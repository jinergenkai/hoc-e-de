# Hriăm Êđê — Học tiếng Ê-đê

Phần mềm học tiếng Ê-đê cho người Việt, chạy trên máy tính Windows, không cần mạng:
học thẻ quẹt có chấm điểm, thử thách quẹt 60 giây, luyện dịch Việt ↔ Ê-đê có chấm điểm, dịch thông minh (tra từ điển + luật ngữ pháp), bảng chữ cái 38 chữ, từ điển.



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

## Ghi âm qua mạng & ẩn/hiện tính năng (bản Vercel)

**Ghi âm:** ai mở `https://<tên-miền>/#/recording` cũng ghi được (điện thoại hay máy tính, không cần mã). Bấm micro, đọc, **Lưu** → bản ghi tự gửi lên máy chủ (mất mạng thì tự gửi lại sau). Mỗi mục giữ bản ghi mới nhất, tối đa 12 giây / 2 MB. Ở nhà mở cùng trang, bấm **Tải gói từ máy chủ** → giải nén vào `public/audio/` → build lại là bản offline có giọng.

**Ẩn/hiện tính năng:** mở `https://<tên-miền>/#/quan-tri`, tick tính năng muốn cho khách thấy (hoặc "Đến đợt N"), nhập mật khẩu, **Lưu**. Mọi máy mở lại app sẽ chỉ thấy các tab đó — dùng để demo dần cho khách. Trang Ghi âm luôn vào được bằng link dù đang ẩn khỏi menu.

Cài đặt một lần trên Vercel:

1. Project → **Storage → Create → Blob**, chọn **Private**, nối vào project (tự có `BLOB_READ_WRITE_TOKEN`).
2. **Settings → Environment Variables**: thêm `ADMIN_PASSWORD` (mật khẩu trang cài đặt). Deploy lại.

`npm run dev` chỉ chạy giao diện; muốn chạy cả máy chủ trên máy dùng `npx vercel dev`.

## Thêm âm thanh

Hai cách:
- **Ghi ngay trong app:** menu **Ghi âm nội dung** (mã PIN mặc định `2468`, đổi bằng `VITE_ADMIN_PIN`). Bấm **Ghi liên tục**: Space = ghi/dừng, Enter = lưu & sang mục sau, R = ghi lại. Ghi âm lưu trên máy; **Xuất gói** ra file .zip để chép sang máy khác (**Nhập gói**) hoặc giải nén vào `public/audio/` để đóng gói vào bản cài.
- **Chép file:** đặt vào `public/audio/`, tên theo mã: `w001.mp3` (từ), `s001.mp3` (câu), `l-ƀ.mp3` (chữ cái). Lần build sau nút nghe tự hiện.

## Thêm ảnh Góc văn hoá

Chép ảnh (jpg, png, webp) vào thư mục của từng mục: `public/culture/nha-dai/`, `mau-he/`, `cong-chieng/`, `tho-cam/`, `ghe-kpan/`, `ruou-can/`, `le-hoi/`. Ảnh xếp theo tên (`1.jpg`, `2.jpg`…), ảnh đầu tiên làm ảnh bìa. Nội dung chữ sửa ở `src/data/culture.ts`.

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
