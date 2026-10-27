import { availability, siteConfig } from './site-config.js';

export const canonical = 'https://robertoferrero.es/gandia/';
const rate = (id) => availability.seasons.find((season) => season.id === id).price;
const euro = (value) => new Intl.NumberFormat('es-ES').format(value) + ' €';
export const questions = [
  ['¿Dónde está el apartamento y a qué distancia está la playa?', 'Está en Carrer de la Valldigna 19, en la urbanización Gandiazar IV, al norte de Gandía Playa (Valencia). La playa está a unos 150 metros. La zona se encuentra junto al Corredor Verd de l’Auir y cerca de la playa de l’Auir, también conocida como playa del Ahuir.'],
  ['¿Cuántas personas pueden alojarse?', 'El apartamento completo admite un máximo de 4 personas. Tiene dos dormitorios, salón, cocina, baño reformado y terraza orientada al sur. El segundo dormitorio dispone de una cama nido: la cama inferior se puede sacar o dejar recogida según las necesidades de la estancia.'],
  ['¿Hay ropa de cama y toallas disponibles?', 'Sí. Si lo deseas, hay ropa de cama y toallas disponibles bajo solicitud. Indícalo al consultar tu estancia para que podamos prepararlas.'],
  ['¿Tiene piscina y parking incluido?', 'Sí. La urbanización cuenta con piscinas para adultos y niños, y el parking está incluido. Consulta las fechas de apertura y las condiciones de uso de la piscina antes de reservar.'],
  ['¿Se admiten mascotas?', 'Sí, se admiten mascotas. Indica que viajarás con tu mascota al enviar la consulta para acordar las condiciones de la estancia.'],
  ['¿Tiene aire acondicionado y wifi?', 'El apartamento tiene WiFi. No dispone de aire acondicionado, pero cuenta con dos ventiladores de pie y, gracias a su altura, suele recibir la brisa del mar.'],
  ['¿Cuánto cuesta alquilar el apartamento en 2027?', `La tarifa por noche es de ${euro(rate('low'))} de enero a mayo, excepto del 22 al 28 de marzo, y de octubre a diciembre; ${euro(rate('mid'))} en junio, septiembre y del 22 al 28 de marzo (Semana Santa, ambos incluidos); ${euro(rate('july'))} en julio; y ${euro(rate('august'))} en agosto. Una quincena de 15 noches cuesta ${euro(rate('july') * 15)} en julio o ${euro(rate('august') * 15)} en agosto. Si la estancia abarca dos temporadas, cada noche se calcula a su tarifa. El presupuesto es orientativo y se confirma personalmente.`],
  ['¿Cómo consulto la disponibilidad y solicito una reserva?', 'Selecciona la llegada y la salida en el calendario para consultar las noches disponibles y el importe orientativo. Puedes enviar el formulario, escribir por WhatsApp o llamar. La disponibilidad se actualiza desde el calendario del propietario. Enviar una consulta no bloquea las fechas ni confirma una reserva: recibirás una respuesta personal.'],
  ['¿Se cobra un suplemento de limpieza?', `Las estancias de 1 a ${availability.cleaningFee.maximumNights} noches llevan un cargo único de limpieza de ${euro(availability.cleaningFee.amount)} por estancia. A partir de ${availability.cleaningFee.maximumNights + 1} noches no se añade este cargo. El calendario lo incluye en el total orientativo y lo muestra desglosado.`],
  ['¿Qué debo confirmar antes de reservar?', 'Consulta las horas de entrada y salida, fianza, cancelación, ropa de cama y toallas, y las condiciones para mascotas. Estos detalles se acuerdan con el propietario antes de confirmar la estancia.'],
];
const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
export function renderSeo(html) {
  const faq = questions.map(([question, answer]) => `<details><summary>${escape(question)}</summary><p>${escape(answer)}</p></details>`).join('\n');
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': canonical + '#webpage', url: canonical, name: 'Alquiler de apartamento en Gandía Playa con piscina y parking', inLanguage: 'es', mainEntity: { '@id': canonical + '#alojamiento' }, hasPart: { '@id': canonical + '#preguntas' } },
      { '@type': 'Apartment', '@id': canonical + '#alojamiento', name: 'Apartamento en Gandía Playa · Gandiazar IV', url: canonical,
        description: 'Apartamento completo reformado para un máximo de 4 personas, con dos dormitorios, terraza orientada al sur, piscina comunitaria y parking incluido, a unos 150 metros de la playa. Se admiten mascotas. No dispone de aire acondicionado.',
        address: { '@type': 'PostalAddress', streetAddress: 'Carrer de la Valldigna 19', addressLocality: 'Gandía', addressRegion: 'Valencia', addressCountry: 'ES' },
        numberOfBedrooms: 2, occupancy: { '@type': 'QuantitativeValue', maxValue: 4 }, petsAllowed: true,
        image: ['salon-1-1600.webp', 'terraza-1-1600.webp', 'dormitorio-1-1400.webp', 'bano-1-1400.webp'].map((name) => canonical + 'images/' + name),
        amenityFeature: [['Piscina comunitaria', true], ['Parking incluido', true], ['Terraza', true], ['WiFi', true], ['Aire acondicionado', false]].map(([name, value]) => ({ '@type': 'LocationFeatureSpecification', name, value })) },
      { '@type': 'FAQPage', '@id': canonical + '#preguntas', inLanguage: 'es', mainEntity: questions.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) },
    ],
  };
  const rates = availability.seasons.map(({ name, price }) => `<span>${escape(name)} <strong>${euro(price)}/noche</strong></span>`).join('');
  return html.replace('<!-- SEO:FAQ -->', faq)
    .replace('<!-- SEO:SCHEMA -->', `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`)
    .replace('<!-- SEO:RATES -->', rates);
}
