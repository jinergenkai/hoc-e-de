// Client for the Vercel functions in /api. Only available when the app is served over http(s)
// (the Electron build loads from file:// and works fully offline instead).

import type { FlagsConfig } from 'src/config/release';

export const REMOTE_AVAILABLE = typeof location !== 'undefined' && /^https?:$/.test(location.protocol);

const API = (import.meta.env.VITE_API_BASE as string | undefined) ?? '';

export type RemoteEntry = { pathname: string; id: string; who: string; ext: string; size: number; at: string; status: 'pending' | 'approved' };

const safe = (fn: () => string | null) => {
  try {
    return fn();
  } catch {
    return null;
  }
};
const store = (kind: 'local' | 'session', key: string, value?: string | null) => {
  const s = kind === 'local' ? localStorage : sessionStorage;
  return safe(() => {
    if (value === undefined) return s.getItem(key);
    if (value === null) s.removeItem(key);
    else s.setItem(key, value);
    return value;
  });
};

// ---- credentials -----------------------------------------------------

export const recorderCode = {
  get: () => store('local', 'hriam-recorder-code') ?? '',
  set: (v: string) => store('local', 'hriam-recorder-code', v),
};
export const recorderName = {
  get: () => store('local', 'hriam-recorder-name') ?? '',
  set: (v: string) => store('local', 'hriam-recorder-name', v),
};
export const adminPassword = {
  get: () => store('session', 'hriam-admin-password') ?? '',
  set: (v: string | null) => store('session', 'hriam-admin-password', v),
};

// ---- calls -----------------------------------------------------------

async function call(path: string, init: RequestInit & { timeoutMs?: number } = {}) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), init.timeoutMs ?? 30_000);
  try {
    return await fetch(`${API}${path}`, { ...init, signal: ctl.signal });
  } finally {
    clearTimeout(timer);
  }
}

const adminHeaders = (extra: Record<string, string> = {}) => ({ authorization: `Bearer ${adminPassword.get()}`, ...extra });

async function jsonOrThrow<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error((data as { error?: string }).error ?? `Lỗi ${res.status}`), { status: res.status });
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
  return jsonOrThrow<FlagsConfig>(await call('/api/config', { method: 'PUT', headers: adminHeaders({ 'content-type': 'application/json' }), body: JSON.stringify(cfg) }));
}

export async function uploadTake(id: string, who: string, blob: Blob) {
  const res = await call(`/api/upload?id=${encodeURIComponent(id)}&who=${encodeURIComponent(who)}`, {
    method: 'POST',
    headers: { 'x-recorder-code': recorderCode.get(), 'content-type': blob.type.split(';')[0] || 'audio/webm' },
    body: blob,
  });
  return jsonOrThrow<{ ok: true }>(res);
}

/** Item ids that already have a submission (any status). */
export async function fetchSubmittedIds() {
  const res = await call('/api/recordings', { headers: { 'x-recorder-code': recorderCode.get() }, cache: 'no-store', timeoutMs: 10_000 });
  return (await jsonOrThrow<{ ids: string[] }>(res)).ids;
}

export async function fetchEntries() {
  return jsonOrThrow<{ entries: RemoteEntry[]; recorderCode: string }>(await call('/api/recordings', { headers: adminHeaders(), cache: 'no-store' }));
}

export async function review(action: 'approve' | 'delete', pathname: string) {
  return jsonOrThrow<{ ok: true }>(
    await call('/api/review', { method: 'POST', headers: adminHeaders({ 'content-type': 'application/json' }), body: JSON.stringify({ action, pathname }) })
  );
}

export async function fetchFile(pathname: string) {
  const res = await call(`/api/file?p=${encodeURIComponent(pathname)}`, { headers: adminHeaders() });
  if (!res.ok) throw new Error(`Không tải được ${pathname}`);
  return res.blob();
}
