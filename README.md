# Apartamento en Gandía Playa

Web en HTML, CSS y JavaScript, con **Vite**, y formulario de correo en **PHP con SMTP**. Implementa la propuesta visual aprobada `docs/diseno/web-gandia-propuesta-v6-mar-arena.png`, con las fotografías originales, la infografía 3D y fondos alternos de la paleta de mar y arena.

Capturas de la implementación: [escritorio](docs/diseno/capturas/web-estatica-escritorio.png), [móvil](docs/diseno/capturas/web-estatica-movil.png) y [sección El entorno](docs/diseno/capturas/el-entorno-2026-10-26.png).

## Arranque local

Requiere Node.js 22.12 o superior. Validado con Node.js 24.14.0.

```powershell
npm ci
npm run dev
```

Abrir **http://127.0.0.1:5173/gandia/**. El servidor se detiene con `Ctrl+C`.

## Compilar para el servidor

```powershell
npm test
npm run build
npm run preview
```

La compilación genera `dist/` (web pública) y `dist-private/` (servidor de correo y calendario). La vista previa estática está en **http://127.0.0.1:4173/gandia/**; no ejecuta PHP ni envía emails.

La web está publicada en **https://robertoferrero.es/gandia/** desde el 27 de octubre de 2026. Para actualizar, copiar **el contenido** de `dist/` a `home/html/gandia/` y el contenido de `dist-private/` a `home/data/gandia-private/`, **fuera de la raíz pública**, conservando sus archivos privados `config.php` y `calendar-source.php`. PHP 8.5.12, OpenSSL y la contraseña SMTP están configurados en el alojamiento. No necesita Node.js, MySQL ni Composer en el servidor. Sigue la [guía de despliegue y correo](docs/despliegue-correo.md). No abrir el HTML con `file://`; usar un servidor HTTP.

La base `/gandia/` se define en `vite.config.js`. Para generar una versión en otra ruta:

```powershell
$env:BASE_PATH = '/otra-ruta/'
npm run build
Remove-Item Env:BASE_PATH
```

## Lo que incluye

- Diseño adaptable a escritorio y móvil, cabecera fija y menú móvil.
- Hero con los textos «Apartamento en» / «Gandía Playa» y un rotador de cuatro fotografías: playa, vistas mejoradas desde la habitación, pasarela y paseo marítimo. Empieza por la playa, cambia cada siete segundos y permite avanzar, retroceder, elegir una foto o pausar.
- Franja «De un vistazo»: playa a 150 m, parking incluido, Corredor Verd de l’Auir y terraza soleada orientada al sur.
- Galería de 18 imágenes (17 fotografías y una vista general en 3D), con categoría Piscina, filtros por estancia y ampliación con teclado, botones y deslizamiento táctil. La portada muestra vista general, salón y terraza, en ese orden.
- Sección «El entorno.» con cinco opciones por pulsación: Apartamento, Playa de l’Auir, Piscina, Corredor Verd de l’Auir y Junto al paseo marítimo. Cada opción muestra su propia imagen y descripción.
- Gandiazar IV destacado de forma fija en la infografía, sin localizador móvil. La opción Apartamento conserva «Cómo llegar» y el plano original de la urbanización.
- Fotografías del entorno, infografía y plano ampliables.
- Calendario de 2027 con tarifas confirmadas y disponibilidad de Google Calendar GANDIA, con lectura privada cada cinco minutos y selección de llegada y salida.
- Cálculo por noche, incluyendo estancias que cruzan temporadas. La salida no se cobra como noche y puede coincidir con otra llegada.
- Formulario que valida los datos y envía la consulta mediante PHP y SMTP una vez configurado el servidor; confirmación solo tras aceptación SMTP y alternativa por WhatsApp.
- Enlaces de teléfono y WhatsApp configurables.

## Estado de esta versión

