'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore, User } from '@/store/useAuthStore';
import { useProgressStore } from '@/store/useProgressStore';

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
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
    const isSupabaseConfigured = url && key && !url.includes('placeholder') && !key.includes('placeholder');

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
        
        // Sync Zustand store only if state is different to prevent loops
        const currentAuthState = useAuthStore.getState();
        if (!currentAuthState.isAuthenticated || currentAuthState.user?.id !== userProfile.id) {
          useAuthStore.setState({ user: userProfile, isAuthenticated: true });
          // Load user-specific progress from localStorage first
          useProgressStore.persist.rehydrate();

          // Sync / merge course enrollment state from database user_metadata
          const dbEnrolledCourses = session.user.user_metadata?.enrolled_courses;
          if (Array.isArray(dbEnrolledCourses) && dbEnrolledCourses.length > 0) {
            const currentEnrolled = useProgressStore.getState().enrolledCourses;
            const merged = Array.from(new Set([...currentEnrolled, ...dbEnrolledCourses]));
            useProgressStore.setState({ enrolledCourses: merged });
          }
        }

        // Clean up URL hash to prevent infinite hydration refresh loops
        if (typeof window !== 'undefined' && window.location.hash && (window.location.hash.includes('access_token') || window.location.hash.includes('type=recovery'))) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } else {
        // Clear Zustand if Supabase has no active session
        const currentAuthState = useAuthStore.getState();
        if (currentAuthState.isAuthenticated) {
          useAuthStore.setState({ user: null, isAuthenticated: false });
          // Load guest progress from localStorage
          useProgressStore.persist.rehydrate();
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    let prevUserId = useAuthStore.getState().user?.id;
    const unsubscribe = useAuthStore.subscribe((state) => {
      const currentUserId = state.user?.id;
      if (currentUserId !== prevUserId) {
        prevUserId = currentUserId;
        // Trigger rehydration of progress store to fetch the correct user-specific storage keys
        useProgressStore.persist.rehydrate();
      }
    });

    return () => {
      unsubscribe();
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
