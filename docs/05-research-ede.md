# Nghiên cứu tiếng Ê đê & cách áp dụng vào sản phẩm

> 22/10/2026 · Tổng hợp từ nguồn công khai trên mạng (có link ở cuối). Một số nguồn là blog/trang phổ thông, **cần chuyên gia của khách xác nhận** trước khi đưa vào nội dung chính thức. Ví dụ tiếng Ê đê trong tài liệu này chỉ để minh hoạ kỹ thuật.

## 1. Tóm tắt nhanh

| Phát hiện | Áp dụng |
|---|---|
| Bảng chữ cái **38 chữ**, Latin, dựa trên chữ Quốc ngữ, có `ƀ č ñ` và 9 nguyên âm mang dấu trăng (breve) | Màn "Bảng chữ cái" cố định 38 ô; thanh phím ảo đủ 38 chữ |
| 4 nguyên âm có dấu trăng **không có mã Unicode dựng sẵn** (`ê̆ ô̆ ơ̆ ư̆`) | Bắt buộc chuẩn hoá NFC + test font; bộ chấm so sánh theo cụm ký tự, không theo từng mã |
| **Không có thanh điệu** | Người học hay quen tay gõ dấu thanh tiếng Việt → bộ chấm phát hiện và nhắc riêng lỗi này |
| Có quy ước gõ "thêm số 0" (`b0 → ƀ`, `c0 → č`) đang được cộng đồng dùng | Hỗ trợ đúng quy ước này để người đã quen không phải học lại |
| Phương ngữ **Kpă** (quanh Buôn Ma Thuột) là chuẩn chữ viết | Nội dung và ghi âm theo Kpă; trường "phương ngữ" tuỳ chọn cho từ khác vùng |
| Phủ định dạng khung `amâo … ôh`; từ hỏi đứng đầu câu; đổi trật tự từ thì đổi nghĩa | Bài **sắp xếp câu** và **dịch câu** có giá trị sư phạm cao; gợi ý lỗi theo mẫu ngữ pháp |
| Nhà nước có **chương trình bồi dưỡng + chứng chỉ tiếng dân tộc** cho cán bộ, công chức, công an, quân đội (TT 09/2023, sửa đổi bởi TT 02/2026) | Định vị sản phẩm: **công cụ ôn luyện cho học viên các lớp bồi dưỡng tiếng Ê đê** → khách hàng tổ chức (trường, sở, đơn vị) |
| Đã có web từ điển + bài học miễn phí (ededic.thaiphong.net) và vài app từ điển | Không cạnh tranh làm "từ điển"; khác biệt ở **học thẻ quẹt + chấm điểm + offline + phòng máy nhiều người** |

---

## 2. Thông tin nền

