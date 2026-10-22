// PIN for content-editor screens (recording). Override at build time: VITE_ADMIN_PIN=xxxx
export const ADMIN_PIN: string = import.meta.env.VITE_ADMIN_PIN || '2468';

const KEY = 'hriam-ede-admin';

export function isAdminUnlocked() {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function unlockAdmin(pin: string) {
  if (pin !== ADMIN_PIN) return false;
  try {
    sessionStorage.setItem(KEY, '1');
  } catch {
    /* storage unavailable */
  }
  return true;
}
