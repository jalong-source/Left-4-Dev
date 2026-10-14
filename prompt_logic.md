# Prompt Logic — Left 4 Dev Interactive Showcase

> Tài liệu này giải thích hệ thống prompt đã dùng để thiết kế chuyển động, lý do UX đằng sau mỗi quyết định theo từng section, và kết quả kiểm tra hiệu năng / accessibility.

---

## 1. Prompt bậc thầy (Master Prompt)

```
Hãy thiết kế chuyển động cho showcase nhóm Left 4 Dev theo một hệ thống
nhất quán: chỉ dùng `opacity` và `transform`, thời lượng 400–700 ms, và
cubic-bezier `cubic-bezier(0.22, 1, 0.36, 1)` cho chuyển động vào để có
gia tốc nhanh rồi hãm mềm. Trạng thái nhấn dùng `scale(0.97)` và thời
lượng ngắn. Không animate `top`, `left`, `width` hoặc `height`; giữ nội
dung đọc được nếu thư viện scroll animation không tải; tôn trọng
`prefers-reduced-motion`; kiểm tra ở mobile trước khi kết luận.
```

### Tại sao prompt này quan trọng?

| Ràng buộc trong prompt          | Lý do kỹ thuật / UX                                                                                       |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Chỉ `opacity` + `transform`    | Hai thuộc tính này chạy trên **GPU compositor thread**, không trigger layout hay paint → 60 fps ổn định     |
| Không `top/left/width/height`   | Animate các thuộc tính layout gây **reflow toàn bộ DOM tree** → giật lag đặc biệt trên mobile/low-end       |
| Easing `cubic-bezier(0.22,1,0.36,1)` | Tăng tốc nhanh ở đầu → cảm giác "tức thì", hãm mềm ở cuối → không bị cắt đột ngột                  |
| `scale(0.97)` cho active state  | Micro-feedback cho thao tác nhấn, đủ nhỏ để không gây khó chịu nhưng đủ rõ để nhận biết                   |
| `prefers-reduced-motion`        | Tôn trọng người dùng nhạy cảm với chuyển động (tiền đình, migraine…)                                       |
| Fallback khi CDN fail           | AOS không tải → nội dung vẫn `opacity: 1` mặc định, không bị ẩn                                           |

---

## 2. Prompt xử lý hiệu ứng (chi tiết)

### 2.1 Intro Animation

```
Tạo intro cho header đi xuống nhẹ từ trên, nội dung hero trượt lên và
hình ảnh đi vào từ cạnh bên. Chỉ animate opacity/transform, stagger
ngắn, không làm nội dung bị ẩn nếu người dùng bật reduced motion.
```

**Kết quả triển khai:**

| Phần tử       | Keyframe          | Delay   | Chi tiết                               |
| ------------- | ----------------- | ------- | -------------------------------------- |
| Header        | `header-enter`    | 0ms     | `translateY(-16px)` → 0, 0.7s          |
| Eyebrow + H1  | `rise-in`         | 0ms     | `translateY(24px)` → 0, 0.8s           |
| H1 (delay)    | `rise-in`         | 120ms   | Stagger `.delay-one`                   |
| Hero bottom   | `rise-in`         | 240ms   | Stagger `.delay-two`                   |
| Hero image    | `visual-enter`    | 160ms   | `translateX(28px)` → 0, 0.9s           |

> **Lý do stagger**: Tạo "nhịp đọc" tự nhiên — mắt người xử lý theo thứ tự từ trên xuống, từ trái sang. Stagger 120ms đủ nhận biết thứ tự mà không quá chậm.

### 2.2 Scroll Reveal

```
Dùng AOS để reveal các section theo một lần khi cuộn. Thời lượng đồng
bộ với design token, không kích hoạt lại liên tục; nếu AOS không tải,
nội dung vẫn phải hiển thị.
```

**Kết quả triển khai:**

- AOS init với `once: true` — animation chỉ chạy 1 lần, không lặp khi cuộn ngược.
- `duration: 650` đồng bộ gần với `--transition-long: 0.72s`.
- `offset: 80` — trigger sớm hơn viewport edge để scroll cảm thấy mượt.
- **Fallback**: class `aos-ready` chỉ được thêm khi `window.AOS` tồn tại. Không có class này → CSS rule `body.aos-ready [data-aos] { opacity: 0 }` không active → nội dung hiển thị bình thường.

### 2.3 Project Cards

