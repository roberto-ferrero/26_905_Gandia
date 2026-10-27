import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { createServer as createTlsServer } from 'node:tls';
import { createServer as createTcpServer } from 'node:net';
import { cp, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { once } from 'node:events';
import { createHash } from 'node:crypto';

const root = resolve(import.meta.dirname, '..');
const php = process.env.PHP_BIN || join(root, '.cache/mail-tools/php/php.exe');
const openssl = process.env.OPENSSL_BIN || 'C:/Program Files/Git/usr/bin/openssl.exe';
// Las pruebas reescriben config.php entre peticiones; no reutilizar bytecode anterior.
const phpArgs = ['-n', '-d', 'opcache.enable=0', '-d', `extension_dir=${join(dirname(php), 'ext')}`, '-d', 'extension=openssl'];
const payload = { arrival: '2027-07-30', departure: '2027-08-02', name: 'Prueba', contact: 'prueba@example.com', message: 'Consulta de prueba local.', website: '', total: 1 };

test('formulario PHP con SMTP SSL/TLS local, sin enviar correos al exterior', async (t) => {
  await mkdir(join(root, '.cache'), { recursive: true });
  const temporary = await mkdtemp(join(root, '.cache/mail-test-'));
  const privateDir = join(temporary, 'gandia-private');
  const publicDir = join(temporary, 'public');
  await cp(join(root, 'dist-private'), privateDir, { recursive: true });
  const fixtureCalendar = JSON.parse(await readFile(join(privateDir, 'calendar.json'), 'utf8'));
  fixtureCalendar.source = 'static';
  fixtureCalendar.reservations = [{ arrival: '2027-08-02', departure: '2027-08-16' }];
  await writeFile(join(privateDir, 'calendar.json'), JSON.stringify(fixtureCalendar));
  await cp(join(root, 'dist'), join(publicDir, 'gandia'), { recursive: true });
  const key = join(temporary, 'key.pem');
  const cert = join(temporary, 'cert.pem');
  execFileSync(openssl, ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', key, '-out', cert, '-subj', '/CN=localhost', '-addext', 'subjectAltName=DNS:localhost,IP:127.0.0.1', '-days', '1'], { stdio: 'ignore' });
  const messages = [];
  const sockets = new Set();
  let rejectMessage = false;
  const smtp = createTlsServer({ key: await readFile(key), cert: await readFile(cert) }, (socket) => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
    socket.on('error', () => {});
    socket.setEncoding('utf8');
    socket.write('220 localhost test SMTP\r\n');
    let buffer = '';
    let auth = 0;
    let data = false;
    let message = '';
    let envelope = [];
    socket.on('data', (chunk) => {
      buffer += chunk;
      while (buffer.includes('\r\n')) {
        const end = buffer.indexOf('\r\n');
        const line = buffer.slice(0, end);
        buffer = buffer.slice(end + 2);
        if (data) {
          if (line !== '.') { message += line.replace(/^\.\./, '.') + '\r\n'; continue; }
          data = false;
          if (rejectMessage) socket.write('550 message rejected for test\r\n');
          else { messages.push({ body: message, envelope }); socket.write('250 queued locally\r\n'); }
          continue;
        }
        if (auth === 1) { auth = 2; socket.write('334 UGFzc3dvcmQ6\r\n'); continue; }
        if (auth === 2) { auth = 0; socket.write('235 authenticated\r\n'); continue; }
        if (line.startsWith('EHLO')) socket.write('250-localhost\r\n250-AUTH LOGIN PLAIN\r\n250 SIZE 100000\r\n');
        else if (line === 'AUTH LOGIN') { auth = 1; socket.write('334 VXNlcm5hbWU6\r\n'); }
        else if (line.startsWith('AUTH PLAIN')) socket.write('235 authenticated\r\n');
        else if (line.startsWith('MAIL FROM:')) { envelope = [line]; socket.write('250 sender accepted\r\n'); }
        else if (line.startsWith('RCPT TO:')) { envelope.push(line); socket.write('250 recipient accepted\r\n'); }
        else if (line === 'DATA') { data = true; message = ''; socket.write('354 end with dot\r\n'); }
        else if (line === 'QUIT') socket.end('221 bye\r\n');
        else if (line === 'RSET') socket.write('250 reset\r\n');
        else socket.write('500 unknown command\r\n');
      }
    });
  });
  smtp.on('tlsClientError', () => {});
  smtp.listen(0, '127.0.0.1');
  await once(smtp, 'listening');
  const reservation = createTcpServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const port = reservation.address().port;
  await new Promise((done) => reservation.close(done));
  const origin = `http://127.0.0.1:${port}`;
  const config = {
    enabled: true,
    smtp: { host: '127.0.0.1', port: smtp.address().port, username: 'test@example.com', password: 'LOCAL_TEST_ONLY', ca_file: cert },
    from_email: 'sender@example.com', from_name: 'Gandia test', to_email: 'owner@example.com',
    allowed_origins: [origin], calendar_file: join(privateDir, 'calendar.json'), storage_dir: join(privateDir, 'storage'),
    rate_limit: { per_ip: 5, total: 30, window_seconds: 3600 },
  };
  const saveConfig = () => writeFile(join(privateDir, 'config.php'), `<?php return json_decode(base64_decode('${Buffer.from(JSON.stringify(config)).toString('base64')}'), true);\n`);
  await saveConfig();
  const server = spawn(php, [...phpArgs, '-S', `127.0.0.1:${port}`, '-t', publicDir], {
    cwd: root, env: { ...process.env, GANDIA_PRIVATE_DIR: privateDir, GANDIA_SMTP_PASSWORD: '' }, stdio: 'pipe', windowsHide: true,
  });
  let log = '';
  server.stderr.on('data', (chunk) => { log += chunk; });
  server.stdout.on('data', (chunk) => { log += chunk; });
  const finish = async () => {
    server.kill();
    for (const socket of sockets) socket.destroy();
    await new Promise((done) => smtp.close(done));
  };
  t.after(finish);
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    try { await fetch(`${origin}/gandia/api/inquiry.php`); ready = true; break; }
    catch { await new Promise((done) => setTimeout(done, 100)); }
  }
  assert.ok(ready, `PHP no ha arrancado: ${log}`);
  const post = (body = payload, extra = {}) => fetch(`${origin}/gandia/api/inquiry.php`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Gandia-Inquiry': '1', Origin: origin, ...extra }, body: JSON.stringify(body),
  });

  await t.test('valida método, origen y tipo de contenido antes del envío', async () => {
    assert.equal((await fetch(`${origin}/gandia/api/inquiry.php`)).status, 405);
    assert.equal((await post(payload, { Origin: 'https://otro.example' })).status, 403);
    assert.equal((await post(payload, { 'Content-Type': 'text/plain' })).status, 415);
    assert.equal(messages.length, 0);
  });
  await t.test('rechaza fechas, contactos y honeypot manipulados sin enviar correo', async () => {
    for (const changes of [
      { arrival: '2027-02-30' }, { departure: '2027-07-29' }, { contact: 'invalid' },
      { name: 'Prueba\r\nBcc: bad@example.com' }, { website: 'https://spam.example' },
      { arrival: '2027-08-03', departure: '2027-08-05' }, { message: 'a'.repeat(1501) }, { name: [] },
    ]) assert.equal((await post({ ...payload, ...changes })).status, 422, JSON.stringify(changes));
    assert.equal(messages.length, 0);
  });
  await t.test('recalcula 360 euros con limpieza y envía al destinatario fijo con Reply-To del visitante', async () => {
    const response = await post({ ...payload, to: 'attacker@example.com' });
    assert.equal(response.status, 200, await response.clone().text());
    const result = await response.json();
    assert.equal(result.ok, true);
    assert.match(result.reference, /^[A-F0-9]{12}$/);
    assert.equal(messages.length, 1);
    assert.deepEqual(messages[0].envelope, ['MAIL FROM:<sender@example.com>', 'RCPT TO:<owner@example.com>']);
    assert.match(messages[0].body, /Reply-To: Prueba <prueba@example.com>/);
    assert.match(messages[0].body, /Total orientativo del alojamiento: 360/);
    assert.match(messages[0].body, /Limpieza: 20/);
    assert.match(messages[0].body, /Esta consulta no confirma ni bloquea una reserva/);
    assert.doesNotMatch(messages[0].body, /attacker@example.com/);
  });
  await t.test('un teléfono es válido sin convertirlo en una dirección Reply-To', async () => {
    assert.equal((await post({ ...payload, contact: '+34 600 000 000' })).status, 200);
    assert.equal(messages.length, 2);
    assert.doesNotMatch(messages[1].body, /^Reply-To:/m);
    assert.match(messages[1].body, /Contacto: \+34 600 000 000/);
  });
  await t.test('un rechazo SMTP devuelve error sin filtrar configuración ni contraseña', async () => {
    rejectMessage = true;
    const response = await post();
    assert.equal(response.status, 503);
    const body = await response.text();
    assert.match(body, /"ok":false/);
    assert.doesNotMatch(body, /LOCAL_TEST_ONLY|SMTP|127\.0\.0\.1|config\.php/);
    assert.equal(messages.length, 2);
    rejectMessage = false;
  });
  await t.test('sin contraseña queda desactivado y los límites bloquean nuevos envíos', async () => {
    config.smtp.password = '';
    await saveConfig();
    assert.equal((await post()).status, 503);
    config.smtp.password = 'LOCAL_TEST_ONLY';
    config.rate_limit.per_ip = 1;
    await saveConfig();
    const response = await post();
    assert.equal(response.status, 429);
    assert.ok(Number(response.headers.get('retry-after')) > 0);
    assert.equal(messages.length, 2);
    const rateData = await readFile(join(privateDir, 'storage/rate-limit.json'), 'utf8');
    assert.doesNotMatch(rateData, /127\.0\.0\.1|prueba@example.com|Consulta de prueba/);
  });
  await t.test('se exige verificar el certificado TLS del servidor de correo', async () => {
    config.rate_limit.per_ip = 10;
    delete config.smtp.ca_file;
    await saveConfig();
    assert.equal((await post()).status, 503);
    assert.equal(messages.length, 2);
  });
  await t.test('la disponibilidad pública solo muestra fechas y el formulario rechaza noches ocupadas o una fuente fallida', async () => {
    fixtureCalendar.source = 'google-ical';
    await writeFile(join(privateDir, 'calendar.json'), JSON.stringify(fixtureCalendar));
    const url = 'https://calendar.google.com/calendar/ical/test/private-test/basic.ics';
    await writeFile(join(privateDir, 'calendar-source.php'), `<?php return ['url'=>'${url}','timezone'=>'Europe/Madrid','cache_seconds'=>300];`);
    const state = { fingerprint: createHash('sha256').update(url + fixtureCalendar.firstDate + fixtureCalendar.lastDate + 'Europe/Madrid').digest('hex'), checkedAt: Math.floor(Date.now() / 1000), reservations: [{ arrival: '2027-01-21', departure: '2027-01-25' }] };
    await writeFile(join(privateDir, 'storage/availability.json'), JSON.stringify(state));
    const response = await fetch(`${origin}/gandia/api/availability.php`);
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.deepEqual(data.reservations, state.reservations);
    assert.doesNotMatch(JSON.stringify(data), /calendar\.google|private-|smtp|password|summary/);
    assert.equal((await post({ ...payload, arrival: '2027-01-21', departure: '2027-01-23' })).status, 422);
    state.retryAfter = Math.floor(Date.now() / 1000) + 60;
    await writeFile(join(privateDir, 'storage/availability.json'), JSON.stringify(state));
    assert.equal((await fetch(`${origin}/gandia/api/availability.php`)).status, 503);
    assert.equal((await post()).status, 503);
    assert.equal(messages.length, 2);
  });
});
