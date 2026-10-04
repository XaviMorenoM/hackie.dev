import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const out = (slug, file) => path.join(__dirname, '../src/assets/projects', slug, file)

async function gradient(outputPath, stops) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${stops[0]}"/>
        <stop offset="100%" stop-color="${stops[1]}"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#g)"/>
  </svg>`
  await sharp(Buffer.from(svg)).png().toFile(outputPath)
  console.log('wrote', outputPath)
}

await gradient(out('alterio', 'cover.png'), ['#C6FF3D', '#4A6600'])
await gradient(out('diskspace', 'cover.png'), ['#4E79A7', '#1F3550'])
