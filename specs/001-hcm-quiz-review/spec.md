# Feature Specification: HCM Quiz Review

**Feature Branch**: `[001-hcm-quiz-review]`

**Created**: 2026-05-26

**Status**: Draft

**Input**: User description: "Hãy xây dựng một ứng dụng web để tôi ôn tập 270 câu hỏi trắc nghiệm môn Tư tưởng Hồ Chí Minh. Tôi đã có sẵn file PDF chứa các câu hỏi. Hãy mô tả chi tiết các tính năng chính."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ôn tập với danh sách câu hỏi (Priority: P1)

Người học mở ứng dụng, thấy danh sách 270 câu hỏi ở cột trái. Nhấp vào bất kỳ câu nào, cột
phải hiển thị nội dung câu hỏi và các phương án. Người học chọn đáp án, nhận phản hồi đúng/sai
ngay lập tức, và cột trái cập nhật biểu tượng trạng thái.

**Why this priority**: Đây là giá trị cốt lõi của sản phẩm; nếu không có luồng luyện tập cơ bản thì ứng dụng không có ích cho người học.

**Independent Test**: Có thể kiểm tra bằng cách mở app, chọn nhiều câu khác nhau trong danh
sách, trả lời và xác nhận phần hiển thị bên phải cùng trạng thái bên trái cập nhật đúng.

**Acceptance Scenarios**:

1. **Given** danh sách câu hỏi đã sẵn sàng, **When** người học mở ứng dụng, **Then** cột trái hiển thị 270 câu hỏi và cột phải sẵn sàng hiển thị nội dung câu được chọn.
2. **Given** người học nhấp vào một câu trong danh sách, **When** câu đó được mở, **Then** cột phải hiển thị nội dung câu hỏi và các phương án tương ứng.
3. **Given** người học chọn một đáp án, **When** họ nộp câu trả lời, **Then** ứng dụng hiển thị đúng/sai ngay lập tức và cập nhật biểu tượng trạng thái ở cột trái.

---

### User Story 2 - Ôn lại câu sai và theo dõi tiến độ (Priority: P2)

Người học xem lại các câu đã làm sai hoặc còn chưa chắc chắn để tập trung ôn lại phần yếu.

**Why this priority**: Học tốt hơn phụ thuộc vào khả năng nhận biết điểm yếu và luyện lại có chủ đích.

**Independent Test**: Có thể kiểm tra bằng cách làm sai một số câu, mở danh sách ôn lại và xác nhận các câu sai được gom đúng.

**Acceptance Scenarios**:

1. **Given** người học đã làm một phiên ôn tập, **When** họ mở phần xem lại, **Then** ứng dụng hiển thị danh sách các câu đã làm sai hoặc được đánh dấu cần ôn.
2. **Given** người học chọn một câu sai, **When** họ xem chi tiết, **Then** ứng dụng hiển thị đáp án đúng và ghi chú ôn tập.
3. **Given** người học quay lại sau đó, **When** họ mở tiến độ học, **Then** ứng dụng hiển thị trạng thái đã học, còn lại và lịch sử làm bài gần nhất.

---

### User Story 3 - Chuẩn bị dữ liệu câu hỏi (Priority: P3)

Người phát triển hoặc người biên soạn chạy một script riêng để trích xuất 270 câu hỏi từ file PDF
thành file JSON. Sau đó, ứng dụng web chỉ việc đọc file JSON này. Không cần giao diện import
trong web.

**Why this priority**: Dữ liệu nguồn đã có sẵn trong PDF, nên việc chuẩn bị JSON đúng định dạng
là điều kiện để ứng dụng đọc và hiển thị bộ câu hỏi một cách ổn định.

**Independent Test**: Có thể kiểm tra bằng cách chạy script với PDF mẫu, tạo ra file JSON, rồi
đối chiếu nội dung JSON với bộ câu hỏi nguồn.

**Acceptance Scenarios**:

1. **Given** một file PDF chứa câu hỏi, **When** người biên soạn chạy script trích xuất, **Then** hệ thống tạo ra file JSON từ bộ câu hỏi nguồn.
2. **Given** có câu hỏi trùng, thiếu đáp án hoặc sai định dạng, **When** script kiểm tra nội dung, **Then** script báo lỗi hoặc cảnh báo để người biên soạn xử lý.
3. **Given** file JSON đã được duyệt, **When** ứng dụng web khởi động, **Then** ứng dụng đọc file JSON đó làm nguồn câu hỏi chính thức.

---

### Edge Cases

