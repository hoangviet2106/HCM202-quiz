# My Vietnam Quiz App

Ứng dụng ôn tập câu hỏi trắc nghiệm môn Tư tưởng Hồ Chí Minh với giao diện React + Vite, lưu tiến độ bằng `localStorage`, và chế độ xem lại câu sai.

## Chạy dự án

```bash
npm install
npm run dev
```

## Trích xuất câu hỏi từ PDF

```bash
npm run extract:questions -- --input path/to/source.pdf --output public/questions.json
```

## Ghi chú

- Repo hiện có bộ câu hỏi mẫu trong `public/questions.json` để kiểm tra luồng UI và persistence.
- Khi có PDF nguồn thật, hãy chạy script trích xuất để tạo bộ 270 câu hỏi theo contract trong `specs/001-hcm-quiz-review/contracts/question-bank-schema.md`.# My Vietnam Quiz App

Mục tiêu: một ứng dụng quiz nhỏ để ôn tập kiến thức về Thành phố Hồ Chí Minh (HCM), phục vụ việc học và ôn tập theo bộ câu hỏi/chuẩn được lưu trong thư mục `specs`.

Tổng quan:
- **Tên dự án:** My Vietnam Quiz App
- **Mục đích:** Cung cấp bộ câu hỏi và bài kiểm tra nhanh để ôn tập kiến thức HCM.
- **Ngôn ngữ:** Tiếng Việt

Tính năng chính (dự kiến):
- Hiển thị câu hỏi theo từng chủ đề/spec
- Chấm điểm và thống kê kết quả
- Lưu lại tiến trình học

Cấu trúc thư mục chính:
- `specs/` – chứa tài liệu đặc tả và checklist cho các quiz, ví dụ [specs/001-hcm-quiz-review/spec.md](specs/001-hcm-quiz-review/spec.md)

Hướng dẫn nhanh:
1. Mở repo trong VS Code.
2. Xem nội dung các spec trong `specs/` để biết yêu cầu và câu hỏi mẫu.
3. (Tùy chọn) Triển khai frontend/backend theo spec — hiện tại repo chỉ chứa tài liệu mô tả.

Gợi ý các bước tiếp theo:
- Thiết kế model dữ liệu cho câu hỏi và bài kiểm tra.
- Tạo một prototype frontend (HTML/React/Vue) để hiển thị quiz.
- Thêm hướng dẫn cài đặt và các script chạy vào `package.json` hoặc `README.md` khi có mã nguồn.

Đóng góp:
- Mọi góp ý và PR đều được hoan nghênh. Vui lòng mở issue hoặc PR với mô tả rõ ràng về nội dung thay đổi.

Liên hệ:
- Người duy trì: (thêm thông tin liên hệ tại đây)

---
File này được tạo tự động để mô tả nhanh dự án và hướng dẫn các bước tiếp theo.
