'use client';

import Link from 'next/link';
import { BookOpen, Send } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Slogan */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white font-extrabold shadow-sm">
                <span>i</span>
              </div>
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-lg font-bold tracking-tight text-transparent">
                iStudent
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Nền tảng học tập luyện thi Đánh giá Năng lực (ĐGNL) chất lượng cao của thầy Bùi Văn Công.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.tiktok.com/@dgnlhcm.thaybuivancong" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors" 
                aria-label="TikTok"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.94 1.18 2.26 2.01 3.71 2.37v3.86a9.55 9.55 0 0 1-5.18-1.58c-.01 1.76-.02 3.53-.02 5.29A9.12 9.12 0 0 1 12.35 23a9.23 9.23 0 0 1-5.74-2.2 9.17 9.17 0 0 1-3.23-5.26 9.17 9.17 0 0 1 1.25-6.72A9.22 9.22 0 0 1 10.36 5c.12 2.06-1.07 3.96-2.95 4.79-.81.36-1.72.48-2.59.34A5.3 5.3 0 0 0 3.7 13.9a5.27 5.27 0 0 0 1.94 3.79 5.29 5.29 0 0 0 4.9.73 5.26 5.26 0 0 0 3.42-4.9c-.01-4.49 0-8.99-.02-13.49.86-.01 1.72-.01 2.58-.01z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 1: Courses */}
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Khóa học</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses?category=scientific-reasoning" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Suy luận Khoa học
                </Link>
              </li>
              <li>
                <Link href="/courses?category=math" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Toán học
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Tài nguyên</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Tài liệu Markdown
                </a>
              </li>
              <li>
                <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Mẫu ghi chú
                </a>
              </li>
              <li>
                <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Chương trình Đại sứ
                </a>
              </li>
              <li>
                <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Hỏi đáp (FAQs)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Bản tin công nghệ</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Đăng ký nhận thông báo về các khóa học mới nhất và tài liệu học tập chọn lọc miễn phí.
            </p>
            <form className="flex max-w-sm items-center gap-1.5" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email của bạn..."
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
              <button
                type="submit"
                className="rounded-lg bg-primary p-1.5 text-white hover:bg-primary/90 transition-colors"
                aria-label="Subscribe"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-2xs text-muted-foreground">
            &copy; {currentYear} iStudent.
          </p>
          <div className="flex space-x-6 text-2xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-foreground transition-colors">Điều khoản dịch vụ</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookie settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