- PDF có định dạng không đồng nhất, xuống dòng sai hoặc lẫn số thứ tự câu hỏi.
- Một câu hỏi có nhiều đáp án nhìn giống đúng nhưng chỉ một đáp án được phê duyệt là chính xác.
- Bộ câu hỏi chưa có giải thích cho tất cả các câu.
- Người học rời phiên ôn giữa chừng rồi quay lại sau đó.
- Người học làm lại câu đã từng làm sai nhiều lần.
- Một số câu bị trùng nội dung hoặc trùng số thứ tự trong tài liệu nguồn.
- Khi người dùng trả lời một câu, sau đó chuyển sang câu khác rồi quay lại câu cũ, hệ thống phải hiển thị đúng lựa chọn trước đó.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống MUST hiển thị cột trái chứa danh sách tất cả câu hỏi (dạng số thứ tự hoặc tóm tắt).
- **FR-002**: Hệ thống MUST cho phép người học nhấp vào bất kỳ câu hỏi nào để hiển thị nội dung câu hỏi và các phương án ở cột phải.
- **FR-003**: Hệ thống MUST cho phép người học chọn một đáp án cho câu hỏi đang xem, và lưu lại lựa chọn đó cùng với kết quả đúng/sai.
- **FR-004**: Hệ thống MUST hiển thị đáp án đúng và phần giải thích hoặc ghi chú ôn tập khi có sẵn.
- **FR-005**: Hệ thống MUST tổng kết kết quả phiên học bằng các chỉ số dễ hiểu như số câu đúng, số câu sai, và mức độ hoàn thành.
- **FR-006**: Hệ thống MUST cho phép người học xem lại các câu đã làm sai hoặc đã đánh dấu để ôn lại.
- **FR-007**: Hệ thống MUST lưu trạng thái học tập tối thiểu để người học có thể quay lại và tiếp tục từ nơi đã dừng.
- **FR-008**: Hệ thống MUST hỗ trợ quy trình tạo file JSON từ PDF nguồn thông qua một script riêng ngoài web app.
- **FR-009**: Hệ thống MUST phát hiện các lỗi nội dung phổ biến như trùng câu, thiếu đáp án, hoặc định dạng câu hỏi không hợp lệ trong dữ liệu đầu vào.
- **FR-010**: Hệ thống MUST chỉ đọc và trình bày bộ câu hỏi từ file JSON đã được chuẩn bị hợp lệ.
- **FR-011**: Hệ thống MUST trình bày tốt trên màn hình điện thoại và máy tính để người học ôn tập thuận tiện ở mọi nơi.
- **FR-012**: Hệ thống MUST hỗ trợ nội dung tiếng Việt rõ ràng, dễ đọc, không làm mất dấu hoặc làm rối bố cục câu hỏi.
- **FR-013**: Hệ thống MUST hiển thị biểu tượng (ví dụ: ✓ xanh cho đúng, ✗ đỏ cho sai) bên cạnh mỗi câu hỏi trên cột trái.
- **FR-014**: Hệ thống MUST lưu toàn bộ câu trả lời vào localStorage của trình duyệt, tự động khôi phục khi người dùng quay lại.
- **FR-015**: Hệ thống MUST cung cấp nút "Reset all answers" để xóa toàn bộ câu trả lời.

### Key Entities *(include if feature involves data)*

- **Question**: Một câu trắc nghiệm gồm nội dung câu hỏi, các lựa chọn trả lời, đáp án đúng, và ghi chú hoặc giải thích.
- **AnswerOption**: Một lựa chọn trả lời của câu hỏi.
- **StudySession**: Một phiên ôn tập của người học, gồm trạng thái tiến độ, kết quả và lịch sử trả lời gần nhất.
- **ReviewItem**: Một câu được đánh dấu để xem lại vì trả lời sai, chưa chắc chắn hoặc muốn ôn thêm.
- **QuestionBank**: Bộ câu hỏi chính thức đang được người học sử dụng.
- **ImportBatch**: Một đợt nhập câu hỏi từ PDF để rà soát trước khi xuất bản.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Người học có thể bắt đầu một phiên ôn tập và trả lời câu hỏi đầu tiên trong vòng 30 giây sau khi vào ứng dụng.
- **SC-002**: Ít nhất 90% người dùng thử nghiệm có thể hoàn thành một phiên ôn tập mẫu mà không cần hướng dẫn trực tiếp.
- **SC-003**: Người học có thể xem lại các câu sai của mình trong cùng một luồng thao tác rõ ràng sau khi hoàn thành bài.
- **SC-004**: Bộ 270 câu hỏi có thể được lưu trữ và trình bày nhất quán như một nguồn học chính thức.
- **SC-005**: Người biên soạn có thể nhập một file PDF nguồn và tạo ra bản nháp câu hỏi để rà soát trước khi xuất bản.
- **SC-006**: Trạng thái học tập của người học được giữ lại đủ để họ quay lại và tiếp tục ôn tập mà không phải làm lại từ đầu.

## Assumptions

- Người dùng có sẵn file PDF chứa đúng nội dung 270 câu hỏi trắc nghiệm môn Tư tưởng Hồ Chí Minh.
- Phiên bản đầu tiên tập trung vào một bộ câu hỏi duy nhất thay vì nhiều môn học hoặc nhiều bộ đề khác nhau.
- Có một người biên soạn hoặc người duyệt nội dung chịu trách nhiệm xác nhận bộ câu hỏi sau khi nhập từ PDF.
- Người học sử dụng tiếng Việt là ngôn ngữ chính và có thể truy cập ứng dụng trên điện thoại hoặc máy tính có kết nối mạng ổn định.
