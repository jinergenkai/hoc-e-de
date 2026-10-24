import { describe, it, expect } from 'vitest';

import { encodeKey, decodeKey, parseEntry, ID_RE, extOfMime } from './_lib';

describe('api helpers', () => {
  it('round-trips Ê-đê letters through blob-safe keys', () => {
    for (const id of ['w001', 's012', 'l-ƀ', 'l-ê', 'l-ŏ']) {
      const k = encodeKey(id);
      expect(k).toMatch(/^[a-zA-Z0-9_-]+$/);
      expect(decodeKey(k)).toBe(id.normalize('NFC'));
    }
  });

  it('validates item ids', () => {
    expect(ID_RE.test('w001')).toBe(true);
    expect(ID_RE.test('l-ƀ')).toBe(true);
    expect(ID_RE.test('../x')).toBe(false);
    expect(ID_RE.test('w')).toBe(false);
  });

  it('parses pending and approved paths', () => {
    const at = new Date('2026-01-01T00:00:00Z');
    const p = parseEntry({ pathname: `pending/${encodeKey('l-ƀ')}/1700000000000-${encodeKey('Y Blô')}-AbC123xYz.webm`, size: 10, uploadedAt: at });
    expect(p).toMatchObject({ status: 'pending', id: 'l-ƀ', who: 'Y Blô', ext: 'webm' });
    const a = parseEntry({ pathname: `approved/w001__${encodeKey('Y Blô')}.m4a`, size: 10, uploadedAt: at });
    expect(a).toMatchObject({ status: 'approved', id: 'w001', who: 'Y Blô', ext: 'm4a' });
    expect(parseEntry({ pathname: 'config/features.json', size: 1, uploadedAt: at })).toBeNull();
  });

  it('maps mime types to extensions', () => {
    expect(extOfMime('audio/webm;codecs=opus')).toBe('webm');
    expect(extOfMime('audio/mp4')).toBe('m4a');
    expect(extOfMime('text/html')).toBeUndefined();
  });
});
