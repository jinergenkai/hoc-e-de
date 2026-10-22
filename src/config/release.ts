// Staged releases: each build turns on the features up to VITE_RELEASE, so the client
// sees the product grow one round at a time. Locked features can still show as
// "Sắp ra mắt" teasers (VITE_TEASERS=0 hides them).
//
//   VITE_RELEASE=2 npm run build              → rounds 1–2 only
//   VITE_PREVIEW=1 VITE_EXPIRES=2026-11-30    → "Bản xem trước" badge + stops after that date

export type FeatureKey =
  | 'learn'
  | 'alphabet'
  | 'challenge'
  | 'gamification'
  | 'practiceWord'
  | 'dictionary'
  | 'practiceSentence'
  | 'translate'
  | 'profiles'
  | 'recording'
  | 'speak'
  | 'certificate'
  | 'culture';

export type Release = { n: number; name: string; pitch: string; features: FeatureKey[] };

export const RELEASES: Release[] = [
  { n: 1, name: 'Làm quen', pitch: 'Học thẻ quẹt có chấm điểm và bảng chữ cái 38 chữ', features: ['learn', 'alphabet'] },
  { n: 2, name: 'Thử thách & điểm thưởng', pitch: 'Thử thách quẹt 60 giây, XP, chuỗi ngày học, mục tiêu ngày', features: ['challenge', 'gamification'] },
  { n: 3, name: 'Luyện dịch từ', pitch: 'Gõ nghĩa Việt ↔ Ê-đê, chấm đúng / gần đúng / sai, kèm từ điển tra không dấu', features: ['practiceWord', 'dictionary'] },
  { n: 4, name: 'Luyện dịch câu', pitch: 'Dịch cả câu, chấm theo %, tô màu từng từ, nhắc lỗi ngữ pháp', features: ['practiceSentence'] },
  { n: 5, name: 'Dịch thông minh', pitch: 'Dịch Việt ↔ Ê-đê ngay trên máy, phân tích từng từ', features: ['translate'] },
  { n: 6, name: 'Nhiều người học', pitch: 'Mỗi người một hồ sơ trên cùng máy, bảng xếp hạng', features: ['profiles'] },
  { n: 7, name: 'Ghi âm & luyện nói', pitch: 'Người soạn ghi âm ngay trong app; người học ghi giọng mình và nghe lại so với giọng mẫu', features: ['recording', 'speak'] },
  { n: 8, name: 'Chứng nhận hoàn thành', pitch: 'Giấy chứng nhận hoàn thành khoá, lưu PDF và in', features: ['certificate'] },
  { n: 9, name: 'Góc văn hoá', pitch: 'Nhà dài, cồng chiêng, thổ cẩm, lễ hội… kèm ảnh và từ vựng liên quan', features: ['culture'] },
];

const env = import.meta.env;

const parsed = Number(env.VITE_RELEASE);
export const RELEASE = Number.isFinite(parsed) && parsed >= 1 ? Math.min(parsed, RELEASES.length) : RELEASES.length;

export const SHOW_TEASERS = env.VITE_TEASERS !== '0';
export const IS_PREVIEW = env.VITE_PREVIEW === '1';
export const EXPIRES: string | null = env.VITE_EXPIRES || null;

const enabledSet = new Set(RELEASES.filter((r) => r.n <= RELEASE).flatMap((r) => r.features));

export const isEnabled = (f: FeatureKey) => enabledSet.has(f);

export const releaseOf = (f: FeatureKey) => RELEASES.find((r) => r.features.includes(f));

export const upcoming = () => RELEASES.filter((r) => r.n > RELEASE);

/** Preview builds stop working after VITE_EXPIRES (local clock — a deterrent, not DRM). */
export const isExpired = (now = new Date()) => Boolean(EXPIRES && now > new Date(`${EXPIRES}T23:59:59`));
