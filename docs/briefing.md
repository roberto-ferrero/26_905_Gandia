# Briefing de la web del apartamento de Playa de Gandía

Actualizado: 27 de octubre de 2026.

Crear una web para promocionar el apartamento de Roberto en Playa de Gandía, con una estética minimalista y elegante, protagonismo de las fotografías y un calendario de disponibilidad gestionable desde un CMS. El alojamiento será el servidor propio de robertoferrero.es, con PHP y MySQL disponibles.

El propietario ha aprobado la propuesta visual v6 y ha solicitado implementarla en HTML estático en el repositorio, utilizando un bundler como Vite. La web usa Vite, HTML, CSS y JavaScript, e incorpora un formulario de correo en PHP con SMTP. Está publicada desde el 27 de octubre de 2026 con el envío de consultas activo. La disponibilidad se sincroniza con Google Calendar GANDIA; el CMS de tarifas queda pendiente.

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
- Playa a 150 metros, según la corrección del propietario del 26 de octubre de 2026, y menor congestión en verano.
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

El propietario confirma el 27 de octubre de 2026: capacidad máxima de cuatro personas, sin aire acondicionado, wifi previsto, mascotas permitidas y parking incluido.

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

El contenido se organiza en presentación, espacios, entorno y ubicación, disponibilidad y contacto. El nombre comercial y los idiomas quedan pendientes. Datos de contacto facilitados el 27 de octubre de 2026: teléfono y WhatsApp +34 678 552 380; correo hola@robertoferrero.es. El formulario está activo con PHP y SMTP; el correo dispone también de un enlace directo `mailto:`.

## Criterios visuales e interacciones

- Hero con rotación entre la playa, las vistas mejoradas desde la habitación, la pasarela y el paseo marítimo, según la actualización del 26 de octubre de 2026. Comenzar por la playa para probar esta presentación. Textos exactos confirmados: «Apartamento en» como h3 y «Gandía Playa» como h1, con una diferencia clara de tamaño. Fotografías originales de esta actualización guardadas en `../assets/source/entorno/`.
- Galería con el título exacto «El apartamento...». Estructura visual elegida: encabezado y subtítulo a la izquierda, filtros por estancia a la derecha, una fotografía grande del salón y dos más estrechas del dormitorio y la cocina, con pies de foto. Referencia guardada en `diseno/referencias/galeria-preferida.png`.
- Actualización del 27 de octubre: conservar la estructura de tres imágenes, mostrando primero la nueva vista general en 3D completa, después la fotografía del salón que encabezaba la galería y, en tercer lugar, la terraza. La galería suma 18 imágenes y mantiene las demás fotografías en el visor y los filtros.
- Ajuste posterior: estrechar la columna de la vista 3D y ampliar las otras dos, con proporciones 1:1,5:1,5 en escritorio. Mejorar la nitidez del salón y la terraza usando los originales de 1600 px y seleccionando la resolución según el recorte de las tarjetas.
- Emplear la paleta del pantallazo de mar y arena aportado por el propietario, guardado en `diseno/referencias/paleta-mar-arena.png`. Muestreo de la referencia: mar profundo `#2E6982`, mar medio `#417E8C`, agua somera `#699597`, orilla `#DDD3C7`, arena `#F4DFBD` y arena clara `#F5E0C0`. Usar tonos derivados más oscuros o claros donde haga falta contraste.
- Alternar los fondos de las secciones con tonos de esa paleta, manteniendo una composición minimalista y elegante. En la propuesta v6: franja práctica azul, galería arena, ubicación azul medio, disponibilidad orilla clara y pie azul.
- Franja «De un vistazo», sin título visible. Mensajes confirmados el 26 de octubre de 2026, en este orden: «Junto a la playa. / Playa a 150 m.» con sombrilla; «Parking incluido / Dentro de la urbanización» con coche; «Junto al Corredor Verd de l’Auir» con duna y árbol; «Terraza soleada. / Terraza orientada al sur.» con sol y copa de cóctel. Estos mensajes sustituyen a los anteriores de tiempo a pie, orientación pendiente y previsión meteorológica. La fotografía de las vistas lleva el pie «Vistas desde la habitación»; las otras fotos del rotador tienen sus propios pies.
- Cabecera fija al desplazarse, mínima y discreta, para no tapar las fotografías.
- Ampliación de fotografías a pantalla completa mediante lightbox con una transición sin saltos de distribución.
- Incorporar un plano interactivo o una vista cenital del edificio y la parcela. Existe un plano de la urbanización en `Ubicación/00 Ubicacion-3.jpeg`, con los bloques A–G, el bloque D señalado, la plaza de aparcamiento y dos piscinas. No se dispone todavía de un plano interior del apartamento.
- Sección titulada «El entorno.», con botones de selección a la izquierda e imagen grande a la derecha. Sustituir los controles de parking y piscinas por las nuevas opciones Playa de l’Auir, Corredor Verd de l’Auir y Junto al paseo marítimo, además de Apartamento. El contenido cambia al pulsar, con acceso mediante teclado. Eliminar el localizador móvil y el cambio al pasar el cursor.
- Utilizar la infografía `diseno/ubicacion-3d-infografia-v1.png` en la opción Apartamento, destacando Gandiazar IV de forma fija mediante una etiqueta y un contorno del edificio. Está basada en la captura 3D de Google Maps del propietario. Conservar «Cómo llegar» y el enlace separado al plano original. La infografía anterior de edificios simplificados se descarta como fuente de geometría; los originales siguen siendo la referencia para bloques, accesos y recorridos.

