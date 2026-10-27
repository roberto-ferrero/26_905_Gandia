<?php
declare(strict_types=1);
namespace Gandia;

use DateTimeImmutable;
use DateTimeZone;
use RuntimeException;

final class HttpError extends RuntimeException
{
    public function __construct(public readonly int $status, string $message, public readonly int $retryAfter = 0)
    {
        parent::__construct($message);
    }
}

function field(array $payload, string $key, int $max, bool $required = true, bool $multiline = false): string
{
    $value = $payload[$key] ?? '';
    if (!is_string($value) || !preg_match('//u', $value)) {
        throw new HttpError(422, 'Revisa los datos del formulario.');
    }
    $value = trim($value);
    if (($required && $value === '') || preg_match_all('/./us', $value) > $max
        || preg_match($multiline ? '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/' : '/[\x00-\x1F\x7F]/', $value)) {
        throw new HttpError(422, 'Revisa los datos del formulario.');
    }
    return $value;
}

function dateValue(string $value): DateTimeImmutable
{
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $value, new DateTimeZone('UTC'));
    if (!$date || $date->format('Y-m-d') !== $value) {
        throw new HttpError(422, 'Revisa las fechas de llegada y salida.');
    }
    return $date;
}

function validateInquiry(array $payload, array $calendar): array
{
    if (field($payload, 'website', 200, false) !== '') {
        throw new HttpError(422, 'No se ha podido validar la consulta.');
    }
    $name = field($payload, 'name', 100);
    $contact = field($payload, 'contact', 160);
    $message = field($payload, 'message', 1500, false, true);
    $email = filter_var($contact, FILTER_VALIDATE_EMAIL) !== false;
    $digits = preg_replace('/\D/', '', $contact);
    $phone = preg_match('/^[+()\d\s.\-]+$/', $contact) && strlen($digits) >= 7 && strlen($digits) <= 20;
    if (!$email && !$phone) {
        throw new HttpError(422, 'Introduce un email o un teléfono válido.');
    }
    $arrival = field($payload, 'arrival', 10);
    $departure = field($payload, 'departure', 10);
    $start = dateValue($arrival);
    $end = dateValue($departure);
    $nights = (int) $start->diff($end)->format('%r%a');
    if ($nights < $calendar['minimumNights'] || $nights > $calendar['maximumNights']
        || $arrival < $calendar['firstDate'] || $end > dateValue($calendar['lastDate'])->modify('+1 day')) {
        throw new HttpError(422, 'Revisa la duración y las fechas de la estancia.');
    }
    $total = 0;
    $breakdown = [];
    for ($date = $start; $date < $end; $date = $date->modify('+1 day')) {
        $iso = $date->format('Y-m-d');
        foreach ($calendar['reservations'] as $reservation) {
            if ($iso >= $reservation['arrival'] && $iso < $reservation['departure']) {
                throw new HttpError(422, 'La estancia incluye noches reservadas. Prueba con otras fechas.');
            }
        }
        $overrideId = null;
        foreach ($calendar['dateOverrides'] ?? [] as $override) {
            if ($iso >= $override['from'] && $iso <= $override['through']) {
                $overrideId = $override['rateId'];
                break;
            }
        }
        $matches = array_values(array_filter($calendar['seasons'], static fn(array $rate): bool => $overrideId !== null ? $rate['id'] === $overrideId : in_array((int) $date->format('n'), $rate['months'], true)));
        if (count($matches) !== 1 || !is_numeric($matches[0]['price']) || $matches[0]['price'] < 0) {
            throw new RuntimeException('Invalid calendar rate');
        }
        $rate = $matches[0];
        $total += $rate['price'];
        $key = $rate['id'];
        $breakdown[$key] ??= ['name' => $rate['name'], 'price' => $rate['price'], 'nights' => 0];
        $breakdown[$key]['nights']++;
    }
    $cleaningFee = $nights <= ($calendar['cleaningFee']['maximumNights'] ?? 0) ? ($calendar['cleaningFee']['amount'] ?? 0) : 0;
    $total += $cleaningFee;
    return compact('name', 'contact', 'message', 'arrival', 'departure', 'nights', 'total', 'breakdown', 'cleaningFee')
        + ['reply_to' => $email ? $contact : null, 'demo' => $calendar['demo'] ?? false];
}

function limitRequests(array $config, string $ip, ?int $time = null): void
{
    $now = $time ?? time();
    $directory = $config['storage_dir'];
    if (!is_dir($directory) && !@mkdir($directory, 0700, true) && !is_dir($directory)) {
        throw new RuntimeException('Rate limit storage unavailable');
    }
    $path = $directory . '/rate-limit.json';
    $handle = @fopen($path, 'c+');
    if (!$handle) {
        throw new RuntimeException('Rate limit storage unavailable');
    }
    @chmod($path, 0600);
    try {
        if (!flock($handle, LOCK_EX)) {
            throw new RuntimeException('Rate limit lock unavailable');
        }
        $contents = stream_get_contents($handle);
        $state = $contents === '' ? null : json_decode($contents, true, 512, JSON_THROW_ON_ERROR);
        $limits = $config['rate_limit'];
        if (!$state || $now >= $state['start'] + $limits['window_seconds']) {
            $state = ['start' => $now, 'salt' => bin2hex(random_bytes(16)), 'total' => 0, 'ips' => []];
        }
        $key = hash_hmac('sha256', $ip, $state['salt']);
        if ($state['total'] >= $limits['total'] || ($state['ips'][$key] ?? 0) >= $limits['per_ip']) {
            throw new HttpError(429, 'Se han realizado demasiados intentos. Espera un poco o contacta por WhatsApp.', max(1, $state['start'] + $limits['window_seconds'] - $now));
        }
        $state['total']++;
        $state['ips'][$key] = ($state['ips'][$key] ?? 0) + 1;
        rewind($handle);
        if (!ftruncate($handle, 0) || fwrite($handle, json_encode($state, JSON_THROW_ON_ERROR)) === false || !fflush($handle)) {
            throw new RuntimeException('Rate limit write failed');
        }
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}
