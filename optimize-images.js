import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const rootDir = 'src/content/';

async function optimizeImage(filePath) {
	console.log('📸 Found image:', filePath);

	try {
		const ext = path.extname(filePath).toLowerCase();
		const image = sharp(filePath);
		const metadata = await image.metadata();

		let buffer;

		if (ext === '.png') {
			buffer = await image.png({ compressionLevel: 6 }).toBuffer();
		} else if (ext === '.jpg' || ext === '.jpeg') {
			buffer = await image.jpeg({ quality: 60 }).toBuffer();
		} else if (ext === '.webp') {
			buffer = await image.webp({ quality: 60 }).toBuffer();
		} else {
			console.log(`❌ Unsupported file format: ${filePath}`);
			return;
		}

		await fs.writeFile(filePath, buffer);
		console.log(`✅ Optimized: ${filePath}`);
	} catch (err) {
		console.error(`❌ Failed to optimize: ${filePath}`, err.message);
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
			await optimizeImage(fullPath);
		}
	}
}

await walkDir(rootDir);
console.log('🎉 Done optimizing images.');
