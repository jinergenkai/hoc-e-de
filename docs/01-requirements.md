# Học tiếng Ê đê — Đặc tả yêu cầu (SRS)

> **Lưu ý (bản 0.3, 22/10/2026):** ngân sách khách chốt **10 triệu** → phạm vi thực hiện xem `02-phases-pricing.md`. Tài liệu này giữ làm định hướng mở rộng.

> Phiên bản 0.2 · 22/10/2026 · **Đổi hướng theo phản hồi khách**: ứng dụng cài trên máy tính (Electron), chạy **không cần mạng**, trọng tâm là *học thẻ quẹt* và *dịch 2 chiều có chấm điểm*.
> Bản 0.1 (web + Vercel) đã bỏ; xem lịch sử git nếu cần.

## 1. Mục tiêu & phạm vi

Phần mềm học tiếng Ê đê cho người nói tiếng Việt, **cài trên máy tính Windows**, dùng hoàn toàn offline (phù hợp phòng máy trường học, cơ quan ở vùng mạng yếu). Hai phần chính:

1. **Học** — học từ vựng bằng thẻ quẹt như các app tiếng Anh: thuộc thì quẹt qua, chưa thuộc thì thẻ quay lại xen vào sau.
2. **Luyện tập** — dịch Việt → Ê đê và Ê đê → Việt, **có chấm điểm**. Chấm điểm bằng thuật toán so khớp chạy trên máy, không cần AI. AI là phần tuỳ chọn về sau, chỉ chạy khi có mạng.

Khách nhấn mạnh: *"thực chất"* — ưu tiên chức năng chạy chắc, chấm điểm rõ ràng hơn là tính năng hào nhoáng.

**Đối tượng người dùng**

| Persona | Mô tả | Nhu cầu chính |
|---|---|---|
| Học viên | Người Kinh làm việc ở Tây Nguyên, học sinh, người Ê đê trẻ chưa đọc/viết chuẩn | Học từ, luyện dịch, xem điểm tiến bộ |
| Phòng máy dùng chung | Nhiều người học trên 1 máy | Mỗi người 1 hồ sơ riêng trên máy, không cần tài khoản/mạng |
| Người soạn nội dung | Giáo viên, chuyên gia ngôn ngữ | Nhập từ vựng + ghi âm từ file Excel |

**Ngoài phạm vi:** bản web, app điện thoại, tài khoản online/đồng bộ giữa các máy, thanh toán, chấm phát âm qua micro, giọng đọc máy.

## 2. Đặc thù ngôn ngữ cần xử lý kỹ thuật

1. **Bảng chữ cái 38 chữ** (Latin, không có `c` đứng riêng): `a ă â b ƀ č d đ e ĕ ê ê̆ g h i ĭ j k l m n ñ o ŏ ô ô̆ ơ ơ̆ p r s t u ŭ ư ư̆ w y`. Bốn chữ `ê̆ ô̆ ơ̆ ư̆` **không có mã Unicode dựng sẵn** (chữ gốc + U+0306) → mọi chuỗi chuẩn hoá **NFC** khi lưu và khi chấm; tô màu/đếm ký tự theo grapheme. Chi tiết: `05-research-ede.md`.
2. **Gõ chữ Ê đê trên bàn phím máy tính** (người dùng thường đang bật Unikey/EVKey). App hỗ trợ 3 cách:
   - Thanh phím ảo bấm chuột ngay dưới ô nhập;
   - Quy ước cộng đồng đang dùng: **gõ chữ + số 0** (`b0 → ƀ`, `c0 → č` …; khách xác nhận bảng đầy đủ);
   - Gõ tiếng Việt bằng Unikey bình thường cho các chữ trùng (â, ê, ô, ơ, ư, ă).
3. **Font**: đóng gói sẵn font phủ đủ 38 chữ hoa + thường (không phụ thuộc font Windows), test hiển thị dấu kết hợp ở Phase 0.
4. **Không có thanh điệu**: bộ chấm phát hiện người học gõ nhầm dấu thanh tiếng Việt vào câu Ê đê và nhắc riêng.
5. **Phương ngữ chuẩn Kpă** (Buôn Ma Thuột) cho nội dung và ghi âm.
6. **Chấm đáp án** chi tiết ở mục 3.2.

## 3. Yêu cầu chức năng

Ưu tiên: **M** bắt buộc · **S** nên có · **C** có thì tốt. Cột *Phase* tham chiếu `02-phases-pricing.md`.

### 3.1 Khu vực HỌC

