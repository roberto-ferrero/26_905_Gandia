# Disponibilidad desde GANDIA

Activado el 27 de octubre de 2026 en https://robertoferrero.es/gandia/. La web consulta el calendario GANDIA mediante su enlace iCal privado. El enlace está exclusivamente en `home/data/gandia-private/calendar-source.php`, con permisos 600, fuera de la web pública. No se guarda en este documento, JavaScript, Git ni en el ZIP de publicación.

## Cómo gestionar las reservas

Crear, editar o eliminar eventos en **GANDIA** actualiza las noches ocupadas en la web. Se consideran bloqueos todos los eventos de este calendario salvo los cancelados, también si Google los marca como «Libre». Por eso conviene reservar este calendario exclusivamente para reservas, uso propio y otros bloqueos del apartamento.

Para una estancia con llegada el 10 de julio y salida el 17 de julio, crear un evento de **todo el día del 10 al 16 de julio**, ambos incluidos en la interfaz de Google. Son siete noches; el 17 queda disponible para otra llegada. Google exporta ese intervalo con `DTEND` del día 17, que es exclusivo.

Si se usan horas, se interpretan en Europe/Madrid y la fecha final es el día de salida. Un evento que empieza y termina en la misma fecha bloquea esa noche. Para evitar ambigüedades, usar eventos de todo el día.

La integración contempla eventos repetidos, exclusiones y cambios o cancelaciones de una instancia. La interpretación utiliza sabre/vobject 5.0.0, con dependencias fijadas en `server/composer.lock`. El año visible sigue siendo 2027 y los eventos fuera de ese intervalo no se publican. Las tarifas permanecen en la configuración de la web: 60 €, 80 €, 100 € y 110 € por noche.

## Actualización y privacidad

- Al abrir la página se consulta `api/availability.php`. El servidor conserva cada lectura correcta durante cinco minutos y vuelve a consultar Google al vencer ese plazo. La pestaña abierta vuelve a consultar cuando vence la lectura y al recuperar la visibilidad. No requiere cron.
- La actualización depende también de cuándo Google refleje los cambios en su exportación iCal; no debe entenderse como una reserva instantánea.
- El navegador recibe únicamente intervalos de fechas y la hora de comprobación. No recibe títulos, nombres, descripciones, identificadores de eventos ni el enlace privado.
- El formulario comprueba las mismas fechas en el servidor antes de enviar el email. Una consulta no añade un evento ni confirma una reserva: el propietario añade el bloqueo cuando la confirma.
- Si Google falla, el enlace deja de ser válido o el documento no se puede interpretar, no se muestra un calendario supuestamente libre. La selección y el envío por formulario quedan pendientes de confirmar la disponibilidad; WhatsApp sigue disponible. Se vuelve a intentar tras un minuto.
- La última lectura correcta se conserva en privado, pero no se presenta como actual después de un error. La caché contiene fechas e información técnica, sin datos de huéspedes ni enlace iCal.

## Archivos y mantenimiento

El servidor utiliza `availability.php`, `calendar-source.php`, `calendar.json`, `vendor/calendar/` y `storage/availability.json` dentro de la carpeta privada. Requiere PHP 8.2+, mbstring, OpenSSL y cURL. El alojamiento actual dispone de PHP 8.5.12 y esas extensiones; tiene `allow_url_fopen` desactivado, por lo que se usa cURL con verificación TLS. En otros alojamientos puede utilizarse la alternativa HTTPS con streams.

Al actualizar, conservar **config.php** (SMTP) y **calendar-source.php** (iCal). Ninguno forma parte de la compilación. El ejemplo `calendar-source.example.php` permite definir el enlace mediante la variable de entorno `GANDIA_ICAL_URL` o una entrada privada. Si se restablece el enlace secreto desde Google, actualizar ese archivo privado; la huella de la fuente invalida automáticamente la caché anterior.

Las nuevas bibliotecas se incluyen en la distribución para no exigir Composer en el alojamiento. Para reconstruirlas en desarrollo, ejecutar Composer en `server/` con el archivo de bloqueo, `--no-dev --no-plugins --no-scripts`. Las licencias se conservan junto a las bibliotecas.

La vista estática local de Vite no ejecuta PHP. Mostrará disponibilidad pendiente; la web pública sí consulta el endpoint. Para una prueba local completa hay que servir la compilación con PHP y configurar una fuente privada de pruebas. No colocar el enlace real en el navegador para simularla.

## Verificación realizada

- 16 pruebas JavaScript: calendario, tarifas, envío y validación de la respuesta de disponibilidad.
- 22 comprobaciones PHP de iCal y caché: fin exclusivo, zonas horarias, cambio de hora, eventos transparentes, repeticiones, excepciones, cancelaciones, solapamientos, borrado, recuperación y error seguro.
- 8 escenarios HTTP/SMTP locales, incluido rechazo de noches ocupadas y de una fuente no disponible; sin correos externos.
- Lectura real en el alojamiento: noches 21–24 de enero de 2027 ocupadas y día 25 libre. Ya no se usan los bloqueos ficticios de junio, julio y agosto.
- Endpoint público comprobado: solo fechas. Consulta para el 21–23 de enero rechazada con HTTP 422 antes del envío de correo.
- Comprobación visual en producción: enero bloqueado correctamente, llegada el 25 admitida y estancia 25–28 calculada en 180 €.

Captura: `docs/diseno/capturas/google-calendar-conectado-2026-10-27.png`.

Para repetir las comprobaciones PHP con el runtime portátil de este equipo:

```powershell
& '.cache/mail-tools/php/php.exe' -n -d extension_dir='.cache/mail-tools/php/ext' -d extension=mbstring tests/availability-backend.test.php
npm test
npm run build
npm run test:mail
```

Referencias técnicas: [sabre/vobject: iCalendar](https://sabre.io/vobject/icalendar/) y [eventos recurrentes](https://sabre.io/vobject/recurrence/).
