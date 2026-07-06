# iStudent - Nền tảng học trực tuyến công nghệ miễn phí

iStudent là một nền tảng học tập trực tuyến hiện đại, trực quan hóa lộ trình học tập tối ưu bám sát đề thi ĐGNL. Được phát triển bằng công nghệ Next.js 15 (App Router), React 19, TypeScript và Tailwind CSS, sẵn sàng deploy trực tiếp lên Vercel.

## 🚀 Các tính năng chính
- **Khám phá khóa học**: Tìm kiếm, lọc và phân cấp khóa học (Cơ bản, Trung bình, Nâng cao).
- **Học tập trực quan**: Video Player hỗ trợ custom speed, subtitles, picture-in-picture và transcripts.
- **Ghi chú Markdown**: Notepad thông minh tự động lưu, đính kèm mốc thời gian bài giảng và hỗ trợ xuất PDF.
- **Trắc nghiệm Quiz**: Đánh giá năng lực ngẫu nhiên câu hỏi kèm lời giải thích chi tiết.
- **Chứng nhận verify QR**: Cấp chứng chỉ số PDF sau khi hoàn thành bài thi với mã QR xác thực.
- **Personal Dashboard**: Thống kê thời gian học bằng biểu đồ Recharts, theo dõi XP, Streak liên tục và huy hiệu.
- **Admin Dashboard**: Giao diện quản lý CRUD mô phỏng cho các khóa học và danh mục.

## 🛠️ Công nghệ sử dụng
- **Core**: Next.js 16/15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide React icons
- **State**: Zustand (Local Storage persistence), TanStack Query
- **Charts**: Recharts
- **Video**: React Player (Youtube/MP4 supports)
- **Analytics & Speed**: Vercel Analytics, Vercel Speed Insights

---

## 💻 Hướng dẫn chạy cục bộ (Local Run)

### 1. Cài đặt các thư viện
Sau khi tải mã nguồn về máy, chạy lệnh cài đặt:
```bash
npm install --legacy-peer-deps
```
*(Sử dụng `--legacy-peer-deps` để đảm bảo độ tương thích mượt mà của các thư viện biểu đồ, video player với React 19)*

### 2. Cấu hình biến môi trường
Sao chép tệp biến môi trường mẫu:
```bash
cp .env.example .env.local
```

### 3. Chạy môi trường Development
Khởi chạy máy chủ chạy thử local:
```bash
npm run dev
```
Truy cập địa chỉ [http://localhost:3000](http://localhost:3000) trên trình duyệt để trải nghiệm ứng dụng.

### 4. Build sản phẩm hoàn chỉnh
Để biên dịch tối ưu hóa trước khi xuất bản:
```bash
npm run build
```

---

## 📦 Hướng dẫn Push lên GitHub & Deploy Vercel

### 1. Push mã nguồn lên GitHub
Mở terminal tại thư mục dự án và chạy các lệnh:
```bash
git init
git add .
git commit -m "feat: init istudent learning platform"
git branch -M main
git remote add origin https://github.com/username/ten-repo-cua-ban.git
git push -u origin main
```

### 2. Deploy lên Vercel
1. Đăng nhập vào [Vercel](https://vercel.com).
2. Chọn **Add New...** -> **Project**.
3. Chọn repo `ten-repo-cua-ban` từ danh sách GitHub của bạn.
4. Bấm **Deploy**. Vercel sẽ tự động phát hiện cấu hình Next.js và tiến hành build. Dự án của bạn sẽ online chỉ sau 1-2 phút!

---

## 🎨 Thông tin Tài khoản Thử nghiệm (Demo)
- **Tài khoản Học viên**: Đăng nhập mặc định (Click "Đăng nhập" ở Navbar).
- **Tài khoản Quản trị viên**: Điền email `admin@istudent.edu` để mở khóa trang quản lý Admin Dashboard.
