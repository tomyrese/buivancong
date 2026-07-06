import * as React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CourseService } from '@/services/courseService';
import EnrollButton from '@/features/courses/enroll-button';
import { 
  ArrowLeft, 
  Check, 
  BookOpen, 
  Clock, 
  Star, 
  Sliders, 
  Users,
  MessageSquare,
  HelpCircle,
  Lock,
  ChevronDown
} from 'lucide-react';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const course = CourseService.getCourseById(id);
  if (!course) return { title: 'Không tìm thấy khóa học' };
  
  return {
    title: `${course.title} - iStudent`,
    description: course.description,
    openGraph: {
      title: `${course.title} - iStudent`,
      description: course.description,
      images: [{ url: course.thumbnail }],
    }
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const course = CourseService.getCourseById(id);

  if (!course) {
    notFound();
  }

  const teacher = CourseService.getTeacherById(course.teacherId);
  const reviews = CourseService.getReviewsByCourseId(id);
  const lessons = CourseService.getLessonsByCourseId(id);
  
  const firstLessonId = lessons[0]?.id || 'quiz';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      <Link 
        href="/courses" 
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Quay lại tìm kiếm
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-2xs font-bold text-primary border border-primary/20">
              {CourseService.getCategoryById(course.categoryId)?.name || 'Khóa học'}
            </span>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight sm:text-3xl lg:text-4xl">
              {course.title}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground pt-1">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-foreground">{course.rating}</span>
                <span>({reviews.length} đánh giá)</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{course.enrolledCount.toLocaleString('vi-VN')} học viên</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card/60 p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground">Bạn sẽ học được gì</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {course.outcomes.map((outcome, idx) => (
                <div key={idx} className="flex gap-2 text-xs text-muted-foreground items-start">
                  <div className="mt-0.5 rounded-full bg-emerald-500/10 p-0.5 text-emerald-500 border border-emerald-500/20 shrink-0">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="leading-relaxed">{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-bold text-foreground">Chi tiết chương trình học</h2>
            <div className="space-y-3">
              {course.syllabus.map((chapter) => (
                <details 
                  key={chapter.id} 
                  className="group rounded-2xl border border-border bg-card/60 overflow-hidden [&_summary::-webkit-details-marker]:hidden"
                  open
                >
                  <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/40 transition-colors list-none">
                    <span className="text-xs sm:text-sm font-bold text-foreground">{chapter.title}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="border-t border-border/40 p-1 bg-muted/10 space-y-1">
                    {chapter.lessonIds.map((lessonId) => {
                      const lesson = lessons.find(l => l.id === lessonId);
                      if (!lesson) return null;

                      return (
                        <div 
                          key={lessonId}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-card transition-colors text-xs text-muted-foreground"
                        >
                          <div className="flex items-center gap-2">
                            {lesson.isPreview ? (
                              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-extrabold text-primary uppercase shrink-0">
                                Xem thử
                              </span>
                            ) : (
                              <Lock className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                            )}
                            <span className="font-semibold text-foreground line-clamp-1">{lesson.title}</span>
                          </div>
                          <span className="shrink-0 font-medium text-muted-foreground/75">{lesson.duration} phút</span>
                        </div>
                      );
                    })}
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-foreground">Yêu cầu khóa học</h2>
            <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1.5 leading-relaxed">
              {course.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>

          {teacher && (
            <div className="space-y-4 border-t border-border pt-6">
              <h2 className="text-base font-bold text-foreground">Giảng viên hướng dẫn</h2>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <img 
                  src={teacher.avatar} 
                  alt={teacher.name}
                  className="h-16 w-16 rounded-2xl object-cover ring-2 ring-primary/10"
                />
                <div className="space-y-2">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{teacher.name}</h3>
                    <p className="text-xs text-primary font-medium">{teacher.role}</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                    {teacher.bio}
                  </p>
                  <div className="flex gap-4 text-[11px] font-semibold text-muted-foreground">
                    <span>★ {teacher.rating} Đánh giá</span>
                    <span>{teacher.studentsCount.toLocaleString('vi-VN')} Học viên</span>
                    <span>{teacher.coursesCount} Khóa học</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 border-t border-border pt-6">
            <h2 className="text-base font-bold text-foreground">Đánh giá từ học viên ({reviews.length})</h2>
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="rounded-2xl border border-border/60 bg-card/40 p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={rev.userAvatar} 
                        alt={rev.userName}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-foreground">{rev.userName}</h4>
                        <span className="text-[10px] text-muted-foreground">{new Date(rev.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-20 rounded-3xl border border-border bg-card/60 p-6 shadow-xl space-y-6">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted shadow-sm">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-border/40 pb-3">
                <span className="text-xs font-bold text-muted-foreground">Giá học:</span>
                <span className="text-2xl font-black text-emerald-500">Miễn phí</span>
              </div>

              <div className="space-y-3 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary" />
                    Tổng thời lượng
                  </span>
                  <span className="font-semibold text-foreground">{course.duration} giờ</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-secondary" />
                    Số lượng bài học
                  </span>
                  <span className="font-semibold text-foreground">{course.lessonsCount} bài giảng</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="h-4 w-4 text-accent" />
                    Cấp độ phù hợp
                  </span>
                  <span className="font-semibold text-foreground">{course.difficulty}</span>
                </div>
              </div>
            </div>

            <EnrollButton 
              courseId={course.id} 
              courseTitle={course.title}
              firstLessonId={firstLessonId}
            />

            <div className="text-center">
              <span className="text-3xs text-muted-foreground">Truy cập trọn đời • Học trực tuyến 100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
