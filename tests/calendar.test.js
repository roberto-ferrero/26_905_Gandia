import test from 'node:test';
import assert from 'node:assert/strict';
import { availability as configuredAvailability } from '../src/site-config.js';
const availability = { ...configuredAvailability, reservations: [
  { arrival: '2027-06-23', departure: '2027-06-27' },
  { arrival: '2027-07-10', departure: '2027-07-17' },
  { arrival: '2027-08-02', departure: '2027-08-16' },
] };
import { addDays, parseDate, nightCount, isReserved, seasonFor, quoteStay, monthCells, shiftMonth } from '../src/calendar.js';

test('valida las fechas de calendario sin normalizar fechas imposibles', () => {
  assert.equal(parseDate('2027-02-29'), null);
  assert.equal(parseDate('2027-06-31'), null);
  assert.equal(parseDate('2027-13-01'), null);
  assert.equal(parseDate('12/06/2027'), null);
  assert.ok(parseDate('2028-02-29'));
});
test('cuenta noches sin errores en los cambios de horario', () => {
  assert.equal(nightCount('2027-03-27', '2027-03-29'), 2);
  assert.equal(nightCount('2027-10-30', '2027-11-01'), 2);
  assert.equal(addDays('2027-12-31', 1), '2028-01-01');
});
test('la salida no ocupa una noche y permite el relevo de huéspedes', () => {
  assert.equal(isReserved('2027-06-23', availability), true);
  assert.equal(isReserved('2027-06-27', availability), false);
  assert.equal(quoteStay('2027-06-20', '2027-06-23', availability).valid, true);
  assert.equal(quoteStay('2027-06-27', '2027-06-30', availability).valid, true);
});
test('impide una estancia que atraviese una reserva aunque sus extremos estén libres', () => {
  assert.equal(quoteStay('2027-06-20', '2027-06-29', availability).valid, false);
});
test('calcula las siete noches de la propuesta y el cruce entre temporadas', () => {
  const initial = quoteStay('2027-06-12', '2027-06-19', availability);
  assert.equal(initial.nights, 7);
  assert.equal(initial.total, 560);
  const mixed = quoteStay('2027-06-29', '2027-07-03', availability);
  assert.equal(mixed.total, 380);
  assert.deepEqual(mixed.breakdown.map(({ id, nights, total }) => ({ id, nights, total })), [
    { id: 'mid', nights: 2, total: 160 }, { id: 'july', nights: 2, total: 220 },
  ]);
});
test('aplica las tarifas acordadas a todas las noches de 2027', () => {
  const prices = [60, 60, 60, 60, 60, 80, 110, 120, 80, 60, 60, 60];
  const seasons = ['low', 'low', 'low', 'low', 'low', 'mid', 'high', 'high', 'mid', 'low', 'low', 'low'];
  for (let date = '2027-01-01'; date <= '2027-12-31'; date = addDays(date, 1)) {
    const month = parseDate(date).getUTCMonth();
    const rate = seasonFor(date, availability);
    assert.equal(rate.price, date >= '2027-03-22' && date <= '2027-03-28' ? 80 : prices[month], date);
    assert.equal(rate.season, date >= '2027-03-22' && date <= '2027-03-28' ? 'mid' : seasons[month], date);
  }
});
test('desglosa julio y agosto por separado aunque compartan temporada alta', () => {
  const quote = quoteStay('2027-07-30', '2027-08-02', availability);
  assert.equal(quote.valid, true);
  assert.equal(quote.nights, 3);
  assert.equal(quote.total, 360);
  assert.deepEqual(quote.breakdown.map(({ price, nights, total }) => ({ price, nights, total })), [
    { price: 110, nights: 2, total: 220 }, { price: 120, nights: 1, total: 120 },
  ]);
});
test('cobra cada noche a su tarifa al entrar y salir de las temporadas', () => {
  for (const [arrival, departure, total] of [
    ['2027-05-31', '2027-06-02', 160],
    ['2027-08-31', '2027-09-02', 220],
    ['2027-09-30', '2027-10-02', 160],
  ]) {
    assert.equal(quoteStay(arrival, departure, availability).total, total, `${arrival} → ${departure}`);
  }
});
test('rechaza intervalos incompletos, invertidos, largos y fuera de calendario', () => {
  for (const [arrival, departure] of [['2027-06-12', ''], ['2027-06-12', '2027-06-12'], ['2027-06-12', '2027-06-11'], ['2027-01-01', '2027-04-01'], ['2026-12-31', '2027-01-02'], ['2027-12-31', '2028-01-02']]) {
    assert.equal(quoteStay(arrival, departure, availability).valid, false, `${arrival} → ${departure}`);
  }
  assert.equal(quoteStay('2027-12-31', '2028-01-01', availability).total, 80);
  assert.equal(quoteStay('2027-06-12', '2027-06-14', { ...availability, minimumNights: 3 }).message, 'La estancia mínima es de 3 noches.');
});
test('ordena los días de lunes a domingo y navega entre años', () => {
  const june = monthCells('2027-06-01');
  assert.equal(june[0], null);
  assert.equal(june[1], '2027-06-01');
  assert.equal(june.filter(Boolean).length, 30);
  assert.equal(june.length % 7, 0);
  assert.equal(monthCells('2028-02-01').filter(Boolean).length, 29);
  assert.equal(shiftMonth('2027-12-01', 1), '2028-01-01');
  assert.equal(shiftMonth('2027-01-01', -1), '2026-12-01');
});

 test('limpieza: un cargo único para 1–3 noches y ninguno desde 4 noches', () => {
  for (const nights of [1, 2, 3, 4, 15]) {
    const q = quoteStay('2027-07-01', addDays('2027-07-01', nights), configuredAvailability);
    assert.equal(q.cleaningFee, nights <= 3 ? 20 : 0);
    assert.equal(q.total, nights * 110 + (nights <= 3 ? 20 : 0));
  }
});

test('Semana Santa incluye las noches del 22 al 28 y respeta ambos límites', () => {
  assert.equal(seasonFor('2027-03-21', configuredAvailability).price, 60);
  assert.equal(seasonFor('2027-03-22', configuredAvailability).price, 80);
  assert.equal(seasonFor('2027-03-28', configuredAvailability).price, 80);
  assert.equal(seasonFor('2027-03-29', configuredAvailability).price, 60);
  assert.equal(quoteStay('2027-03-22', '2027-03-29', configuredAvailability).total, 560);
  assert.equal(quoteStay('2027-03-21', '2027-03-23', configuredAvailability).total, 160);
  assert.equal(quoteStay('2027-03-28', '2027-03-30', configuredAvailability).total, 160);
});