| Mã | Chức năng | Chi tiết | Ưu tiên | Phase |
|---|---|---|---|---|
| L-01 | Màn hình chính | Chào theo hồ sơ, "Tiếp tục học", danh sách chủ đề có % đã thuộc, từ của ngày | M | 1 |
| L-02 | Chủ đề từ vựng | Nhóm theo chủ đề (Chào hỏi, Gia đình, Số đếm, Màu sắc, Cơ thể, Thức ăn, Nông nghiệp, Thời gian…); lọc cấp độ 1–3 | M | 1 |
| L-03 | **Học thẻ quẹt** | Xem mục 3.1.1 | M | 1 |
| L-04 | Chi tiết từ | Từ Ê đê, nghĩa, từ loại, phiên âm gợi ý, nút nghe (ghi âm bản ngữ), câu ví dụ 2 chiều, ảnh, ghi chú | M | 1 |
| L-05 | Bảng chữ cái & vần | Lưới chữ cái/nguyên âm/phụ âm/vần; bấm để nghe; 2–3 từ ví dụ mỗi âm; cặp âm dễ nhầm | M | 1 |
| L-06 | Tra từ điển | Tìm 2 chiều, gõ không dấu vẫn ra, gợi ý khi gõ sai 1 ký tự | M | 1 |
| L-07 | Từ đã lưu | Đánh dấu ⭐ để học riêng | S | 1 |
| L-08 | Mẫu câu giao tiếp | Câu theo tình huống có ghi âm | C | 4 |

#### 3.1.1 Học thẻ quẹt (theo mô tả của khách)

- Bắt đầu một lượt: chọn chủ đề → bộ thẻ (mặc định 20 thẻ) xáo trộn.
- Mặt trước: từ Ê đê (hoặc tiếng Việt, tuỳ chiều chọn) + nút nghe. **Bấm/Space** để lật xem mặt sau (nghĩa + ví dụ).
- **Quẹt phải / phím →** = "Đã thuộc": thẻ rời khỏi bộ.
- **Quẹt trái / phím ←** = "Chưa thuộc": thẻ được **trộn lại vào bộ**, xuất hiện lại sau 3–5 thẻ.
- Lượt kết thúc khi mọi thẻ đã được quẹt "Đã thuộc". Màn tổng kết: số thẻ, số lần chưa thuộc, thời gian, những từ khó nhất.
- Từ chưa thuộc nhiều lần được đánh dấu "từ khó" → ưu tiên trong lượt sau và trong Luyện tập.
- Hỗ trợ chuột kéo, bàn phím, và màn hình cảm ứng (laptop cảm ứng).

### 3.2 Khu vực LUYỆN TẬP (chấm điểm)

Chọn chủ đề + chiều dịch (**Việt → Ê đê** hoặc **Ê đê → Việt**) → 10 câu → màn kết quả. Câu hỏi máy tự sinh từ kho từ vựng/câu ví dụ.

| Mã | Dạng bài | Mô tả | Phase |
|---|---|---|---|
| P-01 | **Dịch từ** | Hiện 1 từ → gõ bản dịch | 2 |
| P-02 | **Dịch câu** | Hiện 1 câu ví dụ → gõ bản dịch cả câu | 2 |
| P-03 | Trắc nghiệm | Chọn 1 trong 4 nghĩa | 2 |
| P-04 | Ghép cặp | 5 từ ↔ 5 nghĩa, bấm để nối | 2 |
| P-05 | Nghe & chọn | Nghe ghi âm → chọn từ | 2 |
| P-06 | Sắp xếp câu | Bấm các từ theo đúng thứ tự | 2 |
| P-07 | Bài kiểm tra chủ đề | 20 câu trộn các dạng, điểm /100, đạt ≥ 80 mở huy hiệu | 2 |

**Cách chấm (chạy offline, không AI):**

| Bước | Dịch từ | Dịch câu |
|---|---|---|
| 1. Chuẩn hoá | NFC, chữ thường, bỏ khoảng trắng thừa, bỏ dấu câu | như trên |
| 2. So với **mọi đáp án chấp nhận** khách nhập | khớp hoàn toàn → **Đúng** (10đ) | khớp hoàn toàn → **100%** |
| 3. Gần đúng | sai 1 ký tự, thiếu dấu trăng, `b`↔`ƀ`, hoặc thừa dấu thanh tiếng Việt → **Gần đúng** (5đ) + chỉ ra chỗ sai và loại lỗi | tính độ giống theo từ (đúng từ, đúng thứ tự) → điểm 0–100%, **tô màu từng từ** đúng/sai/thiếu |
| 4. Sai | 0đ + hiện đáp án đúng + nút nghe | < 50% = sai, hiện đáp án gần nhất |

