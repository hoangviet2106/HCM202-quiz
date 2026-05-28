# Tasks: HCM Quiz Review

## Phase 1: Chuẩn bị dữ liệu JSON từ PDF

- [ ] 1.1 Xác định schema chuẩn cho bộ câu hỏi
  - Chốt các trường bắt buộc cho `Question`, `AnswerOption`, `QuestionBank`, `ReviewItem`.
  - Quy định rõ định dạng `id`, nội dung câu hỏi, danh sách lựa chọn, đáp án đúng, và ghi chú/giải thích.
- [ ] 1.2 Tạo script trích xuất câu hỏi từ PDF nguồn
  - Viết script chạy độc lập để đọc PDF và chuyển từng câu thành bản ghi JSON.
  - Tách riêng logic parse, làm sạch văn bản, và ghi file đầu ra.
- [ ] 1.3 Thêm kiểm tra tính hợp lệ dữ liệu đầu vào
  - Kiểm tra thiếu đáp án, trùng câu, trùng số thứ tự, và định dạng lựa chọn không hợp lệ.
  - Báo lỗi rõ ràng khi dữ liệu không đạt yêu cầu.
- [ ] 1.4 Chuẩn hóa và xuất file `public/questions.json`
  - Sinh file JSON cuối cùng với 270 câu hỏi hợp lệ.
  - Đảm bảo thứ tự câu hỏi ổn định và `id` không thay đổi giữa các lần chạy.
- [ ] 1.5 Đối chiếu mẫu với PDF gốc
  - Spot-check nhiều câu ở đầu, giữa, cuối bộ đề để xác nhận nội dung không bị sai lệch.
  - Ghi nhận các trường hợp cần chỉnh tay nếu script parse chưa đúng.
- [ ] 1.6 Thêm checklist xác minh dữ liệu
  - Xác nhận file JSON có thể parse được.
  - Xác nhận đúng 270 câu hỏi và mỗi câu chỉ có một đáp án đúng.

## Phase 2: Xây dựng giao diện React + Vite

- [ ] 2.1 Khởi tạo ứng dụng Vite React
  - Thiết lập cấu trúc `src/`, `public/`, và điểm vào ứng dụng.
  - Bảo đảm app chạy được trong trình duyệt với dữ liệu JSON tĩnh.
- [ ] 2.2 Tạo lớp nạp dữ liệu câu hỏi
  - Đọc `public/questions.json` khi app khởi động.
  - Xử lý trạng thái loading, lỗi tải dữ liệu, và dữ liệu rỗng.
- [ ] 2.3 Thiết kế layout hai cột cho màn hình ôn tập
  - Cột trái hiển thị danh sách câu hỏi.
  - Cột phải hiển thị chi tiết câu hỏi đang chọn.
  - Đảm bảo layout co giãn tốt trên desktop và mobile.
- [ ] 2.4 Xây dựng component danh sách câu hỏi
  - Hiển thị số thứ tự hoặc tóm tắt ngắn của từng câu.
  - Làm nổi bật câu đang được chọn.
  - Chuẩn bị vị trí cho biểu tượng trạng thái đúng/sai.
- [ ] 2.5 Xây dựng component chi tiết câu hỏi
  - Hiển thị nội dung câu hỏi, các phương án trả lời, và phần ghi chú nếu có.
  - Tách rõ phần chọn đáp án và phần phản hồi kết quả.
- [ ] 2.6 Xây dựng component lựa chọn đáp án
  - Cho phép người học nhấp/chọn một phương án cho câu hiện tại.
  - Trình bày trạng thái selected, đúng, sai, và disabled một cách rõ ràng.
- [ ] 2.7 Áp dụng kiểu chữ và khoảng cách tối ưu cho tiếng Việt
  - Chọn font dễ đọc, cỡ chữ phù hợp, và độ tương phản đủ cao.
  - Giữ bố cục không vỡ khi nội dung câu dài hoặc nhiều phương án.
- [ ] 2.8 Thêm trạng thái hiển thị cơ bản cho app
  - Có giao diện loading ban đầu.
  - Có giao diện khi chưa chọn câu nào.
  - Có giao diện báo lỗi dữ liệu hoặc file JSON không hợp lệ.

## Phase 3: Logic trả lời, ôn sai, và lưu trạng thái

- [ ] 3.1 Implement trạng thái chọn câu và đáp án hiện tại
  - Lưu câu đang mở và đáp án đang chọn trong state của ứng dụng.
  - Khi đổi câu, panel bên phải phải cập nhật đúng nội dung tương ứng.
- [ ] 3.2 Tính phản hồi đúng/sai ngay sau khi chọn đáp án
  - So sánh đáp án người học chọn với đáp án đúng của câu hỏi.
  - Hiển thị phản hồi ngay lập tức trong panel chi tiết.
- [ ] 3.3 Cập nhật trạng thái câu hỏi ở cột trái
  - Hiển thị biểu tượng ✓ cho câu đúng và ✗ cho câu sai.
  - Đồng bộ màu sắc/trạng thái với kết quả đã lưu.
- [ ] 3.4 Lưu tiến độ học vào `localStorage`
  - Ghi lại câu đã trả lời, đáp án đã chọn, và trạng thái đúng/sai sau mỗi lần thay đổi.
  - Đặt key lưu trữ ổn định để có thể khôi phục qua lần tải lại tiếp theo.
- [ ] 3.5 Khôi phục trạng thái khi tải lại trang
  - Đọc `localStorage` lúc khởi động và tái tạo tiến độ học.
  - Đảm bảo câu đã làm vẫn hiển thị đúng lựa chọn trước đó.
- [ ] 3.6 Thêm chế độ xem lại câu sai
  - Lọc ra các câu trả lời sai để người học ôn lại nhanh.
  - Bảo đảm danh sách xem lại chỉ chứa các câu cần luyện thêm.
- [ ] 3.7 Thêm nút “Reset all answers”
  - Xóa toàn bộ dữ liệu đã lưu trong `localStorage`.
  - Đưa ứng dụng về trạng thái sạch và cập nhật lại toàn bộ badge/trạng thái.
- [ ] 3.8 Tổng hợp chỉ số phiên học
  - Tính số câu đúng, số câu sai, và tỷ lệ hoàn thành từ state hiện tại.
  - Hiển thị các chỉ số này ở vị trí dễ đọc trong giao diện.
- [ ] 3.9 Kiểm tra hành vi quay lại câu đã làm
  - Xác nhận khi người học chuyển sang câu khác rồi quay lại, lựa chọn cũ vẫn còn.
  - Xác nhận khi refresh trang, trạng thái vẫn không mất.
- [ ] 3.10 Chạy kiểm tra thủ công cuối cùng cho luồng ôn tập chính
  - Mở app, chọn nhiều câu, trả lời đúng/sai, chuyển câu, refresh, và reset.
  - Xác nhận toàn bộ luồng hoạt động đúng trên desktop và mobile.