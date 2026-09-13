// Generates public/og.png (1200×630) from an inline SVG. Run: node scripts/og-image.mjs
// Uses the `sharp` that ships with Astro's image service — no extra dependency.
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

// Read APP_NAME from src/config.ts without importing it (it depends on import.meta.env).
const APP_NAME = readFileSync(new URL('../src/config.ts', import.meta.url), 'utf8').match(/APP_NAME = '([^']+)'/)[1];

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0B0B0C"/>
  <text x="96" y="330" font-family="'Instrument Serif','Iowan Old Style',Georgia,'Times New Roman',serif" font-style="italic" font-size="200" fill="#F5F5F5">${APP_NAME}<tspan fill="#C6FF3D">.</tspan></text>
  <text x="100" y="420" font-family="Inter,-apple-system,'Helvetica Neue',Arial,sans-serif" font-size="40" fill="#9A9A9A">Gym tracker for iPhone</text>
  <rect x="96" y="500" width="1008" height="2" fill="#232326"/>
  <text x="96" y="560" font-family="Inter,-apple-system,'Helvetica Neue',Arial,sans-serif" font-size="26" font-weight="600" letter-spacing="4" fill="#C6FF3D">HACKIE.DEV</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
writeFileSync(new URL('../public/og.png', import.meta.url), png);
console.log(`public/og.png written (${(png.length / 1024).toFixed(1)} KB)`);