- **Tên gọi:** Ê đê / Êđê / Rade / Rhade, tiếng gọi chính ngôn ngữ là *klei Êđê*. Mã ISO 639-3: `rad`.
- **Ngữ hệ:** Nam Đảo (Austronesian), nhóm Chăm, gần với tiếng Chăm và Jrai. **Không cùng họ với tiếng Việt** → từ vựng gần như không đoán được từ tiếng Việt, người học cần nhiều lần lặp lại → thẻ quẹt + ôn tập ngắt quãng là cách học phù hợp.
- **Số người nói:** khoảng 180.000 người ở Việt Nam (số liệu 2007 trên Wikipedia; số liệu dân số mới hơn có thể cao hơn).
- **Phương ngữ:** Kpă (Buôn Ma Thuột, Krông Ana, Krông Pắc, Cư M'gar — **chuẩn chữ viết**), Adham, Krung, Mdhur, Bih (khác biệt nhất, ~73% từ cùng gốc với Kpă). Giọng các vùng khác nhau nhưng chữ viết khá thống nhất.
- **Chữ viết:** chữ Latin hình thành thời Pháp (đầu thế kỷ 20, có sự tham gia của trí thức Ê đê Y Jut; các nguồn nêu mốc chỉnh sửa 1920 và công nhận chính thức 1935 — chưa đối chiếu với tài liệu học thuật). Tác giả từ điển Tharp & Buôn-yă mô tả chữ Ê đê là chữ Quốc ngữ điều chỉnh, thêm ký tự cho âm hút vào (implosive) và âm tắc thanh hầu.
- **Trong giáo dục:** có chương trình môn tiếng Ê đê cấp tiểu học (QĐ 48/2007/QĐ-BGDĐT) và chương trình giáo dục phổ thông môn tiếng Ê đê (Bộ GD&ĐT, 2020). Năm 2019–2020 Đắk Lắk có 136 giáo viên dạy tiếng Ê đê (VOV4).

## 3. Bảng chữ cái & vấn đề kỹ thuật

### 3.1 38 chữ cái

```
a ă â b ƀ č d đ e ĕ ê ê̆ g h i ĭ j k l m n ñ o ŏ ô ô̆ ơ ơ̆ p r s t u ŭ ư ư̆ w y
```

- **Không có chữ `c` đứng riêng** — chỉ có `č`. `ch`, `nh` … trong tiếng Việt được viết rút gọn thành `č`, `ñ`.
- Các nguồn **xếp thứ tự nhóm o/ô/ơ khác nhau** → khách chốt 1 thứ tự chuẩn (ảnh hưởng sắp xếp từ điển A→Z).
- Có tổ hợp phụ âm đầu (2–3 phụ âm), ví dụ `tl`, `hr`, `mt`, `kp`, `dj`… và phụ âm cuối phong phú hơn tiếng Việt (có cả `l`, `r`, âm xát) → bài "Phiên âm & vần" nên có mục **phụ âm ghép đầu** và **âm cuối**, là phần khó nhất với người Kinh.

### 3.2 Mã hoá Unicode (quan trọng cho bộ chấm điểm)

| Chữ | Unicode | Ghi chú |
|---|---|---|
| ƀ / Ƀ | U+0180 / U+0243 | Font phổ thông đôi khi thiếu Ƀ hoa |
| č / Č | U+010D / U+010C | |
| ñ / Ñ | U+00F1 / U+00D1 | |
| ă ĕ ĭ ŏ ŭ | có mã dựng sẵn | |
| â ê ô ơ ư | có mã dựng sẵn | như tiếng Việt |
| **ê̆ ô̆ ơ̆ ư̆** | **không có mã dựng sẵn** → chữ gốc + U+0306 (dấu trăng kết hợp) | Dễ hiển thị lệch dấu; 1 "chữ" = 2 mã |

**Hệ quả kỹ thuật:**
1. Mọi văn bản (nhập Excel, người học gõ) chuẩn hoá **NFC** trước khi lưu/so sánh.
2. Đếm ký tự, tô màu chữ sai, con trỏ trong ô nhập phải làm theo **grapheme** (`Intl.Segmenter`), không theo `string.length`, nếu không sẽ tô màu nửa chữ `ê̆`.
3. Văn bản cũ có thể dùng **font riêng (không Unicode)** như nghiên cứu của ĐH Đà Nẵng đã chỉ ra → khi khách đưa file Word/Excel cũ, cần bước **chuyển mã** (báo giá riêng nếu khối lượng lớn).
4. Font đóng gói trong app phải phủ đủ 38 chữ hoa + thường; ứng viên: Noto Sans, Be Vietnam Pro, Inter — **test ở Phase 0**.

### 3.3 Cách gõ

- Cộng đồng đang dùng quy ước **thêm số 0 sau chữ** để ra ký tự đặc biệt (ví dụ `b0 → ƀ`, `c0 → č`) trên trang ededic.thaiphong.net; nghiên cứu ĐH Đà Nẵng cũng đề xuất gõ Ê đê bằng Unicode qua Unikey/Vietkey.
- **Áp dụng:** ô nhập trong app hỗ trợ cả 3 cách: (1) bấm thanh phím ảo; (2) quy ước `0` như trên (xác nhận bảng quy ước đầy đủ với khách); (3) Unikey kiểu Telex cho các chữ trùng tiếng Việt (`aa → â`, `ow → ơ`…).
- Khi chấm, nếu người học gõ thành `b` thay `ƀ` hoặc thiếu dấu trăng → **"Gần đúng"**, chỉ rõ chữ cần sửa.

## 4. Ngữ âm

- **Không có thanh điệu** (khác tiếng Việt 6 thanh). Người Kinh hay đọc/gõ "Việt hoá" → bộ chấm thêm quy tắc: đáp án Ê đê mà người học gõ có **dấu thanh tiếng Việt** (sắc, huyền, hỏi, ngã, nặng) → báo lỗi riêng: *"Tiếng Ê đê không có dấu thanh"*.
- **Đa tiết / tiền âm tiết:** nhiều từ có âm tiết phụ phía trước (như `êmuh`, `amâo`, `mtô`). Phần học phát âm nên có ghi âm **chậm từng âm tiết** cho từ dài.
- **Dấu trăng (ĕ, ŏ, ŭ…):** đánh dấu nguyên âm ngắn/biến thể so với nguyên âm không dấu → bài **"cặp âm dễ nhầm"** (e/ĕ, o/ŏ, u/ŭ…) dùng ghi âm thật là phần có giá trị nhất của mục Phiên âm. Cần chuyên gia cung cấp các cặp từ tối thiểu.

## 5. Ngữ pháp có thể khai thác cho bài tập

| Đặc điểm | Ví dụ (từ nguồn) | Áp dụng vào bài tập |
|---|---|---|
| Phủ định dạng **khung**: chủ ngữ + `amâo` + động từ + … + `ôh` | *Kâo amâo nao mă bruă ôh* — "Tôi không đi làm" | Bài sắp xếp câu: kiểm tra có đủ cả 2 thành phần khung; gợi ý lỗi "thiếu `ôh` cuối câu" |
| Từ hỏi thường **đứng đầu câu** | *Hlei mtô ih hriăm klei Êđê?* — "Ai dạy bạn học tiếng Ê đê?" | Dạng bài "đặt câu hỏi"; gợi ý lỗi vị trí từ hỏi |
| **Đổi trật tự đổi nghĩa** (đơn lập, giống tiếng Việt) | *Kâo êmuh ñu* (tôi hỏi nó) ≠ *Êmuh ñu kâo* | Bộ chấm dịch câu **phải tính thứ tự từ**, không chỉ đếm từ đúng |
| Đại từ nhân xưng | `kâo` (tôi), `ih` (bạn), `ñu` (nó/anh ấy) … | Chủ đề đầu tiên trong Phase 0 demo |
| Số đếm | `sa, dua, tlâo, pă, êma` … `pluh` (10), `pluh sa` (11), `dua pluh` (20) | Chủ đề "Số đếm" — dễ sinh bài tập tự động (ghép số ↔ chữ) |

> Các câu ví dụ trên lấy từ nguồn phổ thông, một số bị lỗi font khi trích; **phải để chuyên gia của khách duyệt** trước khi đưa vào app.

## 6. Thị trường & định vị

### 6.1 Ai cần học (khách hàng tiềm năng của khách)
- **Cán bộ, công chức, viên chức, công an, quân đội** làm việc ở vùng đồng bào: Thông tư 09/2023/TT-BGDĐT quy định đào tạo, bồi dưỡng và cấp chứng chỉ tiếng dân tộc thiểu số; Thông tư 02/2026/TT-BGDĐT sửa đổi, giao cho các trường ĐH, CĐ, trung tâm GDTX tổ chức; hình thức có thể **tập trung, bán tập trung hoặc từ xa**; thi cuối khoá theo **chương trình khung** của Bộ. Theo một bài tư vấn pháp luật, công chức có chứng chỉ tiếng dân tộc được miễn thi ngoại ngữ khi thi nâng ngạch (cần kiểm tra lại quy định hiện hành).
- Bộ Chỉ huy Quân sự Đắk Lắk đã tổ chức nhiều lớp tiếng Ê đê cho cán bộ, chiến sĩ.
- Học sinh tiểu học học môn tiếng Ê đê; 136 giáo viên (2019–2020) cần học liệu.

### 6.2 Áp dụng vào sản phẩm
1. **Chủ đề bám chương trình khung** bồi dưỡng tiếng Ê đê và chương trình GDPT môn tiếng Ê đê → bán cho trường/trung tâm tổ chức lớp như **phần mềm hỗ trợ lớp học**. Việc cần làm: khách/chuyên gia lấy bản chương trình khung chính thức để map chủ đề (đã ghi vào mục phụ thuộc của khách).
2. **Bài kiểm tra chủ đề** mô phỏng dạng đề thi cuối khoá (nếu khách có đề mẫu).
3. **Phòng máy nhiều hồ sơ + xuất điểm Excel** (đã có trong Phase 2–3) khớp đúng cách các lớp bồi dưỡng tập trung vận hành.
4. Học viên lớp bồi dưỡng đa số là **người lớn, bận** → mỗi lượt thẻ ngắn (10–20 thẻ), "hôm nay cần ôn X từ".

### 6.3 Sản phẩm hiện có

| Sản phẩm | Có gì | Khác biệt của mình |
|---|---|---|
| ededic.thaiphong.net (web, miễn phí) | Từ điển Ê đê–Việt, 7+ bài học: nguồn gốc chữ, bảng chữ cái, phát âm, cách gõ, số đếm, đại từ, từ hỏi | Không có thẻ quẹt, không chấm điểm, cần mạng |
| App "Từ điển học tiếng Ê đê" (cùng tác giả, giới thiệu trên YouTube) | Tra từ trên điện thoại | Như trên |
| "Ede Dictionary" (app di động) | Tra Ê đê ↔ Anh ↔ Việt offline | Chỉ tra cứu |
| Lớp học trực tiếp (quân đội, sở GD) | Giáo viên, giáo trình giấy | Mình là công cụ **ôn luyện bổ trợ** cho lớp, không thay giáo viên |

→ Có thể **liên hệ tác giả ededic để xin phép/mua bản quyền dữ liệu từ điển**, rút ngắn thời gian nhập liệu của khách (cần khách chủ động).

## 7. Nguồn dữ liệu & bản quyền

| Nguồn | Giá trị | Lưu ý bản quyền |
|---|---|---|
| Từ điển Việt–Êđê (NXB Giáo dục, 1993, Sở GD Đắk Lắk + Viện Ngôn ngữ học) | Kho từ chuẩn, lớn | Có bản quyền → chỉ dùng tham khảo hoặc xin phép |
| Rhade–English Dictionary (Tharp & Buôn-yă, 1980) | Mô tả chính tả, phát âm | Có bản quyền |
| Sách *Hriăm klei Êđê* (Học tiếng Ê đê, bản PDF lưu hành trên mạng) | Giáo trình có cấu trúc bài | Có bản quyền, không chép vào app |
| Bản tin tiếng Ê đê của VOV4, Đài PT-TH Đắk Lắk | Ghi âm giọng chuẩn | **Không được cắt dùng** khi chưa xin phép |
| Ghi âm/văn bản tôn giáo (Global Recordings…) | Nhiều audio | Giấy phép hạn chế, nội dung không phù hợp |
| **Chuyên gia + người bản ngữ của khách tự soạn và ghi âm** | Sạch bản quyền, đúng phương ngữ Kpă | **Phương án chính** — đã ghi trong hợp đồng |

## 8. Thay đổi đề xuất vào tài liệu yêu cầu

- [x] Bảng chữ cái chốt 38 chữ, không có `c` (cập nhật `01-requirements.md` mục 2).
- [x] Hỗ trợ quy ước gõ `chữ + 0`.
- [x] Bộ chấm: chuẩn hoá NFC, xử lý theo grapheme, báo lỗi "dấu thanh tiếng Việt", "thiếu dấu trăng", "thiếu khung phủ định `amâo … ôh`", và tính trật tự từ.
- [x] Phụ thuộc khách: chốt thứ tự chữ o/ô/ơ, chương trình khung bồi dưỡng, bảng quy ước gõ, cặp âm tối thiểu.
- [ ] Đề xuất bán hàng: gói "phòng máy cho lớp bồi dưỡng tiếng Ê đê" — chờ khách xác nhận nhóm khách hàng mục tiêu.

## Nguồn

- [Rade language — Wikipedia](https://en.wikipedia.org/wiki/Rade_language)
- [Rade language and alphabet — Omniglot](https://www.omniglot.com/writing/rade.htm) · [Numbers in Rade — Omniglot](https://www.omniglot.com/language/numbers/rade.htm)
- [Rhade — Austronesian Basic Vocabulary Database (MPI-EVA)](https://abvd.eva.mpg.de/austronesian/language.php?id=741)
- [Glottolog — Rade](https://glottolog.org/resource/languoid/id/rade1240)
- [Bài 2: Bảng chữ cái Ê đê — ededic.thaiphong.net](https://ededic.thaiphong.net/bai-hoc/bai-02.php) · [Bài 3: Cách đọc chữ Êđê](https://ededic.thaiphong.net/bai-hoc/bai-03.php) · [Bài 4: Cách gõ chữ Ê đê](https://ededic.thaiphong.net/bai-hoc/bai-04.php) · [Bài 7: Từ dùng để hỏi](https://ededic.thaiphong.net/bai-hoc/bai-07.php) · [Bài 1: Sự ra đời tiếng và chữ viết Êđê](https://ededic.thaiphong.net/bai-hoc/bai-01.php)
- [Bảng chữ cái Êđê — BŎH HRĂ ÊĐÊ (bvdaihoctaynguyen.com.vn)](https://bvdaihoctaynguyen.com.vn/bai-viet/218-bang-chu-cai-ede--b%C5%8Fh-hra-ede--bang-chu-cai-dong-bao.html) · [chucaiede.blogspot.com](https://chucaiede.blogspot.com/2019/03/blog-post.html)
- [Một số điểm khác biệt giữa tiếng Êđê và tiếng Việt — ĐH Đà Nẵng (PDF)](https://scv.udn.vn/Down.aspx?fn=2020%2F2%2F2020m2_22h5m54_2-tk-e-de-tieng-viet.pdf&style=tailieu) · [Mã hoá Unicode cho tiếng Ê đê — ĐH Đà Nẵng](https://scv.udn.vn/phkhanh/BBao/7947)
- [Người Êđê — Wikipedia tiếng Việt](https://vi.wikipedia.org/wiki/Ng%C6%B0%E1%BB%9Di_%C3%8A%C4%91%C3%AA) · [Người Ê-đê — Ủy ban Dân tộc](http://www.cema.gov.vn/gioi-thieu/cong-dong-54-dan-toc/nguoi-e-de.htm)
- [Y Jut, một trí thức người Rhade (1888–1934) — champa.one](https://champa.one/article/711) · [Léopold Sabatier — Wikipedia](https://en.wikipedia.org/wiki/L%C3%A9opold_Sabatier)
- [QĐ 48/2007/QĐ-BGDĐT chương trình tiếng Êđê cấp tiểu học](https://thuvienphapluat.vn/van-ban/Giao-duc/Quyet-dinh-48-2007-QD-BGDDT-chuong-trinh-tieng-EDE-cap-tieu-hoc-56088.aspx) · [Chương trình GDPT môn tiếng Êđê (PDF, chinhphu.vn)](https://datafiles.chinhphu.vn/cpp/files/vbpq/2020/10/ct-tieng-e-de-1-.pdf)
- [Thông tư 09/2023/TT-BGDĐT](https://thuvienphapluat.vn/van-ban/Giao-duc/Thong-tu-09-2023-TT-BGDDT-to-chuc-dao-tao-boi-duong-va-cap-chung-chi-tieng-dan-toc-thieu-so-563663.aspx) · [Thông tư 02/2026/TT-BGDĐT](https://luatvietnam.vn/giao-duc/thong-tu-02-2026-tt-bgddt-sua-doi-quy-dinh-dao-tao-boi-duong-va-cap-chung-chi-tieng-dan-toc-thieu-so-424896-d1.html) · [Công chức có chứng chỉ tiếng DTTS được miễn thi ngoại ngữ nâng ngạch](https://thuvienphapluat.vn/chinh-sach-phap-luat-moi/vn/ho-tro-phap-luat/tu-van-phap-luat/53558/cong-chuc-co-chung-chi-dao-tao-tieng-dan-toc-thieu-so-se-duoc-mien-thi-mon-ngoai-ngu-doi-voi-cac-ky-thi-nang-ngach)
- [Dạy và học tiếng dân tộc thiểu số ở Đắk Lắk — VOV4](https://vov4.vov.vn/giao-duc/day-va-hoc-tieng-dan-toc-thieu-so-o-dak-lak-309378.vov4) · [Bộ đội Đắk Lắk học tiếng Êđê — VOV](https://vov.gov.vn/bo-doi-dak-lak-hoc-tieng-ede-de-gan-dan-hieu-dan-hon-dtnew-203090)
- [Giới thiệu App Từ Điển Học Tiếng Ê Đê — YouTube](https://www.youtube.com/watch?v=h5YCYV1Y0kA) · [Ede Dictionary app](https://mwm.ai/apps/ede-dictionary/6755342254) · [Học tiếng Ê đê – Hriăm Klei Êđê (blog Trần Tứ Liêm)](https://trantuliem.blogspot.com/2025/02/hoc-tieng-e-e-hriam-klei-ee-sach-pdf.html)
