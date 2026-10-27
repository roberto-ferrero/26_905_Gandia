<?php
declare(strict_types=1);
namespace Gandia;

use PHPMailer\PHPMailer\PHPMailer;

require_once __DIR__ . '/vendor/phpmailer/src/Exception.php';
require_once __DIR__ . '/vendor/phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/vendor/phpmailer/src/SMTP.php';

function inquiryMailer(array $config, array $inquiry, string $reference): PHPMailer
{
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $config['smtp']['host'];
    $mail->Port = $config['smtp']['port'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp']['username'];
    $mail->Password = $config['smtp']['password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->SMTPDebug = 0;
    $mail->Timeout = 12;
    $mail->Timelimit = 20;
    $mail->SMTPOptions = ['ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'allow_self_signed' => false]];
    if (!empty($config['smtp']['ca_file'])) {
        $mail->SMTPOptions['ssl']['cafile'] = $config['smtp']['ca_file'];
    }
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($config['from_email'], $config['from_name']);
    $mail->addAddress($config['to_email']);
    if ($inquiry['reply_to']) {
        $mail->addReplyTo($inquiry['reply_to'], $inquiry['name']);
    }
    $arrival = dateValue($inquiry['arrival'])->format('d/m/Y');
    $departure = dateValue($inquiry['departure'])->format('d/m/Y');
    $money = static fn(int|float $amount): string => number_format($amount, 0, ',', '.') . ' €';
    $lines = [
        'Nueva consulta sobre el apartamento en Gandía Playa',
        'Referencia: ' . $reference,
        '',
        'Llegada: ' . $arrival,
        'Salida: ' . $departure,
        'Estancia: ' . $inquiry['nights'] . ' noches',
        'Total orientativo del alojamiento: ' . $money($inquiry['total']),
    ];
    foreach ($inquiry['breakdown'] as $rate) {
        $lines[] = '- ' . $rate['name'] . ': ' . $rate['nights'] . ' noches × ' . $money($rate['price']);
    }
    if (!empty($inquiry['cleaningFee'])) {
        $lines[] = '- Limpieza: ' . $money($inquiry['cleaningFee']);
    }
    array_push($lines, '', 'Nombre: ' . $inquiry['name'], 'Contacto: ' . $inquiry['contact'], '', 'Mensaje:', $inquiry['message'] ?: '(Sin mensaje adicional)', '', 'Esta consulta no confirma ni bloquea una reserva.');
    if ($inquiry['demo']) {
        $lines[] = 'La web todavía muestra disponibilidad de ejemplo: confirmar las fechas con el propietario.';
    }
    $mail->Subject = 'Consulta Gandía · ' . $arrival . ' – ' . $departure . ' [' . $reference . ']';
    $mail->Body = implode("\n", $lines);
    $mail->isHTML(false);
    return $mail;
}
