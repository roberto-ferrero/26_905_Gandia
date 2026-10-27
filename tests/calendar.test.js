import test from 'node:test';
import assert from 'node:assert/strict';
import { availability } from '../src/site-config.js';
import { addDays, parseDate, nightCount, isReserved, quoteStay, monthCells, shiftMonth } from '../src/calendar.js';

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
  assert.equal(initial.total, 630);
  const mixed = quoteStay('2027-06-29', '2027-07-03', availability);
  assert.equal(mixed.total, 420);
  assert.deepEqual(mixed.breakdown.map(({ id, nights, total }) => ({ id, nights, total })), [
    { id: 'mid', nights: 2, total: 180 }, { id: 'high', nights: 2, total: 240 },
  ]);
});
test('rechaza intervalos incompletos, invertidos, largos y fuera de calendario', () => {
  for (const [arrival, departure] of [['2027-06-12', ''], ['2027-06-12', '2027-06-12'], ['2027-06-12', '2027-06-11'], ['2027-01-01', '2027-04-01'], ['2026-12-31', '2027-01-02'], ['2027-12-31', '2028-01-02']]) {
    assert.equal(quoteStay(arrival, departure, availability).valid, false, `${arrival} → ${departure}`);
  }
  assert.equal(quoteStay('2027-12-31', '2028-01-01', availability).total, 70);
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
