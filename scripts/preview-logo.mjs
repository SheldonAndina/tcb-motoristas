import sharp from 'sharp';
import fs from 'fs';

let svg = fs.readFileSync('public/logo.svg', 'utf8').replaceAll('currentColor', '#111111');
await sharp(Buffer.from(svg))
  .flatten({ background: '#ffffff' })
  .png()
  .toFile('public/logo-preview.png');

const m = await sharp('public/logo-preview.png').stats();
console.log(
  'means',
  m.channels.map((c) => Math.round(c.mean)),
  'size',
  (await sharp('public/logo-preview.png').metadata()).width
);
