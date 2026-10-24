// DỮ LIỆU MẪU — CHƯA ĐƯỢC CHUYÊN GIA DUYỆT.
// Dùng để demo giao diện và bộ chấm. Phase 2 thay bằng dữ liệu khách cung cấp (Excel → scripts/import-excel).
// Ê-đê theo phương ngữ Kpă; mọi chuỗi phải ở dạng NFC.

export type Topic = {
  id: string;
  name: string;
  icon: string;
  color: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
};

export type Word = {
  id: string;
  rade: string;
  vi: string[];
  topicId: string;
  pos?: string;
  note?: string;
};

export type Sentence = {
  id: string;
  rade: string;
  vi: string;
  acceptVi: string[];
  acceptRade: string[];
  topicId: string;
  note?: string;
};

export const topics: Topic[] = [
  { id: 'xung-ho', name: 'Xưng hô', icon: 'solar:users-group-rounded-bold-duotone', color: 'primary' },
  { id: 'gia-dinh', name: 'Gia đình', icon: 'solar:home-smile-bold-duotone', color: 'secondary' },
  { id: 'so-dem', name: 'Số đếm', icon: 'solar:calculator-minimalistic-bold-duotone', color: 'info' },
  { id: 'thien-nhien', name: 'Thiên nhiên', icon: 'solar:sun-2-bold-duotone', color: 'success' },
  { id: 'dong-vat', name: 'Con vật', icon: 'solar:cat-bold-duotone', color: 'warning' },
  { id: 'an-uong', name: 'Ăn uống', icon: 'solar:cup-hot-bold-duotone', color: 'error' },
  { id: 'hoat-dong', name: 'Hoạt động', icon: 'solar:running-round-bold-duotone', color: 'primary' },
  { id: 'cau-hoi', name: 'Từ để hỏi', icon: 'solar:question-circle-bold-duotone', color: 'info' },
];

const w = (id: string, topicId: string, rade: string, vi: string[], pos?: string, note?: string): Word => ({
  id,
  topicId,
  rade: rade.normalize('NFC'),
  vi,
  pos,
  note,
});

