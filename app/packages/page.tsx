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
  X,
  Copy,
  CheckCircle2,
  AlertCircle,
  ArrowUpCircle,
  RefreshCw,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useProgressStore } from '@/store/useProgressStore';
import { supabase } from '@/lib/supabase';
import AuthModal from '@/components/auth-modal';

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

const packageCodeMap: Record<string, string> = {
  'combo-toan-logic': 'CBTOAN',
  'combo-khoa-hoc': 'CBKH',
  'combo-toan-dien': 'CBDN',
  'combo-nang-cap': 'CBNGC'
};

export default function PackagesPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [selectedPackage, setSelectedPackage] = React.useState<Package | null>(null);
  const [checkoutStep, setCheckoutStep] = React.useState<'info' | 'qr' | 'success'>('info');
  const [paymentMode, setPaymentMode] = React.useState<'vietqr' | 'manual'>('vietqr');
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [phone, setPhone] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [hasFile, setHasFile] = React.useState(false);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [copiedText, setCopiedText] = React.useState('');
  const [qrTimestamp, setQrTimestamp] = React.useState<number | null>(null);
  const [timeLeft, setTimeLeft] = React.useState<number>(300);
  const [checkingPayment, setCheckingPayment] = React.useState(false);
  const [checkAlert, setCheckAlert] = React.useState('');

  // Prevent background scrolling when checkout modal is open
  React.useEffect(() => {
    if (selectedPackage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPackage]);
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const hasLogic = user?.purchasedPackages?.includes('combo-toan-logic');
  const hasKhoaHoc = user?.purchasedPackages?.includes('combo-khoa-hoc');
  const hasToanDien = user?.purchasedPackages?.includes('combo-toan-dien');

  const showUpgrade = (hasLogic || hasKhoaHoc) && !hasToanDien;

  const basePackages: Package[] = [
    {
      id: 'combo-toan-logic',
      name: 'Combo Toán học & Tư duy Logic',
      price: 10000,
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
      price: 10000,
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
      price: 10000,
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

  const packages = [...basePackages];

  if (showUpgrade) {
    const originalPrice = hasLogic && hasKhoaHoc 
      ? 100000 
      : hasLogic 
      ? 800000 
      : 400000;

    // Dynamically replace the center Combo Toàn Diện card with the Upgrade card
    packages[1] = {
      id: 'combo-nang-cap',
      name: 'Nâng cấp Combo Toàn Diện',
      price: 5000, // 5k test price
      originalPrice: originalPrice,
      badge: 'Khuyên dùng',
      description: 'Đặc quyền nâng cấp thẳng lên gói Toàn Diện 9 môn học với mức học phí đã khấu trừ combo cũ.',
      icon: ArrowUpCircle,
      color: 'from-amber-500 via-orange-500 to-red-500', // Keep the center card's beautiful color
      features: [
        'Mở khóa trọn bộ 9 môn học ôn thi ĐGNL',
        'Đã trừ đi học phí của các gói bạn đang sở hữu',
        'Tặng sách ôn thi ĐGNL Thầy Bùi Văn Công',
        'Đặc quyền sửa lỗi bài tập, tư vấn lộ trình riêng 1-1'
      ]
    };
  }

  const handleCheckoutOpen = (pkg: Package) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setSelectedPackage(pkg);
    setPaymentMode('vietqr');
    
    // Check if user has phone configured
    if (!user?.phone || user.phone.trim() === '') {
      setCheckoutStep('info'); // Show info step to collect phone number first
      setPhone('');
    } else {
      setCheckoutStep('qr'); // Go straight to QR code if phone is configured
      setPhone(user.phone);
      setQrTimestamp(Date.now());
      setTimeLeft(300);
    }
    
    setFullName(user?.name || '');
    setEmail(user?.email || '');
    setHasFile(false);
    setError('');
  };

  // QR Countdown Timer Effect
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (checkoutStep === 'qr' && qrTimestamp) {
      timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - qrTimestamp) / 1000);
        const remaining = 300 - elapsed;
        if (remaining <= 0) {
          setTimeLeft(0);
          clearInterval(timer);
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [checkoutStep, qrTimestamp]);

  // Polling Check Effect
  React.useEffect(() => {
    let checkInterval: NodeJS.Timeout;
    
    if (selectedPackage && checkoutStep === 'qr' && paymentMode === 'vietqr' && isAuthenticated && timeLeft > 0) {
      checkInterval = setInterval(async () => {
        try {
          // Force refresh session to get the latest JWT containing updated metadata
          const { data: { session: newSession } } = await supabase.auth.refreshSession();
          
          if (newSession?.user) {
            const purchased = newSession.user.user_metadata?.purchased_packages;
            const targetId = selectedPackage.id === 'combo-nang-cap' ? 'combo-toan-dien' : selectedPackage.id;
            if (Array.isArray(purchased) && purchased.includes(targetId)) {
              clearInterval(checkInterval);
              
              // Force update local Zustand store profile to avoid JWT caching delay
              const currentAuthState = useAuthStore.getState();
              if (currentAuthState.user) {
                useAuthStore.setState({
                  user: {
                    ...currentAuthState.user,
                    purchasedPackages: purchased
                  }
                });
              }
              
              setCheckoutStep('success');
            }
          }
        } catch (err) {
          console.error("Error checking activation status:", err);
        }
      }, 3000);
    }
    
    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [selectedPackage, checkoutStep, paymentMode, isAuthenticated, timeLeft]);

  const handleCheckPayment = async () => {
    if (!selectedPackage) return;
    setCheckingPayment(true);
    setCheckAlert('');
    
    try {
      const { data: { session: newSession } } = await supabase.auth.refreshSession();
      if (newSession?.user) {
        const purchased = newSession.user.user_metadata?.purchased_packages;
        const targetId = selectedPackage.id === 'combo-nang-cap' ? 'combo-toan-dien' : selectedPackage.id;
        if (Array.isArray(purchased) && purchased.includes(targetId)) {
          // Force update local Zustand store profile to avoid JWT caching delay
          const currentAuthState = useAuthStore.getState();
          if (currentAuthState.user) {
            useAuthStore.setState({
              user: {
                ...currentAuthState.user,
                purchasedPackages: purchased
              }
            });
          }
          setCheckoutStep('success');
          return;
        }
      }
      
      setCheckAlert('Hệ thống chưa nhận được thông tin chuyển khoản từ ngân hàng của bạn. Xin vui lòng chờ thêm ít phút hoặc quét lại mã và kiểm tra nội dung chuyển khoản.');
    } catch (err: any) {
      console.error('Error verifying payment manually:', err);
      setCheckAlert(err.message || 'Có lỗi xảy ra khi kiểm tra giao dịch, vui lòng thử lại!');
    } finally {
      setCheckingPayment(false);
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
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

    setLoading(true);
    try {
      if (paymentMode === 'vietqr') {
        // Update user profile on Supabase with phone number
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
        const isSupabaseConfigured = url && key && !url.includes('placeholder') && !key.includes('placeholder');

        if (isSupabaseConfigured) {
          const { error } = await supabase.auth.updateUser({
            data: { name: fullName, phone: phone }
          });
          if (error) throw error;
        }
        
        // Update local Zustand auth store profile
        useAuthStore.getState().updateProfile({ name: fullName, phone: phone });
        
        // Transition to QR payment step
        setCheckoutStep('qr');
        setQrTimestamp(Date.now());
        setTimeLeft(300);
      } else {
        if (!hasFile) {
          setError('Vui lòng tải lên ảnh chụp biên lai/minh chứng chuyển khoản!');
          setLoading(false);
          return;
        }
        // Simulate manual transaction submission
        await new Promise((resolve) => setTimeout(resolve, 800));
        setCheckoutStep('success');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Có lỗi xảy ra khi cập nhật thông tin!');
    } finally {
      setLoading(false);
    }
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
          const isPurchased = 
            user?.purchasedPackages?.includes(pkg.id) || 
            (pkg.id !== 'combo-toan-dien' && user?.purchasedPackages?.includes('combo-toan-dien'));

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
              {isPurchased ? (
                <button
                  disabled={true}
                  className="w-full flex items-center justify-center gap-1.5 rounded-2xl py-3.5 text-xs font-extrabold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 cursor-not-allowed mt-8 animate-in fade-in duration-300 animate-pulse"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Đã đăng ký
                </button>
              ) : (
                <button
                  onClick={() => handleCheckoutOpen(pkg)}
                  className={`w-full flex items-center justify-center gap-1.5 rounded-2xl py-3.5 text-xs font-extrabold transition-all active:scale-[0.98] mt-8 ${
                    isBest
                      ? 'bg-primary text-white hover:bg-primary/95 shadow-md shadow-primary/25'
                      : 'bg-muted text-foreground hover:bg-muted/80 border border-border/80'
                  }`}
                >
                  Đăng ký ngay
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
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
            Các khoản thanh toán chuyển khoản được xử lý bảo mật. Khi giao dịch hoàn tất, hệ thống sẽ kích hoạt khóa học tự động. Mọi thắc mắc kỹ thuật vui lòng liên hệ hotline lớp học của Thầy để hỗ trợ ngay lập tức.
          </p>
        </div>
      </div>

      {/* Checkout Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
            onClick={() => { if (!loading && !checkingPayment) setSelectedPackage(null); }}
          />

          {/* Modal content */}
          <div className="relative w-full max-w-2xl transform rounded-3xl border border-border bg-card shadow-2xl transition-all duration-300 z-10 overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
            
            {/* Left side: payment information */}
            <div className="flex-1 bg-muted/50 p-6 border-b md:border-b-0 md:border-r border-border space-y-5">
              <div className="space-y-1">
                <span className="text-3xs font-bold text-primary uppercase tracking-wider">Bước 1: Quét mã QR</span>
                <h3 className="text-sm font-bold text-foreground">
                  Thanh toán tự động VietQR
                </h3>
              </div>

              {/* VietQR design */}
              <div className="rounded-2xl border border-border bg-card p-5 text-center space-y-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-br-lg border-r border-b border-border/60">
                  VietQR Tự Động
                </div>
                
                {/* QR Code image source with scan corners */}
                <div className="relative bg-white p-4 rounded-2xl border border-border w-52 h-52 mx-auto flex items-center justify-center shadow-inner overflow-hidden">
                  {/* Scan corners styling */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary/60 rounded-tl" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary/60 rounded-tr" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary/60 rounded-bl" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary/60 rounded-br" />

                  {timeLeft <= 0 ? (
                    <div className="absolute inset-0 bg-background/95 flex flex-col items-center justify-center p-4 text-center space-y-2 z-10 animate-in fade-in duration-200">
                      <span className="text-[10px] font-bold text-red-500 uppercase">Mã QR đã hết hạn</span>
                      <p className="text-[9px] text-muted-foreground leading-normal">Vui lòng bấm nút bên dưới để tạo mã QR mới.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setQrTimestamp(Date.now());
                          setTimeLeft(300);
                          setCheckAlert('');
                        }}
                        className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-bold text-white shadow hover:bg-primary/95 transition-all cursor-pointer"
                      >
                        Tạo mã mới
                      </button>
                    </div>
                  ) : null}

                  <img 
                    src={`https://img.vietqr.io/image/vietcombank-1019248902-compact2.png?amount=${selectedPackage.price}&addInfo=QRTBVC%20${user ? user.id.replace(/-/g, '').substring(0, 8).toUpperCase() : ''}%20${packageCodeMap[selectedPackage.id] || 'CBTOAN'}&accountName=Nguyen%20Phu%20Quy`}
                    alt="VietQR Automatic Payment"
                    className={`w-44 h-44 object-contain transition-opacity duration-300 ${timeLeft <= 0 ? 'opacity-10' : 'opacity-100'}`}
                  />
                </div>
                
                {timeLeft > 0 ? (
                  <div className="text-[10px] font-bold text-amber-600 flex items-center justify-center gap-1">
                    <span>Mã QR hết hạn sau:</span>
                    <span className="font-mono text-xs bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                ) : (
                  <p className="text-[10px] text-muted-foreground">Mở app Ngân hàng quét QR để thanh toán nhanh</p>
                )}
              </div>

              {/* Bank Details */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Ngân hàng:</span>
                  <span className="font-bold text-foreground">Vietcombank (VCB)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Số tài khoản:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-primary select-all">1019248902</span>
                    <button 
                      onClick={() => handleCopy('1019248902', 'stk')}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      title="Sao chép"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    {copiedText === 'stk' && <span className="text-[10px] text-emerald-600 font-bold">Đã chép!</span>}
                  </div>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Chủ tài khoản:</span>
                  <span className="font-bold text-foreground uppercase">Nguyen Phu Quy</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Số tiền:</span>
                  <span className="font-extrabold text-foreground">{formatPrice(selectedPackage.price)}</span>
                </div>
                <div className="flex flex-col gap-0.5 py-1">
                  <span className="text-muted-foreground">Nội dung chuyển khoản:</span>
                  <div className="flex items-center justify-between gap-2 font-extrabold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg mt-1">
                    <span className="select-all tracking-wide text-xs">
                      QRTBVC {user ? user.id.replace(/-/g, '').substring(0, 8).toUpperCase() : ''} {packageCodeMap[selectedPackage.id] || 'CBTOAN'}
                    </span>
                    <button 
                      onClick={() => handleCopy(
                        `QRTBVC ${user ? user.id.replace(/-/g, '').substring(0, 8).toUpperCase() : ''} ${packageCodeMap[selectedPackage.id] || 'CBTOAN'}`,
                        'ndck'
                      )}
                      className="text-amber-700 hover:text-amber-900 transition-colors"
                      title="Sao chép nội dung"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {copiedText === 'ndck' && <span className="text-[10px] text-emerald-600 font-bold self-end mt-0.5">Đã chép nội dung chuyển!</span>}
                </div>
              </div>
            </div>

            {/* Right side: Registration Form & Success info */}
            <div className="flex-1 p-6 relative flex flex-col justify-between">
              
              {/* Close Button */}
              <button 
                onClick={() => { if (!loading && !checkingPayment) setSelectedPackage(null); }}
                className="absolute right-4 top-4 rounded-xl border border-border p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                disabled={loading || checkingPayment}
              >
                <X className="h-4 w-4" />
              </button>

              {checkoutStep === 'info' ? (
                /* Form block for updating profile */
                <form onSubmit={handleCheckoutSubmit} className="space-y-4 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Step Title */}
                    <div className="space-y-1">
                      <span className="text-3xs font-bold text-primary uppercase tracking-wider">Bước 2: Xác nhận thông tin</span>
                      <h3 className="text-xs font-bold text-foreground">Cập nhật thông tin nhận lớp</h3>
                    </div>

                    {error && (
                      <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-3.5 py-2.5 text-2xs font-semibold text-red-600">
                        {error}
                      </div>
                    )}

                    {/* Personal Details Form */}
                    <div className="space-y-3">
                      <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-3 text-[10px] text-amber-700 font-medium leading-normal">
                        💡 Yêu cầu bắt buộc: Vui lòng kiểm tra và cập nhật đầy đủ Số điện thoại chính xác để hệ thống kích hoạt tự động.
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase pl-0.5">Họ và tên học sinh</label>
                        <input
                          type="text"
                          placeholder="Họ và tên của bạn"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase pl-0.5">Địa chỉ Email (Gmail)</label>
                        <input
                          type="email"
                          placeholder="Email đăng ký của bạn"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase pl-0.5">Số điện thoại liên hệ</label>
                        <input
                          type="tel"
                          placeholder="Số điện thoại di động"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary py-3.5 text-xs font-bold text-white shadow-md shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 mt-4 cursor-pointer"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Xác nhận & Tạo mã QR
                      </>
                    )}
                  </button>
                </form>
              ) : checkoutStep === 'qr' ? (
                /* QR code waiting step */
                <div className="space-y-4 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Step Title */}
                    <div className="space-y-1">
                      <span className="text-3xs font-bold text-primary uppercase tracking-wider">Bước 2: Tiến hành thanh toán</span>
                      <h3 className="text-xs font-bold text-foreground">Chờ giao dịch tự động</h3>
                    </div>

                    <div className="space-y-4 py-2">
                      <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4 text-center space-y-3">
                        <div className="relative flex items-center justify-center">
                          <div className="absolute h-10 w-10 rounded-full bg-primary/20 animate-ping" />
                          <div className="relative h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center text-primary">
                            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-foreground">Đang đợi chuyển khoản tự động...</h4>
                          <p className="text-3xs text-muted-foreground leading-relaxed">
                            Mở ứng dụng Ngân hàng quét mã QR ở ô bên trái. Hệ thống sẽ kích hoạt khóa học ngay sau khi nhận được chuyển khoản.
                          </p>
                        </div>
                      </div>

                      {checkAlert && (
                        <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 px-3.5 py-3 text-[10px] font-semibold text-amber-700 leading-normal animate-in fade-in duration-200">
                          ⚠️ {checkAlert}
                        </div>
                      )}

                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleCheckPayment}
                      disabled={checkingPayment || timeLeft <= 0}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary py-3.5 text-xs font-extrabold text-white shadow-md shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {checkingPayment ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Đang kiểm tra giao dịch...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-3.5 w-3.5" />
                          Kiểm tra
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setCheckAlert('');
                        setCheckoutStep('info');
                      }}
                      className="w-full py-2.5 rounded-2xl border border-border bg-card text-2xs font-bold text-muted-foreground hover:bg-muted transition-colors text-center cursor-pointer"
                    >
                      ✏️ Thay đổi thông tin cá nhân
                    </button>
                  </div>
                </div>
              ) : (
                /* Success screen */
                <div className="text-center py-8 space-y-6 flex flex-col justify-center h-full">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 animate-bounce">
                    <CheckCircle className="h-8 w-8 animate-in zoom-in-50 duration-300" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-black text-foreground">Kích hoạt khóa học thành công!</h3>
                    <p className="text-2xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                      Cám ơn bạn đã đăng ký khóa học của Thầy Công. Hệ thống đã xác thực giao dịch chuyển khoản thành công và mở khóa tài khoản của bạn.
                    </p>
                    <p className="text-2xs text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 leading-relaxed max-w-sm mx-auto">
                      🎉 Tài khoản học viên của bạn đã được ghi nhận quyền sở hữu trọn bộ chuyên đề thuộc <strong>{selectedPackage.name}</strong>.
                    </p>
                  </div>
                  <div className="pt-4 flex flex-col gap-2">
                    <Link
                      href="/courses"
                      onClick={() => setSelectedPackage(null)}
                      className="w-full rounded-2xl bg-primary py-3 text-xs font-bold text-white shadow hover:bg-primary/95 transition-all text-center block"
                    >
                      Vào ôn tập Bài học ngay
                    </Link>
                    <button
                      onClick={() => setSelectedPackage(null)}
                      className="w-full rounded-2xl border border-border bg-card py-3 text-xs font-bold text-foreground hover:bg-muted transition-all cursor-pointer"
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

      {/* AuthModal rendering for non-logged-in users trying to purchase */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}
    </div>
  );
}
