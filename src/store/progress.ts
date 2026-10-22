import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { isEnabled } from 'src/config/release';

import { activeStorageKey, LEGACY_PROGRESS_KEY } from './profiles';

export type SessionKind = 'learn' | 'challenge' | 'practice';

export type CardStat = { known: boolean; seen: number; misses: number; last: number };

export type Session = { kind: SessionKind; topicId: string; score: number; total: number; date: string };

type ProgressState = {
  xp: number;
  todayXp: number;
  today: string;
  streak: number;
  lastStudy: string | null;
  dailyGoal: number;
  cards: Record<string, CardStat>;
  sessions: Session[];
  bestChallenge: number;
  courseCompletedAt: string | null;
  addXp: (n: number) => void;
  markCard: (wordId: string, known: boolean) => void;
  recordSession: (s: Omit<Session, 'date'>) => void;
  markCourseCompleted: () => void;
  reset: () => void;
};

export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const daysBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);

const initial = {
  xp: 0,
  todayXp: 0,
  today: dayKey(),
  streak: 0,
  lastStudy: null as string | null,
  dailyGoal: 100,
  cards: {} as Record<string, CardStat>,
  sessions: [] as Session[],
  bestChallenge: 0,
  courseCompletedAt: null as string | null,
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      ...initial,
      addXp: (n) =>
        set((s) => {
          const today = dayKey();
          const todayXp = s.today === today ? s.todayXp + n : n;
          let { streak } = s;
          if (s.lastStudy !== today) {
            streak = s.lastStudy && daysBetween(s.lastStudy, today) === 1 ? s.streak + 1 : 1;
          }
          return { xp: s.xp + n, todayXp, today, streak, lastStudy: today };
        }),
      markCard: (wordId, known) =>
        set((s) => {
          const prev = s.cards[wordId] ?? { known: false, seen: 0, misses: 0, last: 0 };
          return {
            cards: {
              ...s.cards,
              [wordId]: { known: known || prev.known, seen: prev.seen + 1, misses: prev.misses + (known ? 0 : 1), last: Date.now() },
            },
          };
        }),
      recordSession: (session) =>
        set((s) => ({
          sessions: [{ ...session, date: new Date().toISOString() }, ...s.sessions].slice(0, 200),
          bestChallenge: session.kind === 'challenge' ? Math.max(s.bestChallenge, session.score) : s.bestChallenge,
        })),
      markCourseCompleted: () => set((s) => (s.courseCompletedAt ? s : { courseCompletedAt: new Date().toISOString() })),
      reset: () => set({ ...initial, today: dayKey() }),
    }),
    {
      name: isEnabled('profiles') ? activeStorageKey() : LEGACY_PROGRESS_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);

/** Point the progress store at another profile's storage key and load it. */
export function switchProgressTo(storageKey: string) {
  useProgress.persist.setOptions({ name: storageKey });
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(storageKey);
  } catch {
    /* storage unavailable */
  }
  // Rehydrating an empty key would keep the previous learner's state, so start fresh instead
  if (stored) useProgress.persist.rehydrate();
  else useProgress.setState({ ...initial, today: dayKey() });
}

export const levelOf = (xp: number) => Math.floor(Math.sqrt(xp / 50)) + 1;
export const xpForLevel = (level: number) => (level - 1) ** 2 * 50;

/** Today's XP, which resets when the date changes even if the app stayed open. */
export const useTodayXp = () => useProgress((s) => (s.today === dayKey() ? s.todayXp : 0));
