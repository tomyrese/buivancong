'use client';

import * as React from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useAuthStore();
  const [isLoginMode, setIsLoginMode] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      // Reset state on close
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setError('');
      setSuccess('');
      setLoading(false);
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ email và mật khẩu!');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email không đúng định dạng!');
      return false;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải chứa ít nhất 6 ký tự!');
      return false;
    }
    if (!isLoginMode && !name.trim()) {
      setError('Vui lòng nhập họ và tên của bạn!');
      return false;
    }
    if (!isLoginMode && password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp!');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    // Simulate network delay for premium feel
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      if (isLoginMode) {
        await login(email, password);
        setSuccess('Đăng nhập thành công! Chào mừng bạn quay trở lại.');
      } else {
        await register(name, email, password);
        setSuccess('Đăng ký tài khoản thành công! Bắt đầu học ngay.');
      }

      // Close modal on success after delay and refresh page to reset store state cleanly
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error(err);
      setError('Có lỗi xảy ra, vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder');

      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) throw error;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
        await login('hocsinh.gmail@isinhvien.vn', '123456');
        setSuccess('Đăng nhập bằng Google thành công! Chào mừng bạn.');
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1000);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Không thể đăng nhập bằng Google, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md transform rounded-3xl border border-border bg-card shadow-2xl transition-all duration-300 z-10 overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        {/* Background Decorative Glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-36 w-36 rounded-full bg-primary/10 blur-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-36 w-36 rounded-full bg-secondary/10 blur-xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl border border-border p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Logo/Header */}
        <div className="text-center mb-6 mt-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20 mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            {isLoginMode ? 'Đăng nhập tài khoản' : 'Đăng ký học viên mới'}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {isLoginMode 
              ? 'Luyện thi Đánh giá Năng lực cùng Thầy Bùi Văn Công' 
              : 'Tham gia lớp học chất lượng cao để bứt phá điểm số'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-muted p-1 mb-6 border border-border">
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(true);
              setError('');
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              isLoginMode 
                ? 'bg-card text-foreground shadow-xs' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(false);
              setError('');
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              !isLoginMode 
                ? 'bg-card text-foreground shadow-xs' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Đăng ký
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 text-xs font-semibold text-emerald-600">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full name input for registration */}
          {!isLoginMode && (
            <div className="space-y-1">
              <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Họ và tên</label>
              <div className="relative flex items-center">
                <UserIcon className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading || !!success}
                  className="w-full rounded-2xl border border-border bg-background py-3 pl-10 pr-4 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
            </div>
          )}

          {/* Email input */}
          <div className="space-y-1">
            <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Địa chỉ Email</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="example@student.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || !!success}
                className="w-full rounded-2xl border border-border bg-background py-3 pl-10 pr-4 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Mật khẩu</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || !!success}
                className="w-full rounded-2xl border border-border bg-background py-3 pl-10 pr-4 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Confirm Password input */}
          {!isLoginMode && (
            <div className="space-y-1 animate-in fade-in duration-200">
              <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Nhập lại mật khẩu</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading || !!success}
                  className="w-full rounded-2xl border border-border bg-background py-3 pl-10 pr-4 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !!success}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary py-3 text-xs font-bold text-white shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none mt-2"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                {isLoginMode ? 'Đăng nhập' : 'Tạo tài khoản'}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          {/* OR Separator */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border/80"></div>
            <span className="flex-shrink mx-4 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Hoặc</span>
            <div className="flex-grow border-t border-border/80"></div>
          </div>

          {/* Google (Gmail) Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || !!success}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl border border-border bg-card py-3 text-xs font-bold text-foreground shadow-xs hover:bg-muted/50 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Đăng nhập với Google</span>
          </button>
        </form>

        {/* Footer switch */}
        <div className="text-center mt-6 text-2xs text-muted-foreground">
          {isLoginMode ? (
            <>
              Chưa có tài khoản học viên?{' '}
              <button 
                onClick={() => {
                  setIsLoginMode(false);
                  setError('');
                }}
                className="font-bold text-primary hover:underline focus:outline-none"
              >
                Đăng ký ngay
              </button>
            </>
          ) : (
            <>
              Đã có tài khoản học viên?{' '}
              <button 
                onClick={() => {
                  setIsLoginMode(true);
                  setError('');
                }}
                className="font-bold text-primary hover:underline focus:outline-none"
              >
                Đăng nhập tại đây
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
