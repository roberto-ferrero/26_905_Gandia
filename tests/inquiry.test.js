import test from 'node:test';
import assert from 'node:assert/strict';
import { sendInquiry } from '../src/inquiry.js';

const payload = { arrival: '2027-07-30', departure: '2027-08-02', name: 'Prueba', contact: 'prueba@example.com', message: '', website: '' };

test('envía los datos por POST y solo confirma una respuesta positiva del servidor', async () => {
  const result = await sendInquiry(payload, '/gandia/api/inquiry.php', async (url, options) => {
    assert.equal(url, '/gandia/api/inquiry.php');
    assert.equal(options.method, 'POST');
    assert.equal(options.headers['X-Gandia-Inquiry'], '1');
    assert.deepEqual(JSON.parse(options.body), payload);
    return Response.json({ ok: true, reference: 'ABC123' });
  });
  assert.equal(result.reference, 'ABC123');
});

test('no muestra éxito ante HTML de la vista estática, respuestas incompletas o rechazo SMTP', async () => {
  for (const response of [
    new Response('<html>Vista previa</html>', { headers: { 'content-type': 'text/html' } }),
    Response.json({ ok: true }),
    Response.json({ ok: false, message: 'Correo no disponible' }, { status: 503 }),
  ]) {
    await assert.rejects(() => sendInquiry(payload, '/api/inquiry.php', async () => response));
  }
});

test('una interrupción de red no se presenta como consulta enviada ni reintenta el envío', async () => {
  let attempts = 0;
  await assert.rejects(() => sendInquiry(payload, '/api/inquiry.php', async () => {
    attempts++;
    throw new TypeError('Failed to fetch');
  }), /No hemos podido confirmar el envío/);
  assert.equal(attempts, 1);
});
