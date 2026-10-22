// Text helpers for Ê-đê / Vietnamese strings.
// Ê-đê has 4 letters without a precomposed code point (ê̆ ô̆ ơ̆ ư̆ = base + U+0306),
// so everything goes through NFC and grapheme segmentation.

const BREVE = '̆';
// Vietnamese tone marks: grave, acute, tilde, hook above, dot below.
// Ê-đê has no tones, but ñ uses the tilde, so tilde on "n" is not a tone.
const TONE_MARKS = /[̣̀́̃̉]/;

const segmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new Intl.Segmenter('vi', { granularity: 'grapheme' })
    : null;

export function nfc(s: string): string {
  return s.normalize('NFC');
}

export function graphemes(s: string): string[] {
  const str = nfc(s);
  if (!segmenter) return Array.from(str);
  return Array.from(segmenter.segment(str), (x) => x.segment);
}

/** Lowercase, NFC, drop punctuation, collapse spaces. */
export function loose(s: string): string {
  return nfc(s)
    .toLowerCase()
    .replace(/[.,!?;:"“”'‘’()[\]{}…\-–—/\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Strip every diacritic: "ƀuôn" → "buon", "Đắk" → "dak". Used for accent-free search and "close" grading. */
export function fold(s: string): string {
  return loose(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ƀ/g, 'b')
    .replace(/đ/g, 'd')
    .replace(/č/g, 'c');
}

/** True when the text carries a Vietnamese tone mark (not the tilde of ñ). */
export function hasVietTone(s: string): boolean {
  const d = nfc(s).normalize('NFD');
  for (let i = 0; i < d.length; i += 1) {
    const ch = d[i];
    if (!TONE_MARKS.test(ch)) continue;
    if (ch === '̃' && (d[i - 1] === 'n' || d[i - 1] === 'N')) continue;
    return true;
  }
  return false;
}

/** Remove Vietnamese tone marks, keep Ê-đê letters intact. */
export function stripVietTones(s: string): string {
  const d = nfc(s).normalize('NFD');
  let out = '';
  for (let i = 0; i < d.length; i += 1) {
    const ch = d[i];
    const isNTilde = ch === '̃' && (d[i - 1] === 'n' || d[i - 1] === 'N');
    if (TONE_MARKS.test(ch) && !isNTilde) continue;
    out += ch;
  }
  return out.normalize('NFC');
}

/** Levenshtein distance over graphemes. */
export function editDistance(a: string, b: string): number {
  const x = graphemes(a);
  const y = graphemes(b);
  const prev = Array.from({ length: y.length + 1 }, (_, j) => j);
  for (let i = 1; i <= x.length; i += 1) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= y.length; j += 1) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (x[i - 1] === y[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[y.length];
}

export function tokens(s: string): string[] {
  const l = loose(s);
  return l ? l.split(' ') : [];
}

// "Gõ chữ + 0" convention used by the Ê-đê community (b0 → ƀ, c0 → č …).
// The full table must be confirmed with the client's language expert.
const ZERO_MAP: Record<string, string> = {
  b: 'ƀ', B: 'Ƀ',
  c: 'č', C: 'Č',
  n: 'ñ', N: 'Ñ',
  e: 'ĕ', E: 'Ĕ',
  i: 'ĭ', I: 'Ĭ',
  o: 'ŏ', O: 'Ŏ',
  u: 'ŭ', U: 'Ŭ',
  a: 'ă', A: 'Ă',
  ê: `ê${BREVE}`, Ê: `Ê${BREVE}`,
  ô: `ô${BREVE}`, Ô: `Ô${BREVE}`,
  ơ: `ơ${BREVE}`, Ơ: `Ơ${BREVE}`,
  ư: `ư${BREVE}`, Ư: `Ư${BREVE}`,
};

/** Apply the "letter + 0" shortcut right before the caret. Returns null when nothing changed. */
export function applyZeroShortcut(value: string, caret: number): { value: string; caret: number } | null {
  if (caret < 2 || value[caret - 1] !== '0') return null;
  const before = nfc(value.slice(0, caret - 1));
  const last = graphemes(before).pop();
  if (!last || !ZERO_MAP[last]) return null;
  const head = before.slice(0, before.length - last.length) + ZERO_MAP[last];
  const next = nfc(head + value.slice(caret));
  return { value: next, caret: nfc(head).length };
}

export const RADE_SPECIAL_KEYS = ['ƀ', 'č', 'đ', 'ñ', 'ă', 'â', 'ĕ', 'ê', `ê${BREVE}`, 'ĭ', 'ŏ', 'ô', `ô${BREVE}`, 'ơ', `ơ${BREVE}`, 'ŭ', 'ư', `ư${BREVE}`].map(nfc);