```
Tạo hover state tinh tế cho ảnh bằng transform scale nhỏ. Nút chi tiết
phải hoạt động bằng bàn phím, đồng bộ `aria-expanded` và trạng thái
nội dung, không phụ thuộc hover.
```

**Kết quả triển khai:**

- **Image hover**: `transform: scale(1.045)` + `filter: saturate(1.12)` — đủ nhẹ để gợi tương tác, không choáng.
- **Focus-within**: cùng hiệu ứng scale khi user tab vào card → keyboard user cũng thấy feedback.
- **Detail toggle button**:
  - Click hoặc Enter/Space → toggle `aria-expanded` + `hidden` attribute.
  - JS cập nhật `aria-label` giữa "Xem chi tiết" ↔ "Ẩn chi tiết".
  - CSS animation `detail-in` cho nội dung mở (`translateY(8px)` → 0).

### 2.4 CTA & Menu Mobile

```
Cho nút phản hồi rõ khi hover và active bằng transform/background; menu
mobile có trạng thái mở/đóng truy cập được, đóng sau khi chọn liên kết
hoặc nhấn Escape.
```

**Kết quả triển khai:**

| Tương tác             | Phản hồi                                                     |
| --------------------- | ------------------------------------------------------------- |
| Button hover          | `translateY(-3px)` + `box-shadow` → nút "nổi lên"            |
| Button active         | `scale(0.97)` + `transition: 0.12s` → phản hồi tức thì      |
| `.button-dark:hover`  | Background chuyển sang `var(--blue)` → nhấn mạnh CTA         |
| Nav-contact hover     | `translateY(-2px)` + background đen → thay đổi rõ            |
| Menu toggle           | Hai `<span>` xoay thành dấu ✕ bằng `rotate(±45deg)`         |
| Menu close            | Auto-close khi click link hoặc nhấn Escape                   |
| `aria-expanded`       | Toggle giữa `"true"` / `"false"`, label thay đổi tương ứng   |

---

## 3. Lý do UX theo section

### 🏠 Header & Hero

| Quyết định                           | Lý do UX                                                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Header slide xuống trước             | Thiết lập nhận diện thương hiệu (logo L4D) trước mọi nội dung khác                                          |
| Headline `rise-in` stagger           | Dẫn mắt từ nhận diện → lời giới thiệu → CTA theo hierarchy tự nhiên                                        |
| Ảnh hero từ bên phải                 | Tạo "điểm nhìn thứ hai" — mắt lướt xong chữ sẽ đến ảnh, tăng thời gian ở trên hero                         |
| `prefers-reduced-motion` fallback    | Animation rút về `0.01ms`, AOS disable hoàn toàn → nội dung hiện ngay, không ẩn                              |
| Skip link `.skip-link`               | Keyboard user có thể bỏ qua navigation trực tiếp đến `#main`                                                 |

### 📖 About

| Quyết định                    | Lý do UX                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------- |
| AOS `fade-up` nhẹ             | Tách biệt khỏi hero khi cuộn nhưng không tranh chú ý với nội dung            |
| Reveal một lần (`once: true`) | Tránh nhấp nháy khi cuộn lên xuống, giữ trang ổn định                        |
| Ba nguyên tắc dạng grid       | Dễ quét nhanh, mỗi nguyên tắc đứng độc lập nhưng cùng hàng → song song       |

### 👥 Team

| Quyết định               | Lý do UX                                                                    |
| ------------------------ | ---------------------------------------------------------------------------- |
| Grid 4 → 2 → 1 cột      | Responsive tự nhiên, không bị tràn hay chữ quá nhỏ ở bất kỳ viewport nào    |
| Nhóm trưởng highlight    | `color: var(--blue)` + `font-weight: 700` — phân biệt vai trò bằng thị giác |
| `overflow-wrap: anywhere` | Tên tiếng Việt dài không bị tràn khỏi card                                 |

### 🚀 Projects

| Quyết định                         | Lý do UX                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------- |
| Image `scale(1.045)` khi hover     | Gợi ý "có thể tương tác" mà không phá layout — scale nhỏ nên ảnh vẫn crop đẹp  |
| `focus-within` cùng hiệu ứng      | Keyboard user cũng nhận được cùng tín hiệu thị giác → bình đẳng truy cập       |
| Nút toggle thay vì hover-only      | Thông tin không bị "khóa" sau hover — mobile và keyboard user đều tiếp cận được |
| `hidden` attribute cho detail       | Semantic: trình đọc màn hình không đọc nội dung bị ẩn                           |
| Ghi chú "prototype / learning"     | Quản lý kỳ vọng — rõ ràng đây là bài tập, không phải sản phẩm thương mại       |

