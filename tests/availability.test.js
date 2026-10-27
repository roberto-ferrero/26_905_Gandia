import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchAvailability } from '../src/availability.js';
import { availability } from '../src/site-config.js';

const result = { ok: true, firstDate: '2027-01-01', lastDate: '2027-12-31', checkedAt: '2026-10-27T12:00:00Z', reservations: [{ arrival: '2027-01-21', departure: '2027-01-25', summary: 'PRIVATE' }] };
test('la disponibilidad utiliza fechas del servidor y descarta otros datos', async () => {
  let options;
  const data = await fetchAvailability('/api/availability.php', availability, async (_url, init) => { options = init; return Response.json(result); });
  assert.deepEqual(data.reservations, [{ arrival: '2027-01-21', departure: '2027-01-25' }]);
  assert.equal(options.cache, 'no-store');
});
test('un calendario vacío es válido, pero errores o respuestas corruptas nunca significan todo libre', async () => {
  assert.deepEqual((await fetchAvailability('/', availability, async () => Response.json({ ...result, reservations: [] }))).reservations, []);
  for (const response of [
    Response.json({ ok: false }, { status: 503 }), new Response('<html>Error</html>'),
    Response.json({ ...result, reservations: [{ arrival: '2027-02-30', departure: '2027-03-02' }] }),
    Response.json({ ...result, reservations: [{ arrival: '2027-01-25', departure: '2027-01-21' }] }),
    Response.json({ ...result, firstDate: '2026-01-01' }), Response.json({ ...result, checkedAt: '' }),
  ]) await assert.rejects(fetchAvailability('/', availability, async () => response), /No podemos consultar/);
});
test('la web no incluye reservas de demostración ni el enlace privado de Google', () => {
  assert.equal(availability.demo, false);
  assert.equal(availability.source, 'google-ical');
  assert.deepEqual(availability.reservations, []);
  assert.doesNotMatch(JSON.stringify(availability), /private-|calendar\.google/);
});
