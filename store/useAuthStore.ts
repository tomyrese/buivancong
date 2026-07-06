import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'admin';
  xp: number;
  level: number;
  streak: number;
  joinedAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<boolean>;
  register: (name: string, email: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addXP: (amount: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email) => {
        const isAdmin = email === 'admin@istudent.edu';
        const mockUser: User = isAdmin
          ? {
              id: 'u-admin',
              name: 'iStudent Admin',
              email: 'admin@istudent.edu',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
              role: 'admin',
              xp: 9999,
              level: 99,
              streak: 15,
              joinedAt: '2026-01-01T00:00:00Z',
            }
          : {
              id: 'u-student',
              name: 'Học Viên Chăm Chỉ',
              email: email || 'student@istudent.edu',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
              role: 'student',
              xp: 350,
              level: 2,
              streak: 4,
              joinedAt: '2026-05-01T08:00:00Z',
            };
        set({ user: mockUser, isAuthenticated: true });
        return true;
      },
      register: async (name, email) => {
        const mockUser: User = {
          id: `u-${Math.random().toString(36).substring(2, 9)}`,
          name: name || 'Học Viên Mới',
          email: email,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          role: 'student',
          xp: 0,
          level: 1,
          streak: 1,
          joinedAt: new Date().toISOString(),
        };
        set({ user: mockUser, isAuthenticated: true });
        return true;
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      addXP: (amount) =>
        set((state) => {
          if (!state.user) return {};
          const newXP = state.user.xp + amount;
          const newLevel = Math.floor(newXP / 500) + 1;
          return {
            user: {
              ...state.user,
              xp: newXP,
              level: newLevel > state.user.level ? newLevel : state.user.level,
            },
          };
        }),
    }),
    {
      name: 'istudent-auth',
    }
  )
);