### 🛠️ Toolkit

| Quyết định                    | Lý do UX                                                       |
| ----------------------------- | --------------------------------------------------------------- |
| Tag list (nhãn)               | Dễ quét nhanh hơn danh sách dài, thân thuộc với developer       |
| Aside decorative ẩn ≤ 900px   | Trên mobile/tablet, không gian quý giá hơn trang trí            |
| Reveal một lần                | Duy trì nhịp cuộn nhất quán xuyên suốt trang                   |

### 📬 Contact

| Quyết định                          | Lý do UX                                                                  |
| ------------------------------------ | -------------------------------------------------------------------------- |
| Background tối (`var(--ink)`)        | Tạo tương phản mạnh → section này nổi bật, CTA rõ ràng                    |
| CTA `var(--lime)` trên nền tối      | Tương phản cao, dẫn mắt đến hành động cuối cùng                            |
| Active press `scale(0.97)` 120ms    | Phản hồi thao tác tức thì mà không làm chậm luồng đọc                     |
| Doodle `✳` decorative               | `pointer-events: none` + `aria-hidden` → không cản tương tác, không đọc   |

### 📱 Mobile & Reduced Motion

| Quyết định                            | Lý do UX                                                                   |
| -------------------------------------- | --------------------------------------------------------------------------- |
| Grid chuyển thành 1 cột (≤ 640px)     | Content-first: đọc theo luồng tự nhiên trên mobile                          |
| Menu hamburger + Escape close          | Pattern quen thuộc, có trạng thái `aria-expanded` cho screen reader          |
| `prefers-reduced-motion` CSS + JS     | Double-safety: CSS tắt animation, JS disable AOS → không animation nào sót  |
| `min-width: 320px`                    | Không vỡ layout ở viewport tối thiểu (iPhone SE cũ)                         |

---

## 4. Kết quả kiểm tra hiệu năng (QA Report)

### 4.1 Audit animate thuộc tính layout

✅ **PASS** — Không có animation hay transition nào sử dụng `top`, `left`, `width` hoặc `height`.

**Danh sách keyframes đã kiểm tra:**

| Keyframe          | Thuộc tính animate         | Kết quả |
| ----------------- | -------------------------- | ------- |
| `header-enter`    | `opacity`, `transform`     | ✅ PASS  |
| `rise-in`         | `opacity`, `transform`     | ✅ PASS  |
| `visual-enter`    | `opacity`, `transform`     | ✅ PASS  |
| `ticker-slide`    | `transform`                | ✅ PASS  |
| `detail-in`       | `opacity`, `transform`     | ✅ PASS  |

**Danh sách transition đã kiểm tra:**

| Selector                          | Thuộc tính transition                          | Kết quả |
| --------------------------------- | ---------------------------------------------- | ------- |
| `.site-nav a`                     | `color`                                        | ✅ PASS  |
| `.nav-contact`                    | `background-color`, `color`, `transform`       | ✅ PASS  |
| `.button`                         | `transform`, `background-color`, `color`, `box-shadow` | ✅ PASS  |
| `.text-link`                      | `color`, `border-color`                        | ✅ PASS  |
| `.project-image img`              | `transform`, `filter`                          | ✅ PASS  |
| `.detail-toggle`                  | `color`, `background-color`, `transform`       | ✅ PASS  |
| `.back-top`                       | `color`                                        | ✅ PASS  |
| `body.aos-ready [data-aos]`       | `opacity`, `transform`                         | ✅ PASS  |
| `.menu-toggle span`               | `transform`                                    | ✅ PASS  |

### 4.2 Audit keyboard navigation (Tab focus)

✅ **PASS** — Toàn bộ phần tử tương tác đều reachable bằng Tab.