Las tarifas de 2027 están confirmadas: baja (enero–mayo y octubre–diciembre), 60 €/noche; media (junio y septiembre), 80 €/noche; alta en julio, 100 €/noche; alta en agosto, 110 €/noche. No se han configurado excepciones para Semana Santa, puentes ni otros festivos. La disponibilidad procede del calendario GANDIA: se han retirado las reservas de ejemplo. El formulario está activo con PHP y SMTP: la prueba de producción del 27 de octubre obtuvo la referencia `277AB5311E4F` y aceptación SMTP. La recepción final en el buzón queda por confirmar por el propietario. El formulario no confirma ni añade reservas a Google. El servidor conserva una caché privada de fechas y contadores temporales de envío; no hay cookies ni analítica. Ver [gestión de Google Calendar](docs/google-calendar.md).

El teléfono y WhatsApp están configurados con +34 678 552 380. El correo público es hola@robertoferrero.es, con enlace para abrir el programa de correo. El propietario ha confirmado la orientación sur de la terraza y la distancia de 150 m a la playa. El hero comienza con la playa; la fotografía de las vistas lleva el pie «Vistas desde la habitación». La infografía es orientativa; el plano original es la referencia para la urbanización.

El rotador se detiene al elegir una foto manualmente, al pasar el ratón o enfocar sus controles, al salir de la pantalla o al ocultar la pestaña. Respeta la preferencia de movimiento reducido del dispositivo. La rotación se puede reanudar con su botón de reproducción.

La página permite indexación desde el 27 de octubre de 2026, con URL canónica, sitemap, metadatos sociales y datos estructurados. Ver `docs/seo.md`. La disponibilidad ya utiliza datos reales de GANDIA.

El **CMS de temporadas y tarifas** y la conexión MySQL siguen pendientes. La disponibilidad se gestiona desde Google Calendar GANDIA. La web está publicada y el formulario SMTP está activo. La configuración del navegador no contiene credenciales ni el enlace iCal privado. No se ha subido el repositorio a GitHub.

## Dónde editar

| Archivo | Contenido |
| --- | --- |
| `index.html` | Estructura y textos principales. |
| `src/styles.css` | Paleta, tipografía, secciones y diseño responsive. |
| `src/site-config.js` | Teléfonos, enlaces, límites del calendario y tarifas de 2027. Los bloqueos se consultan en el servidor. |
| `src/gallery-data.js` | Fotografías, categorías, títulos y descripciones. |
| `src/environment-data.js` | Fotografías del hero y opciones, imágenes y textos de «El entorno». |
| `src/hero.js` | Rotación, transición, controles y pausas del hero. |
| `src/main.js` | Galería, selección de entorno, navegación, calendario y formulario. |
| `src/calendar.js` | Fechas, reservas y cálculo de estancias, separado de la interfaz. |
| `src/inquiry.js` | Petición al servidor y tratamiento de errores, sin reintentos automáticos. |
| `src/availability.js` | Lectura y validación de fechas ocupadas, sin datos personales. |
| `server/availability.php` | Descarga iCal privada, interpretación y caché de cinco minutos. |
| `docs/google-calendar.md` | Uso de GANDIA, configuración privada y pruebas de sincronización. |
| `server/` | Validación, cálculo del importe y envío SMTP con PHPMailer. Configuración de ejemplo sin contraseña. |
| `scripts/build-server.mjs` | Genera la parte pública PHP y la carpeta privada con calendario sincronizado. |
| `docs/despliegue-correo.md` | Activación del correo, carpetas y configuración del servidor. |
| `tests/calendar.test.js` | Pruebas de fechas, solapamientos y tarifas. |
| `public/images/` | Imágenes optimizadas listas para publicar. |
| `docs/briefing.md` | Requisitos y decisiones del proyecto. |

