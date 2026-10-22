# Học tiếng Ê đê

Phần mềm học tiếng Ê đê cho người Việt — ứng dụng máy tính Windows (Electron), chạy offline: học thẻ quẹt + luyện dịch Việt ↔ Ê đê có chấm điểm.

## Tài liệu

1. [Đặc tả yêu cầu](docs/01-requirements.md) — chức năng Học, Luyện tập, Tài khoản, AI, CMS; phi chức năng; kiến trúc; dữ liệu
2. [Lộ trình & báo giá theo phase](docs/02-phases-pricing.md) — 4 phase chính + tuỳ chọn, tiêu chí nghiệm thu, chi phí
3. [Design system](docs/03-design-system.md) — port từ Minimal UI (MIT), bảng màu thổ cẩm, layout ứng dụng máy tính
4. [Giải thích tính năng & giới hạn phạm vi](docs/04-feature-scope.md) — dùng khi trao đổi với khách: bao gồm / không bao gồm, câu trả lời mẫu
5. [Nghiên cứu tiếng Ê đê](docs/05-research-ede.md) — chữ viết, Unicode, ngữ âm, ngữ pháp dùng cho bài tập, thị trường, bản quyền dữ liệu

## Stack

Electron · React 19 + Vite · MUI v7 + theme Minimal · SQLite (better-sqlite3) · electron-builder · Claude API (tuỳ chọn, Phase 4)
