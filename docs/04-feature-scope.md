# Giải thích tính năng & giới hạn phạm vi

> Tài liệu dùng khi ngồi với khách: mỗi tính năng ghi rõ **người dùng thấy gì**, **trong giá có gì**, **ngoài giá là gì**. Điều gì không ghi trong cột "Bao gồm" thì coi là ngoài phạm vi, làm thêm sẽ báo giá riêng.

## A. Quy tắc chung cho mọi phase

| Hạng mục | Giới hạn trong giá |
|---|---|
| Sửa giao diện | 2 vòng góp ý cho mỗi phase. Từ vòng thứ 3 tính theo giờ |
| Thiết bị kiểm thử | iPhone (Safari) + Android (Chrome) + máy tính (Chrome/Edge/Safari) bản mới. Không hỗ trợ trình duyệt cũ (iOS < 16, Internet Explorer, trình duyệt Cốc Cốc bản cũ…) |
| Ngôn ngữ giao diện | Chỉ tiếng Việt. Nội dung học là Ê đê ↔ Việt |
| Nội dung | **Khách cung cấp** từ vựng, câu ví dụ, ghi âm, ảnh. Bên mình chỉ nhập 1 lần dữ liệu mẫu (≤ 50 từ) để demo |
| Bảo hành | 30 ngày sau nghiệm thu: sửa lỗi sai so với tài liệu, miễn phí. Không gồm tính năng mới |
| Hỗ trợ | Giờ hành chính, phản hồi trong 1 ngày làm việc |
| Tài khoản dịch vụ | Vercel, Anthropic (AI), tên miền đứng tên khách; khách trả phí dịch vụ |
| Bàn giao | Mã nguồn + hướng dẫn quản trị (1 buổi online + tài liệu) khi thanh toán đủ |

---

## B. Khu vực HỌC (Phase 1)

### B1. Trang chủ
**Người dùng thấy:** lời chào, ô "Tiếp tục học" (chủ đề đang dở), "Từ của ngày", danh sách chủ đề dạng thẻ có ảnh và % đã học.
- **Bao gồm:** "Từ của ngày" chọn ngẫu nhiên mỗi ngày từ kho từ vựng; % đã học tính trên máy người dùng.
- **Không bao gồm:** banner quảng cáo, tin tức/blog, thông báo đẩy (push notification).

### B2. Chủ đề từ vựng
**Người dùng thấy:** bấm vào một chủ đề (VD "Gia đình") → danh sách từ, mỗi dòng có từ Ê đê, nghĩa, nút loa.
- **Bao gồm:** không giới hạn số chủ đề/số từ (thực tế tối ưu cho ≤ 5.000 từ); sắp xếp thứ tự chủ đề trong admin; lọc theo cấp độ 1–3.
- **Không bao gồm:** chủ đề có khoá/trả phí, lộ trình bắt buộc học theo thứ tự (mở khoá dần) — có thể làm ở Phase 3.

### B3. Thẻ từ vựng (trang chi tiết từ)
**Người dùng thấy:** từ Ê đê chữ lớn, nút loa phát giọng người bản ngữ, phiên âm gợi ý, nghĩa tiếng Việt, từ loại, 1–3 câu ví dụ (có loa nếu có ghi âm), ảnh minh hoạ, ghi chú văn hoá; nút ⭐ lưu từ.
- **Bao gồm:** mỗi từ có đường link riêng để chia sẻ và để Google tìm thấy; phát lại chậm (0.75x).
- **Không bao gồm:**
  - **Giọng đọc máy (text-to-speech) tiếng Ê đê** — hiện không có công nghệ nào đọc tiếng Ê đê chuẩn. Từ không có file ghi âm sẽ **ẩn nút loa**.
  - **Chấm điểm phát âm** (người dùng nói vào micro, máy chấm) — không có mô hình nhận dạng giọng Ê đê. Có thể làm "ghi âm để tự nghe lại so sánh" ở Phase 5 nếu khách muốn.
  - Ảnh minh hoạ do khách cung cấp hoặc mua; bên mình không vẽ.

