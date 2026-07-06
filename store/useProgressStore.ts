import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useAuthStore } from './useAuthStore';

export interface Note {
  id: string;
  courseId: string;
  lessonId: string;
  timestamp: string; // MM:SS format or seconds
  content: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  date: string;
  verifyCode: string;
}

interface ProgressState {
  enrolledCourses: string[];
  completedLessons: string[]; // array of lessonIds
  quizAttempts: Record<string, { score: number; totalQuestions: number; passed: boolean; date: string }>; // courseId -> attempt
  certificates: Certificate[];
  bookmarks: string[]; // array of lessonIds
  notes: Note[];
  
  enrollInCourse: (courseId: string) => void;
  completeLesson: (lessonId: string) => void;
  uncompleteLesson: (lessonId: string) => void;
  saveQuizAttempt: (courseId: string, score: number, totalQuestions: number, passed: boolean) => void;
  issueCertificate: (courseId: string, courseTitle: string, studentName: string) => Certificate | null;
  toggleBookmark: (lessonId: string) => void;
  saveNote: (courseId: string, lessonId: string, timestamp: string, content: string) => void;
  deleteNote: (noteId: string) => void;
  getCourseProgressPercentage: (courseId: string, courseLessonIds: string[]) => number;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      enrolledCourses: ['c-1'], // Pre-enroll in Course 1 for demo purposes
      completedLessons: [],
      quizAttempts: {},
      certificates: [],
      bookmarks: [],
      notes: [],

      enrollInCourse: (courseId) => set((state) => {
        if (state.enrolledCourses.includes(courseId)) return {};
        return { enrolledCourses: [...state.enrolledCourses, courseId] };
      }),

      completeLesson: (lessonId) => set((state) => {
        if (state.completedLessons.includes(lessonId)) return {};
        return { completedLessons: [...state.completedLessons, lessonId] };
      }),

      uncompleteLesson: (lessonId) => set((state) => ({
        completedLessons: state.completedLessons.filter((id) => id !== lessonId),
      })),

      saveQuizAttempt: (courseId, score, totalQuestions, passed) => set((state) => ({
        quizAttempts: {
          ...state.quizAttempts,
          [courseId]: {
            score,
            totalQuestions,
            passed,
            date: new Date().toISOString(),
          }
        }
      })),

      issueCertificate: (courseId, courseTitle, studentName) => {
        const existing = get().certificates.find(c => c.courseId === courseId);
        if (existing) return existing;

        const verifyCode = `ISTUDENT-${courseId.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const newCertificate: Certificate = {
          id: `cert-${courseId}-${Date.now()}`,
          courseId,
          courseTitle,
          studentName,
          date: new Date().toLocaleDateString('vi-VN'),
          verifyCode,
        };

        set((state) => ({
          certificates: [...state.certificates, newCertificate],
        }));

        return newCertificate;
      },

      toggleBookmark: (lessonId) => set((state) => {
        const isBookmarked = state.bookmarks.includes(lessonId);
        return {
          bookmarks: isBookmarked
            ? state.bookmarks.filter((id) => id !== lessonId)
            : [...state.bookmarks, lessonId]
        };
      }),

      saveNote: (courseId, lessonId, timestamp, content) => set((state) => {
        const existingNoteIndex = state.notes.findIndex(
          (n) => n.courseId === courseId && n.lessonId === lessonId && n.timestamp === timestamp
        );

        const newNotes = [...state.notes];
        if (existingNoteIndex > -1) {
          if (!content.trim()) {
            // Delete if empty
            newNotes.splice(existingNoteIndex, 1);
          } else {
            // Update
            newNotes[existingNoteIndex] = {
              ...newNotes[existingNoteIndex],
              content,
              createdAt: new Date().toISOString(),
            };
          }
        } else if (content.trim()) {
          // Add new
          newNotes.push({
            id: `note-${Date.now()}`,
            courseId,
            lessonId,
            timestamp,
            content,
            createdAt: new Date().toISOString(),
          });
        }

        return { notes: newNotes };
      }),

      deleteNote: (noteId) => set((state) => ({
        notes: state.notes.filter((n) => n.id !== noteId),
      })),

      getCourseProgressPercentage: (courseId, courseLessonIds) => {
        if (!courseLessonIds || courseLessonIds.length === 0) return 0;
        const completedCount = courseLessonIds.filter(id => get().completedLessons.includes(id)).length;
        return Math.round((completedCount / courseLessonIds.length) * 100);
      },
    }),
    {
      name: 'istudent-progress',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          if (typeof window === 'undefined') return null;
          const userId = useAuthStore.getState().user?.id || 'guest';
          const key = `${name}-${userId}`;
          const value = localStorage.getItem(key);
          // If guest, fall back to key without guest suffix if it exists (for compatibility)
          if (!value && userId === 'guest') {
            return localStorage.getItem(name);
          }
          return value;
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return;
          const userId = useAuthStore.getState().user?.id || 'guest';
          const key = `${name}-${userId}`;
          localStorage.setItem(key, value);
        },
        removeItem: (name) => {
          if (typeof window === 'undefined') return;
          const userId = useAuthStore.getState().user?.id || 'guest';
          const key = `${name}-${userId}`;
          localStorage.removeItem(key);
        }
      }))
    }
  )
);
