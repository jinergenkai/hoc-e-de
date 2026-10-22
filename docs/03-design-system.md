# Design system — học từ Minimal UI

Tham chiếu: [`minimal-ui-kit/material-kit-react`](https://github.com/minimal-ui-kit/material-kit-react) (bản free của minimals.cc, giấy phép **MIT** → được phép port theme và layout vào dự án thương mại, giữ ghi chú bản quyền).

## 1. Những gì lấy từ Minimal

| Thành phần | Minimal làm thế nào | Áp dụng cho Học Ê đê |
|---|---|---|
| Nền tảng | MUI v7 + Emotion, CSS variables (`data-color-scheme`), React 19 | Giữ nguyên, nhưng chạy trên **Next.js App Router** thay vì Vite (cần SSR/SEO + API routes) |
| Cấu trúc theme | `theme-config.ts` (token) → `core/palette, typography, shadows, custom-shadows, components` → `create-theme.ts` | Copy nguyên cấu trúc thư mục `src/theme/` |
| Bảng màu | Mỗi màu có 5 bậc `lighter/light/main/dark/darker` + kênh RGB để làm alpha | Giữ cơ chế, đổi màu (mục 2) |
| Grey | `#F9FAFB … #1C252E … #141A21` (xám xanh) | Giữ nguyên — đây là thứ tạo "chất Minimal" |
| Typography | Body: **DM Sans**; Heading h1–h3: **Barlow** đậm 700–800; responsive font size theo breakpoint | Giữ, **kiểm tra dấu Ê đê**; dự phòng `Noto Sans` |
| Bo góc | `shape.borderRadius = 8`, Card = 16 | Giữ; nút lựa chọn bài tập dùng 12 |
| Đổ bóng | Bóng mềm theo kênh grey 500: `card = 0 0 2px α.2, 0 12px 24px -4px α.12` | Giữ. Thêm bóng màu `primary` cho nút CTA |
| Nút | `disableElevation`, `containedInherit` = nền grey 800 chữ trắng, size large cao 48px | Nút chính trên mobile dùng size large, full-width |
| Label | Component `Label` (chip mềm nền `lighter`, chữ `dark`) | Dùng cho cấp độ, từ loại, trạng thái "Đã thuộc" |
| Layout | `LayoutSection` = Header + Nav + Main, CSS vars `--layout-nav-vertical-width: 300px`; nav dọc từ `lg`, dưới `lg` là drawer | **Mobile first:** dưới `lg` dùng **bottom navigation** cố định (thay drawer) vì app học cần chuyển tab bằng ngón cái |
| Icon | Iconify (`solar:*` duotone) | Giữ bộ `solar` cho đồng bộ |
| Auth layout | Card giữa màn hình trên nền minh hoạ | Dùng cho màn đăng nhập Phase 3 |

## 2. Bảng màu thương hiệu

Lấy cảm hứng từ thổ cẩm Ê đê (đen – đỏ – vàng – trắng) nhưng giữ độ dịu kiểu Minimal.

```ts
primary:   { lighter: '#FFE3D6', light: '#F28B66', main: '#C8401E', dark: '#902615', darker: '#5F120B' } // đỏ thổ cẩm
secondary: { lighter: '#FFF4CC', light: '#FFD666', main: '#E0A100', dark: '#A06A00', darker: '#6B4100' } // vàng
info / success / warning / error: giữ của Minimal
grey: giữ của Minimal
```
Chữ trên `primary.main` là trắng (tương phản ≥ 4.5:1). Màu sắc cuối cùng chốt trong Phase 0.

## 3. Khung màn hình (mobile 360–430px)

```
┌───────────────────────────┐
│ Header: logo · streak 🔥 · avatar │  56px, trong suốt → blur khi cuộn
├───────────────────────────┤
│                           │
│  Nội dung (px 16)         │
│  Card bo 16, gap 16       │
│                           │
├───────────────────────────┤
│ 📖 Học │ ✍️ Luyện │ 🔍 Tra │ 👤 Tôi │  Bottom nav 64px + safe-area
└───────────────────────────┘
```

- **Desktop ≥ 1200px**: sidebar trái 300px (y như Minimal dashboard), nội dung max-width 1200, lưới 2–3 cột card.
- **Màn làm bài**: ẩn bottom nav, header chỉ còn nút ✕ + thanh tiến độ; nút "Kiểm tra" cố định đáy, full-width, size large.
- **Thẻ từ**: từ Ê đê font Barlow 40px, nút loa tròn 56px màu primary, nghĩa tiếng Việt body1, ví dụ trong card con nền `grey.100`.
- **Bàn phím ảo**: hàng chip cuộn ngang dính trên bàn phím hệ thống: `ƀ č đ ñ ă â ĕ ê ĭ ŏ ô ơ ŭ ư` + phím breve kết hợp.

## 4. Quy ước code UI

- Port `src/theme/*` và `minimal-shared` utils (`varAlpha`, `pxToRem`) từ Minimal.
- Component theo cấu trúc Minimal: `src/components/*` (dùng chung), `src/sections/<feature>/*` (theo màn hình), `src/layouts/*`.
- Mọi khoảng cách dùng `theme.spacing` (bội 8); không hardcode màu ngoài token.
