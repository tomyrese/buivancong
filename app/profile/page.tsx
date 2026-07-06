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

  const borderOptions = [
    { 
      id: 'default', 
      name: 'Mặc định', 
      gradient: 'from-border to-border/40', 
      requirement: 'Mở khóa sẵn', 
      isUnlocked: true 
    },
    { 
      id: 'bronze', 
      name: 'Đồng Tân thủ', 
      gradient: 'from-amber-600 to-amber-800', 
      requirement: 'Cấp độ 5 trở lên', 
      isUnlocked: user.level >= 5 
    },
    { 
      id: 'silver', 
      name: 'Bạc Chiến binh', 
      gradient: 'from-slate-300 via-slate-400 to-slate-500', 
      requirement: 'Cấp độ 10 trở lên', 
      isUnlocked: user.level >= 10 
    },
    { 
      id: 'gold', 
      name: 'Vàng Tinh hoa', 
      gradient: 'from-yellow-400 via-amber-500 to-yellow-600', 
      requirement: 'Cấp độ 15 trở lên', 
      isUnlocked: user.level >= 15 
    },
    { 
      id: 'platinum', 
      name: 'Bạch kim Cao thủ', 
      gradient: 'from-teal-400 via-indigo-500 to-purple-600', 
      requirement: 'Cấp độ 20 trở lên', 
      isUnlocked: user.level >= 20 
    },
    { 
      id: 'warrior', 
      name: 'Huyền thoại Lớp học', 
      gradient: 'from-red-500 via-orange-500 to-yellow-500', 
      requirement: 'Đạt từ 1000 XP trở lên', 
      isUnlocked: user.xp >= 1000 
    },
  ];

  const selectedBorder = borderOptions.find(b => b.id === (user.avatarBorder || 'default')) || borderOptions[0];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight sm:text-3xl">
          Hồ sơ Cá nhân
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Quản lý thông tin tài khoản, mật khẩu bảo mật và trang trí ảnh đại diện.
        </p>
      </div>

      <div className="space-y-8">
        {/* Row 1: Avatar & Borders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Left Column: Avatar & Quick Stats */}
          <div className="md:col-span-1 rounded-3xl border border-border bg-card p-6 text-center space-y-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="relative inline-block mx-auto mt-2">
                <div className={`p-1 rounded-full bg-gradient-to-tr ${selectedBorder.gradient} shadow-md`}>
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-white uppercase select-none ring-2 ring-background">
                    {user.name.charAt(0)}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-bold text-foreground">{user.name}</h3>
                <p className="text-3xs text-muted-foreground mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-muted/60 p-4 grid grid-cols-2 gap-2 text-center text-xs mt-4">
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

          {/* Right Column: Avatar Border Customizer */}
          <div className="md:col-span-2 rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Award className="h-4.5 w-4.5 text-primary" />
                Trang trí Viền Avatar
              </h3>
              <p className="text-[10px] text-muted-foreground">Mở khóa viền bằng cách đạt cấp độ hoặc điểm tích lũy.</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {borderOptions.map((opt) => {
                const isSelected = (user.avatarBorder || 'default') === opt.id;
                return (
                  <button
                    key={opt.id}
                    disabled={!opt.isUnlocked}
                    onClick={() => {
                      updateProfile({ avatarBorder: opt.id });
                    }}
                    className={`p-2.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-20 ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : opt.isUnlocked
                        ? 'border-border bg-card hover:bg-muted'
                        : 'border-border/40 bg-muted/40 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] font-bold text-foreground">{opt.name}</span>
                      <div className={`h-3 w-3 rounded-full bg-gradient-to-tr ${opt.gradient} border border-background`} />
                    </div>
                    
                    <span className={`text-[9px] ${opt.isUnlocked ? 'text-muted-foreground' : 'text-amber-600 font-semibold'}`}>
                      {opt.isUnlocked ? (isSelected ? '✓ Đang dùng' : '• Đã mở khóa') : `🔒 ${opt.requirement}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 2: Forms */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Left Column: Personal Info */}
          <div className="md:col-span-1 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider pb-3 border-b border-border/40">
                Thông tin cá nhân
              </h3>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs mt-6">
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
                      Đã lưu!
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Change Password */}
          <div className="md:col-span-2 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider pb-3 border-b border-border/40">
                Đổi mật khẩu bảo mật
              </h3>

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs mt-6">
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
    </div>
  );
}
