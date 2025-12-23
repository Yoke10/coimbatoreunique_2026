import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define directories to scan
const contentDirs = [
    path.resolve(__dirname, '../public/assets'),
    path.resolve(__dirname, '../src/components/images'),
    // Add more if found
];

async function convertImages(dir) {
    if (!fs.existsSync(dir)) {
        console.log(`Directory not found: ${dir}`);
        return;
    }

    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const ext = path.extname(file).toLowerCase();

        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
            const outputName = file.replace(ext, '.webp');
            const outputPath = path.join(dir, outputName);

            if (!fs.existsSync(outputPath)) {
                console.log(`Converting: ${file} -> ${outputName}`);
                try {
                    await sharp(filePath)
                        .webp({ quality: 80 })
                        .toFile(outputPath);
                    console.log(`Success: ${outputName}`);
                } catch (err) {
                    console.error(`Error converting ${file}:`, err);
                }
            } else {
                console.log(`Skipping (already exists): ${outputName}`);
            }
        }
    }
}

async function run() {
    console.log("Starting WebP Conversion...");
    for (const dir of contentDirs) {
        await convertImages(dir);
    }
    console.log("Conversion complete.");
}

run();
