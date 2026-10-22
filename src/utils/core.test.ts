import { describe, it, expect } from 'vitest';

import { words, sentences } from 'src/data/vocab';
import { alphabet } from 'src/data/alphabet';

import { gradeWord, gradeSentence } from './grader';
import { createTranslator } from './translator';
import { fold, graphemes, hasVietTone, applyZeroShortcut, stripVietTones } from './text';

describe('text', () => {
  it('folds Ê-đê letters for accent-free search', () => {
    expect(fold('Ƀuôn')).toBe('buon');
    expect(fold('čư̆')).toBe('cu');
    expect(fold('ñu')).toBe('nu');
  });

  it('counts ê̆ as one grapheme', () => {
    expect(graphemes('mô̆')).toHaveLength(2);
  });

  it('detects Vietnamese tones but not the tilde of ñ', () => {
    expect(hasVietTone('ñu')).toBe(false);
    expect(hasVietTone('kâó')).toBe(true);
    expect(stripVietTones('mnắm')).toBe('mnăm');
  });

  it('applies the "letter + 0" shortcut', () => {
    expect(applyZeroShortcut('b0', 2)).toEqual({ value: 'ƀ', caret: 1 });
    expect(applyZeroShortcut('mô0', 3)?.value).toBe('mô̆'.normalize('NFC'));
    expect(applyZeroShortcut('x0', 2)).toBeNull();
  });
});

describe('data', () => {
  it('has the 38-letter alphabet without a bare "c"', () => {
    expect(alphabet).toHaveLength(38);
    expect(alphabet.some((l) => l.lower === 'c')).toBe(false);
  });

  it('stores everything in NFC with unique ids', () => {
    expect(new Set(words.map((w) => w.id)).size).toBe(words.length);
    for (const w of words) expect(w.rade).toBe(w.rade.normalize('NFC'));
  });
});

describe('gradeWord', () => {
  it('accepts any listed meaning', () => {
    expect(gradeWord('Anh ấy', ['nó', 'anh ấy'], 'vi').verdict).toBe('correct');
  });

  it('marks a missing Ê-đê letter as close', () => {
    const r = gradeWord('bơ̆ng', ['ƀơ̆ng'], 'rade');
    expect(r.verdict).toBe('close');
    expect(r.points).toBe(5);
  });

  it('flags Vietnamese tone marks in Ê-đê answers', () => {
    const r = gradeWord('mnắm', ['mnăm'], 'rade');
    expect(r.verdict).toBe('close');
    expect(r.issues[0]).toMatch(/dấu thanh/);
  });

  it('rejects a wrong answer', () => {
    expect(gradeWord('kbao', ['asâo'], 'rade').verdict).toBe('wrong');
  });
});

describe('gradeSentence', () => {
  it('gives 100% for an accepted translation', () => {
    expect(gradeSentence('tôi hỏi anh ấy', ['Tôi hỏi nó.', 'Tôi hỏi anh ấy.'], 'vi').percent).toBe(100);
  });

  it('penalises wrong word order', () => {
    const r = gradeSentence('Êmuh ñu kâo', ['Kâo êmuh ñu.'], 'rade');
    expect(r.percent).toBeLessThan(90);
  });

  it('reminds the learner about the amâo … ôh frame', () => {
    const r = gradeSentence('Kâo amâo nao mă bruă', ['Kâo amâo nao mă bruă ôh.'], 'rade');
    expect(r.issues.join(' ')).toMatch(/amâo … ôh/);
    expect(r.missing).toContain('ôh');
  });
});

describe('translator', () => {
  const t = createTranslator(words, sentences);

  it('uses the sentence bank first', () => {
    const r = t.translate('tôi đi học', 'vi-rade');
    expect(r.source).toBe('sentence');
    expect(r.text).toBe('Kâo nao hriăm.');
  });

  it('builds the negation frame word by word', () => {
    const r = t.translate('Mẹ không ăn cơm.', 'vi-rade');
    expect(r.text).toBe('Amĭ amâo ƀơ̆ng êsei ôh.');
    expect(r.confidence).toBe(1);
  });

  it('translates Ê-đê to Vietnamese without accents', () => {
    expect(t.translate('ama bong esei', 'rade-vi').text).toBe('Bố ăn cơm');
  });

  it('brackets unknown words and lowers confidence', () => {
    const r = t.translate('tôi đi chợ', 'vi-rade');
    expect(r.text).toContain('[chợ]');
    expect(r.confidence).toBeLessThan(1);
  });
});
