<?php
declare(strict_types=1);

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

// En este alojamiento: home/html/gandia/api -> home/data/gandia-private.
$privateDir = getenv('GANDIA_PRIVATE_DIR') ?: dirname(__DIR__, 3) . '/data/gandia-private';
try {
    $privatePath = realpath($privateDir);
    $publicPath = realpath($_SERVER['DOCUMENT_ROOT'] ?? '');
    if (!$privatePath || !$publicPath) {
        throw new RuntimeException('Private directory unavailable');
    }
    $normalise = static fn(string $path): string => strtolower(str_replace('\\', '/', $path));
    if (str_starts_with($normalise($privatePath) . '/', $normalise($publicPath) . '/')) {
        throw new RuntimeException('Private directory must be outside the document root');
    }
    require $privatePath . '/request.php';
    \Gandia\handleRequest($privatePath);
} catch (Throwable $error) {
    error_log('Gandia: servicio de consultas no disponible (' . get_class($error) . ').');
    http_response_code(503);
    echo json_encode(['ok' => false, 'message' => 'El envío por email no está disponible. Puedes enviarnos la consulta por WhatsApp.'], JSON_UNESCAPED_UNICODE);
}
