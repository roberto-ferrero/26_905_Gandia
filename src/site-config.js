export const siteConfig = {
  // Completar antes de publicar el formulario y los enlaces de contacto.
  contact: { telephone: '', whatsapp: '', email: '' },
  ownerUrl: '',
  mapsUrl: 'https://www.google.com/maps/place//@39.0174167,-0.1759939,1432m/data=!3m2!1e3!4b1?entry=ttu',
  forecastUrl: 'https://www.aemet.es/es/eltiempo/prediccion/playas/norte-de-gandia-4613102',
};

// Fechas y precios ilustrativos, no disponibilidad real.
// Cada reserva bloquea noches en [llegada, salida); la salida permite otro check-in.
export const availability = {
  demo: true,
  firstDate: '2027-01-01',
  lastDate: '2027-12-31',
  initialMonth: '2027-06-01',
  initialArrival: '2027-06-12',
  initialDeparture: '2027-06-19',
  minimumNights: 1,
  maximumNights: 60,
  seasons: [
    { id: 'low', name: 'Baja', price: 70 },
    { id: 'mid', name: 'Media', price: 90 },
    { id: 'high', name: 'Alta', price: 120 },
  ],
  // Reglas mensuales de ejemplo. Cada noche conserva su propia tarifa.
  midSeasonMonths: [5, 6, 9],
  highSeasonMonths: [7, 8],
  reservations: [
    { arrival: '2027-06-23', departure: '2027-06-27' },
    { arrival: '2027-07-10', departure: '2027-07-17' },
    { arrival: '2027-08-02', departure: '2027-08-16' },
  ],
};
