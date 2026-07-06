import categoriesData from '@/data/categories.json';
import teachersData from '@/data/teachers.json';
import coursesData from '@/data/courses.json';
import lessonsData from '@/data/lessons.json';
import quizData from '@/data/quiz.json';
import reviewsData from '@/data/reviews.json';

import physics12 from '../src/courses/scientific_reasoning/physics12.json';
import biology12 from '../src/courses/scientific_reasoning/biology12.json';
import history12 from '../src/courses/scientific_reasoning/history12.json';
import chemistry12 from '../src/courses/scientific_reasoning/chemistry12.json';
import economyandlaw12 from '../src/courses/scientific_reasoning/economyandlaw12.json';
import geography12 from '../src/courses/scientific_reasoning/geography12.json';
import math10 from '../src/courses/math/math10.json';
import math11 from '../src/courses/math/math11.json';
import math12 from '../src/courses/math/math12.json';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
}

export interface Teacher {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  role: string;
  rating: number;
  studentsCount: number;
  coursesCount: number;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  categoryId: string;
  teacherId: string;
  difficulty: string;
  rating: number;
  enrolledCount: number;
  lessonsCount: number;
  duration: number;
  isFeatured: boolean;
  requirements: string[];
  outcomes: string[];
  syllabus: {
    id: string;
    title: string;
    lessonIds: string[];
  }[];
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  duration: number; // minutes
  videoUrl: string;
  type: 'video' | 'article';
  content: string; // Markdown text
  order: number;
  isPreview: boolean;
  resources: { name: string; url: string; size: string }[];
  transcript?: string;
  subtitles?: { time: string; text: string }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  courseId: string;
  questions: QuizQuestion[];
}

export interface Review {
  id: string;
  courseId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const CourseService = {
  // Categories
  getCategories: (): Category[] => {
    return categoriesData as Category[];
  },
  
  getCategoryById: (id: string): Category | undefined => {
    return (categoriesData as Category[]).find(c => c.id === id);
  },

  // Teachers
  getTeachers: (): Teacher[] => {
    return teachersData as Teacher[];
  },

  getTeacherById: (id: string): Teacher | undefined => {
    return (teachersData as Teacher[]).find(t => t.id === id);
  },

  // Courses
  getCourses: (): Course[] => {
    return coursesData as Course[];
  },

  getCourseById: (id: string): Course | undefined => {
    return (coursesData as Course[]).find(c => c.id === id);
  },

  getCourseBySlug: (slug: string): Course | undefined => {
    return (coursesData as Course[]).find(c => c.slug === slug);
  },

  getFeaturedCourses: (): Course[] => {
    return (coursesData as Course[]).filter(c => c.isFeatured);
  },

  getCoursesByCategory: (categoryId: string): Course[] => {
    return (coursesData as Course[]).filter(c => c.categoryId === categoryId);
  },

  // Lessons
  getLessonsByCourseId: (courseId: string): Lesson[] => {
    return (lessonsData as Lesson[]).filter(l => l.courseId === courseId).sort((a, b) => a.order - b.order);
  },

  getLessonById: (id: string): Lesson | undefined => {
    return (lessonsData as Lesson[]).find(l => l.id === id);
  },

  // Quiz
  getQuizByCourseId: (courseId: string): Quiz | undefined => {
    let courseData: any = null;
    if (courseId === 'physics-12') courseData = physics12;
    else if (courseId === 'biology-12') courseData = biology12;
    else if (courseId === 'history-12') courseData = history12;
    else if (courseId === 'chemistry-12') courseData = chemistry12;
    else if (courseId === 'economy-law-12') courseData = economyandlaw12;
    else if (courseId === 'geography-12') courseData = geography12;
    else if (courseId === 'math-10') courseData = math10;
    else if (courseId === 'math-11') courseData = math11;
    else if (courseId === 'math-12') courseData = math12;

    if (!courseData || !courseData.chapters) {
      return (quizData as Quiz[]).find(q => q.courseId === courseId);
    }

    const rawQuestions: any[] = [];
    
    const collectQuestions = (topics: any[]) => {
      topics.forEach((t: any) => {
        if (t.questions && Array.isArray(t.questions)) {
          t.questions.forEach((q: any) => {
            if (q.type === 'multiple_choice') {
              rawQuestions.push(q);
            }
          });
        }
        if (t.subtopics && Array.isArray(t.subtopics)) {
          collectQuestions(t.subtopics);
        }
      });
    };

    courseData.chapters.forEach((ch: any) => {
      if (ch.topics) {
        collectQuestions(ch.topics);
      }
    });

    if (rawQuestions.length === 0) {
      return undefined;
    }

    const questions: QuizQuestion[] = rawQuestions.map((q, idx) => {
      const cleanAnswer = q.answer ? q.answer.trim().toUpperCase() : 'A';
      let correctIdx = 0;
      if (cleanAnswer.startsWith('A') || cleanAnswer === '0') correctIdx = 0;
      else if (cleanAnswer.startsWith('B') || cleanAnswer === '1') correctIdx = 1;
      else if (cleanAnswer.startsWith('C') || cleanAnswer === '2') correctIdx = 2;
      else if (cleanAnswer.startsWith('D') || cleanAnswer === '3') correctIdx = 3;

      const options = q.options.map((opt: string) => {
        return opt.replace(/^[A-D]\.\s*/, '');
      });

      return {
        id: q.id || `q-${courseId}-${idx}`,
        question: q.question,
        options: options,
        correctAnswer: correctIdx,
        explanation: q.explanation || `Đáp án đúng là ${cleanAnswer}.`
      };
    });

    return {
      courseId,
      questions
    };
  },

  // Reviews
  getReviewsByCourseId: (courseId: string): Review[] => {
    return (reviewsData as Review[]).filter(r => r.courseId === courseId);
  },

  // Search & Filter
  searchCourses: (
    query: string,
    filters?: {
      categoryId?: string;
      difficulty?: string;
      durationRange?: 'all' | 'short' | 'medium' | 'long';
      sortBy?: 'newest' | 'popular' | 'rating';
    }
  ): Course[] => {
    let results = coursesData as Course[];

    // Search query
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
      );
    }

    // Filters
    if (filters) {
      if (filters.categoryId && filters.categoryId !== 'all') {
        results = results.filter(c => c.categoryId === filters.categoryId);
      }
      
      if (filters.difficulty && filters.difficulty !== 'all') {
        results = results.filter(c => c.difficulty === filters.difficulty);
      }

      if (filters.durationRange && filters.durationRange !== 'all') {
        results = results.filter(c => {
          if (filters.durationRange === 'short') return c.duration <= 6;
          if (filters.durationRange === 'medium') return c.duration > 6 && c.duration <= 10;
          if (filters.durationRange === 'long') return c.duration > 10;
          return true;
        });
      }

      if (filters.sortBy) {
        if (filters.sortBy === 'popular') {
          results = [...results].sort((a, b) => b.enrolledCount - a.enrolledCount);
        } else if (filters.sortBy === 'rating') {
          results = [...results].sort((a, b) => b.rating - a.rating);
        }
        // Newest is default (or by array index)
      }
    }

    return results;
  }
};
