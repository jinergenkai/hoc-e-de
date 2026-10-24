// Shared helpers for the Vercel functions. Files starting with "_" are not routed.
import { timingSafeEqual } from 'node:crypto';
import { list } from '@vercel/blob';

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

/** Admin = whoever knows ADMIN_PASSWORD (sent as Authorization: Bearer ...). Only needed to change settings. */
export function isAdmin(req: Request) {
  const pw = process.env.ADMIN_PASSWORD;
  const got = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!pw || !got) return false;
  const x = Buffer.from(got);
  const y = Buffer.from(pw);
  return x.length === y.length && timingSafeEqual(x, y);
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

/** One recording per item: rec/<id>.<ext> */
export const recPath = (id: string, ext: string) => `rec/${encodeKey(id)}.${ext}`;

export type RecEntry = { pathname: string; id: string; ext: string; size: number; at: string };

export function parseRec(b: { pathname: string; size: number; uploadedAt: Date }): RecEntry | null {
  const m = /^rec\/([^/]+)\.([a-z0-9]+)$/.exec(b.pathname);
  return m ? { pathname: b.pathname, id: decodeKey(m[1]), ext: m[2], size: b.size, at: b.uploadedAt.toISOString() } : null;
}

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
