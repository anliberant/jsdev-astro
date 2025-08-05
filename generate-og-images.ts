import fs from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import matter from 'gray-matter';
import satori from 'satori';

const fontPath = path.resolve('public/fonts/Inter-Regular.ttf');
if (!fs.existsSync(fontPath)) {
  console.error('❌ Font not found:', fontPath);
  process.exit(1);
}
const fontData = await readFile(fontPath);

const contentRoot = path.resolve('src/content');
const outputRoot = path.resolve('public/og');

if (!fs.existsSync(outputRoot)) {
  fs.mkdirSync(outputRoot, { recursive: true });
}

const walkDir = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walkDir(filepath, filelist);
    } else if (filepath.endsWith('.mdx')) {
      filelist.push(filepath);
    }
  });
  return filelist;
};

const safeText = value => {
  if (!value || typeof value !== 'string') return '';
  return value;
};

const generateOG = async ({ title, description, date, outPath }) => {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          backgroundColor: '#0f172a',
          color: 'white',
          padding: '80px',
          fontFamily: 'Inter',
          justifyContent: 'center',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { fontSize: 60, fontWeight: 'bold', lineHeight: 1.2 },
              children: safeText(title),
            },
          },
          {
            type: 'div',
            props: {
              style: { fontSize: 28, marginTop: 20, color: '#94a3b8' },
              children: safeText(description),
            },
          },
          {
            type: 'div',
            props: {
              style: { fontSize: 24, marginTop: 40, color: '#cbd5e1' },
              children: safeText(date),
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          style: 'normal',
        },
      ],
    }
  );

  const png = new Resvg(svg).render();
  fs.writeFileSync(outPath, png.asPng());
};

const files = walkDir(contentRoot);
for (const fullPath of files) {
  const relativePath = path.relative(contentRoot, fullPath);
  if (!relativePath.startsWith('howto') && !relativePath.startsWith('snippets')) {
    continue;
  }

  const raw = await readFile(fullPath, 'utf8');
  const { data } = matter(raw);

  const title = data.title ?? null;
  const description = data.desc ?? '';
  const dateRaw = data.date ?? '';
  const date =
    typeof dateRaw === 'string'
      ? dateRaw
      : new Date(dateRaw).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

  if (!title) {
    console.warn(`❌ Missing title in: ${fullPath}`);
    continue;
  }

  const folderName = path.basename(path.dirname(fullPath));
  const outPath = path.join(outputRoot, `${folderName}.png`);

  console.log(`✅ Generating for: ${folderName}`);
  await generateOG({ title, description, date, outPath });
}