### B4. Học bằng thẻ lật (flashcard)
**Người dùng thấy:** mặt trước là từ Ê đê (hoặc tiếng Việt), chạm để lật; vuốt phải "Đã thuộc", vuốt trái "Chưa thuộc".
- **Bao gồm:** chọn chiều Ê đê→Việt hoặc ngược lại; xáo trộn; chỉ ôn từ chưa thuộc.
- **Giới hạn:** Phase 1 lưu trên trình duyệt — **xoá dữ liệu trình duyệt hoặc đổi máy là mất**. Đồng bộ giữa các máy ở Phase 3.

### B5. Bảng chữ cái & phiên âm
**Người dùng thấy:** lưới các chữ cái, nguyên âm, phụ âm; chạm vào chữ → nghe âm + 2–3 từ ví dụ; ghi chú "gần giống âm … trong tiếng Việt".
- **Bao gồm:** 1 bộ chữ cái/vần **theo chuẩn khách chọn** (có nhiều cách viết Ê đê khác nhau, mình không tự quyết chuẩn).
- **Bao gồm (nên có):** bài "cặp âm dễ nhầm" (VD ĕ / e), nghe 2 từ rồi chọn đúng.
- **Không bao gồm:** video hướng dẫn khẩu hình, hình động miệng lưỡi.

### B6. Tra từ điển
**Người dùng thấy:** ô tìm kiếm ở thanh dưới; gõ tiếng Việt hoặc Ê đê, kết quả hiện ngay khi gõ.
- **Bao gồm:** tìm 2 chiều; **gõ không dấu vẫn ra** ("buon" → "ƀuôn"); gợi ý gần đúng khi gõ sai 1 ký tự.
- **Giới hạn:** chỉ tìm trong kho từ của dự án. Tìm "theo ý" (VD "con vật nuôi trong nhà") là tính năng AI ở Phase 4.

### B7. Từ đã lưu
- **Bao gồm:** danh sách từ đã ⭐, học flashcard riêng từ đã lưu.
- **Giới hạn:** như B4 — lưu trên máy cho tới Phase 3.

### B8. Trang quản trị nội dung (admin)
**Khách thấy:** trang `/admin` đăng nhập bằng mật khẩu → tải file Excel/CSV từ vựng lên → hệ thống báo dòng lỗi (thiếu nghĩa, trùng mã…) → bấm "Xuất bản" → web cập nhật sau ~1 phút. Tải nhiều file ghi âm cùng lúc (tên file = mã từ).
- **Bao gồm:** 1 mẫu file Excel cố định; tối đa 3 tài khoản admin; tự nén ghi âm cho nhẹ.
- **Không bao gồm (Phase 1):** sửa từng từ trực tiếp trên web, ghi âm trên web, phân quyền nhiều cấp (người soạn / người duyệt), lịch sử chỉnh sửa. Sửa 1 từ = sửa file Excel rồi tải lại. Sửa trực tiếp có ở Phase 3.

---

## C. Khu vực LUYỆN TẬP (Phase 2)

Cách chơi chung: người dùng chọn **chủ đề** + **chiều dịch** (Ê đê→Việt hoặc Việt→Ê đê) → 10 câu → màn kết quả. Câu hỏi được **máy tự sinh từ kho từ vựng**, khách không cần soạn từng bài.

| Dạng bài | Người dùng làm gì | Máy chấm thế nào | Giới hạn |
|---|---|---|---|
| **Ghép cặp** | 5 từ bên trái, 5 nghĩa bên phải, chạm để nối | Đúng/sai từng cặp + thời gian | Không kéo-thả dây nối, chỉ chạm chọn (dễ dùng trên điện thoại hơn) |
| **Trắc nghiệm** | Chọn 1 trong 4 nghĩa | Đúng/sai | Đáp án nhiễu lấy ngẫu nhiên trong cùng chủ đề |
| **Nghe & chọn** | Nghe ghi âm → chọn từ | Đúng/sai | Chỉ dùng từ **có** ghi âm |
| **Điền nghĩa** | Gõ nghĩa của từ | So khớp "mềm": bỏ qua hoa/thường, khoảng trắng, dấu câu; chấp nhận mọi nghĩa trong danh sách | Gõ **đồng nghĩa không có trong danh sách** sẽ bị chấm sai → khách nên nhập đủ các nghĩa |
| **Điền khuyết** | Câu ví dụ thiếu 1 từ, gõ từ còn thiếu | So khớp mềm | Chỉ dùng từ có câu ví dụ |
| **Sắp xếp câu** | Chạm các từ theo đúng thứ tự | Đúng thứ tự | Chỉ chấp nhận **1 thứ tự đúng** như câu mẫu |
| **Dịch câu** | Gõ bản dịch cả câu | Phase 2: so với các đáp án mẫu khách nhập, hiện % giống | **Máy không hiểu nghĩa**: dịch đúng nhưng diễn đạt khác đáp án mẫu sẽ chỉ được điểm một phần. Muốn chấm "hiểu nghĩa" → Phase 4 (AI) |

