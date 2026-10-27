import { asset } from './gallery-data.js';

export const landscapePhotos = {
  beach: { id: 'playa-ahuir', caption: 'Playa de l’Auir', alt: 'Playa de l’Auir con arena, dunas y olas bajo la luz del atardecer.', position: '58% center' },
  views: { id: 'vistas-mejoradas', caption: 'Vistas desde la habitación', alt: 'Vistas mejoradas desde la habitación a los campos, la playa de l’Auir y el mar, con Cullera al fondo.', position: '58% center' },
  corridor: { id: 'pasarela-auir', caption: 'Corredor Verd de l’Auir', alt: 'Pasarela de madera entre las dunas, con el mar al fondo.', position: '50% center' },
  promenade: { id: 'paseo-maritimo', caption: 'Paseo marítimo de Gandía', alt: 'Paseo marítimo de Gandía junto a la playa, con palmeras y paseantes al atardecer.', position: '48% center' },
};

export const landscapeSrcset = (photo) => [768, 1280, 1860].map((width) => `${asset(`${photo.id}-${width}.webp`)} ${width}w`).join(', ');
export const heroSlides = ['beach', 'views', 'corridor', 'promenade'].map((key) => landscapePhotos[key]);

export const environmentPlaces = {
  apartment: {
    title: 'Ubicación privilegiada.',
    description: 'Gandiazar IV, al norte de Gandía Playa. En una zona muy tranquila, conectada con Bus al pueblo y al puerto, y pegada a palmerales, naranjos y dunas.',
    caption: 'Carrer de la Valldigna 19 - Gandía Playa',
    alt: 'Infografía del entorno de Gandiazar IV, destacado junto a los campos y la playa de l’Auir.',
    src: asset('ubicacion-1774.webp'),
    srcset: `${asset('ubicacion-960.webp')} 960w, ${asset('ubicacion-1774.webp')} 1774w`,
  },
  beach: {
    title: 'Playa de l’Auir',
    description: 'A un paso de la playa de l’Auir: kilómetros de arena y dunas en un entorno sin urbanizar.',
    photo: landscapePhotos.beach,
  },
  pool: {
    title: 'Piscina',
    description: 'Piscinas para adultos y niños dentro de la urbanización, rodeadas de césped y zonas de sombra para disfrutar en familia.',
    caption: 'Piscinas de la urbanización',
    alt: 'Piscina circular de Gandiazar IV, con la piscina pequeña y el edificio al fondo.',
    src: asset('piscina-1-1280.webp'),
    srcset: `${asset('piscina-1-480.webp')} 480w, ${asset('piscina-1-960.webp')} 960w, ${asset('piscina-1-1280.webp')} 1280w`,
    position: 'center 75%',
  },
  corridor: {
    title: 'Corredor Verd de l’Auir',
    description: 'Junto al Corredor Verde del Auir. Un paseo que conecta la playa con humedales de alto valor ecológico.',
    photo: landscapePhotos.corridor,
  },
  promenade: {
    title: 'Junto al paseo marítimo',
    description: 'A pocos pasos del paseo marítimo, con restaurantes, heladerías y zonas de juegos infantiles para disfrutar en familia.',
    photo: landscapePhotos.promenade,
  },
};
