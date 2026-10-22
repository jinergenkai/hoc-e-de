# Giải thích tính năng & giới hạn phạm vi

> **Lưu ý (bản 0.3, 22/10/2026):** ngân sách khách chốt **10 triệu** → phạm vi thực hiện xem `02-phases-pricing.md`. Tài liệu này giữ làm định hướng mở rộng.

> Bản 0.2 — ứng dụng máy tính Electron, offline. Dùng khi ngồi với khách: mỗi tính năng ghi **người dùng thấy gì**, **trong giá có gì**, **ngoài giá là gì**. Điều gì không ghi trong "Bao gồm" thì coi là ngoài phạm vi.

## A. Quy tắc chung

| Hạng mục | Giới hạn trong giá |
|---|---|
| Hệ điều hành | Windows 10/11 64-bit. **Không** gồm macOS, Linux, Windows 7/8, điện thoại, bản web |
| Mạng | Toàn bộ Học & Luyện tập chạy **không cần mạng**. Chỉ AI (Phase 4, tuỳ chọn) cần mạng |
| Sửa giao diện | 2 vòng góp ý mỗi phase; từ vòng 3 tính theo giờ |
| Ngôn ngữ giao diện | Chỉ tiếng Việt |
| Nội dung | **Khách cung cấp** từ vựng, câu ví dụ, các đáp án chấp nhận, ghi âm, ảnh. Bên mình nhập 1 lần dữ liệu mẫu (≤ 50 từ) để demo |
| Bảo hành | 30 ngày sau nghiệm thu: sửa lỗi sai so với tài liệu. Không gồm tính năng mới |
| Cài đặt tại chỗ | Hướng dẫn từ xa. Đến tận nơi cài cho phòng máy tính phí đi lại riêng |
| Bàn giao | Mã nguồn + bộ cài + hướng dẫn khi thanh toán đủ |

---

## B. HỌC (Phase 1)

### B1. Học thẻ quẹt — tính năng trọng tâm
**Người dùng thấy:** chọn chủ đề → thẻ hiện từ Ê đê (hoặc tiếng Việt). Bấm `Space` hoặc bấm vào thẻ để lật xem nghĩa. Thuộc thì quẹt phải (`→`), thẻ biến mất. Chưa thuộc thì quẹt trái (`←`), thẻ được trộn lại và quay lại sau vài thẻ. Hết thẻ thì xem tổng kết: bao nhiêu từ, từ nào phải học lại nhiều lần nhất.
- **Bao gồm:** quẹt bằng chuột kéo, phím mũi tên, màn hình cảm ứng; chọn chiều Ê đê→Việt hoặc ngược lại; nút nghe trên thẻ; chọn số thẻ mỗi lượt (10/20/30); ghi nhớ "từ khó" cho lượt sau.
- **Không bao gồm:** thẻ có ảnh động/video, tự tạo bộ thẻ riêng của người học (có thể thêm sau).

### B2. Chi tiết từ & ghi âm
**Người dùng thấy:** từ Ê đê chữ lớn, nút loa (giọng người bản ngữ), phiên âm gợi ý, nghĩa, từ loại, câu ví dụ, ảnh, ghi chú.
- **Bao gồm:** nghe chậm 0.75x.
- **Không bao gồm:** giọng đọc máy tiếng Ê đê (chưa có công nghệ — từ không có ghi âm sẽ ẩn nút loa); chấm phát âm qua micro.

### B3. Bảng chữ cái & vần
- **Bao gồm:** 1 bộ chữ cái/vần **theo chuẩn khách chọn**; bấm để nghe; 2–3 từ ví dụ mỗi âm; bài "cặp âm dễ nhầm".
- **Không bao gồm:** video khẩu hình.

### B4. Tra từ điển
- **Bao gồm:** tìm 2 chiều; gõ không dấu vẫn ra; gợi ý khi gõ sai 1 ký tự.
- **Giới hạn:** chỉ tìm trong kho từ của phần mềm.

### B5. Nhập nội dung (chế độ quản trị)
**Người soạn thấy:** vào ⚙ Quản trị (mật khẩu) → chọn file Excel → app báo dòng lỗi (thiếu nghĩa, trùng mã…) → bấm "Áp dụng" → nội dung có ngay. Chọn thư mục ghi âm → app tự ghép theo mã từ.
- **Bao gồm:** 1 mẫu Excel cố định; không giới hạn số từ (tối ưu cho ≤ 5.000 từ).
- **Không bao gồm (Phase 1):** sửa từng từ trong app (Phase 3), ghi âm trong app, phân quyền người soạn/người duyệt.

---

## C. LUYỆN TẬP & CHẤM ĐIỂM (Phase 2)

### C1. Dịch Việt ↔ Ê đê — tính năng trọng tâm thứ hai
**Người dùng thấy:** chọn chủ đề + chiều dịch → hiện 1 từ hoặc 1 câu → gõ bản dịch (có thanh phím Ê đê dưới ô nhập) → `Enter` → máy chấm ngay.

**Máy chấm như thế nào (giải thích cho khách):**

- **Dịch từ:** đúng hoàn toàn = 10 điểm. Sai 1 chữ hoặc quên dấu ă/ĕ = "gần đúng" 5 điểm, chỉ rõ chữ sai. Sai = 0 điểm, hiện đáp án đúng.
- **Dịch câu:** so với các bản dịch mẫu khách đã nhập, tính % giống (đúng từ, đúng thứ tự). Từng từ trong câu người học gõ được tô màu: xanh đúng, vàng sai chính tả nhẹ, đỏ sai, xám là chữ còn thiếu.
- Không phân biệt hoa/thường, dấu chấm phẩy, khoảng trắng thừa.

