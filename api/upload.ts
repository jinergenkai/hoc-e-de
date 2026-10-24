// POST /api/upload?id=w001  (body = raw audio). A new take replaces the item's previous one.
import { put, del } from '@vercel/blob';

import { json, ID_RE, recPath, listAll, encodeKey, extOfMime } from './_lib';

const MAX_BYTES = 2 * 1024 * 1024; // a 12 s clip is ~100–200 KB; Vercel's body cap is 4.5 MB

export async function POST(req: Request) {
  const id = (new URL(req.url).searchParams.get('id') ?? '').normalize('NFC');
  const ext = extOfMime(req.headers.get('content-type') ?? '');
  if (!ID_RE.test(id)) return json({ error: 'Mã mục không hợp lệ' }, 400);
  if (!ext) return json({ error: 'Định dạng âm thanh không được hỗ trợ' }, 415);

  const body = await req.arrayBuffer();
  if (body.byteLength === 0 || body.byteLength > MAX_BYTES) return json({ error: 'File rỗng hoặc quá 2 MB' }, 413);

  const target = recPath(id, ext);
  await put(target, body, { access: 'private', addRandomSuffix: false, allowOverwrite: true, contentType: req.headers.get('content-type')!.split(';')[0] });

  // The previous take may have another extension (recorded on a different phone/browser)
  const stale = (await listAll(`rec/${encodeKey(id)}.`)).map((b) => b.pathname).filter((p) => p !== target);
  if (stale.length) await del(stale);
  return json({ ok: true });
}
