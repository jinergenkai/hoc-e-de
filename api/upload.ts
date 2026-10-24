// POST /api/upload?id=w001&who=Tên  (body = raw audio, header x-recorder-code)
import { put } from '@vercel/blob';

import { json, ID_RE, isRecorder, encodeKey, extOfMime } from './_lib';

const MAX_BYTES = 2 * 1024 * 1024; // a 12 s clip is ~100 KB; Vercel's body cap is 4.5 MB

export async function POST(req: Request) {
  if (!isRecorder(req)) return json({ error: 'Mã mời không đúng' }, 401);
  const url = new URL(req.url);
  const id = (url.searchParams.get('id') ?? '').normalize('NFC');
  const who = (url.searchParams.get('who') ?? '').trim().slice(0, 40) || 'an-danh';
  const ext = extOfMime(req.headers.get('content-type') ?? '');
  if (!ID_RE.test(id)) return json({ error: 'Mã mục không hợp lệ' }, 400);
  if (!ext) return json({ error: 'Định dạng âm thanh không được hỗ trợ' }, 415);

  const body = await req.arrayBuffer();
  if (body.byteLength === 0 || body.byteLength > MAX_BYTES) return json({ error: 'File rỗng hoặc quá lớn' }, 413);

  const blob = await put(`pending/${encodeKey(id)}/${Date.now()}-${encodeKey(who)}.${ext}`, body, {
    access: 'private',
    addRandomSuffix: true,
    contentType: req.headers.get('content-type')?.split(';')[0] ?? undefined,
  });
  return json({ ok: true, pathname: blob.pathname });
}