**Bàn phím ảo Ê đê:** dải phím `ƀ č đ ñ ă â ĕ ê ĭ ŏ ô ơ ŭ ư …` hiện trên ô nhập. Không làm bộ gõ cài vào điện thoại (kiểu Laban Key).

**Tính điểm:** đúng 10đ, đúng ngay lần đầu +2, chuỗi ≥ 5 câu đúng ×1.2, dùng gợi ý −3. Khách có thể đổi công thức trước khi làm, đổi sau khi nghiệm thu tính là yêu cầu mới.

**Màn kết quả:** điểm, số đúng/sai, thời gian, các câu sai kèm đáp án đúng + nút nghe, nút "Luyện lại câu sai".

**Không bao gồm (Phase 2):** đấu với người khác, giới hạn mạng/"tim" như Duolingo, bài tập do giáo viên giao cho lớp, in đề ra giấy, xuất điểm ra Excel.

---

## D. Tài khoản cá nhân (Phase 3)

| Tính năng | Người dùng thấy | Giới hạn |
|---|---|---|
| Đăng nhập | Nút "Đăng nhập với Google" | Chỉ Google (+ tuỳ chọn link qua email). **Không** có Facebook, Zalo, số điện thoại/OTP — mỗi cái thêm là báo giá riêng (Zalo/SMS có phí và thủ tục) |
| Học không cần tài khoản | Vẫn học bình thường; khi đăng nhập, tiến độ trên máy được gộp vào tài khoản | — |
| Hồ sơ | Tên, ảnh, mục tiêu mỗi ngày | — |
| Tiến độ | % từng chủ đề, số từ đã thuộc, lịch sử bài làm | Lưu lịch sử 12 tháng gần nhất |
| Chuỗi ngày học & huy hiệu | 🔥 số ngày liên tiếp, điểm XP, ~10 huy hiệu định sẵn | Không nhắc học qua thông báo đẩy/email (có thể thêm ở Phase 5) |
| Ôn tập thông minh | "Hôm nay cần ôn 12 từ" — từ hay sai sẽ hiện lại sớm hơn | Thuật toán chuẩn SM-2, không tuỳ biến theo từng người |
| Kiểm tra cuối chủ đề | 20 câu trộn, ≥ 80% được huy hiệu chủ đề | Không cấp chứng chỉ có giá trị pháp lý |
| Bảng xếp hạng tuần | Top người học theo XP | **Chỉ có nếu khách chọn phương án B** (thêm CSDL Neon miễn phí). Chỉ dùng Blob thì không làm được |
| Xoá tài khoản | Nút xoá + tải dữ liệu của tôi | Theo Nghị định 13/2023 |
| Admin | Danh sách người dùng, khoá tài khoản, sửa từng từ trên web | Không có quản lý lớp học/giáo viên–học sinh |

**Sức chứa trên gói miễn phí:** thoải mái vài nghìn người dùng/tháng. Lớn hơn thì nâng gói dịch vụ, không cần sửa code.

---

## E. Trợ lý AI (Phase 4)

**Nguyên tắc cần nói rõ với khách:** AI (Claude) **không thật sự biết tiếng Ê đê**. Mình cho AI "đọc" từ điển của dự án mỗi lần trả lời, nên AI **chỉ giỏi bằng từ điển khách nhập**. Từ điển càng đầy đủ, AI càng tốt.

