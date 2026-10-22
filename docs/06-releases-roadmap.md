# Phát hành theo đợt & danh mục mở rộng

> 22/10/2026 · Dùng nội bộ: lịch công bố tính năng cho khách, gắn với các mốc thanh toán trong `02-phases-pricing.md`, và danh mục tính năng bán thêm.

## 1. Cơ chế kỹ thuật

Mỗi bản build chỉ bật các tính năng tới đợt được chọn. Tính năng chưa mở hiện thành mục **🔒 Sắp ra mắt** (menu trái + thẻ "Sắp ra mắt" ở trang chủ) để khách thấy còn nhiều thứ phía trước.

| Biến build | Ý nghĩa | Ví dụ |
|---|---|---|
| `VITE_RELEASE` | Bật tính năng tới đợt N (1–6). Bỏ trống = đầy đủ | `VITE_RELEASE=2` |
| `VITE_PREVIEW=1` | Nhãn góc màn hình "BẢN XEM TRƯỚC · ĐỢT N/6" | |
| `VITE_EXPIRES` | Bản xem trước khoá lại sau ngày này | `VITE_EXPIRES=2026-11-15` |
| `VITE_TEASERS=0` | Ẩn hẳn tính năng chưa mở (không hiện "Sắp ra mắt") | |

**Build file .exe theo đợt:** GitHub → tab **Actions** → **Build Windows app** → **Run workflow** → nhập đợt, tick "Bản xem trước", nhập ngày hết hạn → tải file ở mục **Artifacts** khi chạy xong.

Chạy thử trên máy: `VITE_RELEASE=1 VITE_PREVIEW=1 npm run dev`.

> Hạn dùng dựa trên đồng hồ máy tính, chỉ có tác dụng nhắc nhở (người rành máy có thể chỉnh giờ để lách). Bản chính thức (không nhãn, không hạn) chỉ gửi khi đã thanh toán đủ.

## 2. Sáu đợt công bố

| Đợt | Tên | Tính năng mở | Điểm "wow" khi demo |
|---|---|---|---|
| 1 | Làm quen | Học thẻ quẹt có chấm điểm, bảng chữ cái 38 chữ | Quẹt thẻ, pháo giấy, chiêng điểm; bảng chữ có chữ riêng Ê-đê |
| 2 | Thử thách & điểm thưởng | Thử thách quẹt 60 giây, XP, chuỗi ngày 🔥, mục tiêu ngày, cấp độ | Đếm ngược 3-2-1, nhân điểm x2 x3, kỷ lục |
| 3 | Luyện dịch từ | Gõ nghĩa Việt ↔ Ê-đê, chấm đúng / gần đúng / sai; từ điển tra không dấu | Gõ thiếu dấu → "Gần đúng" + chỉ chỗ sai; gõ `b0` ra ƀ |
| 4 | Luyện dịch câu | Dịch cả câu, chấm %, tô màu từng từ, nhắc lỗi `amâo … ôh` | Tô màu xanh/vàng/đỏ từng từ |
| 5 | Dịch thông minh | Dịch Việt ↔ Ê-đê, hiệu ứng "đang phân tích", độ tin cậy, tách từ | Gõ câu → chữ hiện dần như AI |
| 6 | Nhiều người học | Màn "Ai đang học hôm nay?", mỗi người 1 hồ sơ, bảng xếp hạng trên máy | Phòng máy dùng chung, thi đua |

## 3. Lịch đề xuất gắn với tiền

| Tuần | Gửi khách | Mốc thanh toán |
|---|---|---|
| 1 | Đợt 1 — bản xem trước, hạn 2 tuần | — |
| 2 | Đợt 2 | **Phase 1: 3 triệu** (sau khi khách ưng đợt 1–2) |
| 3 | Đợt 3 — đồng thời nhận file Excel từ vựng + âm thanh | — |
| 4 | Đợt 4 — đã nạp nội dung thật | — |
| 5 | Đợt 5 — đã gắn âm thanh | **Phase 2: 4 triệu** |
| 6 | Bản chính thức (không nhãn, không hạn) + bộ cài + hướng dẫn | **Phase 3: 3 triệu** |
| sau | Đợt 6 "Nhiều người học" — **bán thêm** (mục 4) | 1,5 – 2 triệu |

Mẹo khi demo:
- Mỗi lần chỉ demo **1 đợt**, nhấn vào 1–2 điểm "wow" ở bảng trên; để mục 🔒 Sắp ra mắt tự tạo tò mò.
- Gửi video quay màn hình 30–60 giây trước, file `.exe` sau.
- Ghi lại góp ý của khách sau mỗi đợt; góp ý ngoài phạm vi → đưa vào danh mục mở rộng (mục 4), báo giá riêng.

## 4. Danh mục tính năng mở rộng (bán thêm)

Giá tham khảo cùng mặt bằng gói 10 triệu. ✅ = đã có sẵn trong code, chỉ cần bật.

| Tính năng | Mô tả ngắn | Giá tham khảo |
|---|---|---|
| ✅ Nhiều người học trên 1 máy | Hồ sơ riêng, chọn người khi mở app, bảng xếp hạng trong máy | 1,5 – 2tr |
| Mã PIN hồ sơ | Mỗi người đặt PIN 4 số, tránh học "hộ" | 0,5tr |
| Xuất điểm ra Excel | Giáo viên thu điểm cả phòng máy | 1 – 1,5tr |
| Chế độ giáo viên | Tạo bài kiểm tra từ danh sách từ, đặt thời gian, xem kết quả từng học viên trên máy | 3 – 4tr |
| Nhập liệu trong app | Màn quản trị: thêm/sửa từ, câu, nhập Excel, không cần nhờ dev | 2 – 3tr |
| Ghi âm trong app | Người soạn ghi âm trực tiếp cho từng từ, tự cắt khoảng lặng | 1,5 – 2tr |
| Gói nội dung qua USB | Xuất/nhập 1 file nội dung để cập nhật nhiều máy không cần mạng | 1 – 1,5tr |
| Ôn tập thông minh | "Hôm nay cần ôn 12 từ" — từ hay sai hiện lại sớm hơn | 1 – 1,5tr |
| Huy hiệu & thành tích | Huy hiệu hoạ tiết thổ cẩm khi hoàn thành chủ đề, chuỗi 7/30 ngày | 1 – 1,5tr |
| Giấy chứng nhận | In PDF "Hoàn thành chủ đề / khoá học" có tên người học | 1tr |
| Trò chơi thêm | Ghép cặp, nghe & chọn (cần âm thanh), sắp xếp câu | 1 – 1,5tr / trò |
| Mẫu câu giao tiếp | Bộ câu theo tình huống: chào hỏi, đi chợ, khám bệnh, hỏi đường | 1,5tr (+ nội dung khách cung cấp) |
| Góc văn hoá | Thẻ giới thiệu nhà dài, cồng chiêng, lễ hội, thổ cẩm kèm từ vựng liên quan | 1,5 – 2tr (+ nội dung) |
| Truyện song ngữ | Đoạn văn ngắn Ê-đê ↔ Việt, bấm từ để tra nghĩa | 2tr (+ nội dung) |
| Chế độ tối | Giao diện nền tối thổ cẩm | 0,5 – 1tr |
| Microsoft Store / chữ ký số | Hết cảnh báo khi cài trên Windows | 1tr công + phí của khách |
| Bản web / điện thoại | Dùng lại giao diện React, thêm bố cục di động | báo giá riêng |
| AI thật (cần mạng) | Chấm dịch theo nghĩa, hỏi đáp | báo giá riêng + phí API |
