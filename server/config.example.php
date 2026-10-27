<?php
declare(strict_types=1);

// Copiar como config.php en la carpeta PRIVADA gandia-private del servidor.
// No subir este archivo con una contraseña a la carpeta pública de la web.
return [
    'enabled' => true,
    'smtp' => [
        'host' => 'smtp.serviciodecorreo.es',
        'port' => 465,
        'username' => 'hola@robertoferrero.es',
        'password' => getenv('GANDIA_SMTP_PASSWORD') ?: '',
        // SSL/TLS implícito (SMTPS). La verificación del certificado es obligatoria.
    ],
    'from_email' => 'hola@robertoferrero.es',
    'from_name' => 'Apartamento en Gandía Playa',
    'to_email' => 'hola@robertoferrero.es',
    'allowed_origins' => ['https://www.robertoferrero.es', 'https://robertoferrero.es'],
    'calendar_file' => __DIR__ . '/calendar.json',
    'storage_dir' => __DIR__ . '/storage',
    'rate_limit' => ['per_ip' => 5, 'total' => 30, 'window_seconds' => 3600],
];
