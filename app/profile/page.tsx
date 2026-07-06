'use client';

import * as React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useTheme } from 'next-themes';
import { 
  User as UserIcon, 
  Mail, 
  Key, 
  Settings, 
  Sun, 
  Moon, 
  Languages, 
  Award, 
  Check, 
  Save 
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const { theme, setTheme } = useTheme();

  // Local state for forms
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [lang, setLang] = React.useState('vi');
  const [isClient, setIsClient] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  if (!isClient) return null;

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-4">
        <UserIcon className="h-12 w-12 text-muted-foreground mx-auto" />
        <h2 className="text-lg font-bold text-foreground">Bạn chưa đăng nhập</h2>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassword('');
    setNewPassword('');
    alert('Mật khẩu đã được cập nhật thành công (Simulated)!');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight sm:text-3xl">
          Hồ sơ Cá nhân
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Quản lý thông tin tài khoản, mật khẩu bảo mật và tùy biến cấu hình giao diện.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column: Avatar & Quick Stats */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 text-center space-y-4 shadow-sm">
            <div className="relative inline-block mx-auto">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-white uppercase ring-4 ring-primary/10 select-none">
                {user.name.charAt(0)}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{user.name}</h3>
              <p className="text-3xs text-muted-foreground mt-0.5">{user.email}</p>
            </div>

            <div className="rounded-2xl bg-muted/60 p-4 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="border-r border-border/60">
                <span className="text-muted-foreground font-semibold text-3xs uppercase tracking-wider block">Cấp độ</span>
                <span className="text-base font-extrabold text-primary">{user.level}</span>
              </div>
              <div>
                <span className="text-muted-foreground font-semibold text-3xs uppercase tracking-wider block">Kinh nghiệm</span>
                <span className="text-base font-extrabold text-secondary">{user.xp} XP</span>
              </div>
            </div>
          </div>

          {/* Quick theme settings */}
          <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Settings className="h-4.5 w-4.5 text-primary" />
              Tùy biến hệ thống
            </h3>



            {/* Language switcher */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Ngôn ngữ hiển thị:</span>
              <div className="flex items-center gap-1 rounded-xl border border-border bg-background px-2.5 py-1 text-3xs font-bold text-foreground">
                <Languages className="h-3.5 w-3.5 text-primary" />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Update Info Form */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile details card */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider pb-3 border-b border-border/40">
              Thông tin cá nhân
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider block">Họ và Tên</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider block">Địa chỉ Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow shadow-primary/10 hover:bg-primary/95 transition-all"
                >
                  <Save className="h-4 w-4" />
                  Lưu thay đổi
                </button>
                {saveSuccess && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500 animate-fade-in">
                    <Check className="h-4 w-4" />
                    Đã lưu thay đổi thành công!
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Change password card */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider pb-3 border-b border-border/40">
              Đổi mật khẩu bảo mật
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider block">Mật khẩu hiện tại</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider block">Mật khẩu mới</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-bold text-foreground hover:bg-muted transition-all"
                >
                  Cập nhật mật khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
