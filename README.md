# DuongBot AI & D-BotAI Firmware Flasher

Trang hiện có hỗ trợ hai firmware ESP32-S3 với cùng bố cục lựa chọn và bộ nạp. Chọn một firmware trong thẻ thiết bị; tiêu đề, thông số, ảnh, danh sách tính năng và file nạp sẽ đổi đồng bộ theo lựa chọn.

- **DuongBot AI** — `duongbot_cam_oled.bin` — ESP32S3-N16-R8-CAM-40P.
- **D-BotAI Dual OLED v1.2** — `D-BotAI.bin` — ESP32-S3-N16-R8-44P.

Cả hai file full image được ghi từ offset `0x000000`. Bộ nạp chỉ tiếp tục khi nhận diện được chip ESP32-S3.

## Chạy trang

Trong PowerShell tại thư mục này, chạy:

```powershell
py -m http.server 8000
```

Mở <http://localhost:8000> bằng Chrome hoặc Edge trên máy tính. Dừng máy chủ bằng `Ctrl+C`.

## Nạp firmware

1. Chọn đúng firmware và kiểm tra lại model bo mạch trong thẻ thiết bị.
2. Cắm cáp USB có truyền dữ liệu, bấm **Kết nối & nạp** và chọn cổng USB/COM.
3. Xác nhận thao tác, giữ cáp và nguồn ổn định đến khi tiến độ đạt 100%.

Thư viện `esptool-js` tải từ CDN nên trang cần Internet. Nếu cổng không xuất hiện, cài driver USB–UART phù hợp (CH340/CH341 hoặc CP210x).
