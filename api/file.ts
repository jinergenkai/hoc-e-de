// GET /api/file?p=rec/<id>.<ext>  → streams one recording (for listening and for the download pack)
import { get } from '@vercel/blob';

import { json, mimeOfExt } from './_lib';

export async function GET(req: Request) {
  const p = new URL(req.url).searchParams.get('p') ?? '';
  if (!/^rec\/[^/]+\.[a-z0-9]+$/.test(p)) return json({ error: 'Đường dẫn không hợp lệ' }, 400);
  const file = await get(p, { access: 'private', useCache: false });
  if (!file || file.statusCode !== 200) return json({ error: 'Không tìm thấy' }, 404);
  return new Response(file.stream, { headers: { 'content-type': mimeOfExt(p.split('.').pop() ?? ''), 'cache-control': 'no-store' } });
}
