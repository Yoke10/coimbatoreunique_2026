const fs = require('fs');
const zlib = require('zlib');

// 1. Read and decode orig_favicon.png (2000x2000 RGB)
const origBuf = fs.readFileSync('scripts/orig_favicon.png');
let offset = 8;
let srcW, srcH;
const idatChunks = [];

while (offset < origBuf.length) {
  const length = origBuf.readUInt32BE(offset);
  const type = origBuf.toString('ascii', offset + 4, offset + 8);
  if (type === 'IHDR') {
    srcW = origBuf.readUInt32BE(offset + 8);
    srcH = origBuf.readUInt32BE(offset + 12);
  } else if (type === 'IDAT') {
    idatChunks.push(origBuf.subarray(offset + 8, offset + 8 + length));
  }
  offset += 12 + length;
}

console.log(`Decoding master source: ${srcW}x${srcH}...`);
const raw = zlib.inflateSync(Buffer.concat(idatChunks));
const bpp = 3;
const stride = 1 + srcW * bpp;
const srcRGB = Buffer.alloc(srcW * srcH * 3);

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

for (let y = 0; y < srcH; y++) {
  const filterType = raw[y * stride];
  const lineStart = y * stride + 1;
  const outStart = y * srcW * 3;
  for (let x = 0; x < srcW * 3; x++) {
    const rawVal = raw[lineStart + x];
    const left = x >= 3 ? srcRGB[outStart + x - 3] : 0;
    const up = y > 0 ? srcRGB[(y - 1) * srcW * 3 + x] : 0;
    const upLeft = (y > 0 && x >= 3) ? srcRGB[(y - 1) * srcW * 3 + x - 3] : 0;
    let val = 0;
    if (filterType === 0) val = rawVal;
    else if (filterType === 1) val = (rawVal + left) & 0xff;
    else if (filterType === 2) val = (rawVal + up) & 0xff;
    else if (filterType === 3) val = (rawVal + Math.floor((left + up) / 2)) & 0xff;
    else if (filterType === 4) val = (rawVal + paeth(left, up, upLeft)) & 0xff;
    srcRGB[outStart + x] = val;
  }
}
console.log('Decoded master source successfully.');

// Background gradient function at (x, y) on a W x H canvas
// Official club colors:
// (0,0): #400763 (64, 7, 99)
// (mid): #680b56 (104, 11, 86)
// (W,H): #ed0775 (237, 7, 117)
function getBgColor(x, y, W, H) {
  const t = Math.max(0, Math.min(1, (x / W + y / H) / 2));
  let r, g, b;
  if (t < 0.5) {
    const u = t / 0.5;
    r = 64 + (104 - 64) * u;
    g = 7 + (11 - 7) * u;
    b = 99 + (86 - 99) * u;
  } else {
    const u = (t - 0.5) / 0.5;
    r = 104 + (237 - 104) * u;
    g = 11 + (7 - 11) * u;
    b = 86 + (117 - 86) * u;
  }
  return [Math.round(r), Math.round(g), Math.round(b)];
}

// 2. Build high-res 2000x2000 composited canvas with scaled and centered symbol
// Scale factor: 1.065
// Center shift: +70px
const scale = 1.055;
const shiftY = 68;
const origCenterX = 1000;
const origCenterY = 998;

console.log(`Generating optimized high-res composite: scale=${scale}, shiftY=${shiftY}px...`);
const compW = 2000;
const compH = 2000;
const compRGB = Buffer.alloc(compW * compH * 3);

// Bilinear sampling from srcRGB
function sampleSrc(x, y) {
  if (x < 0 || x >= srcW - 1 || y < 0 || y >= srcH - 1) {
    const cx = Math.max(0, Math.min(srcW - 1, Math.round(x)));
    const cy = Math.max(0, Math.min(srcH - 1, Math.round(y)));
    const idx = (cy * srcW + cx) * 3;
    return [srcRGB[idx], srcRGB[idx+1], srcRGB[idx+2]];
  }
  const x0 = Math.floor(x), x1 = x0 + 1;
  const y0 = Math.floor(y), y1 = y0 + 1;
  const wx1 = x - x0, wx0 = 1 - wx1;
  const wy1 = y - y0, wy0 = 1 - wy1;

  const i00 = (y0 * srcW + x0) * 3;
  const i10 = (y0 * srcW + x1) * 3;
  const i01 = (y1 * srcW + x0) * 3;
  const i11 = (y1 * srcW + x1) * 3;

  const r = (srcRGB[i00]*wx0 + srcRGB[i10]*wx1)*wy0 + (srcRGB[i01]*wx0 + srcRGB[i11]*wx1)*wy1;
  const g = (srcRGB[i00+1]*wx0 + srcRGB[i10+1]*wx1)*wy0 + (srcRGB[i01+1]*wx0 + srcRGB[i11+1]*wx1)*wy1;
  const b = (srcRGB[i00+2]*wx0 + srcRGB[i10+2]*wx1)*wy0 + (srcRGB[i01+2]*wx0 + srcRGB[i11+2]*wx1)*wy1;
  return [r, g, b];
}

