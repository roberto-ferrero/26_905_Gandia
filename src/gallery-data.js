const photo = (id, category, title, alt, detail) => ({ id, category, title, alt, detail });

export const photos = [
  photo('salon-1', 'salon', 'Salón', 'Salón con sofá, mesa de comedor y salida a la terraza.', 'Sofá, televisión y una mesa abatible con cuatro sillas.'),
  photo('dormitorio-1', 'dormitorios', 'Dormitorio principal', 'Dormitorio principal con cama doble, cabecero claro y ropa de cama estampada.', 'Cama doble y armarios empotrados.'),
  photo('cocina-1', 'cocina', 'Cocina equipada', 'Cocina reformada con muebles blancos y naranjas y encimera oscura.', 'Frigorífico, microondas, cafetera, tostadora, batidora y menaje completo.'),
  photo('terraza-1', 'terraza', 'Terraza', 'Terraza con una mesa blanca, sillas plegables y vistas abiertas de Gandía.', 'Mesita, sillas plegables y toldo. Sombrilla y sillas de playa a tu disposición.'),
  photo('salon-2', 'salon', 'Salón · otra perspectiva', 'Otra perspectiva del salón del apartamento.', 'Un espacio para descansar después de la playa.'),
  photo('salon-3', 'salon', 'Salón · detalles', 'Detalles del salón reformado.', 'El salón conecta directamente con la terraza.'),
  photo('dormitorio-1-2', 'dormitorios', 'Dormitorio principal · detalles', 'Otra vista del dormitorio principal.', 'Con armarios empotrados.'),
  photo('dormitorio-2-1', 'dormitorios', 'Segundo dormitorio', 'Segundo dormitorio con cama nido.', 'Cama nido de 80 + 80 cm y armario empotrado.'),
  photo('dormitorio-2-2', 'dormitorios', 'Segundo dormitorio · camas', 'Las dos camas del segundo dormitorio junto a la ventana.', 'Dos camas individuales de 80 cm.'),
  photo('dormitorio-2-3', 'dormitorios', 'Segundo dormitorio · detalles', 'Otra perspectiva del segundo dormitorio.', 'Espacio para guardar tus cosas.'),
  photo('cocina-2', 'cocina', 'Cocina · detalles', 'Otra perspectiva de la cocina equipada.', 'Lavadora y tendedero junto a la cocina.'),
  photo('bano-1', 'bano', 'Baño', 'Baño completamente reformado del apartamento.', 'Un baño completamente renovado.'),
  photo('bano-2', 'bano', 'Baño · ducha', 'Ducha con mampara y revestimiento rojo.', 'Ducha con mampara.'),
  photo('bano-3', 'bano', 'Baño · detalles', 'Detalles del baño reformado.', 'Toallas y sábanas disponibles bajo solicitud.'),
];

export const categories = [
  { id: 'all', name: 'Todos' },
  { id: 'salon', name: 'Salón' },
  { id: 'dormitorios', name: 'Dormitorios' },
  { id: 'cocina', name: 'Cocina' },
  { id: 'bano', name: 'Baño' },
  { id: 'terraza', name: 'Terraza' },
];

export const asset = (name) => import.meta.env.BASE_URL + 'images/' + name;
