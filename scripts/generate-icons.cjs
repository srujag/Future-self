const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function makePngBuffer(width, height, isMaskable = false) {
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.38;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type None
    
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Base background: #0B0B0E
      let r = 11, g = 11, b = 14, a = 255;

      // Glow ring around center
      if (dist >= radius * 0.7 && dist <= radius * 1.05) {
        const ringGlow = Math.max(0, 1 - Math.abs(dist - radius * 0.88) / (radius * 0.2));
        r = Math.min(255, Math.round(r + ringGlow * 80));
        g = Math.min(255, Math.round(g + ringGlow * 15));
        b = Math.min(255, Math.round(b + ringGlow * 35));
      }

      // Athletic Flame / Chevron shape
      // Normalised coordinates (-1 to 1) within central flame area
      const fx = (x - cx) / (radius * 0.75);
      const fy = (y - (cy - height * 0.04)) / (radius * 0.9);

      // Flame body calculation: teardrop/flame curve
      const inFlame = (fy >= -0.85 && fy <= 0.85) && (Math.abs(fx) <= (0.85 - fy * 0.6) * Math.sqrt(Math.max(0, 0.9 - fy * fy * 0.5)));
      
      if (inFlame) {
        // Coral gradient from top #FF3269 to bottom #FF1744
        const t = (fy + 0.85) / 1.7;
        r = 255;
        g = Math.round(50 * (1 - t) + 23 * t);
        b = Math.round(105 * (1 - t) + 68 * t);
      }

      // Inner electric volt spark / bolt
      const sx = (x - cx) / (radius * 0.4);
      const sy = (y - (cy + height * 0.02)) / (radius * 0.45);
      // Lightning bolt vertices
      if (sy >= -0.6 && sy <= 0.6 && Math.abs(sx + sy * 0.3) < 0.25) {
        r = 204; // Volt #CCFF00
        g = 255;
        b = 0;
      }

      // If not maskable, we can round the corners for regular app icon
      if (!isMaskable) {
        const cornerRadius = width * 0.22;
        const cornerDx = Math.max(0, Math.abs(x - cx) - (cx - cornerRadius));
        const cornerDy = Math.max(0, Math.abs(y - cy) - (cy - cornerRadius));
        if (cornerDx * cornerDx + cornerDy * cornerDy > cornerRadius * cornerRadius) {
          a = 0; // Transparent outside rounded corner
        }
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  function makeChunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    const body = Buffer.concat([typeBuf, data]);
    const crc = Buffer.alloc(4);
    let c = 0xffffffff;
    for (let i = 0; i < body.length; i++) {
      c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    }
    crc.writeUInt32BE((c ^ 0xffffffff) >>> 0, 0);
    return Buffer.concat([length, body, crc]);
  }

  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

const publicDir = path.resolve(__dirname, '../public');

// 1. pwa-192x192.png
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), makePngBuffer(192, 192, false));
// 2. pwa-512x512.png
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), makePngBuffer(512, 512, false));
// 3. pwa-maskable-512x512.png
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), makePngBuffer(512, 512, true));
// 4. apple-touch-icon.png
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), makePngBuffer(180, 180, false));

console.log('Successfully generated all PWA icons in /public!');
