'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { CourseService, Course, Category, Teacher, QuizQuestion } from '@/services/courseService';
import { NewsletterService, NewsletterSubscription } from '@/services/newsletterService';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  BookOpen, 
  FolderHeart, 
  Users, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  HelpCircle,
  X,
  FileText,
  MailCheck
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  // Simulated DB list states
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);
  const [newsletterEmails, setNewsletterEmails] = React.useState<NewsletterSubscription[]>([]);
  
  // Quizzes state
  const [quizzes, setQuizzes] = React.useState<{ [courseId: string]: QuizQuestion[] }>({});
  const [activeQuizCourse, setActiveQuizCourse] = React.useState<Course | null>(null);
  
  // Tab selector
  const [activeTab, setActiveTab] = React.useState<'courses' | 'categories' | 'newsletters' | 'registrations'>('courses');
  const [registrations, setRegistrations] = React.useState<any[]>([]);
  const [regLoading, setRegLoading] = React.useState(false);

  React.useEffect(() => {
    if (activeTab === 'registrations') {
      setRegLoading(true);
      fetch('/api/admin/registrations')
        .then(res => res.json())
        .then(data => {
          if (data.registrations) {
            setRegistrations(data.registrations);
          }
        })
        .catch(err => console.error("Error loading registrations:", err))
        .finally(() => setRegLoading(false));
    }
  }, [activeTab]);
  const [isClient, setIsClient] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState('');

  // Course Add/Edit Form states
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [editingCourse, setEditingCourse] = React.useState<Course | null>(null);
  
  const [title, setTitle] = React.useState('');
  const [categoryId, setCategoryId] = React.useState('math');
  const [difficulty, setDifficulty] = React.useState('Cơ bản');
  const [duration, setDuration] = React.useState(5);
  const [description, setDescription] = React.useState('');

  // Category Add/Edit Form states
  const [showAddCategoryForm, setShowAddCategoryForm] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [catName, setCatName] = React.useState('');
  const [catDescription, setCatDescription] = React.useState('');

  // Quiz Question Form states
  const [showAddQuestionForm, setShowAddQuestionForm] = React.useState(false);
  const [editingQuestion, setEditingQuestion] = React.useState<QuizQuestion | null>(null);
  const [qText, setQText] = React.useState('');
  const [qOptA, setQOptA] = React.useState('');
  const [qOptB, setQOptB] = React.useState('');
  const [qOptC, setQOptC] = React.useState('');
  const [qOptD, setQOptD] = React.useState('');
  const [qCorrect, setQCorrect] = React.useState(0);
  const [qExplanation, setQExplanation] = React.useState('');

  // Load initial data
  React.useEffect(() => {
    setIsClient(true);
    const allCourses = CourseService.getCourses();
    setCourses(allCourses);
    
    const allCategories = CourseService.getCategories();
    setCategories(allCategories);
    setTeachers(CourseService.getTeachers());
    setNewsletterEmails(NewsletterService.getEmails());

    // Load initial quizzes
    const initialQuizzes: { [courseId: string]: QuizQuestion[] } = {};
    allCourses.forEach(c => {
      const quiz = CourseService.getQuizByCourseId(c.id);
      if (quiz) {
        initialQuizzes[c.id] = quiz.questions;
      } else {
        initialQuizzes[c.id] = [];
      }
    });
    setQuizzes(initialQuizzes);
  }, []);

  const handleDeleteNewsletter = (email: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa email "${email}" khỏi danh sách nhận bản tin?`)) {
      NewsletterService.deleteEmail(email);
      setNewsletterEmails(NewsletterService.getEmails());
      setSuccessMsg('Đã xóa email khỏi danh sách nhận bản tin thành công!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  if (!isClient) return null;

  // Authorization Check
  if (!user || user.role !== 'admin') {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center space-y-6 animate-in fade-in duration-300">
        <ShieldAlert className="h-14 w-14 text-amber-500 mx-auto" />
        <div className="space-y-2">
          <h1 className="text-xl font-extrabold text-foreground">Truy cập bị Từ chối</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Bạn cần đăng nhập bằng tài khoản quản trị viên để truy cập trang quản lý này.
          </p>
        </div>
        <div className="rounded-2xl bg-amber-500/5 border border-amber-500/10 p-4 text-xs text-amber-600 font-medium">
          💡 Mẹo: Bấm Đăng xuất, sau đó Đăng nhập bằng email: <strong className="font-bold underline">admin@isinhvien.vn</strong>
        </div>
        <button
          onClick={() => router.push('/')}
          className="rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted"
        >
          Quay lại Trang chủ
        </button>
      </div>
    );
  }

  // Course actions
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newCourse: Course = {
      id: `c-new-${Date.now()}`,
      title: title.trim(),
      slug: title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      description: description.trim(),
      longDescription: 'Khóa học được thêm mới qua Admin Dashboard để mô phỏng CRUD.',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      categoryId,
      teacherId: teachers[0]?.id || 'tc-1',
      difficulty,
      rating: 5.0,
      enrolledCount: 0,
      lessonsCount: 0,
      duration,
      isFeatured: false,
      requirements: ['Có máy tính kết nối mạng'],
      outcomes: ['Hiểu các kiến thức cơ bản của khóa học'],
      syllabus: [],
    };

    setCourses([newCourse, ...courses]);
    // Initialize empty quiz for the new course
    setQuizzes(prev => ({ ...prev, [newCourse.id]: [] }));

    setTitle('');
    setDescription('');
    setShowAddForm(false);
    
    setSuccessMsg('Đã thêm khóa học mới thành công!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleStartEditCourse = (course: Course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setCategoryId(course.categoryId);
    setDifficulty(course.difficulty);
    setDuration(course.duration);
    setDescription(course.description);
    setShowAddForm(true); // Share the same form wrapper
  };

  const handleUpdateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !title.trim() || !description.trim()) return;

    setCourses(courses.map(c => c.id === editingCourse.id ? {
      ...c,
      title: title.trim(),
      categoryId,
      difficulty,
      duration,
      description: description.trim()
    } : c));

    setEditingCourse(null);
    setTitle('');
    setDescription('');
    setShowAddForm(false);

    setSuccessMsg('Đã cập nhật thông tin khóa học thành công!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa khóa học này không?')) {
      setCourses(courses.filter((c) => c.id !== courseId));
      setSuccessMsg('Đã xóa khóa học thành công!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  // Category actions
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim() || !catDescription.trim()) return;

    const newCat: Category = {
      id: `cat-new-${Date.now()}`,
      name: catName.trim(),
      slug: catName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      icon: 'FolderHeart',
      description: catDescription.trim(),
      color: 'from-blue-600 to-indigo-600',
    };

    setCategories([...categories, newCat]);
    setCatName('');
    setCatDescription('');
    setShowAddCategoryForm(false);

    setSuccessMsg('Đã tạo danh mục mới thành công!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleStartEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatDescription(cat.description);
    setShowAddCategoryForm(true);
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !catName.trim() || !catDescription.trim()) return;

    setCategories(categories.map(c => c.id === editingCategory.id ? {
      ...c,
      name: catName.trim(),
      description: catDescription.trim()
    } : c));

    setEditingCategory(null);
    setCatName('');
    setCatDescription('');
    setShowAddCategoryForm(false);

    setSuccessMsg('Đã cập nhật thông tin danh mục thành công!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteCategory = (catId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này? Tất cả các khóa học thuộc danh mục này có thể bị ảnh hưởng.')) {
      setCategories(categories.filter((c) => c.id !== catId));
      setSuccessMsg('Đã xóa danh mục thành công!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  // Quiz Question actions
  const handleStartAddQuestion = () => {
    setQText('');
    setQOptA('');
    setQOptB('');
    setQOptC('');
    setQOptD('');
    setQCorrect(0);
    setQExplanation('');
    setEditingQuestion(null);
    setShowAddQuestionForm(true);
  };

  const handleStartEditQuestion = (q: QuizQuestion) => {
    setEditingQuestion(q);
    setQText(q.question);
    setQOptA(q.options[0] || '');
    setQOptB(q.options[1] || '');
    setQOptC(q.options[2] || '');
    setQOptD(q.options[3] || '');
    setQCorrect(q.correctAnswer);
    setQExplanation(q.explanation);
    setShowAddQuestionForm(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuizCourse || !qText.trim() || !qOptA.trim() || !qOptB.trim()) return;

    const currentQuestions = quizzes[activeQuizCourse.id] || [];

    if (editingQuestion) {
      // Update existing question
      const updated = currentQuestions.map(q => q.id === editingQuestion.id ? {
        ...q,
        question: qText.trim(),
        options: [qOptA.trim(), qOptB.trim(), qOptC.trim(), qOptD.trim()].filter(Boolean),
        correctAnswer: qCorrect,
        explanation: qExplanation.trim() || 'Đáp án đúng.'
      } : q);
      
      setQuizzes(prev => ({
        ...prev,
        [activeQuizCourse.id]: updated
      }));
      setSuccessMsg('Đã sửa câu hỏi thành công!');
    } else {
      // Add new question
      const newQ: QuizQuestion = {
        id: `q-new-${Date.now()}`,
        question: qText.trim(),
        options: [qOptA.trim(), qOptB.trim(), qOptC.trim(), qOptD.trim()].filter(Boolean),
        correctAnswer: qCorrect,
        explanation: qExplanation.trim() || 'Đáp án đúng.'
      };

      setQuizzes(prev => ({
        ...prev,
        [activeQuizCourse.id]: [...currentQuestions, newQ]
      }));
      setSuccessMsg('Đã thêm câu hỏi mới thành công!');
    }

    setShowAddQuestionForm(false);
    setEditingQuestion(null);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteQuestion = (qId: string) => {
    if (!activeQuizCourse) return;
    if (confirm('Bạn có chắc chắn muốn xóa câu hỏi này không?')) {
      const currentQuestions = quizzes[activeQuizCourse.id] || [];
      const updated = currentQuestions.filter(q => q.id !== qId);
      setQuizzes(prev => ({
        ...prev,
        [activeQuizCourse.id]: updated
      }));
      setSuccessMsg('Đã xóa câu hỏi thành công!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* Title bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <span className="text-3xs font-extrabold text-amber-500 tracking-widest uppercase">Trang quản trị</span>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight sm:text-3xl mt-1 flex items-center gap-2">
            <LayoutDashboard className="h-7 w-7 text-primary" />
            iStudent Manager
          </h1>
        </div>
        
        {successMsg && (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-xs font-bold text-emerald-500 flex items-center gap-1.5 animate-bounce">
            <Check className="h-4 w-4" />
            {successMsg}
          </div>
        )}
      </div>

      {/* Admin stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-border/60 shadow-sm flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-primary shrink-0" />
          <div>
            <p className="text-lg font-black text-foreground">{courses.length}</p>
            <p className="text-3xs font-semibold text-muted-foreground uppercase tracking-wider">Khóa học</p>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-border/60 shadow-sm flex items-center gap-3">
          <FolderHeart className="h-5 w-5 text-secondary shrink-0" />
          <div>
            <p className="text-lg font-black text-foreground">{categories.length}</p>
            <p className="text-3xs font-semibold text-muted-foreground uppercase tracking-wider">Danh mục</p>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-border/60 shadow-sm flex items-center gap-3">
          <Users className="h-5 w-5 text-accent shrink-0" />
          <div>
            <p className="text-lg font-black text-foreground">85k+</p>
            <p className="text-3xs font-semibold text-muted-foreground uppercase tracking-wider">Người dùng</p>
          </div>
        </div>
      </div>

      {/* Selector Tabs (Only show if not managing quiz questions) */}
      {!activeQuizCourse && (
        <div className="flex border-b border-border/60 overflow-x-auto scrollbar-none gap-2">
          {[
            { id: 'courses', label: 'Quản lý Khóa học' },
            { id: 'categories', label: 'Quản lý Danh mục' },
            { id: 'newsletters', label: 'Quản lý Đăng ký Bản tin' },
            { id: 'registrations', label: 'Học viên Đăng ký Gói' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setShowAddForm(false);
                setShowAddCategoryForm(false);
                setEditingCourse(null);
                setEditingCategory(null);
              }}
              className={`border-b-2 py-2.5 px-4 text-xs font-bold shrink-0 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-primary text-primary font-extrabold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Tab Contents */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeQuizCourse ? (
            <motion.div
              key={`quiz-${activeQuizCourse.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-3xs font-extrabold text-primary tracking-widest uppercase">Quản lý câu hỏi</span>
                <h3 className="text-lg font-extrabold text-foreground leading-snug mt-1">
                  Trắc nghiệm: {activeQuizCourse.title}
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleStartAddQuestion}
                  className="flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-2xs font-bold text-white shadow shadow-primary/10 hover:bg-primary/95 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Thêm câu hỏi mới
                </button>
                <button
                  onClick={() => {
                    setActiveQuizCourse(null);
                    setShowAddQuestionForm(false);
                  }}
                  className="rounded-xl border border-border bg-card px-4 py-2 text-2xs font-bold text-foreground hover:bg-muted transition-all"
                >
                  Quay lại
                </button>
              </div>
            </div>

            {/* Add/Edit Question Form */}
            {showAddQuestionForm && (
              <form onSubmit={handleSaveQuestion} className="rounded-3xl border border-border bg-card p-6 shadow-md space-y-4 text-xs">
                <h4 className="font-bold text-foreground text-sm">
                  {editingQuestion ? 'Cập nhật câu hỏi trắc nghiệm' : 'Tạo câu hỏi trắc nghiệm mới'}
                </h4>
                
                <div className="space-y-1.5">
                  <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider block">Nội dung câu hỏi</label>
                  <textarea
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    required
                    placeholder="Nhập nội dung câu hỏi ôn tập..."
                    rows={3}
                    className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider block">Đáp án A</label>
                    <input
                      type="text"
                      value={qOptA}
                      onChange={(e) => setQOptA(e.target.value)}
                      required
                      placeholder="Đáp án A..."
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider block">Đáp án B</label>
                    <input
                      type="text"
                      value={qOptB}
                      onChange={(e) => setQOptB(e.target.value)}
                      required
                      placeholder="Đáp án B..."
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider block">Đáp án C</label>
                    <input
                      type="text"
                      value={qOptC}
                      onChange={(e) => setQOptC(e.target.value)}
                      placeholder="Đáp án C (tùy chọn)..."
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider block">Đáp án D</label>
                    <input
                      type="text"
                      value={qOptD}
                      onChange={(e) => setQOptD(e.target.value)}
                      placeholder="Đáp án D (tùy chọn)..."
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="space-y-1.5">
                    <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider block">Đáp án đúng</label>
                    <select
                      value={qCorrect}
                      onChange={(e) => setQCorrect(parseInt(e.target.value))}
                      className="w-full rounded-xl border border-border bg-background px-2.5 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value={0}>Đáp án A</option>
                      <option value={1}>Đáp án B</option>
                      <option value={2}>Đáp án C</option>
                      <option value={3}>Đáp án D</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider block">Giải thích đáp án</label>
                    <input
                      type="text"
                      value={qExplanation}
                      onChange={(e) => setQExplanation(e.target.value)}
                      placeholder="Giải thích tại sao đáp án này đúng..."
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddQuestionForm(false);
                      setEditingQuestion(null);
                    }}
                    className="rounded-xl border border-border bg-background px-4 py-2 font-bold text-muted-foreground hover:bg-muted"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-5 py-2 text-white font-bold shadow hover:bg-primary/95"
                  >
                    Lưu câu hỏi
                  </button>
                </div>
              </form>
            )}

            {/* Questions table */}
            <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
              <table className="w-full border-collapse text-left text-xs text-muted-foreground">
                <thead className="bg-muted/40 text-foreground font-bold border-b border-border/80 text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 w-12 text-center">STT</th>
                    <th className="px-6 py-4">Câu hỏi</th>
                    <th className="px-6 py-4">Các lựa chọn</th>
                    <th className="px-6 py-4 w-28 text-center">Đáp án đúng</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-card/60">
                  {(quizzes[activeQuizCourse.id] || []).length > 0 ? (
                    (quizzes[activeQuizCourse.id] || []).map((q, idx) => (
                      <tr key={q.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4 text-center font-bold text-foreground">{idx + 1}</td>
                        <td className="px-6 py-4 font-semibold text-foreground">
                          <p className="line-clamp-2 max-w-md">{q.question}</p>
                          {q.explanation && (
                            <span className="text-[10px] text-muted-foreground font-normal italic mt-1 block">
                              Giải thích: {q.explanation}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="grid grid-cols-2 gap-1 text-[10px] max-w-sm">
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx} className={q.correctAnswer === oIdx ? 'text-emerald-600 font-bold' : ''}>
                                {String.fromCharCode(65 + oIdx)}. {opt}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-extrabold text-emerald-600">
                          {String.fromCharCode(65 + q.correctAnswer)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleStartEditQuestion(q)}
                              className="rounded p-1 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                              title="Sửa câu hỏi"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(q.id)}
                              className="rounded p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                              title="Xóa câu hỏi"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-muted-foreground font-medium">
                        Khóa học này hiện chưa có câu hỏi trắc nghiệm nào. Nhấp vào "Thêm câu hỏi mới" để tạo bài kiểm tra!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
            {/* Tab Courses */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Danh sách khóa học</h3>
                  <button
                    onClick={() => {
                      setEditingCourse(null);
                      setTitle('');
                      setDescription('');
                      setShowAddForm(!showAddForm);
                    }}
                    className="flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-2xs font-bold text-white shadow shadow-primary/10 hover:bg-primary/95 transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    Thêm khóa học
                  </button>
                </div>

                {/* Course CRUD add/edit form */}
                {showAddForm && (
                  <form onSubmit={editingCourse ? handleUpdateCourse : handleAddCourse} className="rounded-3xl border border-border bg-card p-6 shadow-md space-y-4 text-xs">
                    <h4 className="font-bold text-foreground text-sm">
                      {editingCourse ? 'Sửa thông tin khóa học' : 'Thêm khóa học mới (Simulated CRUD)'}
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider block">Tên khóa học</label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          placeholder="Nhập tên khóa học..."
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1.5 col-span-1">
                          <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider block">Độ khó</label>
                          <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background px-2.5 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          >
                            <option value="Cơ bản">Cơ bản</option>
                            <option value="Trung bình">Trung bình</option>
                            <option value="Nâng cao">Nâng cao</option>
                          </select>
                        </div>

                        <div className="space-y-1.5 col-span-1">
                          <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider block">Thời lượng (h)</label>
                          <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                            required
                            min={1}
                            className="w-full rounded-xl border border-border bg-background px-2.5 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          />
                        </div>

                        <div className="space-y-1.5 col-span-1">
                          <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider block">Danh mục</label>
                          <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background px-2.5 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider block">Mô tả ngắn</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        placeholder="Mô tả tóm tắt nội dung khóa học..."
                        rows={2}
                        className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingCourse(null);
                          setTitle('');
                          setDescription('');
                        }}
                        className="rounded-xl border border-border bg-background px-4 py-2 font-bold text-muted-foreground hover:bg-muted"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-primary px-5 py-2 text-white font-bold shadow hover:bg-primary/95"
                      >
                        Lưu lại
                      </button>
                    </div>
                  </form>
                )}

                {/* Courses table */}
                <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs text-muted-foreground">
                      <thead className="bg-muted/40 text-foreground font-bold border-b border-border/80 text-[10px] uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Khóa học</th>
                          <th className="px-6 py-4">Danh mục</th>
                          <th className="px-6 py-4">Độ khó</th>
                          <th className="px-6 py-4 text-center">Thời lượng</th>
                          <th className="px-6 py-4 text-center">Trắc nghiệm</th>
                          <th className="px-6 py-4 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 bg-card/60">
                        {courses.map((course) => (
                          <tr key={course.id} className="hover:bg-muted/10 transition-colors">
                            <td className="px-6 py-4 font-bold text-foreground">
                              <div className="flex items-center gap-3">
                                <img src={course.thumbnail} alt={course.title} className="h-8 w-12 object-cover rounded-lg shrink-0" />
                                <span className="line-clamp-1">{course.title}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {categories.find(c => c.id === course.categoryId)?.name || course.categoryId}
                            </td>
                            <td className="px-6 py-4 font-semibold">{course.difficulty}</td>
                            <td className="px-6 py-4 text-center">{course.duration} giờ</td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => setActiveQuizCourse(course)}
                                className="inline-flex items-center gap-1 rounded-lg bg-secondary/10 px-2.5 py-1 text-[10px] font-bold text-secondary border border-secondary/20 hover:bg-secondary/25 transition-all"
                                title="Quản lý câu hỏi trắc nghiệm"
                              >
                                <HelpCircle className="h-3 w-3" />
                                <span>{(quizzes[course.id] || []).length} Câu</span>
                              </button>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleStartEditCourse(course)}
                                  className="rounded p-1 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                                  title="Sửa thông tin"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCourse(course.id)}
                                  className="rounded p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                  title="Xóa khóa học"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Categories */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Danh mục hệ thống</h3>
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setCatName('');
                      setCatDescription('');
                      setShowAddCategoryForm(!showAddCategoryForm);
                    }}
                    className="flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-2xs font-bold text-white shadow shadow-primary/10 hover:bg-primary/95 transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    Thêm danh mục
                  </button>
                </div>

                {/* Add/Edit Category Form */}
                {showAddCategoryForm && (
                  <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory} className="rounded-3xl border border-border bg-card p-6 shadow-md space-y-4 text-xs">
                    <h4 className="font-bold text-foreground text-sm">
                      {editingCategory ? 'Sửa thông tin danh mục' : 'Tạo danh mục mới (Simulated CRUD)'}
                    </h4>
                    
                    <div className="space-y-1.5">
                      <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider block">Tên danh mục</label>
                      <input
                        type="text"
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        required
                        placeholder="Tên danh mục (ví dụ: Ngoại ngữ, Kỹ năng mềm...)"
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider block">Mô tả danh mục</label>
                      <textarea
                        value={catDescription}
                        onChange={(e) => setCatDescription(e.target.value)}
                        required
                        placeholder="Mô tả tóm tắt nội dung danh mục này..."
                        rows={2}
                        className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddCategoryForm(false);
                          setEditingCategory(null);
                          setCatName('');
                          setCatDescription('');
                        }}
                        className="rounded-xl border border-border bg-background px-4 py-2 font-bold text-muted-foreground hover:bg-muted"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-primary px-5 py-2 text-white font-bold shadow hover:bg-primary/95"
                      >
                        Lưu lại
                      </button>
                    </div>
                  </form>
                )}

                <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs text-muted-foreground">
                      <thead className="bg-muted/40 text-foreground font-bold border-b border-border/80 text-[10px] uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Tên danh mục</th>
                          <th className="px-6 py-4">Mô tả</th>
                          <th className="px-6 py-4 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 bg-card/60">
                        {categories.map((cat) => (
                          <tr key={cat.id} className="hover:bg-muted/10 transition-colors">
                            <td className="px-6 py-4 font-bold text-foreground">{cat.name}</td>
                            <td className="px-6 py-4 max-w-sm truncate">{cat.description}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleStartEditCategory(cat)}
                                  className="rounded p-1 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                                  title="Sửa danh mục"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(cat.id)}
                                  className="rounded p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                  title="Xóa danh mục"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Newsletters */}
            {activeTab === 'newsletters' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Danh sách đăng ký bản tin</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Danh sách các học sinh đăng ký nhận tin tức và tài liệu học tập qua email.</p>
                  </div>
                  <div className="rounded-xl border border-border/80 px-3 py-1.5 text-2xs font-semibold text-muted-foreground bg-muted/20">
                    Tổng cộng: {newsletterEmails.length} Email
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs text-muted-foreground">
                      <thead className="bg-muted/40 text-foreground font-bold border-b border-border/80 text-[10px] uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Thứ tự</th>
                          <th className="px-6 py-4">Địa chỉ Email học viên</th>
                          <th className="px-6 py-4">Thời gian đăng ký</th>
                          <th className="px-6 py-4 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 bg-card/60">
                        {newsletterEmails.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground text-xs font-semibold">
                              Chưa có email nào đăng ký nhận bản tin.
                            </td>
                          </tr>
                        ) : (
                          newsletterEmails.map((sub, idx) => (
                            <tr key={sub.email} className="hover:bg-muted/10 transition-colors">
                              <td className="px-6 py-4 font-bold text-foreground">{idx + 1}</td>
                              <td className="px-6 py-4 text-foreground font-semibold">
                                <div className="flex items-center gap-2">
                                  <MailCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                                  <span>{sub.email}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-2xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-lg border border-border">
                                  {new Date(sub.subscribedAt).toLocaleString('vi-VN')}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => handleDeleteNewsletter(sub.email)}
                                  className="rounded p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                  title="Xóa email khỏi danh sách"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Registrations */}
            {activeTab === 'registrations' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Học viên đăng ký gói học</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Danh sách các học viên đã hoàn tất giao dịch tự động thanh toán qua VietQR.</p>
                  </div>
                  <div className="rounded-xl border border-border/80 px-3 py-1.5 text-2xs font-semibold text-muted-foreground bg-muted/20 self-start">
                    Tổng cộng: {registrations.length} Học viên
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    {regLoading ? (
                      <div className="flex items-center justify-center py-16 gap-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <span className="text-xs font-semibold text-muted-foreground">Đang tải danh sách học viên...</span>
                      </div>
                    ) : registrations.length === 0 ? (
                      <div className="text-center py-16 text-muted-foreground text-xs font-semibold">
                        Chưa có học viên nào đăng ký gói học.
                      </div>
                    ) : (
                      <table className="w-full border-collapse text-left text-xs text-muted-foreground">
                        <thead className="bg-muted/40 text-foreground font-bold border-b border-border/80 text-[10px] uppercase tracking-wider">
                          <tr>
                            <th className="px-6 py-4">Tên học viên</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Số điện thoại</th>
                            <th className="px-6 py-4">Gói học sở hữu</th>
                            <th className="px-6 py-4">Ngày đăng ký</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60 bg-card/60 text-foreground">
                          {registrations.map((reg) => (
                            <tr key={reg.userId} className="hover:bg-muted/10 transition-colors">
                              <td className="px-6 py-4 font-bold">{reg.name}</td>
                              <td className="px-6 py-4 text-muted-foreground">{reg.email}</td>
                              <td className="px-6 py-4 font-semibold text-primary">{reg.phone}</td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                  {reg.purchasedPackages.map((pkgId: string) => {
                                    const labels: Record<string, string> = {
                                      'combo-toan-logic': 'Combo Toán & Logic',
                                      'combo-khoa-hoc': 'Combo Khoa học',
                                      'combo-toan-dien': 'Combo Toàn diện ĐGNL'
                                    };
                                    return (
                                      <span key={pkgId} className="rounded-md bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 text-[10px] text-emerald-600 font-bold">
                                        {labels[pkgId] || pkgId}
                                      </span>
                                    );
                                  })}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-2xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-lg border border-border">
                                  {new Date(reg.createdAt).toLocaleString('vi-VN')}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      </div>
    </div>
  );
}
