import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'public/images');
await mkdir(output, { recursive: true });
for (const width of [480, 960, 1055]) {
  await sharp(path.join(root, 'assets/source/apartamento/distribucion.png'))
    .rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 90 })
    .toFile(path.join(output, `distribucion-${width}.webp`));
}
console.log('Vista general del apartamento optimizada.');
