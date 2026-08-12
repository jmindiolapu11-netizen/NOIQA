import sharp from 'sharp';
import { mkdirSync } from 'fs';

const src = 'public/logo.png';
const out = 'public';

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

for (const { name, size } of sizes) {
  await sharp(src)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(`${out}/${name}`);
  console.log(`Generated ${name}`);
}

// Generate ICO-like favicon (just use 32x32 png renamed)
await sharp(src)
  .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(`${out}/favicon.ico`);
console.log('Generated favicon.ico');

console.log('Done!');
