<?php
declare(strict_types=1);
namespace Gandia;

use DateTimeImmutable;
use DateTimeZone;
use RuntimeException;
use Sabre\VObject;

require_once __DIR__ . '/inquiry.php';

function readGoogleIcal(string $url): string
{
    // URL fija de configuración privada, nunca facilitada por una petición pública.
    if (!preg_match('~^https://calendar\.google\.com/calendar/ical/[A-Za-z0-9%@._-]+/private-[a-f0-9]+/basic\.ics$~D', $url)) {
        throw new RuntimeException('Invalid calendar source');
    }
    // El alojamiento desactiva allow_url_fopen; cURL mantiene verificación TLS y límites.
    if (function_exists('curl_init')) {
        $contents = '';
        $curl = curl_init($url);
        curl_setopt_array($curl, [
            CURLOPT_FOLLOWLOCATION => false, CURLOPT_CONNECTTIMEOUT => 5, CURLOPT_TIMEOUT => 12,
            CURLOPT_SSL_VERIFYPEER => true, CURLOPT_SSL_VERIFYHOST => 2,
            CURLOPT_HTTPHEADER => ['Accept: text/calendar'], CURLOPT_USERAGENT => 'Gandia-Availability/1.0',
            CURLOPT_WRITEFUNCTION => static function ($handle, string $chunk) use (&$contents): int {
                if (strlen($contents) + strlen($chunk) > 5000000) return 0;
                $contents .= $chunk;
                return strlen($chunk);
            },
        ]);
        $success = curl_exec($curl);
        $status = curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        unset($curl);
        if ($success === false || $status !== 200) throw new RuntimeException('Calendar download unavailable');
        return $contents;
    }
    $context = stream_context_create([
        'http' => ['method' => 'GET', 'timeout' => 12, 'follow_location' => 0, 'ignore_errors' => true,
            'header' => "Accept: text/calendar\r\nUser-Agent: Gandia-Availability/1.0\r\n"],
        'ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'allow_self_signed' => false],
    ]);
    $stream = @fopen($url, 'rb', false, $context);
    if (!$stream) throw new RuntimeException('Calendar download unavailable');
    try {
        $headers = stream_get_meta_data($stream)['wrapper_data'] ?? [];
        if (!preg_match('~^HTTP/\S+ 200\b~', $headers[0] ?? '')) throw new RuntimeException('Calendar download rejected');
        $contents = stream_get_contents($stream, 5000001);
        if ($contents === false || strlen($contents) > 5000000 || stream_get_meta_data($stream)['timed_out']) {
            throw new RuntimeException('Incomplete calendar download');
        }
        return $contents;
    } finally {
        fclose($stream);
    }
}

function icalReservations(string $contents, array $calendar, string $timezone = 'Europe/Madrid'): array
{
    require_once __DIR__ . '/vendor/calendar/autoload.php';
    if (!str_starts_with(ltrim($contents), 'BEGIN:VCALENDAR') || !str_contains($contents, 'END:VCALENDAR')) {
        throw new RuntimeException('Invalid calendar document');
    }
    $zone = new DateTimeZone($timezone);
    $first = new DateTimeImmutable($calendar['firstDate'], $zone);
    $until = (new DateTimeImmutable($calendar['lastDate'], $zone))->modify('+1 day');
    $document = VObject\Reader::read($contents);
    if (!$document instanceof VObject\Component\VCalendar || count($document->select('VEVENT')) > 5000) {
        throw new RuntimeException('Invalid calendar document');
    }
    VObject\Settings::$maxRecurrences = 5000;
    $expanded = $document->expand($first, $until, $zone);
    $ranges = [];
    foreach ($expanded->select('VEVENT') as $event) {
        if (strtoupper((string) $event->STATUS) === 'CANCELLED') continue;
        if (!isset($event->DTSTART)) throw new RuntimeException('Event start missing');
        $start = $event->DTSTART->getDateTime($zone)->setTimezone($zone);
        if (isset($event->DTEND)) $end = $event->DTEND->getDateTime($zone)->setTimezone($zone);
        elseif (isset($event->DURATION)) $end = $start->add(VObject\DateTimeParser::parseDuration($event->DURATION));
        else $end = $event->DTSTART->hasTime() ? $start : $start->modify('+1 day');
        if ($end < $start) throw new RuntimeException('Event ends before arrival');
        $arrival = $start->format('Y-m-d');
        $departure = $end->format('Y-m-d');
        // Las noches terminan en la fecha de salida. Un evento de un solo día bloquea esa noche.
        if ($departure === $arrival) $departure = $start->modify('+1 day')->format('Y-m-d');
        $arrival = max($arrival, $calendar['firstDate']);
        $departure = min($departure, $until->format('Y-m-d'));
        if ($arrival < $departure) $ranges[] = compact('arrival', 'departure');
    }
    usort($ranges, static fn(array $a, array $b): int => $a['arrival'] <=> $b['arrival']);
    $merged = [];
    foreach ($ranges as $range) {
        $last = count($merged) - 1;
        if ($last >= 0 && $range['arrival'] <= $merged[$last]['departure']) {
            $merged[$last]['departure'] = max($merged[$last]['departure'], $range['departure']);
        } else $merged[] = $range;
    }
    return $merged;
}

