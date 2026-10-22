// "Dịch thông minh": offline, dictionary-based translator (no LLM).
// 1. Exact sentence match against the sentence bank.
// 2. Otherwise greedy longest-match over the word list (up to 4 tokens), with
//    accent-free fallback, plus the Ê-đê negation frame "amâo … ôh".
// Ê-đê and Vietnamese are both SVO with modifiers after the noun, so word-by-word
// output is readable for short sentences; confidence tells the user how much was known.

import type { Word, Sentence } from 'src/data/vocab';

import { fold, loose, tokens } from './text';

export type Direction = 'vi-rade' | 'rade-vi';

export type Segment = {
  src: string;
  out: string;
  known: boolean;
  wordId?: string;
  alternatives?: string[];
};

export type Translation = {
  text: string;
  segments: Segment[];
  confidence: number; // 0..1
  source: 'sentence' | 'dictionary' | 'empty';
  sentenceId?: string;
  notes: string[];
};

type Entry = { out: string; wordId: string; alternatives: string[] };

const MAX_SPAN = 4;

export function createTranslator(words: Word[], sentences: Sentence[]) {
  const viToRade = new Map<string, Entry>();
  const viToRadeFolded = new Map<string, Entry>();
  const radeToVi = new Map<string, Entry>();
  const radeToViFolded = new Map<string, Entry>();

  for (const w of words) {
    const radeKey = loose(w.rade);
    const viMain = w.vi[0];
    if (!radeToVi.has(radeKey)) radeToVi.set(radeKey, { out: viMain, wordId: w.id, alternatives: w.vi.slice(1) });
    if (!radeToViFolded.has(fold(w.rade))) radeToViFolded.set(fold(w.rade), { out: viMain, wordId: w.id, alternatives: w.vi.slice(1) });
    for (const v of w.vi) {
      if (v.startsWith('(')) continue;
      const k = loose(v);
      if (!viToRade.has(k)) viToRade.set(k, { out: w.rade, wordId: w.id, alternatives: [] });
      if (!viToRadeFolded.has(fold(v))) viToRadeFolded.set(fold(v), { out: w.rade, wordId: w.id, alternatives: [] });
    }
  }

  const sentenceIndex = new Map<string, { sentence: Sentence; dir: Direction }>();
  for (const s of sentences) {
    for (const v of s.acceptVi) {
      sentenceIndex.set(`vi-rade|${loose(v)}`, { sentence: s, dir: 'vi-rade' });
      sentenceIndex.set(`vi-rade|~${fold(v)}`, { sentence: s, dir: 'vi-rade' });
    }
    for (const r of s.acceptRade) {
      sentenceIndex.set(`rade-vi|${loose(r)}`, { sentence: s, dir: 'rade-vi' });
      sentenceIndex.set(`rade-vi|~${fold(r)}`, { sentence: s, dir: 'rade-vi' });
    }
  }

  function lookup(phrase: string, dir: Direction): Entry | undefined {
    const [exact, folded] = dir === 'vi-rade' ? [viToRade, viToRadeFolded] : [radeToVi, radeToViFolded];
    const hit = exact.get(loose(phrase));
    if (hit) return hit;
    // Accent-free fallback only when the user typed without accents,
    // otherwise "chợ" would fold to "cho" and match "chó".
    return loose(phrase) === fold(phrase) ? folded.get(fold(phrase)) : undefined;
  }

  function translateClause(clause: string, dir: Direction, notes: string[]): Segment[] {
    let toks = tokens(clause);
    const segs: Segment[] = [];

    // Negation frame
    let negate = false;
    if (dir === 'vi-rade') {
      const idx = toks.findIndex((t) => fold(t) === 'khong');
      // "… không?" at the end is a yes/no question, not a negation
      if (idx >= 0 && idx < toks.length - 1) {
        negate = true;
        toks = [...toks.slice(0, idx), ...toks.slice(idx + 1)];
      }
    } else if (toks.some((t) => fold(t) === 'amao') && fold(toks.at(-1) ?? '') === 'oh') {
      toks = toks.filter((t) => fold(t) !== 'oh');
    }

    let i = 0;
    let negInserted = false;
    while (i < toks.length) {
      let matched = false;
      for (let span = Math.min(MAX_SPAN, toks.length - i); span >= 1; span -= 1) {
        const phrase = toks.slice(i, i + span).join(' ');
        const hit = lookup(phrase, dir);
        if (!hit) continue;
        // Put "amâo" right before the first verb-ish token after the subject (= the token after the first word).
        if (negate && !negInserted && i > 0) {
          segs.push({ src: 'không', out: 'amâo', known: true });
          negInserted = true;
        }
        segs.push({ src: phrase, out: hit.out, known: true, wordId: hit.wordId, alternatives: hit.alternatives });
        i += span;
        matched = true;
        break;
      }
      if (!matched) {
        if (negate && !negInserted && i > 0) {
          segs.push({ src: 'không', out: 'amâo', known: true });
          negInserted = true;
        }
        segs.push({ src: toks[i], out: toks[i], known: false });
        i += 1;
      }
    }

    if (negate) {
      if (!negInserted) segs.unshift({ src: 'không', out: 'amâo', known: true });
      segs.push({ src: '', out: 'ôh', known: true });
      notes.push('Câu phủ định Ê-đê dùng khung "amâo … ôh".');
    }
    return segs;
  }

  function translate(input: string, dir: Direction): Translation {
    const text = input.normalize('NFC').trim();
    if (!text) return { text: '', segments: [], confidence: 0, source: 'empty', notes: [] };

    const unaccented = loose(text) === fold(text);
    const exact = sentenceIndex.get(`${dir}|${loose(text)}`) ?? (unaccented ? sentenceIndex.get(`${dir}|~${fold(text)}`) : undefined);
    if (exact) {
      const out = dir === 'vi-rade' ? exact.sentence.rade : exact.sentence.vi;
      return {
        text: out,
        segments: [{ src: text, out, known: true }],
        confidence: 1,
        source: 'sentence',
        sentenceId: exact.sentence.id,
        notes: exact.sentence.note ? [exact.sentence.note] : [],
      };
    }

    const notes: string[] = [];
    const clauses = text.split(/(?<=[.!?;])\s+|\n+/).filter(Boolean);
    const segments: Segment[] = [];
    const outs: string[] = [];
    for (const c of clauses) {
      const segs = translateClause(c, dir, notes);
      segments.push(...segs);
      const punct = /[?!.]$/.test(c.trim()) ? c.trim().slice(-1) : '';
      const sentence = segs.map((s) => (s.known ? s.out : `[${s.out}]`)).join(' ');
      outs.push(sentence ? sentence.charAt(0).toUpperCase() + sentence.slice(1) + punct : '');
    }

    const counted = segments.filter((s) => s.src);
    const known = counted.filter((s) => s.known).length;
    const confidence = counted.length ? known / counted.length : 0;
    if (confidence < 1) notes.push('Từ trong [ngoặc vuông] chưa có trong từ điển.');

    return { text: outs.join(' '), segments, confidence, source: 'dictionary', notes: Array.from(new Set(notes)) };
  }

  return { translate };
}
