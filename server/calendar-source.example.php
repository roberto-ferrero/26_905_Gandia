<?php
declare(strict_types=1);

// Copiar como calendar-source.php solo dentro de gandia-private.
// Nunca publicar el enlace iCal privado en JavaScript, HTML o Git.
return [
    'url' => getenv('GANDIA_ICAL_URL') ?: '',
    'timezone' => 'Europe/Madrid',
    'cache_seconds' => 300,
];
