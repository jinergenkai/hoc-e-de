// Recordings made inside the app (content editors recording native-speaker audio).
// Blobs live in IndexedDB so they work offline in Electron; a recording overrides the
// bundled file in public/audio with the same id. Export/import as a .zip moves them
// between computers or into public/audio for the next build.

import { create } from 'zustand';
import { zipSync, unzipSync } from 'fflate';

const DB_NAME = 'hriam-ede';
const STORE = 'recordings';

export type Recording = { id: string; blob: Blob; mime: string; updatedAt: number };

let dbPromise: Promise<IDBDatabase> | null = null;

function db(): Promise<IDBDatabase> {
  dbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function tx<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const d = await db();
  return new Promise((resolve, reject) => {
    const req = run(d.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const getRecording = (id: string) => tx<Recording | undefined>('readonly', (s) => s.get(id));

const EXT: Record<string, string> = { 'audio/webm': 'webm', 'audio/ogg': 'ogg', 'audio/mp4': 'm4a', 'audio/mpeg': 'mp3', 'audio/wav': 'wav' };
const extOf = (mime: string) => EXT[mime.split(';')[0]] ?? 'webm';
const mimeOf = (name: string) => Object.entries(EXT).find(([, e]) => name.toLowerCase().endsWith(`.${e}`))?.[0];

type RecordingsState = {
  ids: Set<string>;
  ready: boolean;
  load: () => Promise<void>;
  save: (id: string, blob: Blob) => Promise<void>;
  remove: (id: string) => Promise<void>;
  exportZip: () => Promise<Blob>;
  importZip: (file: Blob) => Promise<number>;
};

export const useRecordings = create<RecordingsState>((set, get) => ({
  ids: new Set(),
  ready: false,
  load: async () => {
    try {
      const keys = await tx<IDBValidKey[]>('readonly', (s) => s.getAllKeys());
      set({ ids: new Set(keys.map(String)), ready: true });
    } catch {
      set({ ready: true });
    }
  },
  save: async (id, blob) => {
    const rec: Recording = { id, blob, mime: blob.type || 'audio/webm', updatedAt: Date.now() };
    await tx('readwrite', (s) => s.put(rec));
    set({ ids: new Set(get().ids).add(id) });
  },
  remove: async (id) => {
    await tx('readwrite', (s) => s.delete(id));
    const ids = new Set(get().ids);
    ids.delete(id);
    set({ ids });
  },
  exportZip: async () => {
    const all = await tx<Recording[]>('readonly', (s) => s.getAll());
    const files: Record<string, Uint8Array> = {};
    for (const r of all) files[`${r.id}.${extOf(r.mime)}`] = new Uint8Array(await r.blob.arrayBuffer());
    return new Blob([zipSync(files, { level: 0 })], { type: 'application/zip' });
  },
  importZip: async (file) => {
    const entries = unzipSync(new Uint8Array(await file.arrayBuffer()));
    let n = 0;
    for (const [name, data] of Object.entries(entries)) {
      const base = name.split('/').pop() ?? '';
      const mime = mimeOf(base);
      if (!mime || !base) continue;
      await get().save(base.replace(/\.[^.]+$/, '').normalize('NFC'), new Blob([data as BlobPart], { type: mime }));
      n += 1;
    }
    return n;
  },
}));

/** Object URL for a recording (caller revokes it). */
export async function recordingUrl(id: string): Promise<string | null> {
  const r = await getRecording(id);
  return r ? URL.createObjectURL(r.blob) : null;
}
