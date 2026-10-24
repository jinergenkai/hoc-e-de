// Everything that needs a native-speaker recording: words, sentences and letters.
import { alphabet } from 'src/data/alphabet';
import { words, sentences } from 'src/data/vocab';

export type RecordKind = 'word' | 'sentence' | 'letter';
export type RecordItem = { id: string; rade: string; vi: string };

export const RECORD_ITEMS: Record<RecordKind, RecordItem[]> = {
  word: words.map((w) => ({ id: w.id, rade: w.rade, vi: w.vi.join(', ') })),
  sentence: sentences.map((s) => ({ id: s.id, rade: s.rade, vi: s.vi })),
  letter: alphabet.map((l) => ({ id: `l-${l.lower}`, rade: `${l.upper} ${l.lower}`, vi: l.note })),
};

export const RECORD_TAB_LABEL: Record<RecordKind, string> = { word: 'Từ vựng', sentence: 'Câu', letter: 'Chữ cái' };
