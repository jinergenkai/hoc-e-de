import { fold, loose, tokens, graphemes, hasVietTone, editDistance, stripVietTones } from './text';

export type Lang = 'rade' | 'vi';
export type Verdict = 'correct' | 'close' | 'wrong';

export type WordResult = {
  verdict: Verdict;
  points: number;
  best: string;
  issues: string[];
};

export type TokenMark = { text: string; mark: 'ok' | 'close' | 'wrong' };

export type SentenceResult = WordResult & {
  percent: number;
  marks: TokenMark[];
  missing: string[];
};

const RADE_LETTER_HINT = 'Kiểm tra lại chữ Ê-đê: ƀ, č, ñ, đ hoặc dấu trăng (ă ĕ ĭ ŏ ŭ …)';

/** Grade a single word / short phrase against every accepted answer. */
export function gradeWord(input: string, accepted: string[], lang: Lang): WordResult {
  const answer = loose(input);
  const fallback = accepted[0] ?? '';
  if (!answer) return { verdict: 'wrong', points: 0, best: fallback, issues: ['Chưa nhập đáp án'] };

  for (const a of accepted) {
    if (loose(a) === answer) return { verdict: 'correct', points: 10, best: a, issues: [] };
  }

  if (lang === 'rade' && hasVietTone(answer)) {
    const stripped = loose(stripVietTones(answer));
    const hit = accepted.find((a) => loose(a) === stripped);
    if (hit) {
      return { verdict: 'close', points: 5, best: hit, issues: ['Tiếng Ê-đê không có dấu thanh (sắc, huyền, hỏi, ngã, nặng)'] };
    }
  }

  const folded = fold(answer);
  const foldHit = accepted.find((a) => fold(a) === folded);
  if (foldHit) {
    return {
      verdict: 'close',
      points: 5,
      best: foldHit,
      issues: [lang === 'rade' ? RADE_LETTER_HINT : 'Sai dấu tiếng Việt'],
    };
  }

  let best = fallback;
  let bestDist = Infinity;
  for (const a of accepted) {
    const d = editDistance(loose(a), answer);
    if (d < bestDist) {
      bestDist = d;
      best = a;
    }
  }
  if (bestDist === 1 && graphemes(loose(best)).length >= 4) {
    return { verdict: 'close', points: 5, best, issues: ['Sai 1 chữ cái'] };
  }

  return { verdict: 'wrong', points: 0, best, issues: [] };
}

type Align = { weight: number; marks: TokenMark[]; missing: string[] };

// LCS alignment: an exact token match weighs 1, a diacritic-only mismatch weighs 0.6.
// Word order matters in Ê-đê ("Kâo êmuh ñu" ≠ "Êmuh ñu kâo"), so a plain bag-of-words is not enough.
function align(input: string[], answer: string[]): Align {
  const n = input.length;
  const m = answer.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  const score = (a: string, b: string) => (a === b ? 1 : fold(a) === fold(b) ? 0.6 : 0);

  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      const s = score(input[i], answer[j]);
      dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1], s > 0 ? s + dp[i + 1][j + 1] : 0);
    }
  }

  const marks: TokenMark[] = [];
  const used = new Set<number>();
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    const s = score(input[i], answer[j]);
    if (s > 0 && dp[i][j] === s + dp[i + 1][j + 1]) {
      marks.push({ text: input[i], mark: s === 1 ? 'ok' : 'close' });
      used.add(j);
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      marks.push({ text: input[i], mark: 'wrong' });
      i += 1;
    } else {
      j += 1;
    }
  }
  for (; i < n; i += 1) marks.push({ text: input[i], mark: 'wrong' });

  return { weight: dp[0][0], marks, missing: answer.filter((_, k) => !used.has(k)) };
}

/** Grade a full sentence translation. Score = aligned weight / longer side, so extra words also cost. */
export function gradeSentence(input: string, accepted: string[], lang: Lang): SentenceResult {
  let src = tokens(input);
  const issues: string[] = [];

  if (lang === 'rade' && hasVietTone(input)) {
    issues.push('Tiếng Ê-đê không có dấu thanh (sắc, huyền, hỏi, ngã, nặng)');
    src = tokens(stripVietTones(input));
  }

  let best = { percent: -1, answer: accepted[0] ?? '', al: { weight: 0, marks: [], missing: [] } as Align };
  for (const a of accepted) {
    const ans = tokens(a);
    const al = align(src, ans);
    const percent = Math.round((100 * al.weight) / Math.max(ans.length, src.length, 1));
    if (percent > best.percent) best = { percent, answer: a, al };
  }

  const ansTokens = tokens(best.answer);
  if (lang === 'rade' && ansTokens.includes('amâo') && ansTokens.at(-1) === 'ôh' && src.includes('amâo') && !src.includes('ôh')) {
    issues.push('Câu phủ định Ê-đê cần đủ khung "amâo … ôh" (thiếu "ôh" cuối câu)');
  }
  if (best.al.marks.some((t) => t.mark === 'close')) {
    issues.push(lang === 'rade' ? RADE_LETTER_HINT : 'Có từ sai dấu tiếng Việt');
  }

  const percent = Math.max(best.percent, 0);
  const verdict: Verdict = percent >= 90 ? 'correct' : percent >= 50 ? 'close' : 'wrong';
  return {
    verdict,
    points: Math.round(percent / 10),
    percent,
    best: best.answer,
    issues,
    marks: best.al.marks,
    missing: best.al.missing,
  };
}
