// Runtime feature visibility. The admin chooses which tabs/features are shown (saved on the
// server); the app reads it once at start-up, caches it for offline use, and re-renders
// the whole tree (key = rev) when the admin changes it.

import { create } from 'zustand';

import { fetchFlags } from 'src/remote/api';
import { applyFlags, currentFlags, type FlagsConfig } from 'src/config/release';

const CACHE = 'hriam-flags';

export const useFlags = create<{ rev: number; bump: () => void }>((set, get) => ({ rev: 0, bump: () => set({ rev: get().rev + 1 }) }));

export function setFlags(cfg: FlagsConfig) {
  applyFlags(cfg);
  try {
    localStorage.setItem(CACHE, JSON.stringify(currentFlags()));
  } catch {
    /* storage unavailable */
  }
  useFlags.getState().bump();
}

/** Called before the first render: server value if reachable, otherwise the last cached one. */
export async function loadFlags() {
  const remote = await fetchFlags();
  if (remote?.features) {
    setFlags(remote);
    return;
  }
  try {
    const cached = localStorage.getItem(CACHE);
    if (cached) applyFlags(JSON.parse(cached));
  } catch {
    /* ignore */
  }
}