function loadAvailability(array $config, ?callable $download = null, ?int $time = null): array
{
    $calendar = json_decode(file_get_contents($config['calendar_file']), true, 512, JSON_THROW_ON_ERROR);
    if (($calendar['source'] ?? 'static') === 'static') return $calendar;
    $sourceFile = $config['calendar_source_file'] ?? __DIR__ . '/calendar-source.php';
    if (!is_file($sourceFile)) throw new HttpError(503, 'No podemos consultar la disponibilidad. Contacta por WhatsApp.');
    $source = require $sourceFile;
    if (empty($source['url'])) throw new HttpError(503, 'No podemos consultar la disponibilidad. Contacta por WhatsApp.');
    $now = $time ?? time();
    $ttl = max(30, min(900, (int) ($source['cache_seconds'] ?? 300)));
    $fingerprint = hash('sha256', $source['url'] . $calendar['firstDate'] . $calendar['lastDate'] . ($source['timezone'] ?? 'Europe/Madrid'));
    $directory = $config['storage_dir'];
    if (!is_dir($directory) && !@mkdir($directory, 0700, true) && !is_dir($directory)) throw new RuntimeException('Calendar storage unavailable');
    $file = $directory . '/availability.json';
    $handle = @fopen($file, 'c+');
    if (!$handle) throw new RuntimeException('Calendar storage unavailable');
    @chmod($file, 0600);
    try {
        $locked = false;
        for ($attempt = 0; $attempt < 100; $attempt++) {
            if (flock($handle, LOCK_EX | LOCK_NB)) { $locked = true; break; }
            usleep(20000);
        }
        if (!$locked) throw new HttpError(503, 'Estamos actualizando la disponibilidad. Inténtalo en unos segundos.');
        $state = json_decode(stream_get_contents($handle), true);
        if (!is_array($state) || ($state['fingerprint'] ?? '') !== $fingerprint) $state = ['fingerprint' => $fingerprint];
        if (($state['retryAfter'] ?? 0) > $now) throw new HttpError(503, 'No podemos consultar la disponibilidad. Contacta por WhatsApp.');
        if (!isset($state['reservations'], $state['checkedAt']) || $state['checkedAt'] + $ttl <= $now) {
            try {
                $contents = $download ? $download($source['url']) : readGoogleIcal($source['url']);
                $ranges = icalReservations($contents, $calendar, $source['timezone'] ?? 'Europe/Madrid');
                $state = ['fingerprint' => $fingerprint, 'checkedAt' => $now, 'reservations' => $ranges];
            } catch (\Throwable) {
                // Conservar la última lectura, pero nunca presentarla como disponibilidad actual.
                $state['retryAfter'] = $now + 60;
                saveAvailabilityCache($handle, $state);
                throw new HttpError(503, 'No podemos consultar la disponibilidad. Contacta por WhatsApp.');
            }
            saveAvailabilityCache($handle, $state);
        }
        $calendar['reservations'] = $state['reservations'];
        $calendar['demo'] = false;
        $calendar['checkedAt'] = gmdate('c', $state['checkedAt']);
        return $calendar;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

function saveAvailabilityCache($handle, array $state): void
{
    $json = json_encode($state, JSON_THROW_ON_ERROR);
    rewind($handle);
    if (!ftruncate($handle, 0) || fwrite($handle, $json) !== strlen($json) || !fflush($handle)) {
        throw new RuntimeException('Calendar cache write failed');
    }
}
