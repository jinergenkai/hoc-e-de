# Lộ trình triển khai & báo giá theo Phase

> Bản 0.2 — ứng dụng máy tính Electron, offline. Đơn giá tham khảo thị trường freelance Việt Nam 2026, 1 dev + 0.3 designer.
> Mỗi phase là **một biên bản nghiệm thu riêng**, khách dừng ở phase nào cũng có phần mềm chạy được.

## Tổng quan

| Phase | Tên | Thời gian | Báo giá (VNĐ) | Khách nhận được |
|---|---|---|---|---|
| 0 | Prototype | 1 tuần | 6 – 8 triệu | File `.exe` chạy thử: màn chính, học thẻ quẹt với 30–50 từ mẫu, 1 bài dịch từ có chấm điểm |
| 1 | **Học** | 3 tuần | 22 – 28 triệu | Thẻ quẹt hoàn chỉnh, chi tiết từ, ghi âm, bảng chữ cái/vần, tra từ, nhập nội dung từ Excel |
| 2 | **Luyện tập & chấm điểm** + hồ sơ | 3 tuần | 24 – 30 triệu | Dịch từ/câu 2 chiều có chấm, 5 dạng bài khác, bài kiểm tra, nhiều hồ sơ trên máy, tiến độ, huy hiệu, ôn tập |
| 3 | Phân phối & quản trị | 1.5 tuần | 10 – 14 triệu | Bộ cài chính thức + bản portable, gói nội dung qua USB, sửa từ trong app, xuất điểm Excel, sao lưu |
| | **Tổng gói chính (0–3)** | **~8.5 tuần** | **62 – 80 triệu** | |
| 4 | AI khi có mạng (tuỳ chọn) | 2 tuần | 15 – 20 triệu | Chấm dịch theo nghĩa, hỏi đáp tra cứu |
| 5 | Tuỳ chọn khác | báo giá riêng | | Bản macOS, tự động cập nhật qua mạng, mẫu câu giao tiếp, bản web/điện thoại dùng lại code |

**Thanh toán mỗi phase:** tạm ứng 40% khi ký → 60% khi nghiệm thu. Phase sau chỉ bắt đầu khi phase trước thanh toán đủ.

**Chi phí khác (khách tự trả, ngoài báo giá):**

| Hạng mục | Bắt buộc? | Ước tính |
|---|---|---|
| Hosting / máy chủ | Không cần (app offline) | 0đ |
| Chứng thư ký số code-signing (bỏ cảnh báo Windows) | Khuyến nghị nếu phát cho nhiều trường/cơ quan | ~5 – 10 triệu/năm |
| Claude API + máy chủ trung gian (chỉ Phase 4) | Không | vài trăm nghìn – 1 triệu/tháng tuỳ lượng dùng; đặt trần chi tiêu |

**Bảo trì sau bàn giao (tuỳ chọn):** 2 – 3 triệu/tháng (sửa lỗi, đóng gói nội dung mới ≤ 2 lần/tháng).

**So với phương án web cũ:** bỏ hosting/đăng nhập online → rẻ hơn ~25 triệu và không tốn phí hàng tháng; đổi lại không đồng bộ giữa các máy, cập nhật nội dung phải chép file.

---

## Phase 0 — Prototype (1 tuần)

- [ ] Chốt danh sách chủ đề, mẫu Excel nội dung, bảng chữ cái chuẩn, công thức điểm
- [ ] Khung Electron + React + MUI + theme Minimal (màu thổ cẩm)
- [ ] Màn chính, danh sách chủ đề, **học thẻ quẹt** đúng mô tả của khách (quẹt qua = thuộc, chưa thuộc = trộn lại)
- [ ] 1 bài **dịch từ Việt ↔ Ê đê có chấm điểm** chạy thật
- [ ] Thử font, thanh phím Ê đê, gõ cùng Unikey trên máy Windows thật
- [ ] Xuất file `.exe` gửi khách

**Nghiệm thu:** khách cài trên máy mình, bấm thử, duyệt giao diện bằng văn bản/tin nhắn.

## Phase 1 — Học (3 tuần)

- [ ] L-01 → L-07 (xem `01-requirements.md`)
- [ ] Trình phát ghi âm, nút nghe chậm
- [ ] Tra từ 2 chiều, không dấu, gợi ý gần đúng
- [ ] Chế độ quản trị: nhập Excel từ vựng/câu/đáp án chấp nhận, nhập thư mục ghi âm (C-01 → C-03)
- [ ] Phím tắt toàn app

**Nghiệm thu:** khách tự nhập ≥ 300 từ qua Excel và học được bằng thẻ quẹt trên máy không có mạng.

## Phase 2 — Luyện tập & chấm điểm (3 tuần)

- [ ] Bộ sinh câu hỏi + **bộ chấm điểm offline** (đúng / gần đúng / sai, tô màu từng từ cho dịch câu), có unit test
- [ ] P-01 → P-07
- [ ] Nút "Tôi đúng mà" lưu đề xuất đáp án
- [ ] Hồ sơ nhiều người trên 1 máy, tiến độ, biểu đồ điểm, chuỗi ngày, huy hiệu, ôn tập ngắt quãng, xếp hạng trong máy (U-01 → U-05)

**Nghiệm thu:** mỗi dạng bài chạy với ≥ 3 chủ đề; bộ 50 câu chấm mẫu do khách soạn cho kết quả khớp mong đợi ≥ 90%.

## Phase 3 — Phân phối & quản trị (1.5 tuần)

- [ ] Bộ cài `.exe` chính thức (biểu tượng, tên, gỡ cài đặt) + bản portable
- [ ] Ký số nếu khách có chứng thư
- [ ] Gói nội dung `.ede`: xuất từ máy người soạn, nhập trên máy khác (C-05)
- [ ] Sửa/xoá từng từ trong app (C-04), duyệt đề xuất "Tôi đúng mà" (C-06)
- [ ] Xuất kết quả học ra Excel (U-06), sao lưu/khôi phục tiến độ (U-07)
- [ ] Tài liệu hướng dẫn cài đặt + quản trị, 1 buổi hướng dẫn online

**Nghiệm thu:** cài sạch trên 2 máy Windows khác nhau; chuyển nội dung mới từ máy A sang máy B bằng USB thành công.

## Phase 4 — AI khi có mạng (tuỳ chọn, 2 tuần)

- [ ] Máy chủ trung gian nhỏ giữ khoá API (Vercel free hoặc tương đương), giới hạn số lượt
- [ ] AI-01 chấm dịch theo nghĩa, AI-02 hỏi đáp dựa trên từ điển, AI-03 gợi ý đáp án chấp nhận
- [ ] Tự ẩn khi mất mạng

---

## Gợi ý đàm phán

1. Phase 0 là phase "bán hàng": khách cài và bấm thử trên máy thật thì dễ chốt Phase 1–2.
2. Gói 0–3 ký một lần → có thể giảm ~10%.
3. Thay đổi phạm vi giữa phase: 250 – 400k/giờ, báo trước khi làm.
4. Tiến độ tính từ ngày nhận đủ nội dung (mục 6 của `01-requirements.md`).
5. Bàn giao mã nguồn khi thanh toán đủ phase cuối khách chọn.
