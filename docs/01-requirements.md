# Học tiếng Ê đê — Đặc tả yêu cầu (SRS)

> Phiên bản 0.1 · 22/10/2026 · Trạng thái: bản nháp để trao đổi với khách hàng

## 1. Mục tiêu & phạm vi

Website học tiếng Ê đê (Rade) cho người nói tiếng Việt, ưu tiên điện thoại (mobile first), gồm 2 khu vực chính **Học** và **Luyện tập**, mở rộng dần với **Tài khoản cá nhân** và **Trợ lý AI**.

**Đối tượng người dùng**

| Persona | Mô tả | Nhu cầu chính |
|---|---|---|
| Học viên phổ thông | Người Kinh làm việc ở Tây Nguyên (giáo viên, cán bộ, y tế, công an…) | Giao tiếp cơ bản, học nhanh trên điện thoại |
| Người Ê đê trẻ | Biết nói nhưng chưa đọc/viết chuẩn | Chữ viết, chính tả, phiên âm |
| Giáo viên / cán bộ nội dung | Người soạn bài | Nhập từ vựng, ghi âm, soạn bài tập |
| Quản trị viên | Chủ dự án | Quản lý nội dung, người dùng, thống kê |

**Ngoài phạm vi (giai đoạn đầu):** app native iOS/Android, thanh toán/thu phí trong app, nhận diện giọng nói chấm phát âm, đa ngôn ngữ giao diện ngoài tiếng Việt.

## 2. Đặc thù ngôn ngữ cần xử lý kỹ thuật

1. **Bảng chữ cái Latin có dấu riêng**: `ƀ č đ ñ ă â ĕ ê ê̆ ĭ ŏ ô ô̆ ơ ơ̆ ŭ ư ư̆` … Một số ký tự là *tổ hợp* (chữ + dấu breve kết hợp) → mọi chuỗi phải chuẩn hoá **Unicode NFC** khi lưu và khi so đáp án.
2. **Bàn phím ảo Ê đê**: điện thoại không gõ được `ƀ, č, ñ, ĕ…` → cần thanh phím phụ hiện trên ô nhập.
3. **Font**: chọn font hiển thị đúng dấu kết hợp (kiểm tra trên iOS Safari + Android Chrome). DM Sans/Barlow của Minimal cần test; dự phòng Noto Sans.
4. **Chấm đáp án mềm**: bỏ qua hoa/thường, khoảng trắng thừa, dấu câu; tuỳ chọn "chấp nhận thiếu dấu breve" ở mức dễ.
5. **Nguồn dữ liệu**: LLM hiện tại hiểu tiếng Ê đê rất hạn chế → AI phải **trả lời dựa trên từ điển của dự án (RAG)**, không tự bịa.

## 3. Yêu cầu chức năng

Mã ưu tiên: **M** = bắt buộc (Must), **S** = nên có (Should), **C** = có thì tốt (Could). Cột *Phase* tham chiếu `02-phases-pricing.md`.

### 3.1 Khu vực HỌC