- Có nút **"Tôi đúng mà"**: người học đánh dấu đáp án của mình là chấp nhận được → lưu lại để người soạn nội dung duyệt bổ sung vào danh sách đáp án (xuất ra file).
- Điểm lượt: tổng điểm câu; đúng ngay +2; chuỗi ≥ 5 câu đúng ×1.2; dùng gợi ý −3. Công thức chốt ở Phase 0.
- **Màn kết quả**: điểm, đúng/gần đúng/sai, thời gian, danh sách câu sai + đáp án, nút "Luyện lại câu sai".
- **Giới hạn cần nói rõ:** máy chấm theo đáp án mẫu, **không hiểu nghĩa**. Dịch đúng mà diễn đạt khác đáp án mẫu chỉ được điểm một phần. Khắc phục bằng cách nhập nhiều đáp án chấp nhận cho mỗi câu, và dùng nút "Tôi đúng mà". Chấm theo nghĩa cần AI (Phase 4, cần mạng).

### 3.3 Hồ sơ người học & tiến độ (trên máy, không cần mạng)

| Mã | Chức năng | Phase |
|---|---|---|
| U-01 | Nhiều hồ sơ trên 1 máy: chọn tên + ảnh đại diện khi mở app, mã PIN 4 số tuỳ chọn | 2 |
| U-02 | Tiến độ: % thuộc theo chủ đề, từ khó, lịch sử điểm (biểu đồ theo ngày) | 2 |
| U-03 | Chuỗi ngày học 🔥, XP, huy hiệu | 2 |
| U-04 | Ôn tập ngắt quãng: "Hôm nay cần ôn 12 từ" | 2 |
| U-05 | Bảng xếp hạng các hồ sơ **trên cùng máy** (cho phòng máy/lớp học) | 2 |
| U-06 | Xuất kết quả học ra file Excel (giáo viên thu điểm) | 3 |
| U-07 | Sao lưu / khôi phục tiến độ ra file (đổi máy, cài lại Windows) | 3 |

### 3.4 Quản lý nội dung (trong app, chế độ quản trị)

| Mã | Chức năng | Phase |
|---|---|---|
| C-01 | Mở chế độ quản trị bằng mật khẩu | 1 |
| C-02 | Nhập từ vựng + câu ví dụ + **các đáp án chấp nhận** từ file Excel theo mẫu → báo dòng lỗi → áp dụng | 1 |
| C-03 | Nhập thư mục ghi âm (tên file = mã từ), tự nén | 1 |
| C-04 | Sửa/xoá từng từ trong app | 3 |
| C-05 | Đóng gói nội dung thành **1 file gói** (`.ede`) để chép qua USB/Zalo sang máy khác; máy nhận bấm "Nhập gói nội dung" | 3 |
| C-06 | Duyệt danh sách đáp án "Tôi đúng mà" người học gửi | 3 |

### 3.5 Trợ lý AI (tuỳ chọn, chỉ khi có mạng — Phase 4)

| Mã | Chức năng |
|---|---|
| AI-01 | Chấm dịch câu theo nghĩa: điểm + giải thích + bản đúng, dựa trên câu mẫu |
| AI-02 | Hỏi đáp tra cứu, trả lời dựa trên từ điển trong app (không tự bịa) |
| AI-03 | Gợi ý thêm đáp án chấp nhận cho người soạn nội dung duyệt |

Khi không có mạng, các nút AI ẩn đi, app vẫn chấm điểm offline bình thường. Cần khoá API Anthropic của khách + một máy chủ trung gian nhỏ để không lộ khoá trong app.

## 4. Yêu cầu phi chức năng

| Nhóm | Yêu cầu |
|---|---|
| Hệ điều hành | **Windows 10/11 64-bit** (chính). macOS là tuỳ chọn, báo giá thêm. Không hỗ trợ Windows 7/8 |
| Cấu hình | Chạy được trên máy văn phòng phổ thông: RAM 4GB, CPU 2 nhân |
| Offline | 100% chức năng Học & Luyện tập chạy không mạng. Nội dung + ghi âm đóng gói trong bộ cài |
| Cài đặt | 1 file `.exe` cài đặt (kèm bản portable chạy từ USB); dung lượng dự kiến 120–250MB tuỳ lượng ghi âm |
| Khởi động | Mở app < 5 giây; chuyển màn < 300ms |
| Màn hình | Tối thiểu 1280×720; co giãn tới 1920×1080; phóng to chữ (Ctrl +/−) |
| Thao tác | Dùng được hoàn toàn bằng bàn phím (phím tắt hiện trên nút) và bằng chuột |
| Dữ liệu | Tiến độ lưu trong thư mục người dùng Windows (`%APPDATA%`), không mất khi cập nhật app |
| Bảo mật | Không thu thập dữ liệu, không gửi gì ra ngoài (trừ khi dùng AI). Electron cấu hình an toàn: `contextIsolation`, không bật `nodeIntegration` cho giao diện |
| Cập nhật | Gửi bản cài mới (ghi đè, giữ tiến độ). Tự động cập nhật qua mạng là tuỳ chọn |

