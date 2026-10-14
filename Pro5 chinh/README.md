# Gia Long Portfolio

Portfolio cá nhân của Gia Long, sinh viên Kỹ thuật Phần mềm. Dự án được xây dựng trong học phần **111101 · Thiết kế Web** để giới thiệu bản thân, kỹ năng đang học và quá trình thực hành phát triển giao diện.

## Công nghệ

- HTML5 semantic
- CSS3, CSS Custom Properties, Flexbox và Grid
- JavaScript thuần
- AOS 2.3.4 cho hiệu ứng khi cuộn
- Google Fonts: Manrope và DM Mono

## Chạy dự án

Đây là website tĩnh. Có thể mở `index.html` trực tiếp hoặc chạy máy chủ local:

```sh
python3 -m http.server 8000
```

Sau đó truy cập `http://localhost:8000`.

## Tính năng

- Bố cục responsive cho desktop và mobile.
- Menu điều hướng mobile trượt từ cạnh màn hình.
- Chuyển ngôn ngữ Việt/Anh.
- Hiệu ứng AOS có độ trễ theo từng nhóm nội dung và tôn trọng cài đặt giảm chuyển động.
- Bảng màu được quản lý bằng CSS Custom Properties.
- Footer ba cột với liên kết nhanh và form mở email để gửi yêu cầu nhận tin. Form chưa kết nối dịch vụ lưu đăng ký.

## Cấu trúc

```text
.
├── index.html
├── README.md
├── css/
│   ├── components.css
│   └── main.css
└── js/
    └── app.js
```

## Prompt mẫu

Các prompt dưới đây là mẫu để ghi lại hoặc điều chỉnh theo những tình huống thực tế của nhóm:

1. **Responsive:** “Kiểm tra trang ở viewport 375px, tìm phần tử gây tràn ngang và sửa bằng Grid/Flexbox mà không làm thay đổi bố cục desktop.”
2. **Navigation:** “Hoàn thiện menu mobile dạng panel trượt cạnh bên, hỗ trợ bàn phím, Escape, trạng thái ARIA và tôn trọng prefers-reduced-motion.”
3. **Validation:** “Phân tích từng lỗi từ W3C Nu HTML Checker, giải thích nguyên nhân theo markup hiện tại và sửa lỗi mà không xóa nội dung có ý nghĩa.”
4. **CSS tokens:** “Rà soát stylesheet, đưa các màu dùng trực tiếp vào CSS Custom Properties và giữ nguyên tương phản cũng như sắc thái giao diện.”
5. **Performance:** “Kiểm tra tài nguyên tải ngoài và ảnh của trang; chỉ chuyển ảnh sang WebP khi có ảnh nguồn, rồi xác minh kích thước và đường dẫn sau chuyển đổi.”

## Kiểm tra trước khi nộp

- Kiểm tra giao diện ở các kích thước mobile và desktop.
- Chạy HTML qua [W3C Nu HTML Checker](https://validator.w3.org/nu/) và xử lý các cảnh báo phù hợp.
- Xác nhận các tài nguyên CDN có thể tải trong môi trường trình duyệt.
- Thêm liên kết và ảnh chụp của sáu bài thực hành vào Hub khi các sản phẩm đó có trong repo hoặc đã có URL công khai.
