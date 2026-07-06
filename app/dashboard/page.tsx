'use client';

import * as React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useProgressStore, Certificate } from '@/store/useProgressStore';
import { CourseService, Course } from '@/services/courseService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Flame, 
  Award, 
  Shield, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Sparkles,
  ArrowRight,
  Download,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { enrolledCourses, completedLessons, certificates, getCourseProgressPercentage } = useProgressStore();
  
  const [isClient, setIsClient] = React.useState(false);
  const [activeCertificate, setActiveCertificate] = React.useState<Certificate | null>(null);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter courses user enrolled in
  const userCourses = React.useMemo(() => {
    return CourseService.getCourses().filter((c) => enrolledCourses.includes(c.id));
  }, [enrolledCourses]);

  // Chart data: Weekly study minutes
  const weeklyData = [
    { name: 'Thứ 2', mins: 30, color: '#2563EB' },
    { name: 'Thứ 3', mins: 45, color: '#2563EB' },
    { name: 'Thứ 4', mins: 15, color: '#2563EB' },
    { name: 'Thứ 5', mins: 60, color: '#7C3AED' },
    { name: 'Thứ 6', mins: 20, color: '#2563EB' },
    { name: 'Thứ 7', mins: 90, color: '#06B6D4' },
    { name: 'Chủ Nhật', mins: 50, color: '#06B6D4' },
  ];

  // Mock activity logs
  const activities = [
    { id: 1, text: 'Hoàn thành bài giảng: Chain-of-Thought (CoT)', time: '2 giờ trước' },
    { id: 2, text: 'Lưu ghi chú tại bài học: Giới thiệu Generative AI', time: '1 ngày trước' },
    { id: 3, text: 'Đạt danh hiệu "Khởi đầu học tập"', time: '2 ngày trước' },
  ];

  // Achievements/Badges
  const badges = [
    { id: 'b-1', name: 'Học viên Mới', desc: 'Đăng ký tài khoản iStudent', icon: Shield, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
    { id: 'b-2', name: 'Đuốc Sáng', desc: 'Đạt chuỗi học tập 3 ngày', icon: Flame, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
    { id: 'b-3', name: 'Nhà Thông Thái', desc: 'Hoàn thành bài kiểm tra đạt 100%', icon: Award, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
  ];

  if (!isClient) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-xs text-muted-foreground animate-pulse">
        Đang tải bảng điều khiển...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-4">
        <Award className="h-12 w-12 text-muted-foreground mx-auto" />
        <h2 className="text-lg font-bold text-foreground">Bạn chưa đăng nhập</h2>
        <p className="text-xs text-muted-foreground">Vui lòng đăng nhập ở thanh điều hướng để xem thông tin học tập cá nhân.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300 print:py-0">
      {/* Top summary banners */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Streak */}
        <div className="glass-card rounded-2xl p-4 flex items-center gap-3 shadow border border-border/60">
          <div className="rounded-xl bg-orange-500/10 p-2 border border-orange-500/20">
            <Flame className="h-6 w-6 text-orange-500 fill-orange-500/10" />
          </div>
          <div>
            <p className="text-xl font-black text-foreground">{user.streak} ngày</p>
            <p className="text-3xs font-semibold text-muted-foreground uppercase tracking-wider">Học liên tiếp</p>
          </div>
        </div>

        {/* XP */}
        <div className="glass-card rounded-2xl p-4 flex items-center gap-3 shadow border border-border/60">
          <div className="rounded-xl bg-primary/10 p-2 border border-primary/20">
            <Award className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-xl font-black text-foreground">{user.xp} XP</p>
            <p className="text-3xs font-semibold text-muted-foreground uppercase tracking-wider">Kinh nghiệm</p>
          </div>
        </div>

        {/* Level */}
        <div className="glass-card rounded-2xl p-4 flex items-center gap-3 shadow border border-border/60">
          <div className="rounded-xl bg-secondary/10 p-2 border border-secondary/20">
            <Shield className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <p className="text-xl font-black text-foreground">Cấp {user.level}</p>
            <p className="text-3xs font-semibold text-muted-foreground uppercase tracking-wider">Học tập</p>
          </div>
        </div>

        {/* Courses Completed */}
        <div className="glass-card rounded-2xl p-4 flex items-center gap-3 shadow border border-border/60">
          <div className="rounded-xl bg-emerald-500/10 p-2 border border-emerald-500/20">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-xl font-black text-foreground">{certificates.length} khóa</p>
            <p className="text-3xs font-semibold text-muted-foreground uppercase tracking-wider">Hoàn thành</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left column: My Courses */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Khóa học của tôi ({userCourses.length})
          </h2>

          {userCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {userCourses.map((course) => {
                const lessons = CourseService.getLessonsByCourseId(course.id);
                const progressVal = getCourseProgressPercentage(course.id, lessons.map(l => l.id));
                const firstLesson = lessons[0]?.id || 'quiz';

                return (
                  <div
                    key={course.id}
                    className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 space-y-4 hover:border-primary/20 transition-all shadow-sm"
                  >
                    <div className="flex gap-3">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="h-12 w-16 object-cover rounded-xl shrink-0"
                      />
                      <div className="space-y-0.5">
                        <h3 className="text-xs font-bold text-foreground line-clamp-1">{course.title}</h3>
                        <p className="text-3xs text-muted-foreground">{course.lessonsCount} bài • {course.duration} giờ</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-3xs font-semibold text-muted-foreground">
                        <span>Tiến trình</span>
                        <span className="text-foreground">{progressVal}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                          style={{ width: `${progressVal}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      href={`/learn/${course.id}/${firstLesson}`}
                      className="flex items-center justify-center gap-1 w-full rounded-xl bg-primary/10 hover:bg-primary py-2.5 text-2xs font-bold text-primary hover:text-white transition-all duration-300"
                    >
                      Học tiếp
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center rounded-3xl border border-dashed border-border bg-card/40 space-y-4">
              <BookOpen className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="text-xs text-muted-foreground">Bạn chưa ghi danh vào khóa học nào.</p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/95 transition-all"
              >
                Khám phá khóa học
              </Link>
            </div>
          )}

          {/* Activity Logs */}
          <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-secondary" />
              Hoạt động học tập gần đây
            </h2>
            <div className="space-y-3">
              {activities.map((act) => (
                <div key={act.id} className="flex items-center justify-between text-xs py-2 border-b border-border/40 last:border-0 last:pb-0">
                  <span className="text-muted-foreground">{act.text}</span>
                  <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Chart & Badges & Certificates */}
        <div className="lg:col-span-4 space-y-6 print:hidden">
          {/* Weekly Chart */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Clock className="h-4.5 w-4.5 text-accent" />
              Thời gian học tuần này (phút)
            </h3>
            
            <div className="h-40 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ left: -30, right: 0, top: 0, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '10px' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Bar dataKey="mins" radius={[4, 4, 0, 0]}>
                    {weeklyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Badges achievements */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-secondary" />
              Huy hiệu đạt được
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {badges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-border/60 bg-muted/20">
                    <div className={`rounded-lg p-2 ${badge.color}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-foreground">{badge.name}</h4>
                      <p className="text-[9px] text-muted-foreground">{badge.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Certificates panel */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Award className="h-4.5 w-4.5 text-emerald-500" />
              Chứng chỉ hoàn thành ({certificates.length})
            </h3>
            {certificates.length > 0 ? (
              <div className="space-y-2">
                {certificates.map((cert) => (
                  <div 
                    key={cert.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:border-emerald-500/30 transition-all text-xs"
                  >
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-foreground truncate max-w-[150px]">{cert.courseTitle}</h4>
                      <p className="text-3xs text-muted-foreground">Mã: {cert.verifyCode}</p>
                    </div>

                    <Link
                      href={`/learn/${cert.courseId}/quiz`}
                      className="rounded-lg bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 p-2 text-emerald-500 hover:text-white transition-all flex items-center justify-center shrink-0"
                      title="Xem chứng chỉ"
                    >
                      <Download className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-3xs text-muted-foreground text-center py-4">Chưa có chứng chỉ nào được cấp. Hãy hoàn thành khóa học để nhận chứng chỉ nhé!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
