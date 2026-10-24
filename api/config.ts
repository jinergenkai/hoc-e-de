// GET /api/config → which features are visible (public)   ·   PUT /api/config (admin) saves them
import { get, put } from '@vercel/blob';

import { json, isAdmin } from './_lib.js';

const PATH = 'config/features.json';

export async function GET() {
  try {
    const file = await get(PATH, { access: 'private', useCache: false });
    if (!file || file.statusCode !== 200) return json({ features: null, teasers: true });
    return json(JSON.parse(await new Response(file.stream).text()));
  } catch {
    return json({ features: null, teasers: true });
  }
}

export async function PUT(req: Request) {
  if (!isAdmin(req)) return json({ error: 'Không có quyền' }, 401);
  const body = (await req.json().catch(() => null)) as { features?: unknown; teasers?: unknown } | null;
  if (!body || !Array.isArray(body.features) || !body.features.every((f) => typeof f === 'string')) return json({ error: 'Dữ liệu không hợp lệ' }, 400);
  const cfg = { features: body.features, teasers: body.teasers !== false };
  await put(PATH, JSON.stringify(cfg), { access: 'private', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json' });
  return json(cfg);
}
