# Activar el formulario de consultas

Publicado el 27 de octubre de 2026 en **https://robertoferrero.es/gandia/**. El formulario SMTP está activo. La consulta de prueba enviada desde la web obtuvo la referencia **277AB5311E4F** y fue aceptada por el servidor SMTP. La recepción final en el buzón queda por confirmar por el propietario.

La nueva cuenta FTP apunta a la carpeta de Gandía, que estaba vacía. Se han publicado 80 archivos y se han comprobado por SHA-256 los 79 archivos públicos estáticos. PHP 8.5.12 y OpenSSL están disponibles. La contraseña SMTP se configuró por HTTPS en `home/data/gandia-private/config.php`, fuera de la raíz pública, con permisos 600. Los archivos temporales de instalación se eliminaron y devuelven 404. Las contraseñas no se han copiado al repositorio ni al paquete de publicación.

## Datos configurados

| Parámetro | Valor |
| --- | --- |
| Servidor saliente | `smtp.serviciodecorreo.es` |
| Puerto | `465` |
| Seguridad | SSL/TLS implícito, con verificación del certificado |
| Usuario | `hola@robertoferrero.es` |
| Remitente inicial | `hola@robertoferrero.es` |
| Destinatario inicial | `hola@robertoferrero.es` |
| Contraseña | Configurada únicamente en el servidor privado |

El destinatario es una configuración inicial basada en el correo público del propietario y se puede cambiar en `to_email`. IMAP no interviene en el envío del formulario.

Se necesita PHP **8.2 o posterior**, extensión OpenSSL habilitada, certificados CA del sistema actualizados y salida de red al puerto TCP 465. El usuario que ejecuta PHP debe poder escribir en la carpeta privada `storage/`. No se necesita MySQL ni Composer para este formulario. Se incluye PHPMailer 7.1.1 y su licencia.

## Compilar y subir

En el ordenador de desarrollo:

```powershell
npm ci
npm test
npm run build
```

El resultado tiene dos carpetas diferentes:

- `dist/`: web pública, imágenes y `api/inquiry.php`.
- `dist-private/`: lógica PHP, PHPMailer, calendario generado y `config.example.php`. **Debe quedar fuera de la raíz pública del dominio**.

Distribución instalada en el alojamiento:

```text
/srv/vhost/robertoferrero.es/home/
├── html/                        ← raíz pública del dominio
│   └── gandia/                  ← contenido de dist/
│       ├── index.html
│       ├── assets/
│       ├── images/
│       └── api/inquiry.php
└── data/
    └── gandia-private/          ← contenido de dist-private/
        ├── config.example.php
        ├── config.php           ← conservar al actualizar; contiene la contraseña
        ├── calendar.json
        ├── inquiry.php
        ├── mailer.php
        ├── request.php
        ├── vendor/
        └── storage/
```

Esta estructura se detecta automáticamente. Si tu alojamiento usa otra, establece la variable de entorno `GANDIA_PRIVATE_DIR` con la ruta absoluta de la carpeta privada en el proceso de PHP. Como alternativa, ajusta la ruta predeterminada en `api/inquiry.php` antes de subirlo; no pongas contraseñas en ese archivo público. El endpoint rechaza una carpeta privada situada dentro de `DOCUMENT_ROOT`.

Para una instalación nueva, copia `config.example.php` como `config.php` en la carpeta privada. La instalación actual ya está configurada: conserva su `config.php`. Estas son las dos formas de aportar la contraseña:

1. Configurar `GANDIA_SMTP_PASSWORD` como variable de entorno disponible para PHP/FPM.
2. Escribir la contraseña real en la entrada `smtp.password` de ese `config.php` privado, sustituyendo la expresión `getenv(...) ?: ''`. Escapar las comillas y barras según la sintaxis de PHP.

No hace falta enviar la contraseña por el chat. `config.php` no se incluye en la compilación ni debe añadirse a Git. Conserva ese archivo al actualizar la carpeta privada. Usa permisos que permitan leerlo solo al propietario y al usuario/grupo de PHP (por ejemplo, 600 o 640 según el alojamiento).

Los orígenes autorizados son `https://www.robertoferrero.es` y `https://robertoferrero.es`. Para otro dominio de pruebas, añadir su origen exacto en `allowed_origins`, con protocolo y puerto si lo tiene. No usar un comodín.

## Funcionamiento

Al pulsar «Solicitar información», la web envía los datos al endpoint PHP. Este valida los campos y las fechas, comprueba las noches bloqueadas y recalcula el importe con su copia del calendario. El importe que pueda manipular un visitante en el navegador no se utiliza.

