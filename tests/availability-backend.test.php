<?php
declare(strict_types=1);
require __DIR__ . '/../server/availability.php';

use function Gandia\icalReservations;
use function Gandia\loadAvailability;

$calendar = ['firstDate' => '2027-01-01', 'lastDate' => '2027-12-31', 'source' => 'google-ical', 'reservations' => []];
$checks = 0;
function same($expected, $actual, string $label): void {
    global $checks;
    if ($expected !== $actual) throw new RuntimeException($label . ': ' . json_encode($actual));
    $checks++;
}
function feed(string $events): string { return "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Gandia tests//ES\r\n" . str_replace("\n", "\r\n", trim($events)) . "\r\nEND:VCALENDAR\r\n"; }
function event(string $properties, string $uid = 'test'): string { return "BEGIN:VEVENT\nUID:$uid\nDTSTAMP:20261027T120000Z\n$properties\nEND:VEVENT\n"; }
$dates = "DTSTART;VALUE=DATE:20270121\nDTEND;VALUE=DATE:20270125\nTRANSP:TRANSPARENT\nSUMMARY:PRIVATE PERSON\nDESCRIPTION:PRIVATE CONTACT";
$ics = feed(event($dates));
same([['arrival' => '2027-01-21', 'departure' => '2027-01-25']], icalReservations($ics, $calendar), 'exclusive checkout and transparent events');
same([], icalReservations(feed(event($dates . "\nSTATUS:CANCELLED")), $calendar), 'cancelled event');
same([['arrival' => '2027-12-30', 'departure' => '2028-01-01']], icalReservations(feed(event("DTSTART;VALUE=DATE:20271230\nDTEND;VALUE=DATE:20280105")), $calendar), 'clip at year boundary');
same([['arrival' => '2027-03-27', 'departure' => '2027-03-29']], icalReservations(feed(event("DTSTART;TZID=Europe/Madrid:20270327T160000\nDTEND;TZID=Europe/Madrid:20270329T110000")), $calendar), 'DST and timed checkout');
same([['arrival' => '2027-01-02', 'departure' => '2027-01-03']], icalReservations(feed(event("DTSTART:20270101T233000Z\nDTEND:20270102T003000Z")), $calendar), 'UTC converted to Madrid');
same([['arrival' => '2027-04-01', 'departure' => '2027-04-02']], icalReservations(feed(event('DTSTART;VALUE=DATE:20270401')), $calendar), 'all-day without DTEND');
$series = event("DTSTART;VALUE=DATE:20270104\nDTEND;VALUE=DATE:20270105\nRRULE:FREQ=WEEKLY;COUNT=4\nEXDATE;VALUE=DATE:20270111", 'weekly')
    . event("RECURRENCE-ID;VALUE=DATE:20270118\nDTSTART;VALUE=DATE:20270119\nDTEND;VALUE=DATE:20270120", 'weekly')
    . event("RECURRENCE-ID;VALUE=DATE:20270125\nDTSTART;VALUE=DATE:20270125\nDTEND;VALUE=DATE:20270126\nSTATUS:CANCELLED", 'weekly');
same([['arrival' => '2027-01-04', 'departure' => '2027-01-05'], ['arrival' => '2027-01-19', 'departure' => '2027-01-20']], icalReservations(feed($series), $calendar), 'recurrence, exclusion, moved and cancelled instances');
same([['arrival' => '2027-07-01', 'departure' => '2027-07-10']], icalReservations(feed(event("DTSTART;VALUE=DATE:20270701\nDTEND;VALUE=DATE:20270705", 'a') . event("DTSTART;VALUE=DATE:20270704\nDTEND;VALUE=DATE:20270710", 'b')), $calendar), 'merge overlaps');
same([], icalReservations(feed(''), $calendar), 'valid empty calendar');
foreach (['http://calendar.google.com/test', 'https://other.example/basic.ics', 'https://calendar.google.com.attacker.example/basic.ics'] as $invalidUrl) {
    try { Gandia\readGoogleIcal($invalidUrl); throw new LogicException('External URL accepted'); } catch (RuntimeException) { $checks++; }
}
try { icalReservations('<html>error</html>', $calendar); throw new LogicException('Invalid feed accepted'); } catch (RuntimeException $e) { $checks++; }

$temporary = __DIR__ . '/../.cache/availability-test-' . bin2hex(random_bytes(5));
mkdir($temporary, 0700, true);
file_put_contents($temporary . '/calendar.json', json_encode($calendar));
file_put_contents($temporary . '/source.php', "<?php return ['url'=>'https://calendar.google.com/calendar/ical/test/private-test/basic.ics','cache_seconds'=>300];");
$config = ['calendar_file' => $temporary . '/calendar.json', 'calendar_source_file' => $temporary . '/source.php', 'storage_dir' => $temporary . '/storage'];
$calls = 0;
$download = static function () use (&$calls, $ics): string { $calls++; return $ics; };
$first = loadAvailability($config, $download, 1000);
loadAvailability($config, $download, 1299);
same(1, $calls, 'cache valid for five minutes');
loadAvailability($config, $download, 1300);
same(2, $calls, 'cache refresh after five minutes');
same(false, $first['demo'], 'real source replaces demo');
$cache = file_get_contents($temporary . '/storage/availability.json');
same(false, (bool) preg_match('/PRIVATE|calendar.google|private-test/', $cache), 'cache contains only dates, no identities or link');
$failureCalls = 0;
$failure = static function () use (&$failureCalls): string { $failureCalls++; throw new RuntimeException('Network unavailable'); };
foreach ([1600, 1601] as $now) {
    try { loadAvailability($config, $failure, $now); throw new LogicException('Stale data treated as current'); }
    catch (Gandia\HttpError $error) { same(503, $error->status, 'failure stays unavailable'); }
}
same(1, $failureCalls, 'failure backoff');
same($first['reservations'], json_decode(file_get_contents($temporary . '/storage/availability.json'), true)['reservations'], 'last good cache is preserved');
$recovered = loadAvailability($config, static fn(): string => feed(''), 1661);
same([], $recovered['reservations'], 'deleted events disappear after recovery');
echo json_encode(['ok' => true, 'assertions' => $checks]) . PHP_EOL;
