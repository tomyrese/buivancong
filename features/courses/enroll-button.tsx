'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '@/store/useProgressStore';
import { useAuthStore } from '@/store/useAuthStore';
import AuthModal from '@/components/auth-modal';
import { PlayCircle, ArrowRight } from 'lucide-react';

interface EnrollButtonProps {
  courseId: string;
  courseTitle: string;
  firstLessonId: string;
}

export default function EnrollButton({ courseId, courseTitle, firstLessonId }: EnrollButtonProps) {
  const router = useRouter();
  const { enrolledCourses, enrollInCourse } = useProgressStore();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = React.useState(false);
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  const isEnrolled = enrolledCourses.includes(courseId);

  const handleAction = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (isEnrolled) {
      router.push(`/learn/${courseId}/${firstLessonId}`);
    } else {
      setLoading(true);
      // Simulate enrolling delay
      setTimeout(() => {
        enrollInCourse(courseId);
        setLoading(false);
        router.push(`/learn/${courseId}/${firstLessonId}`);
      }, 500);
    }
  };

  return (
    <>
      <button
        onClick={handleAction}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
      >
        {loading ? (
          <span>Đang đăng ký...</span>
        ) : isEnrolled ? (
          <>
            <span>Vào học ngay</span>
            <ArrowRight className="h-4 w-4" />
          </>
        ) : (
          <>
            <PlayCircle className="h-5 w-5" />
            <span>Đăng ký học miễn phí</span>
          </>
        )}
      </button>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