Textos confirmados para «El entorno.», actualizados el 27 de octubre de 2026:

| Opción | Imagen y contenido |
| --- | --- |
| Apartamento | Infografía con Gandiazar IV destacado. «Ubicación privilegiada.» / «Gandiazar IV, al norte de Gandía Playa. En una zona muy tranquila, conectada con Bus al pueblo y al puerto, y pegada a palmerales, naranjos y dunas.» Conservar «Cómo llegar». |
| Playa de l’Auir | Fotografía de la playa. «A un paso de la playa de l’Auir: kilómetros de arena y dunas en un entorno sin urbanizar.» |
| Piscina (tercera opción) | Fotografía de la piscina, con icono de escalera y agua. «Piscinas para adultos y niños dentro de la urbanización, rodeadas de césped y zonas de sombra para disfrutar en familia.» Las tres imágenes aportadas el 27 de octubre se incluyen también en la nueva categoría Piscina de la galería, que suma 17 fotografías. |
| Corredor Verd de l’Auir | Fotografía de la pasarela. «Junto al Corredor Verde del Auir. Un paseo que conecta la playa con humedales de alto valor ecológico.» |
| Junto al paseo marítimo | Fotografía del paseo marítimo. «A pocos pasos del paseo marítimo, con restaurantes, heladerías y zonas de juegos infantiles para disfrutar en familia.» |

La propuesta aprobada se guarda en `diseno/web-gandia-propuesta-v6-mar-arena.png`, con los textos y la estructura seleccionados, la infografía 3D y la nueva paleta. Las versiones anteriores se conservan como alternativas. La implementación estática incorpora galería ampliable, controles de entorno, plano original ampliable y calendario interactivo. Las tarifas de 2027 están confirmadas; las reservas proceden de Google Calendar GANDIA. La cartografía y la geometría generadas siguen siendo orientativas; no sustituyen a los originales de ubicación.

## Calendario y CMS

Requisitos expresos:

- Desarrollar un CMS para administrar la disponibilidad, las temporadas y las tarifas.
- Permitir al administrador establecer las fechas ya reservadas.
- Mostrar al público la disponibilidad y las temporadas alta, media y baja.
- Indicadores de temporada: baja sin círculo en las casillas y con círculo blanco de contorno negro en la leyenda; media con círculo verde; alta con el naranja existente. Al pasar el cursor sobre cada día se muestra su temporada, también si está reservado.
- Mostrar tarifas por noche según temporada y calcular el total de la estancia seleccionada.
- Permitir solicitar información para las fechas seleccionadas mediante formulario, además del contacto por teléfono y WhatsApp.
- La confirmación de reservas se realizará manualmente, fuera del proceso de consulta de la web.
- El alcance inicial del CMS se limita a disponibilidad, temporadas y tarifas; la edición de textos y fotografías no forma parte de esta primera versión.

Tarifas de 2027 confirmadas por el propietario el 27 de octubre de 2026:

| Temporada | Fechas de aplicación | Precio por noche |
| --- | --- | --- |
| Baja | 1 de enero–31 de mayo y 1 de octubre–31 de diciembre | 60 € |
| Media | 1–30 de junio y 1–30 de septiembre | 80 € |
| Alta · julio | 1–31 de julio | 100 € |
| Alta · agosto | 1–31 de agosto | 110 € |

Abril, mayo y octubre se encuadran en baja como criterio inicial de configuración. No se han definido excepciones para Semana Santa, puentes ni otros festivos. Julio y agosto mantienen el mismo indicador naranja, con tarifas y desglose independientes. Cada noche se calcula con su tarifa; el día de salida no se cobra. Los bloqueos ficticios se han sustituido por los eventos reales de GANDIA.

Decisiones funcionales pendientes:

- Campos del formulario, destino de las solicitudes y datos públicos de teléfono y WhatsApp.
- Excepciones de temporada para festivos, si se desean; las fechas y tarifas serán administrables desde el CMS.
- Tratamiento de posibles suplementos en el total mostrado.
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

El propietario elige el 27 de octubre de 2026 recibir un email automático al enviar el formulario y ofrecer un botón de WhatsApp con la consulta preparada, que el visitante envía desde su WhatsApp. Confirma que él gestiona tanto el alojamiento como el correo. El botón incluye fechas válidas, noches, importe, nombre, contacto y mensaje. No se necesita WhatsApp Business Platform para la opción elegida.