| Mã | Chức năng | Chi tiết | Ưu tiên | Phase |
|---|---|---|---|---|
| L-01 | Trang chủ học | Lời chào, "tiếp tục bài đang học", danh sách chủ đề, từ của ngày | M | 1 |
| L-02 | Chủ đề từ vựng | Nhóm theo chủ đề (Chào hỏi, Gia đình, Số đếm, Màu sắc, Cơ thể, Thức ăn, Nông nghiệp, Thời gian…) có ảnh bìa, số từ, % đã học | M | 1 |
| L-03 | Thẻ từ vựng | Từ Ê đê, nghĩa tiếng Việt, từ loại, **nút phát âm (audio người bản ngữ)**, phiên âm gợi ý, 1–3 câu ví dụ Ê đê ↔ Việt (câu ví dụ cũng có audio nếu có), ảnh minh hoạ (tuỳ chọn), ghi chú văn hoá | M | 1 |
| L-04 | Chế độ lật thẻ (flashcard) | Vuốt trái/phải: "Đã thuộc / Chưa thuộc", lưu trạng thái | M | 1 |
| L-05 | Bảng chữ cái & phiên âm | Lưới chữ cái/nguyên âm/phụ âm/vần; chạm để nghe; mỗi âm có 2–3 từ ví dụ; so sánh với âm tiếng Việt gần nhất | M | 1 |
| L-06 | Bài học vần | Các vần ghép (VD: nguyên âm ngắn/dài ĕ–e, ŏ–o…), cặp tối thiểu (minimal pairs) để luyện tai | S | 1 |
| L-07 | Tra từ điển | Tìm 2 chiều Ê đê ↔ Việt, **tìm không dấu** (gõ "ƀuôn" hoặc "buon" đều ra), gợi ý khi gõ | M | 1 |
| L-08 | Mẫu câu giao tiếp | Bộ câu theo tình huống (đi chợ, khám bệnh, hỏi đường, lớp học) có audio | S | 2 |
| L-09 | Ngữ pháp cơ bản | Bài đọc ngắn: trật tự câu, đại từ, phủ định, câu hỏi | C | 5 |
| L-10 | Từ đã lưu | Bookmark từ để ôn | S | 1 (local) / 3 (đồng bộ) |

### 3.2 Khu vực LUYỆN TẬP

Mọi bài tập có 2 chiều **Ê đê → Việt** và **Việt → Ê đê**, sinh tự động từ kho từ vựng theo chủ đề đã chọn, 10 câu/lượt.

| Mã | Dạng bài | Mô tả | Chấm điểm | Phase |
|---|---|---|---|---|
| P-01 | Ghép cặp (Match) | 5 cặp từ, chạm cột trái–phải để nối; sai rung + đỏ | Đúng/sai mỗi cặp, tính thời gian | 2 |
| P-02 | Trắc nghiệm 4 đáp án | Hiện từ → chọn nghĩa | Đúng/sai | 2 |
| P-03 | Nghe & chọn | Phát audio → chọn từ đúng | Đúng/sai | 2 |
| P-04 | Điền nghĩa | Gõ nghĩa; có bàn phím ảo Ê đê | So khớp mềm (mục 2.4), chấp nhận nhiều đáp án đúng | 2 |
| P-05 | Điền khuyết câu | Câu ví dụ bị ẩn 1 từ | So khớp mềm | 2 |
| P-06 | Sắp xếp câu | Kéo thả các từ thành câu đúng | Đúng thứ tự | 2 |
| P-07 | Dịch câu (tự do) | Gõ bản dịch cả câu | Phase 2: so với danh sách đáp án chấp nhận + độ giống (%). Phase 4: AI chấm & giải thích | 2 / 4 |
| P-08 | Ôn tập thông minh | Lặp lại ngắt quãng (SRS kiểu Anki/SM-2) dựa trên từ sai | — | 3 |
| P-09 | Kiểm tra cuối chủ đề | 20 câu trộn dạng, đạt ≥ 80% mở huy hiệu | Điểm /100 | 3 |

**Màn hình kết quả**: điểm, số đúng/sai, thời gian, danh sách câu sai kèm đáp án + nút nghe, nút "Luyện lại câu sai".

**Công thức điểm đề xuất**: mỗi câu đúng 10 điểm; đúng lần đầu +2; chuỗi đúng liên tiếp ≥ 5 nhân 1.2; gợi ý (hint) −3.

### 3.3 Tài khoản cá nhân (Phase 3)

| Mã | Chức năng | Ghi chú |
|---|---|---|
| A-01 | Đăng nhập Google (1 chạm) | Auth.js; tuỳ chọn thêm email magic-link |
| A-02 | Dùng thử không cần đăng nhập | Tiến độ lưu localStorage, đăng nhập thì gộp lên server |
| A-03 | Hồ sơ | Tên, ảnh, mục tiêu ngày (5/10/20 phút), cấp độ |
| A-04 | Tiến độ | % theo chủ đề, số từ đã thuộc, lịch sử bài làm |
| A-05 | Streak & XP | Chuỗi ngày học, điểm kinh nghiệm, huy hiệu |
| A-06 | Bảng xếp hạng tuần | Tuỳ chọn — phụ thuộc lựa chọn DB (xem 02) |

