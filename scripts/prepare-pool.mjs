import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'public/images');
await mkdir(output, { recursive: true });
for (const [name, fullWidth] of [['piscina-1', 1280], ['piscina-2', 1280], ['piscina-3', 1024]]) {
  for (const width of [480, 960, fullWidth]) {
    await sharp(path.join(root, 'assets/source/piscina', `${name}.png`))
      .rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 86 })
      .toFile(path.join(output, `${name}-${width}.webp`));
  }
}
console.log('Tres fotografías de piscina optimizadas en nueve versiones WebP.');
