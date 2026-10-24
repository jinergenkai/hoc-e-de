// Server copy of the studio recordings (web version on Vercel only).
// A saved take is queued in IndexedDB and uploaded in the background, so a dropped
// connection never loses it; the server list tells which items are already recorded there.

import { zipSync } from 'fflate';
import { create } from 'zustand';

import { fetchFile, uploadTake, REMOTE_AVAILABLE, fetchServerRecordings, type ServerRecording } from 'src/remote/api';

const DB_NAME = 'hriam-ede-outbox';
const STORE = 'takes';

type Take = { key: string; id: string; blob: Blob; at: number };

let dbPromise: Promise<IDBDatabase> | null = null;
const db = () =>
  (dbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'key' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }));

async function tx<T>(mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T>) {
  const d = await db();
  return new Promise<T>((resolve, reject) => {
    const req = run(d.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// Mirror of the IndexedDB queue, so uploads still work where IndexedDB is unavailable
let takes: Take[] = [];

type CloudState = {
  server: ServerRecording[];
  serverIds: Set<string>;
  queued: string[]; // item ids waiting to upload
  sending: boolean;
  error: string | null;
  load: () => Promise<void>;
  refresh: () => Promise<void>;
  queue: (id: string, blob: Blob) => Promise<void>;
  flush: () => Promise<void>;
  downloadZip: () => Promise<Blob>;
};

export const useCloud = create<CloudState>((set, get) => ({
  server: [],
  serverIds: new Set(),
  queued: [],
  sending: false,
  error: null,
  load: async () => {
    if (!REMOTE_AVAILABLE) return;
    try {
      takes = await tx<Take[]>('readonly', (s) => s.getAll());
      set({ queued: takes.map((t) => t.id) });
    } catch {
      /* private mode: queue stays in memory only */
    }
    await Promise.all([get().refresh(), get().flush()]);
  },
  refresh: async () => {
    try {
      const server = await fetchServerRecordings();
      set({ server, serverIds: new Set(server.map((e) => e.id)) });
    } catch {
      /* offline: keep the last list */
    }
  },
  queue: async (id, blob) => {
    if (!REMOTE_AVAILABLE) return;
    const take: Take = { key: `${id}:${Date.now()}`, id, blob, at: Date.now() };
    takes.push(take);
    await tx('readwrite', (s) => s.put(take)).catch(() => undefined);
    set({ queued: [...get().queued, id] });
    void get().flush();
  },
  flush: async () => {
    if (get().sending || takes.length === 0) return;
    set({ sending: true, error: null });
    try {
      for (const t of [...takes].sort((a, b) => a.at - b.at)) {
        await uploadTake(t.id, t.blob);
        takes = takes.filter((x) => x.key !== t.key);
        await tx('readwrite', (s) => s.delete(t.key)).catch(() => undefined);
        const queued = [...get().queued];
        queued.splice(queued.indexOf(t.id), 1);
        set({ queued, serverIds: new Set(get().serverIds).add(t.id) });
      }
      void get().refresh();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : 'Chưa gửi được' });
    } finally {
      set({ sending: false });
    }
  },
  /** Every recording on the server as a .zip named by id (w001.webm …), ready for public/audio. */
  downloadZip: async () => {
    await get().refresh();
    const list = get().server;
    const files: Record<string, Uint8Array> = {};
    let next = 0;
    const worker = async () => {
      while (next < list.length) {
        const e = list[next++];
        files[`${e.id}.${e.ext}`] = new Uint8Array(await (await fetchFile(e.pathname)).arrayBuffer());
      }
    };
    await Promise.all([worker(), worker(), worker(), worker()]);
    return new Blob([zipSync(files, { level: 0 }) as BlobPart], { type: 'application/zip' });
  },
}));

if (typeof window !== 'undefined') window.addEventListener('online', () => void useCloud.getState().flush());