### 3.4 Trợ lý AI (Phase 4)

| Mã | Chức năng | Ghi chú |
|---|---|---|
| AI-01 | Chat hỏi đáp | "Cảm ơn tiếng Ê đê nói sao?", "Phân biệt ĕ và e" — trả lời bằng tiếng Việt, **trích dẫn mục từ điển** làm nguồn, nút nghe audio từ được nhắc |
| AI-02 | Tra cứu thông minh | Tìm theo nghĩa gần đúng ("con vật nuôi trong nhà") |
| AI-03 | Chấm dịch câu | Cho điểm 0–100 + giải thích lỗi + bản đúng, dựa trên câu mẫu |
| AI-04 | Sinh bài tập | Giáo viên chọn chủ đề → AI đề xuất câu ví dụ/bài tập, **bắt buộc duyệt tay** trước khi xuất bản |
| AI-05 | Giới hạn & an toàn | Rate-limit theo user/IP (VD 30 câu/ngày cho khách), cảnh báo "AI có thể sai", nút báo lỗi |

Mô hình đề xuất: Claude Haiku 5.5 (rẻ, nhanh) cho chat; Claude Sonnet 5.5 cho chấm dịch câu nếu cần chất lượng cao hơn.

### 3.5 Quản trị nội dung (CMS)

| Mã | Chức năng | Phase |
|---|---|---|
| C-01 | Nhập từ vựng hàng loạt từ **Google Sheet/CSV** (mẫu cột cố định) → kiểm tra lỗi → xuất bản | 1 |
| C-02 | Upload audio hàng loạt (đặt tên file theo mã từ) | 1 |
| C-03 | Sửa/xoá từng mục từ, ghi âm trực tiếp trên trình duyệt | 3 |
| C-04 | Quản lý chủ đề, thứ tự bài | 1 |
| C-05 | Hộp thư báo lỗi nội dung từ người dùng | 4 |
| C-06 | Thống kê: người dùng hoạt động, từ hay sai nhất | 5 |

## 4. Yêu cầu phi chức năng

| Nhóm | Yêu cầu |
|---|---|
| Mobile first | Thiết kế từ 360px; chạm tối thiểu 44×44px; thanh điều hướng dưới (bottom nav) trên mobile, sidebar trái từ `lg` (≥1200px) như Minimal |
| Hiệu năng | Lighthouse mobile ≥ 90; LCP < 2.5s trên 4G; audio tải lười (lazy) và cache |
| Offline (PWA) | Cài lên màn hình chính; học lại chủ đề đã mở khi mất mạng (Phase 5) |
| Khả năng tiếp cận | Tương phản AA, có nhãn cho nút audio, hỗ trợ chế độ tối |
| SEO | Mỗi mục từ có URL riêng `/tu-dien/[slug]` render tĩnh → lên Google khi người ta tra "… tiếng Ê đê là gì" |
| Bảo mật | Admin bảo vệ bằng đăng nhập + danh sách email; khoá API chỉ ở server; token Blob không lộ ra client |
| Dữ liệu cá nhân | Tuân thủ Nghị định 13/2023/NĐ-CP: chính sách quyền riêng tư, cho phép xoá tài khoản |
| Trình duyệt | iOS Safari 16+, Android Chrome 2 phiên bản gần nhất, desktop Chrome/Edge/Safari/Firefox |

## 5. Kiến trúc kỹ thuật