| Tính năng | Ví dụ | AI làm được | AI không làm được |
|---|---|---|---|
| Hỏi đáp | "Cảm ơn tiếng Ê đê nói sao?" | Trả lời tiếng Việt, dẫn mục từ điển, có nút nghe | Trả lời từ **không có** trong từ điển → nói "chưa có dữ liệu", không tự bịa |
| Tra theo ý | "các từ về lúa gạo" | Tìm các từ liên quan theo nghĩa | — |
| Giải thích | "ĕ khác e thế nào?" | Giải thích dựa trên ghi chú bảng chữ cái | Giải thích ngữ pháp sâu nếu khách chưa cung cấp tài liệu |
| Chấm dịch câu | Người dùng dịch 1 câu | Điểm 0–100, chỉ lỗi, gợi ý bản đúng, chấp nhận cách diễn đạt khác | Đảm bảo đúng 100%. Câu càng xa câu mẫu, độ tin cậy càng thấp |
| Gợi ý bài tập cho giáo viên | Chọn chủ đề → AI đề xuất câu ví dụ | Bản nháp để **người biết tiếng Ê đê duyệt** | Tự đăng lên web không qua duyệt |
| **Không làm** | Dịch cả đoạn văn/tài liệu dài, nói chuyện bằng giọng nói, dịch ảnh chụp | | |

**Giới hạn sử dụng (để kiểm soát chi phí):** khách vãng lai 10 câu/ngày, người có tài khoản 30 câu/ngày (khách chọn con số). Có trần chi tiêu tháng; vượt trần thì AI tạm tắt tới tháng sau. Chi phí AI do khách trả trực tiếp cho Anthropic.

**Nghiệm thu AI:** khách soạn 30 câu hỏi thử; đạt khi ≥ 90% câu trả lời đúng theo từ điển **hoặc** từ chối đúng lúc. Không cam kết "AI trả lời đúng mọi câu".

---

## F. Những yêu cầu khách hay "nói thêm" — cần báo trước là NGOÀI phạm vi

| Yêu cầu | Lý do / cách xử lý |
|---|---|
| App trên App Store / CH Play | Ngoài phạm vi. Phase 5 có PWA (cài từ trình duyệt ra màn hình chính, trông như app). App thật là dự án riêng |
| Giọng đọc máy tiếng Ê đê | Chưa có công nghệ; dùng ghi âm người thật |
| Chấm phát âm qua micro | Chưa có công nghệ cho tiếng Ê đê |
| Thu phí người học, thanh toán MoMo/VNPay | Dự án riêng; cần Vercel Pro + thủ tục cổng thanh toán |
| Quản lý lớp học, giáo viên giao bài, chấm bài cho học sinh | Dự án riêng (có thể là Phase 6) |
| Nhập liệu nội dung hộ (gõ từ điển, cắt ghi âm) | Tính theo giờ hoặc gói riêng |
| Song ngữ Ê đê ↔ Anh, giao diện tiếng Anh | Tính thêm |
| Diễn đàn, bình luận, chat giữa người học | Tính thêm; cần người kiểm duyệt nội dung |
| Thiết kế logo, nhận diện thương hiệu, vẽ minh hoạ | Thuê designer riêng |
| Hỗ trợ 24/7, cam kết uptime | Phụ thuộc Vercel; gói bảo trì không gồm trực đêm |

---

## G. Câu trả lời mẫu khi khách hỏi

- **"Sao không có giọng đọc tự động?"** → Hiện chưa có công nghệ đọc chuẩn tiếng Ê đê; giọng máy đọc sai còn hại hơn không có. Ghi âm người bản ngữ là cách đúng và là giá trị riêng của sản phẩm.
- **"AI có tự dạy tiếng Ê đê được không?"** → AI chỉ trả lời dựa trên từ điển anh/chị nhập. Nó là trợ lý tra cứu thông minh, không phải giáo viên bản ngữ.
- **"Dùng miễn phí mãi được không?"** → Được, nếu web phi lợi nhuận và lượng người dùng vừa phải. Có thu tiền hoặc quảng cáo thì cần gói Vercel Pro ~500k/tháng.
- **"Thêm cái này cái kia được không?"** → Được, ghi lại vào danh sách yêu cầu mới, báo giá khi xong phase hiện tại để không trễ tiến độ.