for (let y = 0; y < compH; y++) {
  for (let x = 0; x < compW; x++) {
    const compIdx = (y * compW + x) * 3;

    // Map comp (x, y) back to src (srcX, srcY)
    const srcX = (x - compW / 2) / scale + origCenterX;
    const srcY = (y - compH / 2) / scale + (origCenterY - shiftY);

    if (srcX >= 0 && srcX < srcW && srcY >= 0 && srcY < srcH) {
      const [sr, sg, sb] = sampleSrc(srcX, srcY);
      // Check if this point in src is part of the logo
      // In src, background has green <= 13!
      // Logo (white U or orange swoosh) has green >= 25.
      // For antialiasing transition between g=12 and g=25:
      if (sg >= 25) {
        // Full logo
        compRGB[compIdx] = Math.round(sr);
        compRGB[compIdx+1] = Math.round(sg);
        compRGB[compIdx+2] = Math.round(sb);
        continue;
      } else if (sg > 13) {
        // Anti-aliased border of the logo
        const alphaLogo = (sg - 13) / (25 - 13);
        const [bgr, bgg, bgb] = getBgColor(x, y, compW, compH);
        compRGB[compIdx] = Math.round(sr * alphaLogo + bgr * (1 - alphaLogo));
        compRGB[compIdx+1] = Math.round(sg * alphaLogo + bgg * (1 - alphaLogo));
        compRGB[compIdx+2] = Math.round(sb * alphaLogo + bgb * (1 - alphaLogo));
        continue;
      }
    }

    // Default background
    const [bgr, bgg, bgb] = getBgColor(x, y, compW, compH);
    compRGB[compIdx] = bgr;
    compRGB[compIdx+1] = bgg;
    compRGB[compIdx+2] = bgb;
  }
}
console.log('High-res composite built successfully.');

// 3. High-quality Area-Averaging Downsampler
function downsample(targetSize) {
  const outRGBA = Buffer.alloc(targetSize * targetSize * 4);
  const ratio = compW / targetSize;

  for (let ty = 0; ty < targetSize; ty++) {
    const srcYStart = ty * ratio;
    const srcYEnd = (ty + 1) * ratio;

    for (let tx = 0; tx < targetSize; tx++) {
      const srcXStart = tx * ratio;
      const srcXEnd = (tx + 1) * ratio;

      let sumR = 0, sumG = 0, sumB = 0, totalWeight = 0;

      const y0 = Math.floor(srcYStart);
      const y1 = Math.min(compH - 1, Math.ceil(srcYEnd));
      const x0 = Math.floor(srcXStart);
      const x1 = Math.min(compW - 1, Math.ceil(srcXEnd));

      for (let sy = y0; sy <= y1; sy++) {
        const yWeight = Math.min(sy + 1, srcYEnd) - Math.max(sy, srcYStart);
        if (yWeight <= 0) continue;

        for (let sx = x0; sx <= x1; sx++) {
          const xWeight = Math.min(sx + 1, srcXEnd) - Math.max(sx, srcXStart);
          if (xWeight <= 0) continue;

          const w = xWeight * yWeight;
          const idx = (sy * compW + sx) * 3;
          sumR += compRGB[idx] * w;
          sumG += compRGB[idx+1] * w;
          sumB += compRGB[idx+2] * w;
          totalWeight += w;
        }
      }

      const outIdx = (ty * targetSize + tx) * 4;
      outRGBA[outIdx] = Math.round(sumR / totalWeight);
      outRGBA[outIdx+1] = Math.round(sumG / totalWeight);
      outRGBA[outIdx+2] = Math.round(sumB / totalWeight);
      outRGBA[outIdx+3] = 255; // Solid 100% opaque
    }
  }
  return outRGBA;
}

// 4. PNG encoder
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

function createPNG(size, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const scanlineLen = 1 + size * 4;
  const raw = Buffer.alloc(size * scanlineLen);
  for (let y = 0; y < size; y++) {
    const rawOffset = y * scanlineLen;
    raw[rawOffset] = 0;
    rgba.copy(raw, rawOffset + 1, y * size * 4, (y + 1) * size * 4);
  }

  return Buffer.concat([
    sig,
    createChunk('IHDR', ihdr),
    createChunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    createChunk('IEND', Buffer.alloc(0))
  ]);
}

function createICO(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const dirEntries = [];
  let currentOffset = 6 + count * 16;

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 0);
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(img.png.length, 8);
    entry.writeUInt32LE(currentOffset, 12);
    dirEntries.push(entry);
    currentOffset += img.png.length;
  }

  return Buffer.concat([
    header,
    ...dirEntries,
    ...images.map(img => img.png)
  ]);
}

// 5. Generate all required assets
const sizes = [512, 192, 180, 48, 32, 16];
const generated = {};

for (const s of sizes) {
  console.log(`Generating ${s}x${s} PNG...`);
  const rgba = downsample(s);
  const png = createPNG(s, rgba);
  generated[s] = { size: s, rgba, png };
}

// Write to public/ directory
fs.writeFileSync('public/favicon.png', generated[192].png);
console.log(`Saved public/favicon.png (192x192, ${generated[192].png.length} bytes)`);

fs.writeFileSync('public/favicon-512x512.png', generated[512].png);
console.log(`Saved public/favicon-512x512.png (512x512, ${generated[512].png.length} bytes)`);

fs.writeFileSync('public/favicon-48x48.png', generated[48].png);
console.log(`Saved public/favicon-48x48.png (48x48, ${generated[48].png.length} bytes)`);

fs.writeFileSync('public/favicon-32x32.png', generated[32].png);
console.log(`Saved public/favicon-32x32.png (32x32, ${generated[32].png.length} bytes)`);

fs.writeFileSync('public/favicon-16x16.png', generated[16].png);
console.log(`Saved public/favicon-16x16.png (16x16, ${generated[16].png.length} bytes)`);

fs.writeFileSync('public/apple-touch-icon.png', generated[180].png);
console.log(`Saved public/apple-touch-icon.png (180x180, ${generated[180].png.length} bytes)`);

const ico = createICO([
  generated[48],
  generated[32],
  generated[16]
]);
fs.writeFileSync('public/favicon.ico', ico);
console.log(`Saved public/favicon.ico (multi-size 48/32/16, ${ico.length} bytes)`);

console.log('All favicon assets generated successfully!');