Los enlaces de llamada, WhatsApp y correo se configuran en `siteConfig.contact`. El botón de WhatsApp prepara la consulta con fechas válidas, noches, importe, nombre, contacto y mensaje del formulario; el visitante debe pulsar Enviar dentro de WhatsApp. El enlace `mailto:` permanece como alternativa. El envío del formulario utiliza `smtp.serviciodecorreo.es:465` con SSL/TLS y el usuario `hola@robertoferrero.es`; la contraseña solo se configura en el servidor privado. `ownerUrl` permanece vacío hasta disponer del CMS. `availability.source` indica Google iCal; `demo` es `false` y no activa ni desactiva el SMTP.

## Imágenes

Las imágenes WebP generadas están incluidas en `public/images/`, por lo que un clon del repositorio puede compilar sin la carpeta de materiales externa. Tienen varios tamaños, carga diferida salvo en el hero, y mantienen los originales sin modificar.

Para regenerarlas desde los materiales del propietario:

```powershell
npm run assets
```

La ruta de origen predeterminada, relativa al repositorio, es `../../Material para la IA`. También se puede indicar otra:

```powershell
npm run assets -- 'D:\ruta\Material para la IA'
```

Las cuatro fotografías del entorno aportadas por el propietario se conservan en `assets/source/entorno/`. Sus versiones WebP de 768, 1280 y 1860 px pueden regenerarse sin materiales externos:

```powershell
npm run assets:environment
```

El comando general `npm run assets` también regenera estas cuatro fotografías. La infografía se lee de `docs/diseno/ubicacion-3d-infografia-v1.png`; el destacado fijo del edificio se dibuja como una capa SVG en la página. Sharp se utiliza solo para la conversión de imágenes durante el desarrollo, no en la web publicada.

Las tres fotografías de Piscina se conservan en `assets/source/piscina/` y se regeneran con `npm run assets:pool`, también incluido en `npm run assets`. Sus versiones grandes respetan la resolución original (1280 o 1024 px).

## Validación realizada

La vista general se conserva en `assets/source/apartamento/distribucion.png` y se regenera con `npm run assets:layout`, incluido también en `npm run assets`. Se muestra completa, sin recorte, y se puede ampliar. En escritorio ocupa aproximadamente el 25 % de la galería inicial; salón y terraza comparten el resto.

Los originales del salón y la terraza se conservan en `assets/source/apartamento/`. `npm run assets:featured` genera sus WebP con calidad 94 y hasta 1600 px, también al ejecutar `npm run assets`. Sus atributos `sizes` contemplan la ampliación necesaria para llenar la altura de las tarjetas, evitando cargar miniaturas de 480 px que luego se estiran.

- `npm test`: 16 pruebas de calendario, tarifas, respuestas del formulario y disponibilidad.
- `npm run test:mail`: integración HTTP y SMTP SSL/TLS local, con 8 escenarios y sin envío externo; ver la guía de correo.
- `tests/availability-backend.test.php`: 22 comprobaciones de iCal, caché y fallos de sincronización.
- `npm run build`: compilación correcta con rutas bajo `/gandia/`.
- Revisión de la compilación servida con `npm run preview`: HTTP 200, imágenes cargadas y sin errores de consola.
- Revisión visual en escritorio y móvil de 390 px, sin desbordamiento horizontal.
- Actualización del 26 de octubre: comprobadas las cuatro fotografías del hero, la rotación automática, los controles manuales y la pausa; las cuatro opciones de «El entorno» muestran su imagen y texto. Ampliación de la pasarela comprobada y destacado fijo de Gandiazar IV revisado en escritorio y móvil. Capturas actualizadas.
- Pruebas manuales previas de filtros, navegación por fotos con teclado, restauración del foco, plano y menú móvil. El envío real está activo y se ha probado desde la web pública; ver la guía de correo.
- Con las tarifas de 2027: salida coincidente con una reserva (3 noches de junio, 240 €), estancia entre junio y julio (4 noches, 360 €) y estancia entre julio y agosto (3 noches, 310 €).