| Phần tử                  | Tab reachable | Focus visible | Keyboard operable | Ghi chú                          |
| ------------------------ | ------------- | ------------- | ------------------ | -------------------------------- |
| Skip link                | ✅             | ✅             | Enter → `#main`    | Ẩn mặc định, hiện khi focus      |
| Logo wordmark `L4D.`     | ✅             | ✅             | Enter → `#home`    |                                  |
| Nav links (4)            | ✅             | ✅             | Enter → anchor     |                                  |
| Hero CTA button          | ✅             | ✅             | Enter → `#team`    |                                  |
| Scroll cue link          | ✅             | ✅             | Enter → `#about`   |                                  |
| Text link (About)        | ✅             | ✅             | Enter → `#team`    |                                  |
| Detail toggle buttons (3)| ✅             | ✅             | Enter/Space toggle | `aria-expanded` cập nhật         |
| Contact CTA              | ✅             | ✅             | Enter → GitHub     | `target="_blank"`, `rel="noreferrer"` |
| Footer logo              | ✅             | ✅             | Enter → `#home`    |                                  |
| Footer "Lên đầu trang"   | ✅             | ✅             | Enter → `#home`    |                                  |
| Menu toggle (mobile)     | ✅             | ✅             | Enter/Space toggle | `aria-expanded`, Escape đóng     |

### 4.3 Audit Accessibility

| Tiêu chí                          | Kết quả | Chi tiết                                                   |
| --------------------------------- | ------- | ---------------------------------------------------------- |
| Skip link                         | ✅ PASS  | `.skip-link` → `#main`                                    |
| Semantic landmarks                | ✅ PASS  | `<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`    |
| ARIA attributes                   | ✅ PASS  | 26 instances across HTML                                   |
| `:focus-visible` style            | ✅ PASS  | `outline: 3px solid var(--blue); outline-offset: 4px`     |
| `prefers-reduced-motion`          | ✅ PASS  | CSS media query + JS `matchMedia` check                    |
| `lang="vi"`                       | ✅ PASS  | Đúng ngôn ngữ chính                                       |
| Image alt text                    | ✅ PASS  | Tất cả `<img>` đều có `alt` mô tả                         |
| Decorative content `aria-hidden`  | ✅ PASS  | Ticker, stamps, doodle đều `aria-hidden="true"`            |

---

## 5. Bàn giao demo

### Yêu cầu

- **Thời lượng**: 30–60 giây
- **Nền tảng**: Desktop (≥ 1024px) + Mobile (≤ 640px hoặc Chrome DevTools mobile emulation)
- **Nội dung cần thể hiện**:
  1. Intro animation khi tải trang
  2. Scroll qua các section → AOS reveal
  3. Hover và click project card → detail toggle
  4. Tab navigation demo (focus visible outline)
  5. Menu hamburger trên mobile (mở / đóng / Escape)
  6. `prefers-reduced-motion` demo (optional)

### File nộp

- `showcase.gif` hoặc `showcase.mp4` — đặt cùng thư mục gốc dự án
- Link trong README.md đã tham chiếu sẵn: `![Demo Desktop](showcase.gif)`

### Hướng dẫn quay demo

**Cách 1 — OBS Studio (khuyến nghị):**
1. Cài đặt [OBS Studio](https://obsproject.com/)
2. Thêm source "Window Capture" → chọn cửa sổ trình duyệt
3. Recording format: MP4, Resolution: 1920×1080
4. Quay desktop 30s → chuyển Chrome DevTools mobile → quay mobile 30s
5. Dùng [ezgif.com](https://ezgif.com/video-to-gif) hoặc `ffmpeg` để convert:
   ```bash
   ffmpeg -i showcase.mp4 -vf "fps=12,scale=800:-1" -loop 0 showcase.gif
   ```

**Cách 2 — ShareX (Windows, miễn phí):**
1. Tải từ [getsharex.com](https://getsharex.com)
2. Capture → Screen Recording (GIF) → chọn vùng trình duyệt
3. Kết thúc → tự động lưu GIF

**Cách 3 — PowerShell script tự động (chỉ mở trình duyệt):**
- Xem file `demo-guide.ps1` đi kèm (nếu có)

---

## 6. Tổng kết

Toàn bộ hệ thống chuyển động của Left 4 Dev showcase tuân thủ:

1. ✅ Chỉ animate `opacity` + `transform` → hiệu năng tốt, không giật lag
2. ✅ Không animate `top`, `left`, `width`, `height` → không layout reflow
3. ✅ Keyboard navigation hoạt động đầy đủ → Tab, Enter, Space, Escape
4. ✅ ARIA attributes nhất quán → screen reader friendly
5. ✅ `prefers-reduced-motion` được tôn trọng ở cả CSS và JavaScript
6. ✅ Fallback khi CDN fail → nội dung luôn hiển thị

---

*Tài liệu biên soạn bởi **Nguyễn Hữu Thanh Trường** (TV4 — Prompt Engineer & Documenter)*
*Rà soát lần cuối: 14/10/2026*