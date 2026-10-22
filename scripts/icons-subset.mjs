// Extracts only the Solar icons referenced in src/ into a small JSON,
// so the app bundles a few KB of icons instead of the whole set (and works offline).
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { getIcons } from '@iconify/utils';
import { icons } from '@iconify-json/solar';

const names = new Set();
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|json)$/.test(f) && !f.includes('icons-subset')) {
      for (const m of readFileSync(p, 'utf8').matchAll(/solar:([a-z0-9-]+)/g)) names.add(m[1]);
    }
  }
};
walk('src');

const subset = getIcons(icons, [...names]);
const missing = [...names].filter((n) => !subset?.icons[n] && !subset?.aliases?.[n]);
if (missing.length) {
  console.error(`Unknown Solar icons: ${missing.join(', ')}`);
  process.exit(1);
}
writeFileSync('src/components/icons-subset.json', JSON.stringify(subset));
console.log(`icons-subset: ${names.size} icon(s)`);
