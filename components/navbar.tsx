'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  User as UserIcon, 
  LogOut, 
  BookOpen, 
  Award, 
  LayoutDashboard, 
  Sparkles,
  Settings,
  ShieldCheck,
  Home
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, logout, login } = useAuthStore();
  
  const [isOpen, setIsOpen] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check scroll position immediately on mount
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Trang chủ', href: '/', icon: Home },
    { name: 'Khóa học', href: '/courses', icon: BookOpen },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ];

  const handleMockLogin = async () => {
    await login('student@istudent.edu');
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] h-16 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md border-b border-border' 
          : 'glass-navbar'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
                <span className="text-xl font-black">i</span>
              </div>
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
                iStudent
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-primary font-semibold" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.name}
                </Link>
              );
            })}
            
            {/* Admin link if user is admin */}
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-1.5 text-sm font-medium text-amber-500 hover:text-amber-600 transition-colors",
                  pathname === '/admin' ? "font-bold" : ""
                )}
              >
                <ShieldCheck className="h-4 w-4" />
                Quản lý
              </Link>
            )}

            {/* AI Assistant shortcut */}
            <Link
              href="/courses?ai=true"
              className="flex items-center gap-1.5 rounded-full bg-secondary/10 px-3.5 py-1 text-xs font-semibold text-secondary hover:bg-secondary/20 transition-all border border-secondary/20 hover:scale-105"
            >
              <Sparkles className="h-3.5 w-3.5 text-secondary animate-pulse" />
              Gợi ý AI
            </Link>
          </div>

          {/* Right Section (User profile) */}
          <div className="hidden md:flex items-center gap-4">

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white uppercase ring-2 ring-primary/20 hover:ring-primary/50 transition-all select-none">
                    {user.name.charAt(0)}
                  </div>
                </button>

                {showProfileMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-border bg-card p-2 shadow-xl ring-1 ring-black/5 z-20 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="px-3 py-2 border-b border-border">
                        <p className="text-sm font-semibold truncate text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        <div className="mt-2 flex items-center justify-between rounded-lg bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Award className="h-3.5 w-3.5 text-primary" />
                            Cấp độ {user.level}
                          </span>
                          <span>{user.xp} XP</span>
                        </div>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          Hồ sơ cá nhân
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Bảng điều khiển
                        </Link>
                      </div>
                      <div className="border-t border-border pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setShowProfileMenu(false);
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={handleMockLogin}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Đăng nhập
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-xl p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-md animate-in slide-in-from-top duration-200">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-base font-medium transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.name}
                </Link>
              );
            })}
            
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-base font-medium text-amber-500 hover:bg-muted transition-colors"
                )}
              >
                <ShieldCheck className="h-5 w-5" />
                Trang Quản trị
              </Link>
            )}

            <Link
              href="/courses?ai=true"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-base font-medium text-secondary hover:bg-muted transition-colors"
            >
              <Sparkles className="h-5 w-5 text-secondary" />
              Tư vấn lộ trình học AI
            </Link>

            <div className="border-t border-border pt-4 pb-2 mt-4">
              {user ? (
                <div className="px-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white uppercase ring-2 ring-primary/20 select-none shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-primary" />
                      Cấp độ {user.level}
                    </span>
                    <span>{user.xp} XP</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <UserIcon className="h-3.5 w-3.5" />
                      Hồ sơ
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-destructive/10 py-2 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-3">
                  <button
                    onClick={() => {
                      handleMockLogin();
                      setIsOpen(false);
                    }}
                    className="w-full rounded-xl bg-primary py-2.5 text-center text-sm font-semibold text-white shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
                  >
                    Đăng nhập tài khoản
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