export const words: Word[] = [
  // Xưng hô
  w('w001', 'xung-ho', 'kâo', ['tôi'], 'đại từ'),
  w('w002', 'xung-ho', 'ih', ['bạn', 'anh', 'chị'], 'đại từ', 'Ngôi thứ hai'),
  w('w003', 'xung-ho', 'ñu', ['nó', 'anh ấy', 'chị ấy'], 'đại từ'),
  w('w004', 'xung-ho', 'drei', ['chúng ta'], 'đại từ'),
  w('w005', 'xung-ho', 'hmei', ['chúng tôi'], 'đại từ'),
  w('w006', 'xung-ho', 'diih', ['các bạn'], 'đại từ'),
  // Gia đình
  w('w010', 'gia-dinh', 'ama', ['bố', 'cha'], 'danh từ'),
  w('w011', 'gia-dinh', 'amĭ', ['mẹ'], 'danh từ'),
  w('w012', 'gia-dinh', 'ayŏng', ['anh'], 'danh từ', 'Anh trai'),
  w('w013', 'gia-dinh', 'amai', ['chị'], 'danh từ', 'Chị gái'),
  w('w014', 'gia-dinh', 'adei', ['em'], 'danh từ'),
  w('w015', 'gia-dinh', 'anak', ['con'], 'danh từ'),
  w('w016', 'gia-dinh', 'aê', ['ông'], 'danh từ'),
  w('w017', 'gia-dinh', 'aduôn', ['bà'], 'danh từ'),
  w('w018', 'gia-dinh', 'ung', ['chồng'], 'danh từ'),
  w('w019', 'gia-dinh', 'mô̆', ['vợ'], 'danh từ', 'Có chữ ô̆ (ô + dấu trăng)'),
  // Số đếm
  w('w020', 'so-dem', 'sa', ['một'], 'số từ'),
  w('w021', 'so-dem', 'dua', ['hai'], 'số từ'),
  w('w022', 'so-dem', 'tlâo', ['ba'], 'số từ', 'Phụ âm ghép đầu "tl"'),
  w('w023', 'so-dem', 'pă', ['bốn'], 'số từ'),
  w('w024', 'so-dem', 'êma', ['năm'], 'số từ'),
  w('w025', 'so-dem', 'năm', ['sáu'], 'số từ', 'Dễ nhầm: "năm" tiếng Ê-đê là số 6'),
  w('w026', 'so-dem', 'kjuh', ['bảy'], 'số từ'),
  w('w027', 'so-dem', 'sapăn', ['tám'], 'số từ'),
  w('w028', 'so-dem', 'dua păn', ['chín'], 'số từ'),
  w('w029', 'so-dem', 'pluh', ['mười'], 'số từ'),
  w('w030', 'so-dem', 'pluh sa', ['mười một'], 'số từ', '10 + 1'),
  w('w031', 'so-dem', 'dua pluh', ['hai mươi'], 'số từ', '2 × 10'),
  // Thiên nhiên
  w('w040', 'thien-nhien', 'êa', ['nước'], 'danh từ'),
  w('w041', 'thien-nhien', 'adiê', ['trời', 'bầu trời'], 'danh từ'),
  w('w042', 'thien-nhien', 'hruê', ['mặt trời', 'ngày'], 'danh từ'),
  w('w043', 'thien-nhien', 'mlan', ['mặt trăng', 'tháng'], 'danh từ'),
  w('w044', 'thien-nhien', 'lăn', ['đất'], 'danh từ'),
  w('w045', 'thien-nhien', 'čư̆', ['núi'], 'danh từ', 'Có chữ ư̆ (ư + dấu trăng)'),
  w('w046', 'thien-nhien', 'krông', ['sông'], 'danh từ', 'Gặp trong địa danh: Krông Ana, Krông Pắc'),
  w('w047', 'thien-nhien', 'pui', ['lửa'], 'danh từ'),
  w('w048', 'thien-nhien', 'hjan', ['mưa'], 'danh từ'),
  w('w049', 'thien-nhien', 'kyâo', ['cây'], 'danh từ'),
  w('w050', 'thien-nhien', 'hla', ['lá'], 'danh từ'),
  // Con vật
  w('w060', 'dong-vat', 'asâo', ['chó'], 'danh từ'),
  w('w061', 'dong-vat', 'mnŭ', ['gà'], 'danh từ'),
  w('w062', 'dong-vat', 'kbao', ['trâu'], 'danh từ'),
  w('w063', 'dong-vat', 'êmô', ['bò'], 'danh từ'),
  w('w064', 'dong-vat', 'aseh', ['ngựa'], 'danh từ'),
  w('w065', 'dong-vat', 'êman', ['voi'], 'danh từ', 'Con vật gắn với văn hoá Tây Nguyên'),
  w('w066', 'dong-vat', 'čim', ['chim'], 'danh từ'),
  w('w067', 'dong-vat', 'kan', ['cá'], 'danh từ'),
  // Ăn uống
  w('w070', 'an-uong', 'ƀơ̆ng', ['ăn'], 'động từ', 'Có chữ ƀ và ơ̆'),
  w('w071', 'an-uong', 'mnăm', ['uống'], 'động từ'),
  w('w072', 'an-uong', 'êsei', ['cơm'], 'danh từ'),
  w('w073', 'an-uong', 'mdiê', ['lúa'], 'danh từ'),
  w('w074', 'an-uong', 'ktơr', ['ngô', 'bắp'], 'danh từ'),
  w('w075', 'an-uong', 'kpiê', ['rượu'], 'danh từ', 'Kpiê: rượu cần'),
  w('w076', 'an-uong', 'boh', ['quả', 'trái'], 'danh từ'),
  // Hoạt động
  w('w080', 'hoat-dong', 'nao', ['đi'], 'động từ'),
  w('w081', 'hoat-dong', 'hriăm', ['học'], 'động từ', 'Hriăm klei Êđê: học tiếng Ê-đê'),
  w('w082', 'hoat-dong', 'mtô', ['dạy'], 'động từ'),
  w('w083', 'hoat-dong', 'êmuh', ['hỏi'], 'động từ'),
  w('w084', 'hoat-dong', 'mă bruă', ['làm việc', 'làm'], 'động từ'),
  w('w085', 'hoat-dong', 'dôk', ['ở', 'ngồi'], 'động từ'),
  w('w086', 'hoat-dong', 'đih', ['ngủ'], 'động từ'),
  w('w087', 'hoat-dong', 'ƀuôn', ['làng', 'buôn'], 'danh từ', 'Gặp trong địa danh: Buôn Ma Thuột'),
  w('w088', 'hoat-dong', 'sang', ['nhà'], 'danh từ'),
  w('w089', 'hoat-dong', 'hma', ['rẫy'], 'danh từ'),
  w('w090', 'hoat-dong', 'hră', ['chữ', 'giấy'], 'danh từ'),
  w('w091', 'hoat-dong', 'klei', ['tiếng', 'lời'], 'danh từ', 'Klei Êđê: tiếng Ê-đê'),
  // Từ để hỏi & ngữ pháp
  w('w100', 'cau-hoi', 'hlei', ['ai'], 'từ hỏi', 'Đứng đầu câu: Hlei mtô ih? (Ai dạy bạn?)'),
  w('w101', 'cau-hoi', 'ya', ['gì', 'cái gì'], 'từ hỏi'),
  w('w102', 'cau-hoi', 'ti', ['đâu', 'ở đâu'], 'từ hỏi'),
  w('w103', 'cau-hoi', 'amâo', ['không'], 'phủ định', 'Đi theo khung: amâo … ôh'),
  w('w104', 'cau-hoi', 'ôh', ['(cuối câu phủ định)'], 'tiểu từ', 'Kết thúc câu phủ định: Kâo amâo nao ôh'),
];

