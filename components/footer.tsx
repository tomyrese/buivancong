'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import logoImg from '@/src/imgs/logo.png';
import { NewsletterService } from '@/services/newsletterService';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const isPackagesActive = pathname === '/packages';

  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [newsletterStatus, setNewsletterStatus] = React.useState<'idle' | 'success' | 'duplicate' | 'error'>('idle');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const emailToSubscribe = newsletterEmail.trim().toLowerCase();
    if (!emailToSubscribe) return;
    
    const existing = NewsletterService.getEmails();
    if (existing.includes(emailToSubscribe)) {
      setNewsletterStatus('duplicate');
      return;
    }
    
    const success = NewsletterService.addEmail(emailToSubscribe);
    if (success) {
      setNewsletterStatus('success');
      setNewsletterEmail('');
    } else {
      setNewsletterStatus('error');
    }
  };

  return (
    <footer className="border-t border-border bg-card/50 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Slogan */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src={logoImg} 
                alt="iStudent Logo" 
                className="h-7 w-auto object-contain rounded-lg shadow shadow-primary/5"
              />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-lg font-bold tracking-tight text-transparent">
                iStudent
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Nền tảng học tập luyện thi Đánh giá Năng lực (ĐGNL) chất lượng cao của thầy Bùi Văn Công.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/buivancong2020" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors flex items-center" 
                aria-label="Facebook"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a 
                href="https://www.tiktok.com/@dgnlhcm.thaybuivancong" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors flex items-center" 
                aria-label="TikTok"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 1: Lessons */}
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Bài học</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses?category=scientific-reasoning" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Bài học Khoa học
                </Link>
              </li>
              <li>
                <Link href="/courses?category=math" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Bài học Toán học
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Tài nguyên</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/packages" 
                  className={cn(
                    "text-xs font-semibold transition-colors",
                    isPackagesActive 
                      ? "text-primary font-bold" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Mua Gói Khóa học (Combo)
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Tài liệu học tập
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Luyện đề trắc nghiệm
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Bản tin công nghệ</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Đăng ký nhận thông báo về các khóa học mới nhất và tài liệu học tập chọn lọc miễn phí.
            </p>
            <form className="flex max-w-sm flex-col gap-1.5" onSubmit={handleSubscribe}>
              <div className="flex gap-1.5 w-full">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    if (newsletterStatus !== 'idle') setNewsletterStatus('idle');
                  }}
                  placeholder="Email của bạn..."
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-primary p-1.5 text-white hover:bg-primary/90 transition-colors shrink-0"
                  aria-label="Subscribe"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              {newsletterStatus === 'success' && (
                <span className="text-[10px] text-emerald-500 font-bold animate-in fade-in">
                  ✓ Đăng ký nhận bản tin thành công!
                </span>
              )}
              {newsletterStatus === 'duplicate' && (
                <span className="text-[10px] text-amber-500 font-bold animate-in fade-in">
                  • Email này đã được đăng ký trước đó.
                </span>
              )}
              {newsletterStatus === 'error' && (
                <span className="text-[10px] text-red-500 font-bold animate-in fade-in">
                  ✗ Định dạng email không hợp lệ.
                </span>
              )}
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