## 5. Kiến trúc kỹ thuật

```
Electron (Windows .exe, electron-builder)
 ├─ Main process (Node.js)
 │   ├─ SQLite (better-sqlite3): hồ sơ, tiến độ, lịch sử điểm, đáp án "Tôi đúng mà"
 │   ├─ Đọc/ghi gói nội dung, nhập Excel (SheetJS), nén audio
 │   └─ IPC an toàn qua preload (contextBridge)
 └─ Renderer: React 19 + Vite + MUI v7 + theme Minimal (bộ Minimal gốc dùng Vite → tái sử dụng gần như nguyên vẹn)
     ├─ Học: thẻ quẹt (framer-motion), tra từ (tìm mờ trên chỉ mục nạp sẵn)
     ├─ Luyện tập: sinh câu hỏi + bộ chấm điểm (hàm thuần, có unit test)
     └─ Tiến độ: biểu đồ (ApexCharts — có sẵn trong Minimal)
```

### 5.1 Dữ liệu

```
<thư mục cài app>/resources/content/      # nội dung gốc đi kèm bộ cài (chỉ đọc)
├─ manifest.json        # phiên bản gói, danh sách chủ đề
├─ topics/{topicId}.json
├─ alphabet.json
└─ audio/{wordId}.mp3, audio/sentences/{sentenceId}.mp3

%APPDATA%/HocEde/
├─ content/             # gói nội dung nhập thêm (ghi đè bản gốc nếu mới hơn)
└─ hocede.db            # SQLite: profiles, card_progress, attempts, accepted_suggestions
```

Một mục từ:

```json
{
  "id": "w_0001",
  "rade": "…",
  "vi": ["nghĩa chính", "nghĩa phụ"],
  "acceptRade": ["các cách viết Ê đê được chấp nhận"],
  "pos": "danh từ",
  "topicId": "gia-dinh",
  "level": 1,
  "audio": "audio/w_0001.mp3",
  "examples": [
    { "id": "s_0001", "rade": "…", "vi": "…",
      "acceptVi": ["các bản dịch Việt chấp nhận"],
      "acceptRade": ["các bản dịch Ê đê chấp nhận"],
      "audio": "audio/sentences/s_0001.mp3" }
  ]
}
```

## 6. Phụ thuộc từ phía khách hàng

1. **Từ vựng + câu ví dụ** theo mẫu Excel (tối thiểu 300 từ / 10 chủ đề, 100 câu cho MVP), đã được người bản ngữ duyệt.
2. **Đáp án chấp nhận**: với mỗi câu dùng để luyện dịch, càng nhiều cách dịch đúng thì chấm càng công bằng (khuyến nghị 2–4 cách/câu).
3. **Ghi âm** người bản ngữ (mp3/m4a, tên file = mã từ).
4. Chuẩn bảng chữ cái/vần dự án theo (chốt thứ tự nhóm o/ô/ơ), bảng quy ước gõ `chữ + 0`, danh sách cặp âm dễ nhầm.
5. **Chương trình khung bồi dưỡng tiếng Ê đê** (nếu nhắm tới lớp cán bộ) để sắp chủ đề cho khớp.
6. Tên phần mềm, logo, 1–2 máy tính thật để thử nghiệm tại chỗ.

## 7. Rủi ro

| Rủi ro | Giảm thiểu |
|---|---|
| Thiếu đáp án chấp nhận → chấm dịch câu "khó tính" | Nút "Tôi đúng mà" + quy trình duyệt bổ sung; nói rõ giới hạn ngay từ đầu |
| Windows cảnh báo "phần mềm không rõ nguồn gốc" (SmartScreen); máy Win 11 bật Smart App Control **chặn hẳn** app chưa ký | Phát hành qua **Microsoft Store** (Microsoft ký hộ, tài khoản cá nhân miễn phí) cho máy có Store; bản `.exe` ký bằng chứng thư OV (~5–10 triệu/năm) cho phòng máy không có Store; giai đoạn demo: chép qua USB + hướng dẫn "Vẫn chạy" |
| Antivirus nhà trường chặn file `.exe` lạ | Có ký số; hoặc bản portable; gửi hướng dẫn cho IT |
| Unikey xung đột khi gõ ký tự Ê đê | Thanh phím ảo + phím tắt riêng; test với Unikey & EVKey ở Phase 0 |
| Cập nhật nội dung khó vì máy không có mạng | Gói nội dung `.ede` chép qua USB (Phase 3) |
| Chậm có nội dung/ghi âm | Demo bằng 30–50 từ mẫu; tiến độ tính từ ngày nhận đủ dữ liệu |
