// Shared helpers for the Vercel functions. Files starting with "_" are not routed.
import { timingSafeEqual } from 'node:crypto';
import { list } from '@vercel/blob';

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

const same = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

/** Admin = whoever knows ADMIN_PASSWORD (sent as Authorization: Bearer ...). */
export function isAdmin(req: Request) {
  const pw = process.env.ADMIN_PASSWORD;
  const got = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  return Boolean(pw && got && same(got, pw));
}

/** Recorder = whoever has the invite code (RECORDER_CODE) in the x-recorder-code header; admins pass too. */
export function isRecorder(req: Request) {
  const code = process.env.RECORDER_CODE;
  const got = req.headers.get('x-recorder-code') ?? '';
  return isAdmin(req) || Boolean(code && got && same(got, code));
}

// Ids contain Ê-đê letters (l-ƀ); keep blob paths ASCII-safe and reversible.
export const encodeKey = (s: string) => s.normalize('NFC').replace(/[^a-zA-Z0-9-]/g, (c) => `_${c.codePointAt(0)!.toString(16)}_`);
export const decodeKey = (s: string) => s.replace(/_([0-9a-f]+)_/g, (_, h) => String.fromCodePoint(parseInt(h, 16)));

export const ID_RE = /^(?:[ws]\d{1,5}|l-\S{1,4})$/u;

const EXT: Record<string, string> = {
  'audio/webm': 'webm',
  'audio/ogg': 'ogg',
  'audio/mp4': 'm4a',
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
};
export const extOfMime = (ct: string) => EXT[ct.split(';')[0].trim().toLowerCase()];
export const mimeOfExt = (ext: string) => Object.entries(EXT).find(([, e]) => e === ext)?.[0] ?? 'application/octet-stream';

export async function listAll(prefix: string) {
  const out: Awaited<ReturnType<typeof list>>['blobs'] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, cursor, limit: 1000 });
    out.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out;
}

export type Entry = { pathname: string; id: string; who: string; ext: string; size: number; at: string; status: 'pending' | 'approved' };

/**
 * pending/<id>/<time>-<who>-<random>.<ext>   ·   approved/<id>__<who>.<ext>
 * (the random part is added by the blob store; it is stripped from the name shown)
 */
export function parseEntry(b: { pathname: string; size: number; uploadedAt: Date }): Entry | null {
  const m = /^(pending|approved)\/(.+)\.([a-z0-9]+)$/.exec(b.pathname);
  if (!m) return null;
  const [, status, rest, ext] = m;
  let idPart: string;
  let whoPart: string;
  if (status === 'pending') {
    const [dir, file = ''] = rest.split('/');
    idPart = dir;
    whoPart = file.replace(/^\d+-/, '').replace(/-[A-Za-z0-9]{6,}$/, '');
  } else {
    [idPart, whoPart = ''] = rest.split('__');
  }
  return { pathname: b.pathname, id: decodeKey(idPart), who: decodeKey(whoPart), ext, size: b.size, at: b.uploadedAt.toISOString(), status: status as Entry['status'] };
}
