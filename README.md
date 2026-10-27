# Apartamento en Gandía Playa

Web estática en HTML, CSS y JavaScript, con **Vite**. Implementa la propuesta visual aprobada `docs/diseno/web-gandia-propuesta-v6-mar-arena.png`, con las fotografías originales, la infografía 3D y fondos alternos de la paleta de mar y arena.

Capturas de la implementación: [escritorio](docs/diseno/capturas/web-estatica-escritorio.png) y [móvil](docs/diseno/capturas/web-estatica-movil.png).

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

La compilación genera `dist/`. La vista previa de esa compilación está en **http://127.0.0.1:4173/gandia/**.

Copiar **el contenido** de `dist/` a la carpeta pública `gandia/` del alojamiento. La URL prevista es `https://www.robertoferrero.es/gandia/`. El resultado no necesita Node.js en el servidor: son HTML, CSS, JavaScript e imágenes. No requiere reglas de reescritura ni una base de datos para esta demostración. No abrir el HTML con `file://`; usar un servidor HTTP.

La base `/gandia/` se define en `vite.config.js`. Para generar una versión en otra ruta:

```powershell
$env:BASE_PATH = '/otra-ruta/'
npm run build
Remove-Item Env:BASE_PATH
```

## Lo que incluye

- Diseño adaptable a escritorio y móvil, cabecera fija y menú móvil.
- Hero con la fotografía real de las vistas y los textos «Apartamento en» / «Gandía Playa».
- Franja «De un vistazo», con enlace a la previsión de playa de AEMET.
- Galería de 14 fotografías, filtros por estancia y ampliación con teclado, botones y deslizamiento táctil.
- Infografía del entorno con controles de apartamento, parking, piscinas y playa. El parking remite al plano original, sin inventar un punto exacto en la ilustración.
- Infografía y plano de la urbanización ampliables.
- Calendario de ejemplo para 2027, temporadas, noches reservadas y selección de llegada y salida.
- Cálculo por noche, incluyendo estancias que cruzan temporadas. La salida no se cobra como noche y puede coincidir con otra llegada.
- Formulario que valida los datos y prepara una consulta que se puede copiar.
- Enlaces de teléfono y WhatsApp configurables.

## Estado de esta versión

Es un **prototipo estático**. Los precios de 70, 90 y 120 €/noche y las reservas de 2027 son ejemplos. El formulario **no envía mensajes ni confirma o guarda reservas**. Los datos del visitante se mantienen solo en la página; no hay almacenamiento persistente, cookies, analítica ni peticiones a un backend.

Los teléfonos están pendientes: sus botones explican esta situación hasta que se configuren. La orientación de la terraza y el tiempo andando hasta la orilla siguen por confirmar. La infografía es orientativa; el plano original es la referencia para la urbanización.

La página lleva `noindex, nofollow` mientras contiene datos de demostración. Retirar esa etiqueta de `index.html` cuando el contenido definitivo y el backend estén listos.

El **CMS de disponibilidad, temporadas y tarifas**, el envío real del formulario y la conexión PHP/MySQL corresponden a la siguiente fase. La configuración del navegador no es un sistema de administración ni debe contener credenciales. No se ha publicado la web ni se ha subido el repositorio a GitHub.

## Dónde editar

| Archivo | Contenido |
| --- | --- |
| `index.html` | Estructura y textos principales. |
| `src/styles.css` | Paleta, tipografía, secciones y diseño responsive. |
| `src/site-config.js` | Teléfonos, enlaces, reservas y tarifas de ejemplo. |
| `src/gallery-data.js` | Fotografías, categorías, títulos y descripciones. |
| `src/main.js` | Galería, mapa, navegación, calendario y formulario. |
| `src/calendar.js` | Fechas, reservas y cálculo de estancias, separado de la interfaz. |
| `tests/calendar.test.js` | Pruebas de fechas, solapamientos y tarifas. |
| `public/images/` | Imágenes optimizadas listas para publicar. |
| `docs/briefing.md` | Requisitos y decisiones del proyecto. |

Para activar los enlaces de llamada y WhatsApp, completar `siteConfig.contact.telephone` y `siteConfig.contact.whatsapp` con el número y prefijo internacional. El campo `email` queda reservado para la futura integración del formulario; completarlo no activa un envío. `ownerUrl` permanece vacío hasta disponer del CMS. El modo de demostración del formulario no se desactiva cambiando los datos del calendario.

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

La infografía se lee de `docs/diseno/ubicacion-3d-infografia-v1.png`. Sharp se utiliza solo para la conversión de imágenes durante el desarrollo, no en la web publicada.

## Validación realizada

- `npm test`: 7 pruebas superadas, incluyendo años bisiestos, cambios de horario, solapamientos, límites de estancia y cambios de temporada.
- `npm run build`: compilación correcta con rutas bajo `/gandia/`.
- Revisión de la compilación servida con `npm run preview`: HTTP 200, imágenes cargadas y sin errores de consola.
- Revisión visual en escritorio y móvil de 390 px, sin desbordamiento horizontal.
- Pruebas manuales de filtros, navegación por fotos con teclado, restauración del foco, plano, menú móvil y preparación de una consulta sin envío.
- Comprobación de salida coincidente con una reserva (3 noches, 270 €) y de estancia entre junio y julio (4 noches, 420 €).
