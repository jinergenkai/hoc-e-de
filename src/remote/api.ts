// Client for the Vercel functions in /api. Only available when the app is served over http(s)
// (the Electron build loads from file:// and works fully offline instead).

import type { FlagsConfig } from 'src/config/release';

export const REMOTE_AVAILABLE = typeof location !== 'undefined' && /^https?:$/.test(location.protocol);

const API = (import.meta.env.VITE_API_BASE as string | undefined) ?? '';

export type ServerRecording = { pathname: string; id: string; ext: string; size: number; at: string };

/** Admin password for changing settings; kept for the browser tab only. */
export const adminPassword = {
  get: () => {
    try {
      return sessionStorage.getItem('hriam-admin-password') ?? '';
    } catch {
      return '';
    }
  },
  set: (v: string) => {
    try {
      sessionStorage.setItem('hriam-admin-password', v);
    } catch {
      /* storage unavailable */
    }
  },
};

async function call(path: string, init: RequestInit & { timeoutMs?: number } = {}) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), init.timeoutMs ?? 30_000);
  try {
    return await fetch(`${API}${path}`, { ...init, signal: ctl.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function jsonOrThrow<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok || data === null) throw Object.assign(new Error((data as { error?: string } | null)?.error ?? `Lỗi ${res.status}`), { status: res.status });
  return data as T;
}

/** Visible-feature setting saved by the admin; null when the server is unreachable. */
export async function fetchFlags(): Promise<FlagsConfig | null> {
  if (!REMOTE_AVAILABLE) return null;
  try {
    return await jsonOrThrow<FlagsConfig>(await call('/api/config', { timeoutMs: 2500, cache: 'no-store' }));
  } catch {
    return null;
  }
}

export async function saveFlags(cfg: FlagsConfig) {
  const res = await call('/api/config', {
    method: 'PUT',
    headers: { authorization: `Bearer ${adminPassword.get()}`, 'content-type': 'application/json' },
    body: JSON.stringify(cfg),
  });
  return jsonOrThrow<FlagsConfig>(res);
}

export async function uploadTake(id: string, blob: Blob) {
  const res = await call(`/api/upload?id=${encodeURIComponent(id)}`, {
    method: 'POST',
    headers: { 'content-type': blob.type.split(';')[0] || 'audio/webm' },
    body: blob,
  });
  return jsonOrThrow<{ ok: true }>(res);
}

export async function fetchServerRecordings() {
  return (await jsonOrThrow<{ entries: ServerRecording[] }>(await call('/api/recordings', { cache: 'no-store', timeoutMs: 10_000 }))).entries;
}

export async function fetchFile(pathname: string) {
  const res = await call(`/api/file?p=${encodeURIComponent(pathname)}`);
  if (!res.ok) throw new Error(`Không tải được ${pathname}`);
  return res.blob();
}
