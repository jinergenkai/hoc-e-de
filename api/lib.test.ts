import { describe, it, expect } from 'vitest';

import { encodeKey, decodeKey, parseRec, recPath, ID_RE, extOfMime } from './_lib.js';

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

  it('parses recording paths', () => {
    const at = new Date('2026-01-01T00:00:00Z');
    expect(parseRec({ pathname: recPath('l-ƀ', 'webm'), size: 10, uploadedAt: at })).toMatchObject({ id: 'l-ƀ', ext: 'webm' });
    expect(parseRec({ pathname: 'config/features.json', size: 1, uploadedAt: at })).toBeNull();
  });

  it('maps mime types to extensions', () => {
    expect(extOfMime('audio/webm;codecs=opus')).toBe('webm');
    expect(extOfMime('audio/mp4')).toBe('m4a');
    expect(extOfMime('text/html')).toBeUndefined();
  });
});