const s = (id: string, topicId: string, rade: string, vi: string, acceptVi: string[], acceptRade: string[] = [], note?: string): Sentence => ({
  id,
  topicId,
  rade: rade.normalize('NFC'),
  vi,
  acceptVi: [vi, ...acceptVi],
  acceptRade: [rade, ...acceptRade].map((x) => x.normalize('NFC')),
  note,
});

export const sentences: Sentence[] = [
  s('s001', 'hoat-dong', 'Kâo amâo nao mă bruă ôh.', 'Tôi không đi làm.', ['Tôi không đi làm việc.'], [], 'Phủ định: amâo … ôh'),
  s('s002', 'cau-hoi', 'Hlei mtô ih hriăm klei Êđê?', 'Ai dạy bạn học tiếng Ê-đê?', ['Ai dạy bạn học tiếng Ê đê?', 'Ai dạy anh học tiếng Ê-đê?', 'Ai dạy chị học tiếng Ê-đê?'], [], 'Từ hỏi đứng đầu câu'),
  s('s003', 'xung-ho', 'Kâo êmuh ñu.', 'Tôi hỏi nó.', ['Tôi hỏi anh ấy.', 'Tôi hỏi chị ấy.'], [], 'Đổi trật tự từ là đổi nghĩa'),
  s('s004', 'hoat-dong', 'Kâo nao hriăm.', 'Tôi đi học.', []),
  s('s005', 'an-uong', 'Kâo mnăm êa.', 'Tôi uống nước.', []),
  s('s006', 'cau-hoi', 'Ih nao ti?', 'Bạn đi đâu?', ['Anh đi đâu?', 'Chị đi đâu?']),
  s('s007', 'gia-dinh', 'Ama nao hma.', 'Bố đi rẫy.', ['Cha đi rẫy.', 'Bố đi làm rẫy.']),
  s('s008', 'gia-dinh', 'Amĭ ƀơ̆ng êsei.', 'Mẹ ăn cơm.', []),
  s('s009', 'hoat-dong', 'Ñu hriăm hră.', 'Nó học chữ.', ['Anh ấy học chữ.', 'Chị ấy học chữ.']),
  s('s010', 'an-uong', 'Kâo amâo mnăm kpiê ôh.', 'Tôi không uống rượu.', [], [], 'Phủ định: amâo … ôh'),
];

export const wordById = new Map(words.map((x) => [x.id, x]));
export const topicById = new Map(topics.map((x) => [x.id, x]));
export const wordsByTopic = (topicId: string) => words.filter((x) => x.topicId === topicId);
export const sentencesByTopic = (topicId: string) => sentences.filter((x) => x.topicId === topicId);
