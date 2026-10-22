# Hriăm Êđê — Học tiếng Ê-đê

Phần mềm học tiếng Ê-đê cho người Việt, chạy trên máy tính Windows, không cần mạng:
học thẻ quẹt có chấm điểm, thử thách quẹt 60 giây, luyện dịch Việt ↔ Ê-đê có chấm điểm, dịch thông minh (tra từ điển + luật ngữ pháp), bảng chữ cái 38 chữ, từ điển.

> ⚠️ Từ vựng, câu và ghi chú phát âm hiện là **dữ liệu mẫu chưa được chuyên gia duyệt**.

## Chạy thử

```bash
npm install
npm run dev            # mở http://localhost:5173 trên trình duyệt
npm test               # kiểm thử bộ chấm điểm, bộ dịch, xử lý chữ Ê-đê
npm run build          # build giao diện vào dist/
npm run electron       # mở bằng Electron (sau khi build)
npm run dist:win       # đóng gói .exe (chạy trên Windows)
```

Mỗi lần đẩy lên nhánh `master`, GitHub Actions build file `.exe` đầy đủ (tab **Actions → Build Windows app → Artifacts**).
Muốn build bản theo đợt (chỉ mở một phần tính năng, có nhãn xem trước, có hạn dùng): **Run workflow** và nhập đợt — xem [docs/06](docs/06-releases-roadmap.md).

## Thêm âm thanh

Chép file vào `public/audio/`, đặt tên theo mã: `w001.mp3` (từ), `s001.mp3` (câu), `l-ƀ.mp3` (chữ cái). Lần build sau nút nghe tự hiện.

## Cấu trúc

```
electron/            cửa sổ Electron (contextIsolation, không nodeIntegration)
src/theme/           theme port từ Minimal UI (MIT): bảng màu, chữ, bóng, component
src/layouts/         khung dashboard: menu trái + header (chuỗi ngày, XP, cấp)
src/sections/        các màn: home, learn, challenge, practice, translate, alphabet, dictionary
src/components/      thẻ quẹt, ô nhập Ê-đê, khung trò chơi, hoạ tiết thổ cẩm & chiêng, icon offline…
src/utils/           text (Unicode, gõ tắt), grader (chấm điểm), translator (dịch thông minh)
src/data/            dữ liệu mẫu: từ vựng, câu, bảng chữ cái
src/store/           tiến độ (XP, chuỗi ngày, thẻ đã thuộc) + hồ sơ người học, lưu trên máy
src/config/release.ts các đợt phát hành, bật/tắt tính năng theo đợt
```

## Tài liệu

1. [Đặc tả yêu cầu](docs/01-requirements.md) — định hướng đầy đủ
2. [Lộ trình & báo giá](docs/02-phases-pricing.md) — **3 phase, 10 triệu**
3. [Design system](docs/03-design-system.md) — port từ Minimal UI
4. [Giải thích tính năng & giới hạn](docs/04-feature-scope.md)
5. [Nghiên cứu tiếng Ê-đê](docs/05-research-ede.md)
6. [Phát hành theo đợt & danh mục mở rộng](docs/06-releases-roadmap.md) — build từng đợt, lịch công bố gắn mốc thanh toán