**Giới hạn phải nói thẳng với khách:**
- Máy **so với đáp án mẫu, không hiểu nghĩa**. Ví dụ đáp án mẫu là "Tôi đi chợ", người học gõ "Mình đi chợ" → chỉ được điểm một phần, trừ khi khách đã nhập "Mình đi chợ" là đáp án chấp nhận.
- Cách khắc phục trong giá: (1) mỗi câu nhập 2–4 cách dịch đúng; (2) nút **"Tôi đúng mà"** cho người học gửi đề xuất, người soạn duyệt thêm vào đáp án.
- Chấm "hiểu nghĩa" thật sự cần AI → Phase 4, cần mạng, tốn phí API.

### C2. Các dạng bài khác
Trắc nghiệm 4 đáp án, ghép cặp, nghe & chọn (chỉ với từ có ghi âm), sắp xếp câu (chỉ 1 thứ tự đúng), bài kiểm tra chủ đề 20 câu (≥ 80 điểm được huy hiệu).
- **Không bao gồm:** đấu với người khác, đề do giáo viên tự soạn từng câu, in đề ra giấy.

### C3. Hồ sơ & tiến độ trên máy
**Người dùng thấy:** mở app chọn tên mình (như Netflix), có thể đặt PIN 4 số. Xem % thuộc từng chủ đề, biểu đồ điểm theo ngày, chuỗi ngày học 🔥, huy hiệu, "hôm nay cần ôn 12 từ", bảng xếp hạng các bạn cùng máy.
- **Giới hạn:** tiến độ **chỉ nằm trên máy đó**. Đổi máy → dùng sao lưu/khôi phục (Phase 3). Không có xếp hạng giữa các máy/trường.
- **Không bao gồm:** tài khoản online, đăng nhập Google/Zalo, đồng bộ nhiều máy (cần máy chủ — dự án riêng).

---

## D. PHÂN PHỐI & QUẢN TRỊ (Phase 3)

| Tính năng | Bao gồm | Giới hạn |
|---|---|---|
| Bộ cài | `.exe` cài đặt + bản portable chạy từ USB | Chưa ký số thì Windows sẽ hiện cảnh báo "không rõ nguồn gốc" khi cài — khách bấm "Vẫn chạy". Muốn hết cảnh báo: khách mua chứng thư ký số (~5–10 triệu/năm) |
| Cập nhật nội dung | Người soạn xuất **1 file gói nội dung** → gửi qua USB/Zalo/email → máy khác bấm "Nhập" | Không tự cập nhật qua mạng (tuỳ chọn Phase 5) |
| Cập nhật phần mềm | Gửi bộ cài mới, cài đè, giữ nguyên tiến độ | Như trên |
| Sửa từ trong app | Sửa/xoá/thêm từng từ | Không có lịch sử chỉnh sửa |
| Xuất điểm | File Excel kết quả các hồ sơ trên máy | Giáo viên phải gom file từ từng máy |
| Sao lưu | Xuất/nhập file tiến độ | — |

---

## E. AI (Phase 4, tuỳ chọn, cần mạng)

- AI **không thật sự biết tiếng Ê đê** — chỉ dựa trên từ điển và câu mẫu trong app.
- Làm được: chấm dịch câu theo nghĩa (chấp nhận cách diễn đạt khác), giải thích lỗi, hỏi đáp tra cứu, gợi ý thêm đáp án cho người soạn duyệt.
- Không làm được: đảm bảo đúng 100%, trả lời từ không có trong từ điển, dịch tài liệu dài.
- Cần: khoá API Anthropic của khách + 1 máy chủ trung gian nhỏ; giới hạn lượt/ngày và trần chi tiêu tháng.
- Mất mạng → nút AI tự ẩn, chấm offline vẫn chạy.

---

## F. Yêu cầu thường bị "nói thêm" — NGOÀI phạm vi

| Yêu cầu | Xử lý |
|---|---|
| Bản điện thoại / web | Dự án riêng. Giao diện dùng React nên **tái sử dụng được phần lớn**, giảm chi phí khi làm sau |
| macOS | Báo giá thêm (cần máy Mac để đóng gói + ký số Apple) |
| Tài khoản online, đồng bộ nhiều máy, xếp hạng toàn tỉnh | Cần máy chủ → dự án riêng |
| Giọng đọc máy / chấm phát âm | Chưa có công nghệ cho tiếng Ê đê |
| Quản lý lớp, giáo viên giao bài, thu bài qua mạng | Dự án riêng |
| Nhập liệu hộ, cắt ghi âm hộ | Tính theo giờ hoặc gói riêng |
| Thiết kế logo, minh hoạ | Thuê designer riêng |
| Cài đặt tận nơi cho từng phòng máy | Phí đi lại + ngày công |

---

## G. Câu trả lời mẫu khi khách hỏi

- **"Chấm điểm có chính xác không?"** → Từ đơn chấm rất chính xác. Câu dài thì máy so với các bản dịch mẫu anh/chị nhập, nên càng nhập nhiều cách dịch đúng thì chấm càng công bằng. Có nút "Tôi đúng mà" để bổ sung dần.
- **"Có cần AI không?"** → Không bắt buộc. Bản offline đã chấm điểm được. AI chỉ giúp chấm "hiểu nghĩa" khi có mạng, và tốn phí hàng tháng.
- **"Cập nhật từ mới thế nào khi máy không có mạng?"** → Người soạn bấm xuất gói nội dung, chép USB sang máy khác, bấm nhập là xong.
- **"Sau này muốn có bản điện thoại?"** → Làm được, phần giao diện và bộ chấm điểm dùng lại, nên rẻ hơn làm mới.
