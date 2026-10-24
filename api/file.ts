// GET /api/file?p=<pathname>  → streams a private blob to the admin (for playing and zipping)
import { get } from '@vercel/blob';

import { json, isAdmin, mimeOfExt } from './_lib';

export async function GET(req: Request) {
  if (!isAdmin(req)) return json({ error: 'Không có quyền' }, 401);
  const p = new URL(req.url).searchParams.get('p') ?? '';
  if (!/^(pending|approved)\//.test(p)) return json({ error: 'Đường dẫn không hợp lệ' }, 400);
  const file = await get(p, { access: 'private' });
  if (!file || file.statusCode !== 200) return json({ error: 'Không tìm thấy' }, 404);
  return new Response(file.stream, {
    headers: { 'content-type': mimeOfExt(p.split('.').pop() ?? ''), 'cache-control': 'private, max-age=300' },
  });
}
