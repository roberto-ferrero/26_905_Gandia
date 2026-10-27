import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
await mkdir(path.join(root, 'public/images'), { recursive: true });
for (const name of ['salon-1', 'terraza-1']) {
  for (const width of [480, 960, 1600]) {
    await sharp(path.join(root, 'assets/source/apartamento', `${name}.jpeg`))
      .rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 94 })
      .toFile(path.join(root, 'public/images', `${name}-${width}.webp`));
  }
}
console.log('Salón y terraza regenerados desde los originales, hasta 1600 px.');
