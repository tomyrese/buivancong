'use client';

import * as React from 'react';
import { 
  Check, 
  Sparkles, 
  CreditCard, 
  ArrowRight, 
  Lock, 
  Info, 
  Award,
  BookOpen,
  Smartphone,
  Send,
  Upload,
  CheckCircle,
  X
} from 'lucide-react';
import Link from 'next/link';

interface Package {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  badge?: string;
  description: string;
  icon: typeof Award;
  color: string;
  features: string[];
}

export default function PackagesPage() {
  const [selectedPackage, setSelectedPackage] = React.useState<Package | null>(null);
  const [checkoutStep, setCheckoutStep] = React.useState<'info' | 'success'>('info');
  const [phone, setPhone] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [hasFile, setHasFile] = React.useState(false);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const packages: Package[] = [
    {
      id: 'combo-toan-logic',
      name: 'Combo Toán học & Tư duy Logic',
      price: 499000,
      originalPrice: 1000000,
      description: 'Lộ trình tối ưu cho phần Tư duy định lượng & Logic học của kỳ thi ĐGNL.',
      icon: BookOpen,
      color: 'from-blue-600 to-indigo-600',
      features: [
        'Hệ thống hóa toàn bộ chuyên đề Toán lớp 10, 11, 12 bám sát đề ĐGNL',
        'Rèn luyện tư duy logic, kỹ năng suy luận nhanh đề trắc nghiệm',
        '20+ đề thi thử Toán học có video sửa chi tiết từ Thầy Bùi Văn Công',
        'Tham gia group kín hỏi đáp 24/7 trực tiếp cùng trợ giảng chuyên môn',
        'Tải bộ tài liệu công thức độc quyền học nhanh nhớ lâu'
      ]
    },
    {
      id: 'combo-toan-dien',
      name: 'Combo Toàn Diện ĐGNL 9 Môn',
      price: 1299000,
      originalPrice: 2500000,
      badge: 'Bán chạy nhất',
      description: 'Giải pháp học tập hoàn hảo và bứt phá nhất bao trọn toàn bộ 9 môn thi ĐGNL ĐHQG TP.HCM.',
      icon: Sparkles,
      color: 'from-amber-500 via-orange-500 to-red-500',
      features: [
        'Trọn gói toàn bộ 9 môn học ôn thi ĐGNL cốt lõi',
        'Tặng ngay sách ôn thi ĐGNL Thầy Bùi Văn Công chuyển thẳng về nhà',
        '50+ Đề thi thử tổng hợp cấu trúc mới nhất của ĐHQG TP.HCM',
        'Chiến thuật làm bài đạt điểm tối ưu 900+ thi ĐGNL',
        'Đặc quyền tư vấn lộ trình học tập riêng, sửa lỗi sai trực tiếp',
        'Cam kết hỗ trợ học tập đến khi kỳ thi chính thức khép lại'
      ]
    },
    {
      id: 'combo-khoa-hoc',
      name: 'Combo Suy luận Khoa học',
      price: 899000,
      originalPrice: 1800000,
      description: 'Bí kíp làm chủ 6 môn Lý - Hóa - Sinh - Sử - Địa - Kinh tế & Pháp luật.',
      icon: Award,
      color: 'from-emerald-600 to-teal-600',
      features: [
        'Ôn tập kiến thức Lý, Hóa, Sinh lớp 12 phục vụ ĐGNL',
        'Hệ thống hóa Lịch sử, Địa lý & KT-PL đầy đủ theo sơ đồ tư duy',
        'Kỹ năng phân tích bảng số liệu, đọc Atlat, giải quyết tình huống',
        '1000+ câu trắc nghiệm thực hành kèm lời giải chi tiết',
        'Các đề luyện thi chuyên sâu phần Suy luận Khoa học'
      ]
    }
  ];

  const handleCheckoutOpen = (pkg: Package) => {
    setSelectedPackage(pkg);
    setCheckoutStep('info');
    setPhone('');
    setFullName('');
    setEmail('');
    setHasFile(false);
    setError('');
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setError('Vui lòng nhập đầy đủ các thông tin cá nhân bắt buộc!');
      return;
    }
    if (!/^\d{9,11}$/.test(phone)) {
      setError('Số điện thoại không đúng định dạng (9 - 11 chữ số)!');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email không đúng định dạng!');
      return;
    }
    if (!hasFile) {
      setError('Vui lòng tải lên ảnh chụp biên lai/minh chứng chuyển khoản!');
      return;
    }

    setLoading(true);
    // Simulate transaction submission
    setTimeout(() => {
      setLoading(false);
      setCheckoutStep('success');
    }, 1200);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="rounded-full bg-primary/10 px-3.5 py-1.5 text-2xs font-extrabold text-primary border border-primary/20 tracking-wider uppercase">
          Khóa học trả phí ôn thi ĐGNL
        </span>
        <h1 className="text-3xl font-black text-foreground tracking-tight sm:text-4xl lg:text-5xl">
          Đăng ký Combo Lớp học Thầy Bùi Văn Công
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Đăng ký một lần để mở khóa toàn bộ chuyên đề bài giảng nâng cao, sách độc quyền, hệ thống luyện đề trắc nghiệm và nhóm hỗ trợ đặc quyền cùng Thầy Công.
        </p>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-stretch pt-4">
        {packages.map((pkg) => {
          const PkgIcon = pkg.icon;
          const isBest = pkg.badge !== undefined;
          return (
            <div 
              key={pkg.id} 
              className={`relative flex flex-col justify-between rounded-3xl border bg-card p-6 sm:p-8 shadow-xl transition-all duration-300 hover:scale-[1.01] ${
                isBest 
                  ? 'border-2 border-primary ring-4 ring-primary/5 lg:-translate-y-4' 
                  : 'border-border/60 hover:border-primary/20'
              }`}
            >
              {isBest && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-1 text-3xs font-extrabold text-white uppercase tracking-wider shadow">
                  {pkg.badge}
                </span>
              )}
              
              <div className="space-y-6">
                {/* Header card info */}
                <div className="space-y-2">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${pkg.color} text-white shadow-lg`}>
                    <PkgIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-black text-foreground pt-2 leading-snug">{pkg.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{pkg.description}</p>
                </div>

                {/* Price block */}
                <div className="flex items-baseline gap-2 border-y border-border/60 py-4">
                  <span className="text-2xl font-black text-foreground tracking-tight">
                    {formatPrice(pkg.price)}
                  </span>
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(pkg.originalPrice)}
                  </span>
                </div>

                {/* Features list */}
                <div className="space-y-3.5">
                  <p className="text-3xs font-bold text-muted-foreground uppercase tracking-wider">Những đặc quyền bao gồm:</p>
                  <ul className="space-y-2.5">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                        <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="leading-normal">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Buy Button */}
              <button
                onClick={() => handleCheckoutOpen(pkg)}
                className={`w-full flex items-center justify-center gap-1.5 rounded-2xl py-3.5 text-xs font-extrabold transition-all active:scale-[0.98] mt-8 ${
                  isBest
                    ? 'bg-primary text-white hover:bg-primary/95 shadow-md shadow-primary/25'
                    : 'bg-muted text-foreground hover:bg-muted/80 border border-border/80'
                }`}
              >
                Mua ngay
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Safety Guarantee */}
      <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-muted/40 p-6 flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left">
        <div className="rounded-2xl bg-primary/10 p-3 text-primary border border-primary/20 shrink-0">
          <Lock className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-foreground">Giao dịch được bảo vệ và hỗ trợ 24/7</h4>
          <p className="text-2xs text-muted-foreground leading-relaxed">
            Các khoản thanh toán chuyển khoản thủ công được đối soát bảo mật. Khi giao dịch hoàn tất, hệ thống sẽ kích hoạt khóa học tự động. Mọi thắc mắc kỹ thuật vui lòng liên hệ hotline lớp học của Thầy để hỗ trợ ngay lập tức.
          </p>
        </div>
      </div>

      {/* Checkout Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
            onClick={() => { if (!loading) setSelectedPackage(null); }}
          />

          {/* Modal content */}
          <div className="relative w-full max-w-2xl transform rounded-3xl border border-border bg-card shadow-2xl transition-all duration-300 z-10 overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
            
            {/* Left side: payment information */}
            <div className="flex-1 bg-muted/50 p-6 border-b md:border-b-0 md:border-r border-border space-y-6">
              <div className="space-y-1">
                <span className="text-3xs font-bold text-primary uppercase tracking-wider">Bước 1: Chuyển khoản</span>
                <h3 className="text-sm font-bold text-foreground">Thông tin tài khoản</h3>
              </div>

              {/* VietQR design */}
              <div className="rounded-2xl border border-border bg-card p-4 text-center space-y-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-br-lg border-r border-b border-border/60">
                  VietQR
                </div>
                {/* Custom Vector Simulated QR Code */}
                <div className="bg-white p-3 rounded-xl border border-border w-52 h-52 mx-auto flex items-center justify-center">
                  <svg className="w-48 h-48 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="5" y="5" width="20" height="20" rx="1" />
                    <rect x="9" y="9" width="12" height="12" fill="white" />
                    <rect x="12" y="12" width="6" height="6" />
                    
                    <rect x="75" y="5" width="20" height="20" rx="1" />
                    <rect x="79" y="9" width="12" height="12" fill="white" />
                    <rect x="82" y="12" width="6" height="6" />

                    <rect x="5" y="75" width="20" height="20" rx="1" />
                    <rect x="9" y="79" width="12" height="12" fill="white" />
                    <rect x="12" y="82" width="6" height="6" />

                    <rect x="32" y="10" width="8" height="8" />
                    <rect x="45" y="5" width="12" height="6" />
                    <rect x="62" y="15" width="8" height="8" />
                    <rect x="35" y="25" width="25" height="6" />
                    <rect x="10" y="35" width="6" height="25" />
                    <rect x="25" y="45" width="15" height="15" />
                    <rect x="50" y="40" width="8" height="8" />
                    <rect x="65" y="32" width="20" height="20" fill="transparent" />
                    <rect x="65" y="32" width="10" height="10" />
                    <rect x="80" y="45" width="15" height="8" />
                    <rect x="48" y="60" width="22" height="6" />
                    <rect x="75" y="60" width="15" height="10" />
                    <rect x="30" y="70" width="10" height="20" />
                    <rect x="45" y="80" width="25" height="10" />
                    <rect x="75" y="80" width="18" height="15" />
                    <rect x="15" y="65" width="8" height="6" />
                  </svg>
                </div>
                <p className="text-[10px] text-muted-foreground">Quét mã QR để tự động điền thông tin chuyển khoản</p>
              </div>

              {/* Bank Details */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Ngân hàng:</span>
                  <span className="font-bold text-foreground">MB Bank (Quân Đội)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Số tài khoản:</span>
                  <span className="font-extrabold text-primary select-all">0988888888</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Chủ tài khoản:</span>
                  <span className="font-bold text-foreground">BUI VAN CONG</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Số tiền:</span>
                  <span className="font-extrabold text-foreground">{formatPrice(selectedPackage.price)}</span>
                </div>
                <div className="flex flex-col gap-1 py-1.5">
                  <span className="text-muted-foreground">Nội dung chuyển khoản:</span>
                  <span className="font-extrabold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg select-all text-center tracking-wide mt-1">
                    ISTUDENT {phone ? phone.trim() : '[SĐT_CỦA_BẠN]'} {selectedPackage.id.toUpperCase().replace(/-/g, '_')}
                  </span>
                </div>
              </div>
            </div>

            {/* Right side: Registration Form & Success info */}
            <div className="flex-1 p-6 relative flex flex-col justify-between">
              
              {/* Close Button */}
              <button 
                onClick={() => { if (!loading) setSelectedPackage(null); }}
                className="absolute right-4 top-4 rounded-xl border border-border p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                disabled={loading}
              >
                <X className="h-4 w-4" />
              </button>

              {checkoutStep === 'info' ? (
                /* Form block */
                <form onSubmit={handleCheckoutSubmit} className="space-y-5 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-3xs font-bold text-primary uppercase tracking-wider">Bước 2: Gửi minh chứng</span>
                      <h3 className="text-base font-black text-foreground">Xác nhận chuyển khoản</h3>
                    </div>

                    {error && (
                      <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-3.5 py-2.5 text-2xs font-semibold text-red-600">
                        {error}
                      </div>
                    )}

                    {/* Inputs */}
                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase pl-0.5">Số điện thoại đăng ký học</label>
                        <input
                          type="tel"
                          placeholder="Số điện thoại dùng đăng nhập"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase pl-0.5">Họ và tên học sinh</label>
                        <input
                          type="text"
                          placeholder="Họ và tên của bạn"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase pl-0.5">Địa chỉ Email</label>
                        <input
                          type="email"
                          placeholder="Email nhận mã kích hoạt"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                          required
                        />
                      </div>

                      {/* File upload */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase pl-0.5">Ảnh chụp màn hình chuyển khoản</label>
                        <button
                          type="button"
                          onClick={() => setHasFile(true)}
                          className={`w-full rounded-2xl border-2 border-dashed p-4 text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                            hasFile 
                              ? 'border-emerald-500 bg-emerald-500/5 text-emerald-600' 
                              : 'border-border hover:border-primary/40 hover:bg-muted/40 text-muted-foreground'
                          }`}
                        >
                          <Upload className="h-6 w-6" />
                          <span className="text-3xs font-semibold">
                            {hasFile ? 'Đã đính kèm: bienlai.png (Thay đổi)' : 'Tải ảnh biên lai giao dịch lên'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary py-3.5 text-xs font-bold text-white shadow-md shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 mt-4"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Xác nhận đã thanh toán
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Success screen */
                <div className="text-center py-8 space-y-6 flex flex-col justify-center h-full">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <CheckCircle className="h-8 w-8 animate-in zoom-in-50 duration-300" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-black text-foreground">Gửi thông tin đăng ký thành công!</h3>
                    <p className="text-2xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                      Cám ơn <strong>{fullName}</strong> đã đăng ký khóa học của Thầy Công. Hệ thống đang tiến hành kiểm tra giao dịch chuyển khoản.
                    </p>
                    <p className="text-2xs text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5 leading-relaxed max-w-sm mx-auto">
                      💡 Khóa học của bạn sẽ tự động được kích hoạt và gửi email thông báo sau <strong>5 - 10 phút</strong>.
                    </p>
                  </div>
                  <div className="pt-4 flex flex-col gap-2">
                    <Link
                      href="/courses"
                      onClick={() => setSelectedPackage(null)}
                      className="w-full rounded-2xl bg-primary py-3 text-xs font-bold text-white shadow hover:bg-primary/95 transition-all text-center block"
                    >
                      Vào ôn tập Bài học
                    </Link>
                    <button
                      onClick={() => setSelectedPackage(null)}
                      className="w-full rounded-2xl border border-border bg-card py-3 text-xs font-bold text-foreground hover:bg-muted transition-all"
                    >
                      Đóng cửa sổ
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
