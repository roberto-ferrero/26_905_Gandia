# SEO y búsquedas con IA

Publicación: 27 de octubre de 2026. URL canónica: https://robertoferrero.es/gandia/

- Indexación habilitada; se elimina el bloqueo noindex anterior.
- Título, descripción, URL canónica, vista previa social y sitemap de la página.
- H1 descriptivo y texto visible sobre capacidad, ubicación y servicios confirmados.
- Preguntas frecuentes y tarifas renderizadas en HTML durante la compilación. No requieren JavaScript para ser leídas.
- JSON-LD de WebPage, Apartment y FAQPage. Las respuestas visibles y estructuradas proceden de la misma fuente; las tarifas se generan desde site-config.js.
- No se inventan reseñas, puntuaciones, coordenadas, licencia ni condiciones de reserva. El marcado no implica elegibilidad para resultados enriquecidos de Google Vacation Rentals o FAQ.
- Robots del dominio: mantener las reglas existentes; registrar el sitemap de Gandía en la raíz. Un robots.txt dentro de /gandia/ no controla los rastreadores.

Fuentes: https://developers.google.com/search/docs/appearance/ai-features y https://developers.openai.com/api/docs/bots

No hay un marcado especial que garantice aparecer en respuestas de IA. La indexación y las citas dependen de cada buscador. No se ha dado de alta Search Console ni Bing Webmaster Tools: hace falta acceso a una propiedad verificada. Allí se puede enviar https://robertoferrero.es/gandia/sitemap.xml y solicitar la indexación de la URL canónica.

Al cambiar servicios o condiciones, actualizar src/seo.js. Al cambiar tarifas, actualizar src/site-config.js, la portada y volver a compilar y desplegar también calendar.json privado. Actualizar lastmod del sitemap cuando cambie sustancialmente la página.

El propietario confirma WiFi disponible el 27 de octubre de 2026; actualizado en FAQ y amenityFeature.
