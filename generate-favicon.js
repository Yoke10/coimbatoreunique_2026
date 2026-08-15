import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateFavicon() {
  try {
    const inputPath = path.join(__dirname, 'public', 'images', 'logo.webp');
    const outputPath = path.join(__dirname, 'public', 'favicon.png');

    // Generate a 192x192 favicon with a white background
    await sharp({
      create: {
        width: 192,
        height: 192,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
      }
    })
    .composite([
      {
        input: await sharp(inputPath).resize(160, 160).toBuffer(), // Scale logo down slightly to fit within the square
        gravity: 'center'
      }
    ])
    .png()
    .toFile(outputPath);

    console.log('Favicon generated successfully at', outputPath);
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

generateFavicon();
