<?php
declare(strict_types=1);
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

try {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') { http_response_code(405); header('Allow: GET'); echo '{"ok":false}'; exit; }
    $privatePath = realpath(getenv('GANDIA_PRIVATE_DIR') ?: dirname(__DIR__, 3) . '/data/gandia-private');
    $publicPath = realpath($_SERVER['DOCUMENT_ROOT'] ?? '');
    $normalise = static fn(string $path): string => strtolower(str_replace('\\', '/', $path));
    if (!$privatePath || !$publicPath || str_starts_with($normalise($privatePath) . '/', $normalise($publicPath) . '/')) throw new RuntimeException('Private directory unavailable');
    require_once $privatePath . '/availability.php';
    $config = require $privatePath . '/config.php';
    $calendar = \Gandia\loadAvailability($config);
    // Solo fechas: nunca exportar enlaces, títulos, nombres, descripciones o identificadores de eventos.
    echo json_encode(['ok' => true, 'reservations' => $calendar['reservations'], 'checkedAt' => $calendar['checkedAt'] ?? gmdate('c'),
        'firstDate' => $calendar['firstDate'], 'lastDate' => $calendar['lastDate']], JSON_THROW_ON_ERROR);
} catch (Throwable) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'message' => 'No podemos consultar la disponibilidad. Contacta por WhatsApp.'], JSON_UNESCAPED_UNICODE);
}
