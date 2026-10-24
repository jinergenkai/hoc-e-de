// GET /api/recordings
//   recorder code  → { ids } (items that already have a submission, so the phone can show progress)
//   admin password → { entries, recorderCode }
import { json, isAdmin, isRecorder, listAll, parseEntry, type Entry } from './_lib';

export async function GET(req: Request) {
  if (!isRecorder(req)) return json({ error: 'Không có quyền' }, 401);
  const entries = (await listAll('')).map(parseEntry).filter((e): e is Entry => e !== null);
  if (!isAdmin(req)) return json({ ids: [...new Set(entries.map((e) => e.id))] });
  entries.sort((a, b) => b.at.localeCompare(a.at));
  return json({ entries, recorderCode: process.env.RECORDER_CODE ?? '' });
}
