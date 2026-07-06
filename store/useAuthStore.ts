import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  role: 'student' | 'admin';
  xp: number;
  level: number;
  streak: number;
  joinedAt: string;
  avatarBorder?: string;
  purchasedPackages?: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string, phone?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
  addXP: (amount: number) => void;
}

// Helper to check if Supabase has non-placeholder keys configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
  return !!(url && key && !url.includes('placeholder') && !key.includes('placeholder'));
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        if (isSupabaseConfigured()) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: password || '123456',
          });
          if (error) throw error;
          
          if (data.user) {
            const isAdmin = data.user.email === 'admin@istudent.vn';
            const userProfile: User = {
              id: data.user.id,
              name: data.user.user_metadata?.name || 'Học Viên',
              email: data.user.email || email,
              phone: data.user.user_metadata?.phone || '',
              avatar: data.user.user_metadata?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
              role: isAdmin ? 'admin' : 'student',
              xp: data.user.user_metadata?.xp || 0,
              level: data.user.user_metadata?.level || 1,
              streak: data.user.user_metadata?.streak || 1,
              joinedAt: data.user.created_at,
              avatarBorder: data.user.user_metadata?.avatarBorder || undefined,
              purchasedPackages: data.user.user_metadata?.purchased_packages || [],
            };
            set({ user: userProfile, isAuthenticated: true });
            return true;
          }
          return false;
        } else {
          // Fallback to local mock authentication
          const isAdmin = email === 'admin@istudent.vn';
          const mockUser: User = isAdmin
            ? {
                id: 'u-admin',
                name: 'iSinhvien Admin',
                email: 'admin@istudent.vn',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
                role: 'admin',
                xp: 9999,
                level: 99,
                streak: 15,
                joinedAt: '2026-01-01T00:00:00Z',
                purchasedPackages: ['combo-toan-dien'],
              }
            : {
                id: 'u-student',
                name: 'Học Viên Chăm Chỉ',
                email: email || 'student@istudent.vn',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                role: 'student',
                xp: 350,
                level: 2,
                streak: 4,
                joinedAt: '2026-05-01T08:00:00Z',
                purchasedPackages: [],
              };
          set({ user: mockUser, isAuthenticated: true });
          return true;
        }
      },
      register: async (name, email, password, phone) => {
        if (isSupabaseConfigured()) {
          const { data, error } = await supabase.auth.signUp({
            email,
            password: password || '123456',
            options: {
              data: {
                name: name || 'Học Viên Mới',
                phone: phone || '',
                xp: 0,
                level: 1,
                streak: 1,
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
              }
            }
          });
          if (error) throw error;
          
          if (data.user) {
            const userProfile: User = {
              id: data.user.id,
              name: name || 'Học Viên Mới',
              email: data.user.email || email,
              phone: phone || '',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
              role: 'student',
              xp: 0,
              level: 1,
              streak: 1,
              joinedAt: data.user.created_at,
              purchasedPackages: [],
            };
            set({ user: userProfile, isAuthenticated: true });
            return true;
          }
          return false;
        } else {
          // Fallback to local mock registration
          const mockUser: User = {
            id: `u-${Math.random().toString(36).substring(2, 9)}`,
            name: name || 'Học Viên Mới',
            email: email,
            phone: phone || '',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            role: 'student',
            xp: 0,
            level: 1,
            streak: 1,
            joinedAt: new Date().toISOString(),
          };
          set({ user: mockUser, isAuthenticated: true });
          return true;
        }
      },
      logout: async () => {
        if (isSupabaseConfigured()) {
          try {
            await supabase.auth.signOut();
          } catch (e) {
            console.error('Supabase signOut error:', e);
          }
        }
        set({ user: null, isAuthenticated: false });
      },
      updateProfile: (updates) =>
        set((state) => {
          const newUser = state.user ? { ...state.user, ...updates } : null;
          if (isSupabaseConfigured() && newUser) {
            supabase.auth.updateUser({
              data: {
                name: newUser.name,
                avatar: newUser.avatar,
                xp: newUser.xp,
                level: newUser.level,
                streak: newUser.streak,
                avatarBorder: newUser.avatarBorder
              }
            }).catch(e => console.error('Supabase updateUser profile error:', e));
          }
          return { user: newUser };
        }),
      addXP: (amount) =>
        set((state) => {
          if (!state.user) return {};
          const newXP = state.user.xp + amount;
          const newLevel = Math.floor(newXP / 500) + 1;
          const finalLevel = newLevel > state.user.level ? newLevel : state.user.level;
          const updatedUser = {
            ...state.user,
            xp: newXP,
            level: finalLevel,
          };
          if (isSupabaseConfigured()) {
            supabase.auth.updateUser({
              data: {
                xp: newXP,
                level: finalLevel
              }
            }).catch(e => console.error('Supabase updateUser XP error:', e));
          }
          return {
            user: updatedUser,
          };
        }),
    }),
    {
      name: 'istudent-auth',
    }
  )
);
