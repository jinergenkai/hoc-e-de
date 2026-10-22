# Lộ trình triển khai & báo giá theo Phase

> Đơn giá tham khảo thị trường freelance/agency nhỏ tại Việt Nam (2026), 1 dev full-stack + 0.3 designer. Điều chỉnh theo năng lực và quan hệ với khách.
> Mỗi phase là **một hợp đồng/biên bản nghiệm thu riêng** → khách có thể dừng sau bất kỳ phase nào mà vẫn có sản phẩm chạy được.

## Tổng quan

| Phase | Tên | Thời gian | Báo giá (VNĐ) | Kết quả demo cho khách |
|---|---|---|---|---|
| 0 | Khảo sát + Prototype UI | 1 tuần | 6 – 8 triệu | Link Vercel chạy được, bấm thử các màn hình với dữ liệu mẫu |
| 1 | MVP **Học** | 3 tuần | 22 – 30 triệu | Từ vựng, phát âm, bảng chữ/vần, tra từ, admin nhập CSV |
| 2 | **Luyện tập** + chấm điểm | 2.5 tuần | 18 – 25 triệu | 7 dạng bài, màn kết quả, lưu điểm trên máy |
| 3 | **Tài khoản** + tiến độ | 2 tuần | 15 – 20 triệu | Đăng nhập Google, đồng bộ tiến độ, streak, SRS, huy hiệu |
| 4 | **Trợ lý AI** | 2 tuần | 18 – 25 triệu | Chat hỏi đáp có nguồn, chấm dịch câu bằng AI |
| 5 | Hoàn thiện (tuỳ chọn) | 1.5 tuần | 10 – 15 triệu | PWA offline, thống kê admin, ghi âm trong CMS, ngữ pháp |
| | **Tổng** | **~12 tuần** | **89 – 123 triệu** | |

**Điều khoản thanh toán đề xuất cho mỗi phase:** tạm ứng 40% khi ký → 60% khi nghiệm thu (demo trên link Vercel + checklist bên dưới). Phase sau chỉ bắt đầu khi phase trước đã thanh toán đủ.

**Chi phí vận hành (khách tự trả, ngoài báo giá):**

| Hạng mục | Free | Khi lớn lên |
|---|---|---|
| Vercel hosting | Hobby 0đ (chỉ phi thương mại) | Pro ~20 USD/tháng |
| Vercel Blob | Gói free của Vercel (kiểm tra hạn mức hiện hành khi deploy) | Trả theo dung lượng/băng thông |
| DB người dùng (Phase 3) | Neon Postgres free qua Vercel Marketplace | Nâng gói khi > vài nghìn user |
| Claude API (Phase 4) | — | Ước tính vài trăm nghìn đến 1–2 triệu/tháng cho vài trăm người dùng tích cực với Haiku; đặt trần chi tiêu |
| Tên miền .vn / .com | — | ~300k – 800k/năm |

**Bảo trì sau bàn giao (tuỳ chọn):** 2 – 4 triệu/tháng (sửa lỗi, cập nhật thư viện, nhập nội dung hộ ≤ 2 giờ/tháng).

---

## Phase 0 — Khảo sát & Prototype UI (1 tuần)

Mục tiêu: chốt giao diện và cảm nhận sản phẩm trước khi tốn tiền làm thật. **Đây là phase dùng để demo bán hàng.**

- [ ] Workshop 1 buổi chốt danh sách chủ đề, mẫu Google Sheet nội dung, bảng chữ cái chuẩn
- [ ] Khởi tạo Next.js + MUI + theme Minimal (màu thương hiệu Ê đê, xem `03-design-system.md`)
- [ ] Layout mobile: bottom nav (Học · Luyện tập · Tra từ · Tôi), desktop: sidebar
- [ ] Màn hình tĩnh với 30–50 từ mẫu: Trang chủ, Chủ đề, Thẻ từ, Bảng chữ cái, 1 bài Match chạy thật
- [ ] Test font + bàn phím ảo trên iPhone và Android
- [ ] Deploy Vercel, gửi link

**Nghiệm thu:** link chạy trên điện thoại khách; khách duyệt màu sắc/bố cục bằng văn bản.

## Phase 1 — MVP Học (3 tuần)

- [ ] L-01 → L-07, L-10 (bookmark lưu trên máy)
- [ ] Đọc nội dung từ Vercel Blob, render tĩnh + ISR, URL SEO `/tu-dien/[slug]`
- [ ] Trình phát audio dùng chung, cache, tải lười
- [ ] Tìm kiếm 2 chiều, không dấu, gợi ý khi gõ (tìm phía client trên `search-index.json`)
- [ ] Admin `/admin` (đăng nhập bằng mật khẩu/biến môi trường): C-01, C-02, C-04
- [ ] Trang Giới thiệu, Liên hệ, Chính sách quyền riêng tư

