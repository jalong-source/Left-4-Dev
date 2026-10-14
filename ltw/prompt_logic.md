# Prompt Logic — Left 4 Dev Interactive Showcase

## Prompt bậc thầy

> Hãy thiết kế chuyển động cho showcase nhóm Left 4 Dev theo một hệ thống nhất quán: chỉ dùng `opacity` và `transform`, thời lượng 400–700 ms, và cubic-bezier `cubic-bezier(0.22, 1, 0.36, 1)` cho chuyển động vào để có gia tốc nhanh rồi hãm mềm. Trạng thái nhấn dùng `scale(0.97)` và thời lượng ngắn. Không animate `top`, `left`, `width` hoặc `height`; giữ nội dung đọc được nếu thư viện scroll animation không tải; tôn trọng `prefers-reduced-motion`; kiểm tra ở mobile trước khi kết luận.

## Prompt xử lý hiệu ứng

1. **Intro animation:** “Tạo intro cho header đi xuống nhẹ từ trên, nội dung hero trượt lên và hình ảnh đi vào từ cạnh bên. Chỉ animate opacity/transform, stagger ngắn, không làm nội dung bị ẩn nếu người dùng bật reduced motion.”
2. **Scroll reveal:** “Dùng AOS để reveal các section theo một lần khi cuộn. Thời lượng đồng bộ với design token, không kích hoạt lại liên tục; nếu AOS không tải, nội dung vẫn phải hiển thị.”
3. **Project cards:** “Tạo hover state tinh tế cho ảnh bằng transform scale nhỏ. Nút chi tiết phải hoạt động bằng bàn phím, đồng bộ `aria-expanded` và trạng thái nội dung, không phụ thuộc hover.”
4. **CTA và menu mobile:** “Cho nút phản hồi rõ khi hover và active bằng transform/background; menu mobile có trạng thái mở/đóng truy cập được, đóng sau khi chọn liên kết hoặc nhấn Escape.”

## Lý do UX theo section

- **Header và Hero:** header fade/slide xuống, headline và mô tả slide-up theo nhịp ngắn `stagger`; ảnh trượt vào từ bên phải để tạo điểm nhìn thứ hai. Thứ tự này dẫn mắt từ nhận diện Left 4 Dev đến lời giới thiệu nhóm rồi CTA. Khi bật `prefers-reduced-motion`, thời lượng animation được rút về mức tối thiểu và phần reveal vẫn hiện đầy đủ, không để nội dung bị ẩn.
- **About:** AOS `fade-up` nhẹ giúp section tách khỏi hero khi cuộn nhưng không tranh sự chú ý với nội dung.
- **Projects:** ảnh scale nhẹ khi hover/focus để báo khả năng tương tác. Nút mở mô tả hỗ trợ click và bàn phím, nên thông tin không bị khóa sau hover.
- **Toolkit:** reveal một lần để duy trì nhịp cuộn; các kỹ năng hiển thị dạng nhãn dễ quét nhanh.
- **Contact:** CTA dùng tương phản màu và trạng thái active ngắn để phản hồi thao tác mà không làm chậm luồng đọc.
- **Mobile và reduced motion:** grid chuyển thành một cột, menu thu gọn và mọi hiệu ứng chuyển động được giảm khi hệ điều hành yêu cầu.

## Review hiệu năng

Các hiệu ứng dùng `transform`/`opacity`, không animate `top` hoặc `left`. AOS chỉ khởi tạo nếu thư viện tồn tại; nội dung mặc định vẫn hiển thị nếu CDN không sẵn sàng. Ảnh ngoài hero tải lazy, còn ảnh hero được ưu tiên tải.

## Bàn giao demo

Quay màn hình 30–60 giây ở desktop và mobile để nộp cùng repository. File GIF/video cần được tạo sau khi chốt bản review của nhóm.