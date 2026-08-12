import sharp from 'sharp';
import potrace from 'potrace';
import fs from 'fs';
import { promisify } from 'util';

const trace = promisify(potrace.trace);
const src = 'public/tcb-logo-source.png';

const { data, info } = await sharp(src).greyscale().raw().toBuffer({ resolveWithObject: true });
const w = info.width;
const h = info.height;

// Aggressive: keep only very dark pixels (vinyl ink), then morphological cleanup
const bin = new Uint8Array(w * h);
for (let i = 0; i < bin.length; i++) bin[i] = data[i] < 55 ? 1 : 0;

// Remove small speckles: keep pixels that have >= 3 dark neighbors in 3x3
const cleaned = new Uint8Array(w * h);
for (let y = 1; y < h - 1; y++) {
  for (let x = 1; x < w - 1; x++) {
    const i = y * w + x;
    if (!bin[i]) continue;
    let n = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        n += bin[(y + dy) * w + (x + dx)];
      }
    }
    if (n >= 4) cleaned[i] = 1;
  }
}

// Bounding box
let minX = w,
  minY = h,
  maxX = 0,
  maxY = 0,
  count = 0;
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    if (cleaned[y * w + x]) {
      count++;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
}
console.log({ minX, minY, maxX, maxY, count });

const pad = 6;
minX = Math.max(0, minX - pad);
minY = Math.max(0, minY - pad);
maxX = Math.min(w - 1, maxX + pad);
maxY = Math.min(h - 1, maxY + pad);
const cw = maxX - minX + 1;
const ch = maxY - minY + 1;

// Render cropped BW
const outBuf = Buffer.alloc(cw * ch);
for (let y = 0; y < ch; y++) {
  for (let x = 0; x < cw; x++) {
    outBuf[y * cw + x] = cleaned[(y + minY) * w + (x + minX)] ? 0 : 255;
  }
}
await sharp(outBuf, { raw: { width: cw, height: ch, channels: 1 } })
  .png()
  .toFile('public/tcb-logo-crop.png');

const rgba = Buffer.alloc(cw * ch * 4);
for (let i = 0; i < cw * ch; i++) {
  const dark = outBuf[i] < 128;
  rgba[i * 4] = 0;
  rgba[i * 4 + 1] = 0;
  rgba[i * 4 + 2] = 0;
  rgba[i * 4 + 3] = dark ? 255 : 0;
}
await sharp(rgba, { raw: { width: cw, height: ch, channels: 4 } })
  .png()
  .toFile('public/tcb-logo.png');

const svg = await trace('public/tcb-logo-crop.png', {
  threshold: 128,
  color: '#000000',
  background: 'transparent',
  turdSize: 30,
  optTolerance: 0.25,
});

const finalSvg = svg
  .replaceAll('fill="#000000"', 'fill="currentColor"')
  .replace('<svg', '<svg role="img" aria-label="TCB Transportes"');
fs.writeFileSync('public/logo.svg', finalSvg);
console.log('svg', finalSvg.match(/viewBox="[^"]+"/)?.[0], finalSvg.length);
