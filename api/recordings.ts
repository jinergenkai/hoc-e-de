// GET /api/recordings → every recording on the server: [{ id, ext, size, at, pathname }]
import { json, listAll, parseRec, type RecEntry } from './_lib';

export async function GET() {
  const entries = (await listAll('rec/')).map(parseRec).filter((e): e is RecEntry => e !== null);
  return json({ entries });
}