Facilita SMTP autenticado: `smtp.serviciodecorreo.es`, puerto 465, SSL/TLS, usuario `hola@robertoferrero.es`. Posteriormente facilita la contraseña real y una cuenta FTP para Gandía; las contraseñas se omiten de la documentación y del repositorio. El envío queda implementado con PHPMailer 7.1.1, comprobación del importe en el servidor, validación, protección básica contra abuso y tratamiento de errores. Se usa `hola@robertoferrero.es` como remitente y destinatario inicial por ser el correo público conocido; se puede cambiar en la configuración privada. El teléfono público sigue siendo `+34 678 552 380`.

Publicado el 27 de octubre de 2026 en `https://robertoferrero.es/gandia/`, con PHP 8.5.12 y OpenSSL. La configuración privada queda en `/srv/vhost/robertoferrero.es/home/data/gandia-private/`; la contraseña SMTP se transfirió por HTTPS y no está en la carpeta pública. La prueba desde el formulario publicado fue aceptada por SMTP, referencia `277AB5311E4F`; queda por confirmar por el propietario la recepción final en su buzón. La guía está en `despliegue-correo.md`. La interfaz utiliza Vite sin framework. La disponibilidad ya se sincroniza con GANDIA mediante iCal privado. Se conserva `noindex, nofollow` para revisar la indexación por separado. La fuente se configura en `calendar-source.php` privado; consultar `google-calendar.md` para las reglas de fechas y actualización.

## Decisiones confirmadas por el propietario

1. Solicitudes de información mediante formulario para las fechas elegidas, con alternativas de contacto por teléfono y WhatsApp. Sin pagos en la web.
2. Mostrar tanto el precio por noche según temporada como el precio total para las fechas seleccionadas. La respuesta «2 y 3» corresponde a estas dos opciones de la pregunta sobre precios.
3. CMS limitado a disponibilidad, temporadas y tarifas.

## Información para completar más adelante

- Nombre del apartamento e idiomas de la web.
- Medida de la cama principal.
- Horas de sol y tiempo andando hasta la orilla por un acceso real; la orientación sur de la terraza ya está confirmada.
- Puesta en servicio del wifi previsto; disponibilidad de calefacción y ascensor.
- Fechas de apertura y condiciones de uso de la piscina.
- Condiciones o suplementos para las mascotas admitidas; tabaco, entradas y salidas, limpieza, fianza, cancelación y ropa de hogar.
- Datos públicos de contacto y precisión de la ubicación que se mostrará.
- Excepciones de temporada para festivos y estancias mínimas.
- Datos del titular y número de registro del alojamiento, si corresponde incluirlos.
- Identificación precisa del entorno natural y del relieve visible para redactar los textos definitivos.

Las respuestas futuras se incorporarán a este documento, conservando la distinción entre requisitos confirmados y decisiones pendientes.

Actualización publicada el 27 de octubre de 2026: dirección visible «Carrer de la Valldigna 19 - Gandía Playa» y calendario sin fechas inicialmente seleccionadas. Portada: 1.400 € por 14 noches en julio y 1.540 € por 14 noches en agosto de 2027. Comparativa de agosto basada en cuatro capturas aportadas por el propietario para el 1–15 de agosto de 2027, 2 adultos y 1 niño: 3.325 €, 2.520 €, 2.024 € y 2.988 €; media 2.714,25 € y diferencia del 43,26 % respecto a 1.540 €. Se publica redondeado al 43 %, identificando la muestra y sus diferencias de características; no se presenta como media de Booking ni se extrapola a julio.

Comparativa de julio añadida con otras tres capturas del propietario para el 16–31 de julio de 2027 (15 noches, 2 adultos y 1 niño): 3.563 €, 2.345 € y 3.012 €; media 2.973,33 €. Nuestra tarifa para esas 15 noches es 1.500 €, un 49,55 % inferior. Se publica aproximadamente 50 % comparando precios por noche y se conserva el destacado de 1.400 € por 14 noches. Esta nueva evidencia sustituye la ausencia previa de comparación de julio.

Última revisión de tarifas: julio 110 €/noche y agosto 120 €/noche. Portada: 1.650 € y 1.800 € por quincena de 15 noches. Comparación aproximada del 40 % con los anuncios aportados, normalizados por noche (julio 44,5 %; agosto 38,1 %). Sustituye las tarifas y los porcentajes anteriores.

Cargo de limpieza confirmado: 20 € una sola vez por estancia de 1, 2 o 3 noches; no se añade desde 4 noches. Incluido y desglosado en presupuesto, email y WhatsApp. Configurado en availability.cleaningFee.

Semana Santa 2027: noches del 22 al 28 de marzo, ambos incluidos, temporada media a 80 €/noche. El 21 y el 29 vuelven a baja. Salida el 29 para disfrutar de las siete noches de temporada media. Excepción configurada en dateOverrides y aplicada también en PHP.

Equipamiento confirmado: dos ventiladores de pie; por su altura, el apartamento suele recibir la brisa del mar. Sin aire acondicionado. Actualizado en las preguntas frecuentes.
