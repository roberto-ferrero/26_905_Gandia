# Briefing de la web del apartamento de Playa de Gandía

Fecha: 23 de octubre de 2026.

Crear una web para promocionar el apartamento de Roberto en Playa de Gandía, con una estética minimalista y elegante, protagonismo de las fotografías y un calendario de disponibilidad gestionable desde un CMS. El alojamiento será el servidor propio de robertoferrero.es, con PHP y MySQL disponibles.

El propietario ha aprobado la propuesta visual v6 y ha solicitado implementarla en HTML estático en el repositorio, utilizando un bundler como Vite. La fase actual es un prototipo local con Vite, HTML, CSS y JavaScript. El backend, el CMS y la publicación quedan para una fase posterior.

## Destino y materiales

- Dirección web propuesta: https://www.robertoferrero.es/gandia.
- Repositorio local: `D:\Trabajo\Proyectos_LEGION\26_905_Gandia\_Repos\26_905_Gandia`.
- Repositorio GitHub: https://github.com/roberto-ferrero/26_905_Gandia.
- Fotografías: `D:\Trabajo\Proyectos_LEGION\26_905_Gandia\Material para la IA\Galeria de fotos`.
- Información de ubicación: `D:\Trabajo\Proyectos_LEGION\26_905_Gandia\Material para la IA\Ubicación`.

La galería contiene archivos identificados como vistas, ubicación, dormitorios, salón, baño, cocina, terraza y entorno. La carpeta de ubicación incluye dos imágenes, un acceso a Google Maps y un archivo de dirección. La selección visual de fotografías queda pendiente.

Según `Dirección.txt`, el apartamento está en Gandiazar IV, calle Valldigna, 19, bloque D, planta 10, puerta izquierda, 46730 Gandía, Valencia, España. Queda por decidir qué grado de detalle mostrar públicamente en la web.

## Propuesta del alojamiento

Los siguientes atributos proceden de la descripción del propietario:

- Ubicación en el último edificio al norte de Gandía Playa, frente a un espacio natural protegido, al inicio de la playa del Ahuir y junto al Corredor Verd de l’Auir.
- Playa a unos 100 metros y menor congestión en verano.
- Planta 10, con vistas hacia la playa del Ahuir y Cullera por un lado, y hacia parques y montañas de Gandía por el otro. El propietario menciona el Mondúver; queda pendiente identificar con precisión el relieve visible.
- Una plaza de aparcamiento incluida en el alquiler, dentro de la urbanización.
- Piscinas de la urbanización para adultos y pequeños.
- Apartamento completamente reformado.
- Precio competitivo: el propietario estima que su tarifa equivale aproximadamente al 50–60 % del precio de apartamentos similares vistos en Booking. Es una estimación inicial, pendiente de contrastar si se quiere utilizar como afirmación comercial. No confundir esta proporción con un descuento del 50–60 %.

## Espacios y equipamiento

| Espacio | Descripción facilitada |
| --- | --- |
| Salón | Sofá, televisión, mesa abatible y cuatro sillas. |
| Cocina | Reformada; frigorífico, lavadora, microondas, cafetera, tostadora, batidora y dotación completa de sartenes y ollas. Tendedero junto a la lavadora. |
| Baño | Completamente reformado. |
| Dormitorio principal | Cama indicada como «1.50cm», interpretada provisionalmente como 1,50 m de ancho; armarios empotrados. Confirmar medida. |
| Segundo dormitorio | Cama nido de 80 cm + 80 cm y armario empotrado. |
| Terraza del salón | Mesita, dos sillas plegables, toldo y armario exterior con sombrilla y sillas de playa. |
| Ropa de hogar | Posibilidad de facilitar toallas y sábanas si se solicita. Condiciones y posible coste por definir. |

La capacidad máxima anunciable queda por confirmar. La distribución descrita sugiere cuatro plazas, pero no se fija todavía como dato definitivo.

## Experiencia de la web

