// Takes recorded on a phone wait here until they are uploaded, so a dropped connection
// (or closing the tab) never loses a recording. Separate IndexedDB from the studio's.

import { create } from 'zustand';

import { uploadTake } from 'src/remote/api';

const DB_NAME = 'hriam-ede-outbox';
const STORE = 'takes';

type Take = { key: string; id: string; who: string; blob: Blob; at: number };

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

// Mirror of the IndexedDB contents, so uploads still work where IndexedDB is unavailable
let takes: Take[] = [];

type OutboxState = {
  queued: string[]; // item ids waiting to upload
  sent: Set<string>; // item ids uploaded from this phone in this session
  sending: boolean;
  error: string | null;
  load: () => Promise<void>;
  add: (id: string, who: string, blob: Blob) => Promise<void>;
  flush: () => Promise<void>;
};

export const useOutbox = create<OutboxState>((set, get) => ({
  queued: [],
  sent: new Set(),
  sending: false,
  error: null,
  load: async () => {
    try {
      takes = await tx<Take[]>('readonly', (s) => s.getAll());
      set({ queued: takes.map((t) => t.id) });
    } catch {
      /* private mode: queue stays in memory only */
    }
    void get().flush();
  },
  add: async (id, who, blob) => {
    const take: Take = { key: `${id}:${Date.now()}`, id, who, blob, at: Date.now() };
    takes.push(take);
    await tx('readwrite', (s) => s.put(take)).catch(() => undefined);
    set({ queued: [...get().queued, id] });
    void get().flush();
  },
  flush: async () => {
    if (get().sending) return;
    set({ sending: true, error: null });
    try {
      for (const t of [...takes].sort((a, b) => a.at - b.at)) {
        await uploadTake(t.id, t.who, t.blob);
        takes = takes.filter((x) => x.key !== t.key);
        await tx('readwrite', (s) => s.delete(t.key)).catch(() => undefined);
        const queued = [...get().queued];
        queued.splice(queued.indexOf(t.id), 1);
        set({ queued, sent: new Set(get().sent).add(t.id) });
      }
    } catch (e) {
      set({ error: e instanceof Error ? e.message : 'Chưa gửi được, sẽ thử lại khi có mạng.' });
    } finally {
      set({ sending: false });
    }
  },
}));

if (typeof window !== 'undefined') window.addEventListener('online', () => void useOutbox.getState().flush());
