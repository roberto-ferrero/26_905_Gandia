<?php
declare(strict_types=1);
namespace Gandia;

require_once __DIR__ . '/inquiry.php';
require_once __DIR__ . '/availability.php';

function handleRequest(string $privateDir): void
{
    try {
        if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
            header('Allow: POST');
            throw new HttpError(405, 'Utiliza el formulario para enviar la consulta.');
        }
        if (!is_file($privateDir . '/config.php')) {
            throw new HttpError(503, 'El envío por email no está disponible. Puedes enviarnos la consulta por WhatsApp.');
        }
        $config = require $privateDir . '/config.php';
        if (empty($config['enabled']) || empty($config['smtp']['password'])) {
            throw new HttpError(503, 'El envío por email no está disponible. Puedes enviarnos la consulta por WhatsApp.');
        }
        if (!in_array($_SERVER['HTTP_ORIGIN'] ?? '', $config['allowed_origins'], true)
            || ($_SERVER['HTTP_X_GANDIA_INQUIRY'] ?? '') !== '1') {
            throw new HttpError(403, 'Envía la consulta desde el formulario de la web.');
        }
        if (strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0])) !== 'application/json') {
            throw new HttpError(415, 'Formato de consulta no válido.');
        }
        $body = file_get_contents('php://input', false, null, 0, 16385);
        if ($body === false || strlen($body) > 16384) {
            throw new HttpError(413, 'La consulta es demasiado larga.');
        }
        try {
            $payload = json_decode($body, true, 32, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            throw new HttpError(400, 'Formato de consulta no válido.');
        }
        if (!is_array($payload) || array_is_list($payload)) {
            throw new HttpError(400, 'Formato de consulta no válido.');
        }
        $calendar = loadAvailability($config);
        $inquiry = validateInquiry($payload, $calendar);
        // No confiar en X-Forwarded-For facilitado por el visitante.
        limitRequests($config, $_SERVER['REMOTE_ADDR'] ?? 'unknown');
        require_once __DIR__ . '/mailer.php';
        $reference = strtoupper(bin2hex(random_bytes(6)));
        $mail = inquiryMailer($config, $inquiry, $reference);
        if (!$mail->send()) {
            throw new \RuntimeException('SMTP rejected the message');
        }
        echo json_encode(['ok' => true, 'reference' => $reference, 'message' => 'Tu consulta se ha enviado. Te responderemos personalmente.'], JSON_UNESCAPED_UNICODE);
    } catch (HttpError $error) {
        http_response_code($error->status);
        if ($error->retryAfter > 0) {
            header('Retry-After: ' . $error->retryAfter);
        }
        echo json_encode(['ok' => false, 'message' => $error->getMessage()], JSON_UNESCAPED_UNICODE);
    }
}
