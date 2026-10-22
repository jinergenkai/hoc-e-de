// Bảng chữ cái Êđê — Bŏh hră Êđê: 38 chữ, không có "c" đứng riêng (chỉ có č).
// Thứ tự nhóm o/ô/ơ khác nhau giữa các nguồn: khách cần chốt (xem docs/05-research-ede.md).
// Ghi chú phát âm là gợi ý ban đầu, cần chuyên gia bổ sung + ghi âm.

export type Letter = {
  upper: string;
  lower: string;
  kind: 'vowel' | 'consonant';
  special?: boolean; // khác tiếng Việt
  note: string;
};

const B = '̆';
const L = (upper: string, lower: string, kind: Letter['kind'], note: string, special = false): Letter => ({
  upper: upper.normalize('NFC'),
  lower: lower.normalize('NFC'),
  kind,
  note,
  special,
});

export const alphabet: Letter[] = [
  L('A', 'a', 'vowel', 'Như "a" tiếng Việt'),
  L('Ă', 'ă', 'vowel', 'Như "ă" tiếng Việt, âm a ngắn'),
  L('Â', 'â', 'vowel', 'Như "â" tiếng Việt'),
  L('B', 'b', 'consonant', 'Như "b" tiếng Việt'),
  L('Ƀ', 'ƀ', 'consonant', 'Âm b hút vào (b mạnh hơn). Không có trong tiếng Việt', true),
  L('Č', 'č', 'consonant', 'Gần "ch" tiếng Việt. Ê-đê viết gọn thành 1 chữ', true),
  L('D', 'd', 'consonant', 'Âm d (không đọc như "z" của tiếng Việt miền Bắc)'),
  L('Đ', 'đ', 'consonant', 'Như "đ" tiếng Việt'),
  L('E', 'e', 'vowel', 'Như "e" tiếng Việt'),
  L('Ĕ', 'ĕ', 'vowel', 'Âm e ngắn. Không có trong tiếng Việt', true),
  L('Ê', 'ê', 'vowel', 'Như "ê" tiếng Việt'),
  L(`Ê${B}`, `ê${B}`, 'vowel', 'Âm ê ngắn. Chữ ghép: ê + dấu trăng', true),
  L('G', 'g', 'consonant', 'Như "g" tiếng Việt'),
  L('H', 'h', 'consonant', 'Như "h"; đứng sau phụ âm khác tạo âm bật hơi (ph, th, kh…)'),
  L('I', 'i', 'vowel', 'Như "i" tiếng Việt'),
  L('Ĭ', 'ĭ', 'vowel', 'Âm i ngắn. Không có trong tiếng Việt', true),
  L('J', 'j', 'consonant', 'Âm gần "d/gi" đọc ở mặt lưỡi. Không có trong tiếng Việt', true),
  L('K', 'k', 'consonant', 'Như "k/c" tiếng Việt'),
  L('L', 'l', 'consonant', 'Như "l"; có thể đứng cuối âm tiết'),
  L('M', 'm', 'consonant', 'Như "m"; hay đứng trước phụ âm khác (mnăm, mtô)'),
  L('N', 'n', 'consonant', 'Như "n" tiếng Việt'),
  L('Ñ', 'ñ', 'consonant', 'Như "nh" tiếng Việt. Ê-đê viết gọn thành 1 chữ', true),
  L('O', 'o', 'vowel', 'Như "o" tiếng Việt'),
  L('Ŏ', 'ŏ', 'vowel', 'Âm o ngắn. Không có trong tiếng Việt', true),
  L('Ô', 'ô', 'vowel', 'Như "ô" tiếng Việt'),
  L(`Ô${B}`, `ô${B}`, 'vowel', 'Âm ô ngắn. Chữ ghép: ô + dấu trăng', true),
  L('Ơ', 'ơ', 'vowel', 'Như "ơ" tiếng Việt'),
  L(`Ơ${B}`, `ơ${B}`, 'vowel', 'Âm ơ ngắn. Chữ ghép: ơ + dấu trăng', true),
  L('P', 'p', 'consonant', 'Như "p", có thể đứng đầu âm tiết'),
  L('R', 'r', 'consonant', 'Âm r rung; có thể đứng cuối âm tiết (ktơr)'),
  L('S', 's', 'consonant', 'Như "s" tiếng Việt'),
  L('T', 't', 'consonant', 'Như "t"; ghép đầu: tl (tlâo)'),
  L('U', 'u', 'vowel', 'Như "u" tiếng Việt'),
  L('Ŭ', 'ŭ', 'vowel', 'Âm u ngắn. Không có trong tiếng Việt', true),
  L('Ư', 'ư', 'vowel', 'Như "ư" tiếng Việt'),
  L(`Ư${B}`, `ư${B}`, 'vowel', 'Âm ư ngắn. Chữ ghép: ư + dấu trăng', true),
  L('W', 'w', 'consonant', 'Âm bán nguyên âm "w" (như "u" lướt)', true),
  L('Y', 'y', 'consonant', 'Âm bán nguyên âm "y" (như "i" lướt)'),
];

export const ALPHABET_FACTS = [
  { title: '38 chữ cái', body: 'Bảng chữ Latin dựa trên chữ Quốc ngữ, thêm ƀ, č, ñ và 9 nguyên âm có dấu trăng.' },
  { title: 'Không có thanh điệu', body: 'Tiếng Ê-đê không dùng dấu sắc, huyền, hỏi, ngã, nặng.' },
  { title: 'Phụ âm ghép đầu', body: 'Nhiều từ bắt đầu bằng 2–3 phụ âm: tl, mn, kp, kb, hr, mt…' },
  { title: 'Phương ngữ chuẩn', body: 'Chữ viết theo phương ngữ Kpă, vùng Buôn Ma Thuột.' },
];
