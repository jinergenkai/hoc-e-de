# Lộ trình triển khai & báo giá theo Phase

> Bản 0.3 · 22/10/2026 · **Ngân sách khách chốt: 10 triệu.** Phạm vi rút gọn còn đúng 3 thứ khách cần: học thẻ quẹt có chấm điểm, luyện dịch có chấm điểm, "dịch thông minh" (tra từ điển, không phải AI), giao diện vui mắt, chạy offline trên Windows.
> Các tính năng khác trong `01-requirements.md` / `04-feature-scope.md` là **định hướng mở rộng**, báo giá riêng khi khách cần.

> Lịch công bố tính năng theo 6 đợt (bản xem trước có hạn dùng) và danh mục bán thêm: xem `06-releases-roadmap.md`.

## Tổng quan

| Phase | Nội dung | Thời gian | Giá | Thanh toán |
|---|---|---|---|---|
| 1 | **Bản nháp demo** — đã làm xong (xem bên dưới) | đã xong | 3 triệu | Khi khách chạy thử và đồng ý làm tiếp |
| 2 | **Nội dung thật + âm thanh** + 1 vòng chỉnh giao diện | ~1,5 tuần sau khi nhận đủ dữ liệu | 4 triệu | Khi nghiệm thu Phase 2 |
| 3 | **Đóng gói & bàn giao** | ~3 ngày | 3 triệu | Khi bàn giao bộ cài |
| | **Tổng** | | **10 triệu** | |

Chi phí ngoài (khách tự trả nếu muốn): chữ ký số / Microsoft Store để hết cảnh báo Windows (xem `01-requirements.md` mục Rủi ro). Không có phí máy chủ hàng tháng.

---

## Phase 1 — Bản nháp demo (đã hoàn thành)

Chạy được ngay, dữ liệu mẫu ~70 từ / 10 câu (chưa duyệt).

- [x] Giao diện theo Minimal UI: menu trái, thẻ bo góc, bóng mềm; màu đỏ – vàng – đen thổ cẩm, viền hoạ tiết thổ cẩm
- [x] **Học thẻ quẹt có chấm điểm**: quẹt phải = thuộc (+10, đúng liên tiếp +5), quẹt trái = chưa thuộc (thẻ quay lại sau 3–5 thẻ); lật thẻ xem nghĩa, ví dụ, ghi chú; tổng kết + pháo giấy
- [x] **Thử thách quẹt 60 giây**: từ Ê-đê + một nghĩa, quẹt Đúng/Sai; đúng liên tiếp nhân điểm x2, x3; lưu kỷ lục
- [x] **Luyện dịch có chấm điểm**: Việt ↔ Ê-đê, dịch từ hoặc câu; Đúng / Gần đúng / Sai; tô màu từng từ; nhắc lỗi dấu thanh, thiếu dấu trăng, thiếu "ôh" trong câu phủ định; gợi ý (−3đ)
- [x] **Dịch thông minh**: khớp câu mẫu trước, không có thì dịch theo cụm từ dài nhất + luật phủ định `amâo … ôh`; hiệu ứng "đang phân tích", hiện độ tin cậy và phân tích từng từ
- [x] Bảng chữ cái 38 chữ (lọc nguyên âm / phụ âm / chữ riêng Ê-đê), từ điển tra không dấu
- [x] Ô nhập có thanh phím Ê-đê + gõ tắt `chữ + 0` (b0 → ƀ)
- [x] Điểm XP, chuỗi ngày học, mục tiêu ngày, cấp độ — lưu trên máy
- [x] Nút nghe tự hiện khi có file âm thanh (chưa có thì hiện biểu tượng tắt tiếng)
- [x] 17 kiểm thử tự động cho bộ chấm, bộ dịch và xử lý chữ Ê-đê
- [x] GitHub Actions build file `.exe` Windows

## Phase 2 — Nội dung thật + âm thanh (4 triệu)

Khách gửi:
1. File Excel theo mẫu: từ vựng (Ê-đê, nghĩa, từ loại, chủ đề, ghi chú) và câu (Ê-đê, tiếng Việt, các cách dịch đúng khác).
2. Thư mục âm thanh, tên file = mã từ/mã câu (ví dụ `w001.mp3`, `s001.mp3`, `l-ƀ.mp3` cho chữ cái).
3. Xác nhận: thứ tự chữ o/ô/ơ, bảng gõ tắt `chữ + 0`, ghi chú phát âm từng chữ cái.

Bên mình làm:
- [ ] Công cụ chuyển Excel → dữ liệu app (kiểm tra trùng mã, thiếu nghĩa, chuẩn hoá Unicode)
- [ ] Nạp tối đa **500 từ + 100 câu**, gắn âm thanh
- [ ] 1 vòng chỉnh giao diện / câu chữ theo góp ý
- [ ] Bỏ nhãn "Dữ liệu mẫu" khi chuyên gia đã duyệt

## Phase 3 — Đóng gói & bàn giao (3 triệu)

- [ ] Bộ cài `.exe` + bản portable (chạy từ USB), tên, biểu tượng
- [ ] Hướng dẫn cài (kèm cách bấm "Vẫn chạy" khi Windows cảnh báo)
- [ ] Bàn giao mã nguồn + hướng dẫn cập nhật nội dung
- [ ] Bảo hành 30 ngày: sửa lỗi so với bản đã nghiệm thu

---

## Không nằm trong 10 triệu (báo giá riêng nếu cần)

| Hạng mục | Ghi chú |
|---|---|
| Nhập liệu trong app (màn quản trị) | Phase 2 dùng file Excel do bên mình nạp |
| Nhiều hồ sơ người học trên 1 máy, xuất điểm Excel | Hiện là 1 người dùng / máy |
| Microsoft Store, chữ ký số | Chi phí và thủ tục riêng |
| AI thật (Claude) để chấm/dịch theo nghĩa | Cần mạng + phí API |
| Thêm từ vượt 500 từ / 100 câu, cắt ghi âm hộ | Tính theo khối lượng |
| macOS, điện thoại, web | Code React dùng lại được phần lớn |
| Vòng sửa giao diện thứ 2 trở đi | Tính theo giờ |
