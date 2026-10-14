# Left 4 Dev — Interactive Showcase

> Team showcase dạng one-page cho nhóm **Left 4 Dev**, xây dựng bằng semantic HTML, CSS Grid / Flexbox và JavaScript thuần.

![Demo Desktop](showcase.gif)

---

## 📋 Mục lục

- [Thành viên](#thành-viên)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Chạy tại máy](#chạy-tại-máy)
- [Tính năng & Tương tác](#tính-năng--tương-tác)
- [Hiệu ứng chuyển động](#hiệu-ứng-chuyển-động)
- [Responsive & Accessibility](#responsive--accessibility)
- [Phân công nhiệm vụ](#phân-công-nhiệm-vụ)
- [Prompt Logic](#prompt-logic)
- [Giấy phép](#giấy-phép)

---

## Thành viên

| STT | Họ và tên               | Vai trò                                          |
| --- | ----------------------- | ------------------------------------------------ |
| 01  | Nhữ Mai Gia Long        | Nhóm Trưởng                                      |
| 02  | Trần Khắc Đạt           | Thành viên                                        |
| 03  | Phạm Thành Danh         | Thành viên                                        |
| 04  | Nguyễn Hữu Thanh Trường | Thành viên — Tài liệu, QA & Bàn giao Demo        |

---

## Cấu trúc dự án

```
Left-4-Dev/
├── index.html          # Trang chính — semantic HTML, aria attributes
├── style.css           # Toàn bộ styling: layout, animation, responsive
├── script.js           # Menu mobile, detail-toggle, AOS init
├── prompt_logic.md     # Giải thích prompt & lý do UX theo section
├── README.md           # Tài liệu dự án (file này)
└── showcase.gif        # Demo quay màn hình (desktop + mobile)
```

---

## Chạy tại máy

1. **Clone** repository:
   ```bash
   git clone https://github.com/jalong-source/Left-4-Dev.git
   cd Left-4-Dev
   ```
2. **Mở** `index.html` trong trình duyệt (khuyến nghị Chrome / Edge / Firefox bản mới nhất).

> [!NOTE]
> Google Fonts, ảnh Unsplash và AOS được tải từ CDN — cần kết nối Internet để hiển thị đầy đủ hiệu ứng. Nội dung văn bản vẫn đọc được khi offline nhờ fallback font và AOS fallback.

---

## Tính năng & Tương tác

| Section       | Tính năng                                                                          |
| ------------- | ---------------------------------------------------------------------------------- |
| **Header**    | Logo wordmark `L4D.`, navigation ngang; menu hamburger trên mobile (≤ 640px)       |
| **Hero**      | Intro animation stagger: header → headline → description → image                  |
| **Ticker**    | Marquee CSS-only liên tục, nội dung `aria-hidden` vì mang tính trang trí           |
| **About**     | Scroll reveal (AOS `fade-up`), ba nguyên tắc làm việc dạng grid                    |
| **Team**      | Grid 4 cột (desktop) → 2 cột (tablet) → 1 cột (mobile), nhóm trưởng được highlight |
| **Projects**  | Card hover: ảnh `scale(1.045)`, nút toggle mở/đóng mô tả chi tiết bằng click/keyboard |
| **Toolkit**   | Tag list công nghệ, aside decorative (ẩn ở tablet trở xuống)                      |
| **Contact**   | CTA nổi bật, background tối tạo tương phản, link GitHub                            |
| **Footer**    | Wordmark, copyright, nút "Lên đầu trang"                                          |

---

## Hiệu ứng chuyển động

### Nguyên tắc chung

- ✅ **Chỉ animate** `opacity` và `transform` — thuộc tính composite-friendly, không gây layout reflow.
- ❌ **Không animate** `top`, `left`, `width`, `height` — tránh jank / giật lag.
- ⏱️ **Thời lượng**: 400–700 ms cho transition; 120 ms cho active press.
- 🎯 **Easing**: `cubic-bezier(0.22, 1, 0.36, 1)` — tăng tốc sớm, hãm mềm cuối.

### Chi tiết từng animation

| Animation          | Keyframes / Transition           | Thuộc tính            | Thời lượng |
| ------------------ | -------------------------------- | --------------------- | ---------- |
| `header-enter`     | `translateY(-16px)` → `0`        | `opacity`, `transform` | 0.7s       |
| `rise-in`          | `translateY(24px)` → `0`         | `opacity`, `transform` | 0.8s       |
| `visual-enter`     | `translateX(28px)` → `0`         | `opacity`, `transform` | 0.9s       |
| `ticker-slide`     | `translateX(0)` → `(-50%)`      | `transform`            | 32s loop   |
| `detail-in`        | `translateY(8px)` → `0`          | `opacity`, `transform` | 0.42s      |
| AOS `fade-up`      | `translateY(22px)` → `0`         | `opacity`, `transform` | 0.7s       |
| Button hover       | `translateY(-3px)`, `box-shadow` | `transform`, `box-shadow` | 0.42s  |
| Button active      | `scale(0.97)`                    | `transform`            | 0.12s      |
| Project image hover | `scale(1.045)`, `saturate`      | `transform`, `filter`  | 0.72s      |

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  body.aos-ready [data-aos] { opacity: 1; transform: none; }
}
```

AOS cũng kiểm tra `prefers-reduced-motion` trong JavaScript và sẽ disable hoàn toàn nếu người dùng bật tùy chọn giảm chuyển động.

---

## Responsive & Accessibility

### Responsive breakpoints

| Breakpoint   | Thay đổi chính                                                                |
| ------------ | ----------------------------------------------------------------------------- |
| `≤ 900px`    | Hero 2 cột thu hẹp, team grid 2 cột, toolkit aside ẩn                         |
| `≤ 640px`    | Hero 1 cột, team/principles 1 cột, menu hamburger, project grid 1 cột         |
| `≤ 370px`    | Font-size heading giảm thêm cho màn hình rất nhỏ                              |

### Accessibility checklist (đã kiểm tra)

- [x] **Skip link**: `.skip-link` cho phép nhảy qua navigation đến `#main`
- [x] **Semantic HTML**: `<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>`
- [x] **ARIA attributes**: 26 thuộc tính ARIA bao gồm `aria-label`, `aria-expanded`, `aria-controls`, `aria-hidden`
- [x] **Keyboard navigation**: Tab qua tất cả link và button; `Escape` đóng menu mobile
- [x] **Focus visible**: `:focus-visible` outline 3px solid `var(--blue)`, offset 4px
- [x] **Focus-within**: Project card ảnh hiệu ứng scale khi focus bên trong (keyboard-friendly)
- [x] **`prefers-reduced-motion`**: CSS + JS đều tôn trọng, nội dung luôn hiển thị
- [x] **`lang="vi"`**: thuộc tính ngôn ngữ chính xác trên `<html>`
- [x] **Alt text**: tất cả `<img>` có alt mô tả; ảnh trang trí dùng `aria-hidden`
- [x] **Minimum width**: `body { min-width: 320px }` — không bị vỡ ở viewport nhỏ

---

## Phân công nhiệm vụ

| TV  | Thành viên               | Trách nhiệm chính                                                             |
| --- | ------------------------ | ------------------------------------------------------------------------------ |
| 1   | Nhữ Mai Gia Long         | Nhóm trưởng — điều phối & code chính                                           |
| 2   | Trần Khắc Đạt            | Thành viên — hỗ trợ phát triển                                                 |
| 3   | Phạm Thành Danh          | Thành viên — hỗ trợ phát triển                                                 |
| 4   | Nguyễn Hữu Thanh Trường  | Tài liệu & bàn giao — rà `README.md`, `prompt_logic.md`, QA, quay demo        |

---

## Prompt Logic

Xem chi tiết cách đội ngũ sử dụng prompt để thiết kế hệ thống chuyển động, lý do UX cho từng section, và kết quả kiểm tra hiệu năng trong:

👉 **[prompt_logic.md](prompt_logic.md)**

---

## Giấy phép

© 2026 Left 4 Dev. Dự án học tập — không sử dụng thương mại.
Ảnh minh họa từ [Unsplash](https://unsplash.com), font từ [Google Fonts](https://fonts.google.com), scroll animation từ [AOS](https://github.com/michalsnik/aos).
