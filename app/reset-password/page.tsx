'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { Lock, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const hasReset = React.useRef(false);

  React.useEffect(() => {
    // If they leave or navigate away from reset-password page without completing success, sign them out!
    return () => {
      if (!hasReset.current) {
        supabase.auth.signOut().then(() => {
          const { logout } = useAuthStore.getState();
          logout();
        });
      }
    };
  }, []);

  const validateForm = () => {
    if (!password.trim() || !confirmPassword.trim()) {
      setError('Vui lòng nhập mật khẩu mới và xác nhận mật khẩu!');
      return false;
    }
    if (password.length < 6) {
      setError('Mật khẩu mới phải chứa ít nhất 6 ký tự!');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không trùng khớp!');
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

    try {
      // Check if Supabase is configured
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
      const isSupabaseConfigured = url && key && !url.includes('placeholder') && !key.includes('placeholder');

      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.updateUser({
          password: password,
        });
        if (error) throw error;
        setSuccess('Cập nhật mật khẩu thành công! Bạn sẽ được chuyển về trang chủ.');
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSuccess('[Giả lập] Cập nhật mật khẩu thành công! Đang chuyển hướng...');
      }

      hasReset.current = true;
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Có lỗi xảy ra khi cập nhật mật khẩu, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 h-96 w-96 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10 glass-card rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20 mb-4">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-extrabold text-foreground tracking-tight">Đặt lại mật khẩu</h1>
          <p className="text-xs text-muted-foreground mt-2">Nhập mật khẩu mới cho tài khoản iSinhvien của bạn</p>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-center gap-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-xs font-semibold text-emerald-600 animate-in fade-in duration-200">
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Mật khẩu mới</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4.5 w-4.5 text-muted-foreground" />
              <input
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || !!success}
                className="w-full rounded-2xl border border-border bg-background py-3.5 pl-11 pr-4 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Nhập lại mật khẩu mới</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4.5 w-4.5 text-muted-foreground" />
              <input
                type="password"
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading || !!success}
                className="w-full rounded-2xl border border-border bg-background py-3.5 pl-11 pr-4 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !!success}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary py-3.5 text-xs font-bold text-white shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none mt-2 cursor-pointer"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>Xác nhận đổi mật khẩu</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
