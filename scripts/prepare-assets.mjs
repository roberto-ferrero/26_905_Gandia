import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.resolve(process.argv[2] || path.join(root, '../../Material para la IA'));
const output = path.join(root, 'public/images');
await mkdir(output, { recursive: true });
const gallery = {
  'salon-1': '03 Salon.jpeg', 'salon-2': '03 Salon-2.jpeg', 'salon-3': '03 Salon-3.jpeg',
  'dormitorio-1': '01 Habitacion1.jpeg', 'dormitorio-1-2': '01 Habitacion1-2.jpeg',
  'dormitorio-2-1': '02 Habitacion2-1.jpeg', 'dormitorio-2-2': '02 Habitacion2-2.jpeg', 'dormitorio-2-3': '02 Habitacion2-3.jpeg',
  'cocina-1': '05 Cocina-1.jpeg', 'cocina-2': '05 Cocina-2.jpeg',
  'bano-1': '04 Baño-1.jpeg', 'bano-2': '04 Baño-2.jpeg', 'bano-3': '04 Baño-3.jpeg',
  'terraza-1': '06 Terraza-1.jpeg',
};
let bytes = 0;
async function convert(input, name, widths, quality = 83) {
  for (const width of widths) {
    const file = path.join(output, `${name}-${width}.webp`);
    await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(file);
    bytes += (await stat(file)).size;
  }
}
for (const [name, filename] of Object.entries(gallery)) {
  await convert(path.join(source, 'Galeria de fotos', filename), name, [480, 960, 1400]);
}
await convert(path.join(source, 'Galeria de fotos/00 Vistas-1.jpeg'), 'vistas', [960, 1600], 87);
await convert(path.join(source, 'Galeria de fotos/00 Vistas-2.jpeg'), 'piscinas', [1400], 87);
await convert(path.join(source, 'Galeria de fotos/entorno.jpg'), 'entorno', [1400], 87);
await convert(path.join(root, 'docs/diseno/ubicacion-3d-infografia-v1.png'), 'ubicacion', [960, 1774], 90);
await convert(path.join(source, 'Ubicación/00 Ubicacion-3.jpeg'), 'plano', [1451], 94);
console.log(`Imágenes optimizadas en public/images · ${(bytes / 1024 / 1024).toFixed(2)} MB en total.`);
await import('./prepare-environment.mjs');
await import('./prepare-pool.mjs');
await import('./prepare-layout.mjs');
await import('./prepare-featured.mjs');
