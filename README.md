# Ứng dụng Quản lý Nhân sự (HRM)

Ứng dụng quản lý nhân sự được xây dựng bằng JavaScript thuần, HTML và CSS, không sử dụng bất kỳ framework nào.

## Tính năng chính

1. **Xác thực người dùng** - Đăng nhập/Đăng ký
2. **Quản lý nhân viên** - Thêm, sửa, xóa, tìm kiếm nhân viên
3. **Quản lý phòng ban** - Thêm, sửa, xóa phòng ban
4. **Quản lý vị trí** - Thêm, sửa, xóa vị trí công việc
5. **Quản lý lương** - Tính toán và hiển thị bảng lương
6. **Theo dõi chấm công** - Ghi nhận giờ vào/ra
7. **Quản lý nghỉ phép** - Yêu cầu và phê duyệt nghỉ phép
8. **Đánh giá hiệu suất** - Thêm đánh giá và xem báo cáo
9. **Quản lý dữ liệu JSON** - Xuất và nhập dữ liệu dưới dạng JSON

## Cách chạy ứng dụng

1. Mở file `index.html` trong trình duyệt web
2. Nếu trình duyệt báo lỗi về module JavaScript, bạn cần chạy ứng dụng thông qua một server cục bộ:
   - Sử dụng Live Server trong VS Code, hoặc
   - Sử dụng Python: `python -m http.server 8000` rồi truy cập `http://localhost:8000`

## Công nghệ sử dụng

- JavaScript ES6+
- HTML5
- CSS3
- LocalStorage để lưu trữ dữ liệu

## Cấu trúc dự án

```
hrmass/
├── app.js
├── attendanceModule.js
├── authModule.js
├── dataManagementModule.js
├── departmentModule.js
├── employeeDbModule.js
├── employeeManagementModule.js
├── index.html
├── leaveModule.js
├── performanceModule.js
├── positionModule.js
├── register.html
├── register.js
├── salaryModule.js
├── searchEmployeeModule.js
└── style.css
```

## Hướng dẫn sử dụng

1. **Đăng nhập**: Đăng ký tài khoản mới và sử dụng để đăng nhập
2. **Đăng ký tài khoản mới**: Chọn "Đăng ký tài khoản mới" trên màn hình đăng nhập hoặc truy cập trực tiếp file `register.html`
3. **Quản lý nhân viên**: Chọn "Quản lý Nhân sự" từ menu để thêm, sửa, xóa nhân viên. Danh sách nhân viên sẽ được hiển thị ngay dưới form thêm nhân viên.
4. **Tìm kiếm nhân viên**: Sử dụng chức năng tìm kiếm với các tiêu chí khác nhau
5. **Quản lý phòng ban/vị trí**: Thêm, sửa, xóa các phòng ban và vị trí
6. **Chấm công**: Ghi nhận giờ vào/ra cho nhân viên
7. **Nghỉ phép**: Yêu cầu và phê duyệt nghỉ phép
8. **Đánh giá hiệu suất**: Thêm đánh giá và xem báo cáo hiệu suất
9. **Quản lý dữ liệu JSON**: 
   - **Xuất dữ liệu**: Chọn "Quản lý Dữ liệu" → "Xuất dữ liệu JSON" để tải về file JSON chứa toàn bộ dữ liệu
   - **Nhập dữ liệu**: Chọn "Quản lý Dữ liệu" → Chọn file JSON → "Nhập dữ liệu JSON" để nhập dữ liệu từ file

## Lưu ý

- Dữ liệu được lưu trữ trong LocalStorage của trình duyệt
- Ứng dụng không tự động tạo tài khoản mẫu
- Giao diện được thiết kế responsive, phù hợp với cả desktop và mobile
- File JSON xuất ra chứa toàn bộ dữ liệu của hệ thống, có thể dùng để sao lưu hoặc chuyển dữ liệu