**Nghiệm thu:** khách tự nhập ≥ 300 từ qua CSV, thấy hiển thị trên site; Lighthouse mobile ≥ 90.

## Phase 2 — Luyện tập & chấm điểm (2.5 tuần)

- [ ] Bộ máy sinh câu hỏi từ kho từ vựng theo chủ đề + chiều dịch
- [ ] P-01 → P-07 (P-07 chấm theo đáp án chấp nhận + độ tương đồng)
- [ ] Bàn phím ảo Ê đê cho mọi ô nhập
- [ ] So khớp mềm: NFC, hoa/thường, dấu câu, tuỳ chọn bỏ qua breve
- [ ] Màn kết quả + "Luyện lại câu sai"; lịch sử điểm lưu localStorage
- [ ] Hiệu ứng đúng/sai, rung nhẹ trên mobile, âm báo (tắt được)

**Nghiệm thu:** mỗi dạng bài chạy với ≥ 3 chủ đề; checklist test trên 2 điện thoại thật.

## Phase 3 — Tài khoản & tiến độ (2 tuần)

- [ ] Đăng nhập Google (Auth.js), gộp tiến độ khách vãng lai khi đăng nhập
- [ ] A-03 → A-05, P-08 (SRS), P-09 (kiểm tra cuối chủ đề + huy hiệu)
- [ ] Đồng bộ bookmark, lịch sử bài làm
- [ ] Xoá tài khoản, xuất dữ liệu của tôi
- [ ] Admin: danh sách người dùng, C-03 sửa từng mục từ

**Quyết định cần khách chọn trước khi bắt đầu Phase 3:**

| Phương án | Ưu | Nhược |
|---|---|---|
| **A. Chỉ Vercel Blob** (mỗi user 1 file `users/{id}.json`) | Đúng yêu cầu "chỉ dùng Blob", 0 thêm dịch vụ | Không có bảng xếp hạng, không thống kê tổng hợp, rủi ro ghi đè khi học trên 2 máy cùng lúc |
| **B. Blob cho nội dung + Neon Postgres free cho user** (khuyến nghị) | Bảng xếp hạng, thống kê, an toàn dữ liệu; vẫn free và quản lý ngay trong Vercel | Thêm 1 dịch vụ |

## Phase 4 — Trợ lý AI (2 tuần)

- [ ] Endpoint `/api/ai/chat` stream câu trả lời, Claude Haiku 5.5
- [ ] RAG: tìm mục từ liên quan trong từ điển → đưa vào ngữ cảnh → bắt buộc trích dẫn; không có trong từ điển thì nói "chưa có dữ liệu"
- [ ] AI-03 chấm dịch câu (điểm + giải thích + bản đúng)
- [ ] AI-04 gợi ý bài tập cho giáo viên (duyệt tay)
- [ ] Rate-limit, trần chi tiêu, log câu hỏi để cải thiện từ điển, nút báo sai

**Nghiệm thu:** bộ 30 câu hỏi kiểm thử do khách soạn, ≥ 90% câu trả lời đúng nguồn hoặc từ chối hợp lý.

## Phase 5 — Hoàn thiện (tuỳ chọn, 1.5 tuần)

- [ ] PWA: cài lên màn hình chính, học offline chủ đề đã tải
- [ ] Ghi âm trực tiếp trong CMS, cắt khoảng lặng
- [ ] L-08 mẫu câu giao tiếp, L-09 ngữ pháp cơ bản
- [ ] C-06 thống kê, Google Analytics/Vercel Analytics
- [ ] Chế độ tối hoàn chỉnh

---

## Gợi ý chiến lược demo/đàm phán

1. **Làm Phase 0 trước, có thể giảm giá hoặc tính phí nhỏ** — khách cầm điện thoại bấm thử dễ chốt hơn mọi tài liệu.
2. Phase 1 + 2 là gói "sản phẩm dùng được" → có thể đề xuất **gói combo giảm ~10%** nếu ký cùng lúc.
3. Thay đổi phạm vi giữa phase (thêm dạng bài, thêm màn hình) tính theo giờ: 250 – 400k/giờ, báo trước khi làm.
4. Tiến độ tính từ ngày **nhận đủ dữ liệu** (mục 6 của `01-requirements.md`), ghi rõ trong hợp đồng.
5. Mã nguồn bàn giao khi thanh toán đủ phase cuối khách chọn; tài khoản Vercel/Anthropic đứng tên khách ngay từ đầu.
