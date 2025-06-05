import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const rootDir = 'src/content/';

async function resizeImage(filePath) {
	console.log('📸 Found image:', filePath);

	try {
		const image = sharp(filePath);
		const metadata = await image.metadata();

		if (metadata.width && metadata.width > 800) {
			const resizedBuffer = await image.resize({ width: 800 }).toBuffer();
			await fs.writeFile(filePath, resizedBuffer);
			console.log(`✅ Resized to 800px: ${filePath}`);
		} else {
			console.log(`➖ Skipped (<=800px): ${filePath}`);
		}
	} catch (err) {
		console.error(`❌ Failed to resize: ${filePath}`, err.message);
	}
}

async function walkDir(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			await walkDir(fullPath);
		} else if (
			entry.isFile() &&
			dir.includes(`${path.sep}images`) &&
			/\.(png|jpe?g|webp)$/i.test(entry.name)
		) {
			await resizeImage(fullPath);
		}
	}
}

await walkDir(rootDir);
console.log('🎉 Done resizing images.');
