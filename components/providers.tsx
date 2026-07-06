'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore, User } from '@/store/useAuthStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  React.useEffect(() => {
    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder');

    if (!isSupabaseConfigured) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const email = session.user.email || '';
        const isAdmin = email === 'admin@isinhvien.vn';
        const userProfile: User = {
          id: session.user.id,
          name: session.user.user_metadata?.name || 'Học Viên',
          email: email,
          avatar: session.user.user_metadata?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          role: isAdmin ? 'admin' : 'student',
          xp: session.user.user_metadata?.xp || 0,
          level: session.user.user_metadata?.level || 1,
          streak: session.user.user_metadata?.streak || 1,
          joinedAt: session.user.created_at,
          avatarBorder: session.user.user_metadata?.avatarBorder || undefined,
        };
        
        // Sync Zustand store
        useAuthStore.setState({ user: userProfile, isAuthenticated: true });
      } else {
        // Clear Zustand if Supabase has no active session
        if (useAuthStore.getState().isAuthenticated) {
          useAuthStore.setState({ user: null, isAuthenticated: false });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        forcedTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
