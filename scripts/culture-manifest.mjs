// Lists the photos in public/culture/<item id>/ so the culture corner shows them
// without code changes. Files are sorted by name: 1.jpg, 2.jpg, …
import { readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const root = 'public/culture';
mkdirSync(root, { recursive: true });
const out = {};
for (const id of readdirSync(root)) {
  const dir = join(root, id);
  if (!statSync(dir).isDirectory()) continue;
  const files = readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  if (files.length) out[id] = files.map((f) => `culture/${id}/${f}`);
}
writeFileSync('src/data/culture-images.json', `${JSON.stringify(out, null, 2)}\n`);
console.log(`culture-manifest: ${Object.values(out).flat().length} image(s)`);
