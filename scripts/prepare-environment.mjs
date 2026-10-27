import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'public/images');
await mkdir(output, { recursive: true });
let bytes = 0;
for (const name of ['playa-ahuir', 'vistas-mejoradas', 'pasarela-auir', 'paseo-maritimo']) {
  for (const width of [768, 1280, 1860]) {
    const result = await sharp(path.join(root, 'assets/source/entorno', `${name}.png`))
      .rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 86 })
      .toFile(path.join(output, `${name}-${width}.webp`));
    bytes += result.size;
  }
}
console.log(`Cuatro fotografías del entorno optimizadas · ${(bytes / 1024 / 1024).toFixed(2)} MB.`);
