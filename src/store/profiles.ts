import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Several learners on one computer (school / office lab). Each profile keeps its
// progress under its own localStorage key; the first profile reuses the original
// key so progress made before profiles existed is kept.

export const LEGACY_PROGRESS_KEY = 'hriam-ede-progress';
export const PROFILES_KEY = 'hriam-ede-profiles';

export type Profile = { id: string; name: string; emoji: string; color: string; storageKey: string; createdAt: number };

type ProfilesState = {
  profiles: Profile[];
  activeId: string | null;
  add: (p: Pick<Profile, 'name' | 'emoji' | 'color'>) => Profile;
  remove: (id: string) => void;
  setActive: (id: string) => void;
};

export const AVATAR_EMOJIS = ['🐘', '🐃', '🐓', '🐎', '🐟', '🐦', '🌾', '🌽', '🔥', '⛰️', '🌙', '☀️'];
export const AVATAR_COLORS = ['#C8401E', '#E0A100', '#1C252E', '#118D57', '#006C9C', '#8E33FF'];

export const useProfiles = create<ProfilesState>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeId: null,
      add: ({ name, emoji, color }) => {
        const id = `p${Date.now().toString(36)}`;
        const first = get().profiles.length === 0;
        const profile: Profile = {
          id,
          name: name.trim() || 'Người học',
          emoji,
          color,
          storageKey: first ? LEGACY_PROGRESS_KEY : `${LEGACY_PROGRESS_KEY}:${id}`,
          createdAt: Date.now(),
        };
        set((s) => ({ profiles: [...s.profiles, profile] }));
        return profile;
      },
      remove: (id) => {
        const p = get().profiles.find((x) => x.id === id);
        if (p) {
          try {
            localStorage.removeItem(p.storageKey);
          } catch {
            /* storage unavailable */
          }
        }
        set((s) => ({ profiles: s.profiles.filter((x) => x.id !== id), activeId: s.activeId === id ? null : s.activeId }));
      },
      setActive: (id) => set({ activeId: id }),
    }),
    { name: PROFILES_KEY, storage: createJSONStorage(() => localStorage), version: 1 }
  )
);

/** Storage key of the active profile, read synchronously at startup. */
export function activeStorageKey(): string {
  const { profiles, activeId } = useProfiles.getState();
  return profiles.find((p) => p.id === activeId)?.storageKey ?? LEGACY_PROGRESS_KEY;
}

/** XP / streak of every profile, for the on-device leaderboard. */
export function readProfileStats(key: string): { xp: number; streak: number; known: number } {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { xp: 0, streak: 0, known: 0 };
    const { state } = JSON.parse(raw);
    const known = Object.values(state.cards ?? {}).filter((c: any) => c.known).length;
    return { xp: state.xp ?? 0, streak: state.streak ?? 0, known };
  } catch {
    return { xp: 0, streak: 0, known: 0 };
  }
}