```
Next.js 15 (App Router, TypeScript)  ──deploy──▶  Vercel
 ├─ UI: MUI v7 + theme port từ Minimal (MIT)  · Iconify icons
 ├─ Nội dung: JSON + audio trên Vercel Blob  ─▶ đọc qua CDN, ISR revalidate
 ├─ Route Handlers /api/*  (admin upload, chấm bài, AI)
 ├─ Auth.js (Google)                              [Phase 3]
 ├─ DB người dùng: xem lựa chọn ở 02              [Phase 3]
 └─ Claude API (RAG trên từ điển)                 [Phase 4]
```

### 5.1 Lưu trữ trên Vercel Blob

Blob là **kho file**, không phải CSDL: không truy vấn, không ghi đồng thời an toàn. Phù hợp với *nội dung chỉ admin ghi, mọi người đọc*.

```
blob/
├─ content/
│  ├─ manifest.json          # phiên bản, danh sách chủ đề, thời điểm xuất bản
│  ├─ topics/{topicId}.json  # từ vựng + câu ví dụ của 1 chủ đề
│  ├─ alphabet.json          # chữ cái, vần, ví dụ
│  └─ search-index.json      # chỉ mục tìm kiếm rút gọn (có cột không dấu)
├─ audio/{wordId}.mp3        # và audio/sentences/{sentenceId}.mp3
└─ images/{wordId}.webp
```

Mô hình dữ liệu một mục từ:

```json
{
  "id": "w_0001",
  "rade": "kkuh",
  "radeNoAccent": "kkuh",
  "vi": ["chào", "cúi chào"],
  "pos": "động từ",
  "ipa": "/kkuh/",
  "topicId": "chao-hoi",
  "level": 1,
  "audio": "audio/w_0001.mp3",
  "image": null,
  "examples": [
    { "id": "s_0001", "rade": "…", "vi": "…", "audio": "audio/sentences/s_0001.mp3" }
  ],
  "note": "",
  "updatedAt": "2026-10-22T00:00:00Z"
}
```
*(Ví dụ minh hoạ cấu trúc; nội dung thật do chuyên gia ngôn ngữ của khách cung cấp.)*

Luồng xuất bản: Admin upload CSV → server kiểm tra (trùng mã, thiếu nghĩa, NFC) → ghi `topics/*.json` + `search-index.json` → cập nhật `manifest.json` → gọi `revalidatePath` để trang cập nhật.

## 6. Phụ thuộc từ phía khách hàng (rất quan trọng)

1. **Danh sách từ vựng** theo mẫu Google Sheet (tối thiểu 300 từ / 10 chủ đề cho MVP) đã được người bản ngữ/chuyên gia duyệt.
2. **File ghi âm** người bản ngữ cho từ và câu ví dụ (mp3/m4a, đặt tên theo mã). Không có audio → nút phát âm sẽ ẩn.
3. Bảng chữ cái/vần chuẩn mà dự án theo (có nhiều cách phiên âm khác nhau).
4. Logo, tên miền, tài khoản Vercel/Anthropic đứng tên khách hàng.
5. Người duyệt nghiệm thu mỗi phase.

## 7. Rủi ro

| Rủi ro | Ảnh hưởng | Giảm thiểu |
|---|---|---|
| Chậm có nội dung/audio | Trễ toàn dự án | Dùng 30–50 từ mẫu để demo; tiến độ phase tính từ ngày nhận đủ dữ liệu |
| AI trả lời sai tiếng Ê đê | Mất uy tín | RAG bắt buộc, chỉ trả lời từ có trong từ điển, nhãn cảnh báo |
| Vercel Hobby (free) **không cho phép dùng thương mại** | Vi phạm điều khoản nếu dự án thu tiền/quảng cáo | Phi lợi nhuận/giáo dục: Hobby được. Có thu phí: Vercel Pro (~20 USD/tháng) |
| Vượt hạn mức Blob free | Gián đoạn | Nén audio mono 64kbps (~10–20KB/từ), theo dõi dung lượng |
| Font hiển thị sai dấu kết hợp | Đọc sai chữ | Test font sớm ở Phase 0 |
