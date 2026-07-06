'use client';

import * as React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { CourseService, Course, Category, Teacher, Lesson } from '@/services/courseService';
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
  Video
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  // Simulated DB list states
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);
  const [lessons, setLessons] = React.useState<Lesson[]>([]);
  
  const [activeTab, setActiveTab] = React.useState<'courses' | 'categories' | 'lessons'>('courses');
  const [isClient, setIsClient] = React.useState(false);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState('');

  // Add course form inputs
  const [title, setTitle] = React.useState('');
  const [categoryId, setCategoryId] = React.useState('ai');
  const [difficulty, setDifficulty] = React.useState('Cơ bản');
  const [duration, setDuration] = React.useState(5);
  const [description, setDescription] = React.useState('');

  React.useEffect(() => {
    setIsClient(true);
    setCourses(CourseService.getCourses());
    setCategories(CourseService.getCategories());
    setTeachers(CourseService.getTeachers());
  }, []);

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
          💡 Mẹo: Bấm Đăng xuất, sau đó Đăng nhập bằng email: <strong className="font-bold underline">admin@istudent.edu</strong>
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
    setTitle('');
    setDescription('');
    setShowAddForm(false);
    
    setSuccessMsg('Đã thêm khóa học mới thành công!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa khóa học này không?')) {
      setCourses(courses.filter((c) => c.id !== courseId));
      setSuccessMsg('Đã xóa khóa học thành công!');
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
            <p className="text-lg font-black text-foreground">100k+</p>
            <p className="text-3xs font-semibold text-muted-foreground uppercase tracking-wider">Người dùng</p>
          </div>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="flex border-b border-border/60 overflow-x-auto scrollbar-none gap-2">
        {[
          { id: 'courses', label: 'Quản lý Khóa học' },
          { id: 'categories', label: 'Quản lý Danh mục' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setShowAddForm(false);
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

      {/* Tab Contents */}
      <div className="animate-in fade-in duration-200">
        
        {/* Tab Courses */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Danh sách khóa học</h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-2xs font-bold text-white shadow shadow-primary/10 hover:bg-primary/95 transition-all"
              >
                <Plus className="h-4 w-4" />
                Thêm khóa học
              </button>
            </div>

            {/* Course CRUD add form */}
            {showAddForm && (
              <form onSubmit={handleAddCourse} className="rounded-3xl border border-border bg-card p-6 shadow-md space-y-4 text-xs">
                <h4 className="font-bold text-foreground text-sm">Thêm khóa học mới (Simulated CRUD)</h4>
                
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
                        onChange={(e) => setDuration(parseInt(e.target.value))}
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
                    onClick={() => setShowAddForm(false)}
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
                      <th className="px-6 py-4">Thời lượng</th>
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
                        <td className="px-6 py-4">{course.duration} giờ</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => alert('Sửa khóa học (Simulated action)')}
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
            </div>

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
                        <td className="px-6 py-4 line-clamp-1">{cat.description}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => alert('Sửa danh mục (Simulated)')}
                              className="rounded p-1 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Edit className="h-4 w-4" />
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

      </div>
    </div>
  );
}