- Diseño minimalista y elegante.
- Fotografías del apartamento y del entorno como elemento principal.
- Presentación clara de las distintas estancias.
- Visibilidad de los principales atractivos: entorno, vistas, playa cercana, aparcamiento, piscinas y reforma.
- Calendario público con fechas disponibles y reservadas.
- Indicadores de temporada alta, media y baja.
- Mostrar el precio por noche según la temporada y el precio total de las fechas seleccionadas.
- Formulario para solicitar información sobre las fechas elegidas.
- Contacto alternativo por teléfono y WhatsApp.
- Sin pagos en la web; el envío del formulario es una consulta y no confirma una reserva.

Como propuesta para la siguiente fase, organizar el contenido en presentación, espacios, entorno y ubicación, disponibilidad y contacto. El nombre comercial, los idiomas y el diseño todavía no están definidos. Los canales de contacto serán el formulario, el teléfono y WhatsApp; sus datos concretos quedan pendientes.

## Criterios visuales e interacciones

- Mantener la fotografía de las vistas del apartamento como imagen principal del hero. Textos exactos confirmados: «Apartamento en» como h3 y «Gandía Playa» como h1, con una diferencia clara de tamaño.
- Galería con el título exacto «El apartamento...». Estructura visual elegida: encabezado y subtítulo a la izquierda, filtros por estancia a la derecha, una fotografía grande del salón y dos más estrechas del dormitorio y la cocina, con pies de foto. Referencia guardada en `diseno/referencias/galeria-preferida.png`.
- Emplear la paleta del pantallazo de mar y arena aportado por el propietario, guardado en `diseno/referencias/paleta-mar-arena.png`. Muestreo de la referencia: mar profundo `#2E6982`, mar medio `#417E8C`, agua somera `#699597`, orilla `#DDD3C7`, arena `#F4DFBD` y arena clara `#F5E0C0`. Usar tonos derivados más oscuros o claros donde haga falta contraste.
- Alternar los fondos de las secciones con tonos de esa paleta, manteniendo una composición minimalista y elegante. En la propuesta v6: franja práctica azul, galería arena, ubicación azul medio, disponibilidad orilla clara y pie azul.
- Mostrar información práctica de costa: orientación de la terraza y sol de mañana o tarde, tiempo andando hasta la orilla y previsión de viento/oleaje o tabla de mareas. El propietario ha indicado que le gusta esta franja. Se propone llamarla «De un vistazo», sin necesidad de mostrar un título. Orientación y duración del recorrido están pendientes de confirmar; la fuente de datos meteorológicos se decidirá en la implementación.
- Cabecera fija al desplazarse, mínima y discreta, para no tapar las fotografías.
- Ampliación de fotografías a pantalla completa mediante lightbox con una transición sin saltos de distribución.
- Incorporar un plano interactivo o una vista cenital del edificio y la parcela. Existe un plano de la urbanización en `Ubicación/00 Ubicacion-3.jpeg`, con los bloques A–G, el bloque D señalado, la plaza de aparcamiento y dos piscinas. No se dispone todavía de un plano interior del apartamento.
- Integrar un mapa personalizado, claro u oscuro, con un estilo coherente con la web y selección sincronizada entre controles y elementos del mapa. Para este único alojamiento, destacar el apartamento, el parking, las piscinas y la playa, con respuesta al cursor y alternativas de pulsación y teclado.
- Utilizar la nueva infografía `diseno/ubicacion-3d-infografia-v1.png` en el módulo de ubicación, según la indicación expresa del propietario. Está basada en su captura 3D de Google Maps. Mantener el título y los controles de selección del módulo elegido, con la ilustración a un tamaño que permita distinguir el entorno. La propuesta v6 muestra el plano original mediante un enlace separado. La infografía anterior de edificios simplificados se descarta como fuente de geometría; los originales siguen siendo la referencia para bloques, accesos y recorridos.

