// GÓC VĂN HOÁ — NỘI DUNG MẪU, CHỜ KHÁCH DUYỆT VÀ GỬI ẢNH.
// Ảnh: chép vào public/culture/<id>/ (jpg, png, webp). Script scripts/culture-manifest.mjs
// tự liệt kê ảnh khi chạy dev/build, không cần sửa file này.

export type CultureItem = {
  id: string;
  title: string;
  icon: string;
  summary: string;
  body: string[];
  wordIds: string[];
};

export const culture: CultureItem[] = [
  {
    id: 'nha-dai',
    title: 'Nhà dài',
    icon: 'solar:home-2-bold-duotone',
    summary: 'Ngôi nhà sàn dài, nơi nhiều thế hệ cùng sinh sống.',
    body: [
      'Nhà dài là nhà sàn truyền thống của người Ê-đê, nơi nhiều thế hệ trong một gia đình theo dòng mẹ cùng chung sống. Gia đình càng đông, nhà càng được nối dài thêm.',
      'Cầu thang lên nhà thường được tạc hình bầu ngực và vầng trăng khuyết, gắn với vai trò của người phụ nữ trong gia đình.',
    ],
    wordIds: ['w088', 'w087', 'w011', 'w017'],
  },
  {
    id: 'mau-he',
    title: 'Chế độ mẫu hệ',
    icon: 'solar:women-bold-duotone',
    summary: 'Con cái theo họ mẹ, người phụ nữ giữ vai trò chủ nhà.',
    body: [
      'Người Ê-đê theo chế độ mẫu hệ: con cái mang họ mẹ, người phụ nữ giữ vai trò chủ gia đình và tài sản được truyền theo dòng nữ.',
      'Trong hôn nhân, nhà gái thường chủ động đi hỏi chồng; sau khi cưới, người chồng về sống ở nhà vợ.',
    ],
    wordIds: ['w011', 'w018', 'w019', 'w015'],
  },
  {
    id: 'cong-chieng',
    title: 'Cồng chiêng',
    icon: 'solar:music-notes-bold-duotone',
    summary: 'Không gian văn hoá Cồng chiêng Tây Nguyên — di sản được UNESCO ghi danh.',
    body: [
      'Cồng chiêng gắn liền với đời sống tinh thần của người Ê-đê, vang lên trong các lễ hội, nghi lễ của buôn làng và của từng gia đình.',
      'Không gian văn hoá Cồng chiêng Tây Nguyên được UNESCO công nhận là di sản văn hoá phi vật thể của nhân loại.',
    ],
    wordIds: ['w087'],
  },
  {
    id: 'tho-cam',
    title: 'Thổ cẩm',
    icon: 'solar:t-shirt-bold-duotone',
    summary: 'Vải dệt tay nền đen, sọc màu và băng hoa văn hình học.',
    body: [
      'Phụ nữ Ê-đê dệt vải trên khung dệt thủ công. Trang phục truyền thống có nền đen hoặc chàm, điểm các sọc đỏ, vàng, xanh, trắng và những băng hoa văn hình học.',
      'Váy, áo, khố và tấm choàng đều được trang trí bằng các dải hoa văn ở cổ, tay áo, gấu váy.',
    ],
    wordIds: [],
  },
  {
    id: 'ghe-kpan',
    title: 'Ghế Kpan',
    icon: 'solar:sofa-2-bold-duotone',
    summary: 'Chiếc ghế dài đẽo từ một thân cây, đặt trong nhà dài.',
    body: [
      'Ghế Kpan được đẽo từ một thân cây gỗ lớn nguyên khối, đặt dọc theo gian khách của nhà dài.',
      'Đây là nơi ngồi của người đánh chiêng và khách quý trong những dịp lễ của gia đình.',
    ],
    wordIds: ['w088', 'w085'],
  },
  {
    id: 'ruou-can',
    title: 'Rượu cần',
    icon: 'solar:wineglass-bold-duotone',
    summary: 'Thức uống trong lễ hội, uống chung bằng cần trúc.',
    body: [
      'Rượu cần được ủ trong ché, khi uống mọi người cùng hút bằng những cần trúc dài. Rượu cần có mặt trong các lễ hội và khi tiếp đón khách quý.',
    ],
    wordIds: ['w075', 'w071', 'w073'],
  },
  {
    id: 'le-hoi',
    title: 'Lễ hội',
    icon: 'solar:confetti-bold-duotone',
    summary: 'Những nghi lễ theo mùa rẫy và vòng đời con người.',
    body: [
      'Đời sống của buôn làng gắn với các nghi lễ nông nghiệp như mừng lúa mới sau mùa thu hoạch, cùng các nghi lễ của gia đình và cộng đồng.',
      'Trong lễ hội thường có tiếng cồng chiêng, rượu cần và các điệu múa của buôn làng.',
    ],
    wordIds: ['w073', 'w089', 'w040'],
  },
];

export const CULTURE_NOTICE = 'Nội dung mẫu, chờ khách bổ sung ảnh và duyệt nội dung';
