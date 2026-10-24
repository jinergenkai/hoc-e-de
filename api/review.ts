// POST /api/review  { action: 'approve' | 'delete', pathname }   (admin only)
import { get, put, del } from '@vercel/blob';

import { json, isAdmin, listAll, parseEntry, encodeKey } from './_lib';

export async function POST(req: Request) {
  if (!isAdmin(req)) return json({ error: 'Không có quyền' }, 401);
  const { action, pathname } = (await req.json().catch(() => ({}))) as { action?: string; pathname?: string };
  if (!pathname || !/^(pending|approved)\//.test(pathname)) return json({ error: 'Thiếu pathname' }, 400);

  if (action === 'delete') {
    await del(pathname);
    return json({ ok: true });
  }

  if (action === 'approve') {
    const src = parseEntry({ pathname, size: 0, uploadedAt: new Date(0) });
    if (!src || src.status !== 'pending') return json({ error: 'Chỉ duyệt được bản chờ duyệt' }, 400);
    const file = await get(pathname, { access: 'private', useCache: false });
    if (!file || file.statusCode !== 200) return json({ error: 'Không đọc được file' }, 404);

    // One approved take per item: replace any earlier one (the extension may differ)
    const old = (await listAll(`approved/${encodeKey(src.id)}__`)).map((b) => b.pathname);
    const target = `approved/${encodeKey(src.id)}__${encodeKey(src.who)}.${src.ext}`;
    await put(target, file.stream, { access: 'private', addRandomSuffix: false, allowOverwrite: true, contentType: file.blob.contentType });
    const stale = old.filter((p) => p !== target);
    if (stale.length) await del(stale);
    await del(pathname);
    return json({ ok: true, pathname: target });
  }

  return json({ error: 'Hành động không hợp lệ' }, 400);
}
