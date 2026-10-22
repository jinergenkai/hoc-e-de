// Lists the audio files in public/audio so the app only shows a speaker button
// when a recording exists. File name = word/sentence id, e.g. public/audio/w001.mp3
import { readdirSync, writeFileSync, mkdirSync } from 'node:fs';

const dir = 'public/audio';
mkdirSync(dir, { recursive: true });
const ids = readdirSync(dir)
  .filter((f) => /\.(mp3|m4a|ogg|wav|webm)$/i.test(f))
  .map((f) => ({ id: f.replace(/\.[^.]+$/, ''), file: f }));
writeFileSync('src/data/audio-manifest.json', `${JSON.stringify(Object.fromEntries(ids.map((x) => [x.id, x.file])), null, 2)}\n`);
console.log(`audio-manifest: ${ids.length} file(s)`);
