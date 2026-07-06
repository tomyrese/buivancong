'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Send, X, ShieldCheck, FileText, Cookie, UserCheck, Lock, CreditCard, ShieldAlert } from 'lucide-react';
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
  const [activeModal, setActiveModal] = React.useState<'privacy' | 'terms' | 'cookies' | null>(null);
  
  // Cookie setting local states
  const [cookiePerformance, setCookiePerformance] = React.useState(true);
  const [cookieMarketing, setCookieMarketing] = React.useState(true);

  // Prevent background scrolling when policy modal is open
  React.useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeModal]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const emailToSubscribe = newsletterEmail.trim().toLowerCase();
    if (!emailToSubscribe) return;
    
    const existing = NewsletterService.getEmails();
    if (existing.some(s => s.email === emailToSubscribe)) {
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
                alt="iSinhvien Logo" 
                className="h-7 w-auto object-contain rounded-lg shadow shadow-primary/5"
              />
              <span className="text-lg font-black tracking-tight select-none">
                <span className="text-[#2F80ED]">i</span>
                <span className="text-[#F2994A]">Sinhvien</span>
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
            &copy; {currentYear} iSinhvien.
          </p>
          <div className="flex space-x-6 text-2xs text-muted-foreground">
            <button onClick={() => setActiveModal('privacy')} className="hover:text-foreground transition-colors cursor-pointer">Chính sách bảo mật</button>
            <button onClick={() => setActiveModal('terms')} className="hover:text-foreground transition-colors cursor-pointer">Điều khoản dịch vụ</button>
            <button onClick={() => setActiveModal('cookies')} className="hover:text-foreground transition-colors cursor-pointer">Cookie settings</button>
          </div>
        </div>
      </div>

      {/* Policy and Cookie Settings Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setActiveModal(null)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl transform rounded-3xl border border-border bg-card shadow-2xl transition-all duration-300 z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {activeModal === 'privacy' && (
                  <>
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    <h3 className="text-sm font-bold text-foreground">Chính sách Bảo mật iSinhvien</h3>
                  </>
                )}
                {activeModal === 'terms' && (
                  <>
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-sm font-bold text-foreground">Điều khoản Dịch vụ iSinhvien</h3>
                  </>
                )}
                {activeModal === 'cookies' && (
                  <>
                    <Cookie className="h-5 w-5 text-amber-500 animate-pulse" />
                    <h3 className="text-sm font-bold text-foreground">Thiết lập Cookie</h3>
                  </>
                )}
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="rounded-xl border border-border p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 text-xs text-muted-foreground leading-relaxed">
              {activeModal === 'privacy' && (
                <div className="space-y-4 pr-1">
                  {/* Card 1 */}
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <UserCheck className="h-4.5 w-4.5 text-primary shrink-0" />
                      <span>1. Thu thập thông tin cá nhân</span>
                    </div>
                    <p className="text-2xs leading-relaxed text-muted-foreground pl-7">
                      iSinhvien chỉ thu thập các thông tin cá nhân cơ bản và cần thiết cho trải nghiệm học tập bao gồm: Họ tên, Địa chỉ Email, và Số điện thoại di động. Các thông tin này được thu thập khi bạn đăng ký tài khoản hoặc cập nhật hồ sơ cá nhân.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <BookOpen className="h-4.5 w-4.5 text-primary shrink-0" />
                      <span>2. Sử dụng thông tin của bạn</span>
                    </div>
                    <p className="text-2xs leading-relaxed text-muted-foreground pl-7">
                      Chúng tôi sử dụng dữ liệu của bạn nhằm đối soát tự động các giao dịch chuyển khoản VietQR để kích hoạt gói học ngay lập tức; theo dõi tiến trình bài học, chuỗi ngày học liên tục (streak) và điểm kinh nghiệm (XP) của riêng bạn; gửi tài liệu học tập hoặc các thông báo quan trọng thông qua hệ thống Bản tin.
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <Lock className="h-4.5 w-4.5 text-primary shrink-0" />
                      <span>3. Bảo mật và Lưu trữ dữ liệu</span>
                    </div>
                    <p className="text-2xs leading-relaxed text-muted-foreground pl-7">
                      Toàn bộ mật khẩu của bạn được mã hóa một chiều an toàn bằng thuật toán mã hóa hiện đại của hệ thống Supabase. Mọi kết nối truyền tải thông tin giữa máy khách và máy chủ đều sử dụng giao thức bảo mật SSL. Chúng tôi cam kết tuyệt đối không chia sẻ, mua bán dữ liệu cá nhân của bạn cho bất kỳ bên thứ ba nào.
                    </p>
                  </div>

                  {/* Card 4 */}
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <ShieldCheck className="h-4.5 w-4.5 text-primary shrink-0" />
                      <span>4. Quyền kiểm soát của học sinh</span>
                    </div>
                    <p className="text-2xs leading-relaxed text-muted-foreground pl-7">
                      Bạn có toàn quyền truy cập, chỉnh sửa thông tin cá nhân bất kỳ lúc nào tại mục Hồ sơ cá nhân. Trong trường hợp muốn xóa tài khoản học viên vĩnh viễn hoặc yêu cầu đặt lại các gói học đã đăng ký, vui lòng liên hệ quản trị viên qua email hỗ trợ để được giải quyết lập tức.
                    </p>
                  </div>
                </div>
              )}

              {activeModal === 'terms' && (
                <div className="space-y-4 pr-1">
                  {/* Card 1 */}
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <UserCheck className="h-4.5 w-4.5 text-primary shrink-0" />
                      <span>1. Quy định về tài khoản học viên</span>
                    </div>
                    <p className="text-2xs leading-relaxed text-muted-foreground pl-7">
                      Mỗi học viên chỉ được phép sử dụng một tài khoản email (Gmail) duy nhất ứng với một thông tin đăng ký lớp học chính thức. Bạn chịu trách nhiệm hoàn toàn về tính bảo mật của mật khẩu đăng nhập cá nhân.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <FileText className="h-4.5 w-4.5 text-primary shrink-0" />
                      <span>2. Bản quyền sở hữu tài liệu học tập</span>
                    </div>
                    <p className="text-2xs leading-relaxed text-muted-foreground pl-7">
                      Toàn bộ video bài giảng, câu hỏi trắc nghiệm, đề thi thử và tài liệu PDF đính kèm trên website iSinhvien đều thuộc bản quyền trí tuệ của Thầy Bùi Văn Công. Nghiêm cấm mọi hành vi sao chép, tải lậu, hoặc chia sẻ tài khoản cho nhiều người sử dụng chung.
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <CreditCard className="h-4.5 w-4.5 text-primary shrink-0" />
                      <span>3. Chính sách thanh toán tự động</span>
                    </div>
                    <p className="text-2xs leading-relaxed text-muted-foreground pl-7">
                      Giao dịch chuyển khoản được xác thực tự động thông qua việc quét mã VietQR đi kèm đúng Nội dung chuyển khoản đã chỉ định. Hệ thống kích hoạt gói học ngay lập tức trên tài khoản khi ngân hàng báo có.
                    </p>
                  </div>

                  {/* Card 4 */}
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <ShieldAlert className="h-4.5 w-4.5 text-primary shrink-0" />
                      <span>4. Miễn trừ trách nhiệm kết quả học tập</span>
                    </div>
                    <p className="text-2xs leading-relaxed text-muted-foreground pl-7">
                      Các chuyên đề tự luyện thi ĐGNL được thiết kế tối ưu nhất. Tuy nhiên, kết quả thi chính thức phụ thuộc hoàn toàn vào quá trình kiên trì tự ôn luyện và làm bài của mỗi học viên. iSinhvien không cam kết đảm bảo điểm số đầu ra cụ thể bằng văn bản pháp lý.
                    </p>
                  </div>
                </div>
              )}

              {activeModal === 'cookies' && (
                <div className="space-y-5">
                  <p className="text-2xs">
                    Chúng tôi sử dụng cookie để mang lại trải nghiệm tối ưu nhất cho bạn. Vui lòng thiết lập quyền cho phép sử dụng cookie theo nhu cầu cá nhân của bạn dưới đây:
                  </p>

                  <div className="space-y-4">
                    {/* Essential cookies */}
                    <div className="flex items-start justify-between gap-4 p-3 rounded-2xl bg-muted/40 border border-border">
                      <div className="space-y-0.5">
                        <span className="text-2xs font-bold text-foreground">1. Cookie bắt buộc (Essential)</span>
                        <p className="text-3xs text-muted-foreground">Cookie duy trì phiên đăng nhập bảo mật và cấu hình giao diện sáng/tối (Theme). Không thể tắt.</p>
                      </div>
                      <div className="h-5 w-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-end px-1 select-none">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                      </div>
                    </div>

                    {/* Performance cookies */}
                    <div className="flex items-start justify-between gap-4 p-3 rounded-2xl bg-muted/40 border border-border">
                      <div className="space-y-0.5">
                        <span className="text-2xs font-bold text-foreground">2. Cookie hiệu suất (Performance)</span>
                        <p className="text-3xs text-muted-foreground">Lưu giữ tiến trình ôn tập bài học, thời gian làm bài kiểm tra và lịch sử ôn tập cục bộ.</p>
                      </div>
                      <button 
                        onClick={() => setCookiePerformance(!cookiePerformance)}
                        className={`h-5 w-9 rounded-full transition-colors flex items-center px-1 cursor-pointer ${
                          cookiePerformance ? 'bg-primary/20 border border-primary/30 justify-end' : 'bg-muted border border-border/80 justify-start'
                        }`}
                      >
                        <div className={`h-3 w-3 rounded-full transition-colors ${cookiePerformance ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
                      </button>
                    </div>

                    {/* Marketing cookies */}
                    <div className="flex items-start justify-between gap-4 p-3 rounded-2xl bg-muted/40 border border-border">
                      <div className="space-y-0.5">
                        <span className="text-2xs font-bold text-foreground">3. Cookie tiếp thị (Marketing)</span>
                        <p className="text-3xs text-muted-foreground">Đề xuất các gói học nâng cấp hoặc bài giảng mới dựa trên sở thích và hành vi của bạn.</p>
                      </div>
                      <button 
                        onClick={() => setCookieMarketing(!cookieMarketing)}
                        className={`h-5 w-9 rounded-full transition-colors flex items-center px-1 cursor-pointer ${
                          cookieMarketing ? 'bg-primary/20 border border-primary/30 justify-end' : 'bg-muted border border-border/80 justify-start'
                        }`}
                      >
                        <div className={`h-3 w-3 rounded-full transition-colors ${cookieMarketing ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="p-6 border-t border-border flex justify-end gap-2 bg-card">
              <button 
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl border border-border text-2xs font-bold text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                {activeModal === 'cookies' ? 'Hủy bỏ' : 'Đóng lại'}
              </button>
              {activeModal === 'cookies' && (
                <button 
                  onClick={() => {
                    alert('Thiết lập Cookie đã được lưu thành công!');
                    setActiveModal(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-primary text-2xs font-bold text-white hover:bg-primary/95 transition-all shadow shadow-primary/25 cursor-pointer"
                >
                  Lưu thiết lập
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
