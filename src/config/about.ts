// Thông tin hiển thị ở trang "Giới thiệu". Sửa file này để cập nhật người / đơn vị triển khai.
// Trường để trống ('') sẽ không hiện ra.

export type Member = {
  name: string;
  title?: string; // cách xưng hô hiển thị trước tên, ví dụ "Đồng chí"
  role: string;
  unit: string;
  phone?: string;
  email?: string;
};

export const ABOUT = {
  appName: 'Hriăm Êđê',
  tagline: 'Phần mềm hỗ trợ học tiếng Ê-đê',
  initiative:
    'Ứng dụng công nghệ thông tin trong dạy và học tiếng Ê-đê: phần mềm "Hriăm Êđê" học từ vựng bằng thẻ ghi nhớ và luyện dịch hai chiều Việt – Ê-đê không cần kết nối Internet',
  goals: [
    'Giúp người học ghi nhớ từ vựng tiếng Ê-đê qua thẻ quẹt và trò chơi có chấm điểm',
    'Luyện dịch hai chiều Việt – Ê-đê, được chấm điểm và chỉ lỗi ngay',
    'Chạy hoàn toàn trên máy tính, không cần mạng, phù hợp phòng máy cơ quan, trường học',
    'Góp phần gìn giữ và lan toả tiếng nói, chữ viết của đồng bào Ê-đê',
  ],
  members: [
    { title: 'Đồng chí', name: 'Dân', role: 'Người triển khai', unit: 'Ban Đổi mới sáng tạo', phone: '', email: '' },
  ] as Member[],
};
