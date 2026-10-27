import { cp, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { availability } from '../src/site-config.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const path = (value) => new URL(value, new URL('../', import.meta.url));
await mkdir(path('dist/api/'), { recursive: true });
await mkdir(path('dist-private/'), { recursive: true });
await cp(path('server/public-inquiry.php'), path('dist/api/inquiry.php'));
await cp(path('server/public-availability.php'), path('dist/api/availability.php'));
for (const name of ['config.example.php', 'calendar-source.example.php', 'availability.php', 'inquiry.php', 'mailer.php', 'request.php', 'vendor']) {
  await cp(path(`server/${name}`), path(`dist-private/${name}`), { recursive: true });
}
await writeFile(path('dist-private/calendar.json'), JSON.stringify(availability, null, 2) + '\n');
console.log(`Formulario PHP preparado: ${root}dist/api/ y dist-private/ (carpeta privada).`);