El correo contiene llegada, salida, noches, desglose de tarifas, importe orientativo, nombre, contacto, mensaje y una referencia. El destinatario está fijado en el servidor. Si el contacto del visitante es un email, se configura `Reply-To` para que puedas responderle desde tu correo. Si es un teléfono, aparece en el cuerpo del mensaje.

La web solo muestra «Consulta enviada» cuando SMTP acepta el mensaje; la aceptación no acredita la entrega final al buzón. Los errores conservan los datos del formulario y ofrecen WhatsApp como alternativa. No hay reintentos automáticos ni envío al simple escribir en los campos.

WhatsApp abre la consulta preparada en la aplicación del visitante. El visitante debe pulsar Enviar; no se utiliza WhatsApp Business Platform.

El envío no crea, confirma ni bloquea reservas. La disponibilidad ya procede del calendario GANDIA mediante iCal privado; se han retirado las reservas de ejemplo y `demo` es `false`. El formulario valida los intervalos ocupados del servidor antes de enviar el correo. El CMS de tarifas sigue pendiente y se conserva `noindex, nofollow`. Ver [Google Calendar](google-calendar.md).

Cada cambio de tarifas o del año visible en `src/site-config.js` requiere compilar y subir tanto `dist/` como `dist-private/calendar.json`. Las reservas se actualizan desde GANDIA sin recompilar. Conservar también `calendar-source.php` en la carpeta privada al desplegar; contiene el enlace iCal y no se incluye en la distribución.

## Protección y mantenimiento

- Campos acotados, validación del contacto y rechazo de controles de cabecera.
- Campo invisible para robots y límite inicial de 5 intentos por IP/hora y 30 intentos totales/hora, ajustable en `rate_limit`.
- Solo se admiten peticiones JSON desde los orígenes configurados, con la cabecera del formulario. No se habilita CORS para otros sitios.
- El límite utiliza la IP que recibe PHP (`REMOTE_ADDR`), sin confiar en cabeceras enviadas por el visitante. Si existe un proxy inverso, configurar en el servidor la recuperación de la IP real desde proxies de confianza; de lo contrario varios visitantes pueden compartir límite.
- `storage/rate-limit.json` guarda contadores temporales con identificadores derivados de la IP y una clave aleatoria, que se renuevan al vencer la ventana. No guarda nombre, contacto ni mensaje del visitante.
- No se muestran errores de SMTP ni credenciales al visitante. Los detalles de configuración y conectividad se comprueban desde el servidor. No desactivar la verificación TLS para resolver un error de certificado.

## Comprobación en producción

Prueba realizada desde la web pública el 27 de octubre de 2026: nombre «PRUEBA DE PUBLICACIÓN», fechas 12–19 de junio de 2027, total 560 €, destinatario `hola@robertoferrero.es`. La interfaz mostró «Consulta enviada» con referencia `277AB5311E4F`, tras la aceptación SMTP. No se ha abierto el buzón: el propietario debe confirmar la recepción final, incluida la carpeta de spam. El Reply-To se ha verificado en las pruebas locales.

Captura: `docs/diseno/capturas/envio-correo-produccion-2026-10-27.png`. Las dos variantes del dominio (con y sin `www`) devuelven HTTP 200; el endpoint rechaza GET con 405. La ruta pública equivalente a la carpeta privada devuelve 404.

Si aparece «El envío por email no está disponible», revisar la ruta privada, `config.php`, contraseña, permisos, OpenSSL y conectividad SMTP. Si aparece un error de origen, revisar `allowed_origins` y el dominio utilizado. La vista estática `npm run preview` no ejecuta PHP y no puede enviar emails.

## Pruebas locales realizadas

- 16 pruebas de JavaScript: calendario, tarifas, respuestas del formulario y disponibilidad.
- Sintaxis PHP verificada con PHP 8.5.12.
- 8 escenarios de integración a través de HTTP y un SMTP SSL/TLS local: método/origen, campos inválidos, cálculo de 310 € para 30 julio–2 agosto, destinatario fijo, Reply-To, contacto telefónico, errores SMTP, ausencia de contraseña, límites y rechazo de certificados no confiables (algunos escenarios agrupan varias comprobaciones).
- Estas pruebas locales no envían correos reales; la prueba de producción descrita arriba sí envió una consulta al propietario.

Para repetir la integración: `npm run build` y `npm run test:mail`. El ejecutor admite `PHP_BIN` y `OPENSSL_BIN` con rutas de herramientas locales. En este equipo se utilizó PHP portátil en `.cache/mail-tools/php/`, descargado del sitio oficial y comprobado mediante SHA-256. Las herramientas temporales no se despliegan.
