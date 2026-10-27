export const siteConfig = {
  // Datos públicos de contacto facilitados por el propietario.
  contact: { telephone: '+34 678 552 380', whatsapp: '+34678552380', email: 'hola@robertoferrero.es' },
  ownerUrl: '',
  mapsUrl: 'https://www.google.com/maps/place//@39.0174167,-0.1759939,1432m/data=!3m2!1e3!4b1?entry=ttu',
};

// Tarifas confirmadas; las reservas se consultan en el servidor desde Google Calendar.
// Cada reserva bloquea noches en [llegada, salida); la salida permite otro check-in.
export const availability = {
  demo: false,
  source: 'google-ical',
  firstDate: '2027-01-01',
  lastDate: '2027-12-31',
  initialMonth: '2027-06-01',
  initialArrival: '',
  initialDeparture: '',
  minimumNights: 1,
  maximumNights: 60,
  cleaningFee: { maximumNights: 3, amount: 20 },
  seasons: [
    { id: 'low', season: 'low', name: 'Baja', price: 60, months: [1, 2, 3, 4, 5, 10, 11, 12] },
    { id: 'mid', season: 'mid', name: 'Media', price: 80, months: [6, 9] },
    { id: 'july', season: 'high', name: 'Alta · julio', price: 110, months: [7] },
    { id: 'august', season: 'high', name: 'Alta · agosto', price: 120, months: [8] },
  ],
  dateOverrides: [{ from: '2027-03-22', through: '2027-03-28', rateId: 'mid' }],
  // Tres temporadas y cuatro tarifas, con excepción de Semana Santa.
  // Cada noche conserva su tarifa, también al pasar de julio a agosto.
  reservations: [],
};