La propuesta aprobada se guarda en `diseno/web-gandia-propuesta-v6-mar-arena.png`, con los textos y la estructura seleccionados, la infografía 3D y la nueva paleta. Las versiones anteriores se conservan como alternativas. La implementación estática incorpora galería ampliable, controles de entorno, plano original ampliable y calendario interactivo. Fechas y precios son ejemplos. La cartografía y la geometría generadas siguen siendo orientativas; no sustituyen a los originales de ubicación.

## Calendario y CMS

Requisitos expresos:

- Desarrollar un CMS para administrar la disponibilidad, las temporadas y las tarifas.
- Permitir al administrador establecer las fechas ya reservadas.
- Mostrar al público la disponibilidad y las temporadas alta, media y baja.
- Mostrar tarifas por noche según temporada y calcular el total de la estancia seleccionada.
- Permitir solicitar información para las fechas seleccionadas mediante formulario, además del contacto por teléfono y WhatsApp.
- La confirmación de reservas se realizará manualmente, fuera del proceso de consulta de la web.
- El alcance inicial del CMS se limita a disponibilidad, temporadas y tarifas; la edición de textos y fotografías no forma parte de esta primera versión.

Decisiones funcionales pendientes:

- Campos del formulario, destino de las solicitudes y datos públicos de teléfono y WhatsApp.
- Fechas concretas de cada temporada, que serán administrables desde el CMS.
- Importes de las tarifas y tratamiento de posibles suplementos en el total mostrado.
- Estancia mínima y posibles reglas de llegada y salida.
- Distinción entre reservas y bloqueos de uso propio, si se necesita.
- Gestión exclusivamente manual o futura sincronización con otros calendarios, si se utiliza alguna plataforma.
- Tratamiento de entrada y salida en el calendario para permitir cambios de huésped el mismo día, si procede.

Los pagos en la web y las reservas instantáneas quedan fuera del alcance. No se ha decidido incorporar sincronizaciones externas.

## Condiciones técnicas conocidas

- Alojamiento en el servidor propio de Roberto.
- Disponibilidad de PHP y base de datos MySQL.
- Instalación prevista dentro de la ruta `/gandia`.
- Repositorio local vinculado al remoto indicado; sin archivos de proyecto ni commits en la revisión inicial.

Para la implementación del backend se comprobarán las versiones de PHP/MySQL, el procedimiento de despliegue y las posibilidades de envío de correo para tramitar las consultas del formulario, si se elige ese medio de recepción. No se han solicitado credenciales. El prototipo estático utiliza Vite sin un framework de interfaz.

## Decisiones confirmadas por el propietario

1. Solicitudes de información mediante formulario para las fechas elegidas, con alternativas de contacto por teléfono y WhatsApp. Sin pagos en la web.
2. Mostrar tanto el precio por noche según temporada como el precio total para las fechas seleccionadas. La respuesta «2 y 3» corresponde a estas dos opciones de la pregunta sobre precios.
3. CMS limitado a disponibilidad, temporadas y tarifas.

## Información para completar más adelante

- Nombre del apartamento e idiomas de la web.
- Capacidad máxima y medida de la cama principal.
- Orientación de la terraza, horas de sol y tiempo andando hasta la orilla por un acceso real.
- Disponibilidad de wifi, aire acondicionado, calefacción y ascensor.
- Fechas de apertura y condiciones de uso de la piscina.
- Condiciones para mascotas, tabaco, entradas y salidas, limpieza, fianza, cancelación y ropa de hogar.
- Datos públicos de contacto y precisión de la ubicación que se mostrará.
- Importes de las tarifas, fechas de las temporadas y estancias mínimas.
- Datos del titular y número de registro del alojamiento, si corresponde incluirlos.
- Identificación precisa del entorno natural y del relieve visible para redactar los textos definitivos.

Las respuestas futuras se incorporarán a este documento, conservando la distinción entre requisitos confirmados y decisiones pendientes.
