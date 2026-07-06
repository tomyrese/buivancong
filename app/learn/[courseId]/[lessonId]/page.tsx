'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CourseService, Course, Lesson, QuizQuestion } from '@/services/courseService';
import { useProgressStore } from '@/store/useProgressStore';
import SidebarPlaylist from '@/features/learn/sidebar-playlist';
import NotesTab from '@/features/learn/notes-tab';
import DiscussionTab from '@/features/learn/discussion-tab';
import { BookOpen, FileText, Settings, ShieldAlert, Sparkles, Bookmark, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const { enrolledCourses, completedLessons, completeLesson, toggleBookmark, bookmarks } = useProgressStore();

  const [activeTab, setActiveTab] = React.useState<'docs' | 'transcript' | 'notes' | 'discussion'>('docs');
  const [userAnswers, setUserAnswers] = React.useState<{ [key: string]: number }>({});
  const [isClient, setIsClient] = React.useState(false);

  // Hydration fix
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const course = React.useMemo(() => CourseService.getCourseById(courseId), [courseId]);
  const lesson = React.useMemo(() => CourseService.getLessonById(lessonId), [lessonId]);
  const lessons = React.useMemo(() => CourseService.getLessonsByCourseId(courseId), [courseId]);
  const lessonQuestions = React.useMemo(() => CourseService.getQuizQuestionsByLessonId(courseId, lessonId), [courseId, lessonId]);

  // Reset user answers when switching lessons
  React.useEffect(() => {
    setUserAnswers({});
  }, [lessonId]);

  // Authorization check (Client-side redirect to course detail if not enrolled and lesson is not preview)
  React.useEffect(() => {
    if (isClient && course && lesson) {
      const isEnrolled = enrolledCourses.includes(courseId);
      if (!isEnrolled && !lesson.isPreview) {
        // Redirect to detail page
        router.push(`/courses/${courseId}`);
      }
    }
  }, [isClient, courseId, lessonId, enrolledCourses, lesson, course]);

  if (!isClient) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-xs text-muted-foreground animate-pulse">
        Đang tải giao diện học tập...
      </div>
    );
  }

  if (!course || !lesson) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="text-lg font-bold text-foreground">Không tìm thấy bài học hoặc khóa học</h2>
        <Link href="/courses" className="text-xs text-primary font-bold hover:underline">
          Quay lại danh sách khóa học
        </Link>
      </div>
    );
  }

  const isBookmarked = bookmarks.includes(lessonId);
  const isCompleted = completedLessons.includes(lessonId);

  const handleMarkAsCompleted = () => {
    if (!isCompleted) {
      completeLesson(lessonId);
    }
  };

  const handleAnswerSelect = (questionId: string, optionIdx: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <span className="text-3xs font-extrabold text-primary tracking-widest uppercase">
            {course.title}
          </span>
          <h1 className="text-lg font-extrabold text-foreground leading-snug mt-1">
            {lesson.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Bookmark */}
          <button
            onClick={() => toggleBookmark(lessonId)}
            className={`rounded-xl border border-border p-2.5 transition-colors cursor-pointer hover:bg-muted ${
              isBookmarked ? 'text-amber-500 bg-amber-500/5 border-amber-500/20' : 'text-muted-foreground'
            }`}
            title={isBookmarked ? 'Bỏ lưu bài học' : 'Lưu bài học'}
          >
            <Bookmark className="h-4.5 w-4.5" />
          </button>

          {/* Mark Complete */}
          <button
            onClick={handleMarkAsCompleted}
            disabled={isCompleted}
            className={`flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all ${
              isCompleted
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 font-semibold'
                : 'bg-primary border-primary text-white hover:bg-primary/95 shadow shadow-primary/10 active:scale-95'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isCompleted ? 'Đã hoàn thành' : 'Hoàn thành bài'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Player & Tabs content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Practice Quiz Section */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-md space-y-6">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-sm sm:text-base font-bold text-foreground">
                Câu hỏi luyện tập ({lessonQuestions.length} câu)
              </h2>
            </div>

            {lessonQuestions.length > 0 ? (
              <div className="space-y-8">
                {lessonQuestions.map((q, qIdx) => {
                  const selectedAns = userAnswers[q.id];
                  const isAnswered = selectedAns !== undefined;
                  const isCorrect = isAnswered && selectedAns === q.correctAnswer;

                  return (
                    <div key={q.id} className="space-y-4 border-b border-border/40 pb-6 last:border-b-0 last:pb-0">
                      <h3 className="text-xs sm:text-sm font-bold text-foreground leading-snug">
                        Câu {qIdx + 1}: {q.question}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((option, oIdx) => {
                          const isCurrentSelected = selectedAns === oIdx;
                          const isCurrentCorrect = q.correctAnswer === oIdx;

                          let buttonClass = 'border-border bg-card/60 hover:bg-muted text-foreground';
                          let badgeClass = 'border-border';

                          if (isAnswered) {
                            if (isCurrentCorrect) {
                              buttonClass = 'border-emerald-500 bg-emerald-500/5 text-emerald-600';
                              badgeClass = 'border-emerald-500 bg-emerald-500 text-white font-bold';
                            } else if (isCurrentSelected) {
                              buttonClass = 'border-destructive bg-destructive/5 text-destructive';
                              badgeClass = 'border-destructive bg-destructive text-white font-bold';
                            } else {
                              buttonClass = 'border-border bg-card/40 opacity-60 text-muted-foreground pointer-events-none';
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={isAnswered}
                              onClick={() => handleAnswerSelect(q.id, oIdx)}
                              className={`flex items-center w-full rounded-xl border p-3.5 text-left text-xs font-semibold transition-all cursor-pointer ${buttonClass}`}
                            >
                              <span className={`mr-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border text-3xs ${badgeClass}`}>
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              {option}
                            </button>
                          );
                        })}
                      </div>

                      {/* Instant Explanation Box */}
                      {isAnswered && (
                        <div className="rounded-xl bg-slate-50 border border-border p-3.5 text-xs text-muted-foreground leading-relaxed animate-in fade-in duration-200">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={`h-2 w-2 rounded-full ${isCorrect ? 'bg-emerald-500' : 'bg-destructive'}`} />
                            <span className={`font-bold ${isCorrect ? 'text-emerald-600' : 'text-destructive'}`}>
                              {isCorrect ? 'Chính xác!' : 'Chưa chính xác!'}
                            </span>
                          </div>
                          <p className="font-bold text-foreground inline">Giải thích: </p>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Completion Celebration Card */}
                {Object.keys(userAnswers).length === lessonQuestions.length && (
                  <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center space-y-2 animate-in zoom-in-95 duration-200">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                    <h4 className="text-xs font-bold text-emerald-600">Tuyệt vời! Bạn đã hoàn thành hết các câu hỏi ôn tập.</h4>
                    <p className="text-3xs text-muted-foreground">Hãy nhấp nút "Hoàn thành bài" ở trên để lưu trữ tiến độ học tập nhé!</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-muted-foreground">
                Không có câu hỏi trắc nghiệm nào cho bài học này. Bạn có thể tự học qua nội dung tài liệu lý thuyết bên dưới.
              </div>
            )}
          </div>

          {/* Tab selectors */}
          <div className="flex border-b border-border/60 overflow-x-auto scrollbar-none gap-2">
            {[
              { id: 'docs', label: 'Tài liệu học' },
              { id: 'transcript', label: 'Bản dịch thoại' },
              { id: 'notes', label: 'Ghi chú Markdown' },
              { id: 'discussion', label: 'Hỏi đáp & Thảo luận' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`border-b-2 py-2 px-4 text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-primary text-primary font-extrabold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab contents */}
          <div className="animate-in fade-in duration-200">
            {activeTab === 'docs' && (
              <div className="space-y-4">
                <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line bg-card/40 rounded-2xl border border-border p-5">
                  {lesson.content}
                </div>
                {/* Resources */}
                {lesson.resources.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-foreground">Tài liệu đính kèm:</h4>
                    <div className="flex flex-col gap-2">
                      {lesson.resources.map((res, i) => (
                        <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-card p-3 text-xs">
                          <span className="font-semibold text-foreground flex items-center gap-1.5">
                            <FileText className="h-4 w-4 text-primary" />
                            {res.name}
                          </span>
                          <a
                            href={res.url}
                            className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-1 text-2xs font-bold text-primary hover:bg-primary hover:text-white transition-all"
                          >
                            Tải về ({res.size})
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'transcript' && (
              <div className="rounded-2xl border border-border bg-card/40 p-5 text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line italic">
                {lesson.transcript || 'Không có bản dịch thoại nào cho bài học này.'}
              </div>
            )}

            {activeTab === 'notes' && (
              <NotesTab
                courseId={courseId}
                lessonId={lessonId}
                currentVideoTime={0}
                onSeek={() => {}}
              />
            )}

            {activeTab === 'discussion' && (
              <DiscussionTab courseId={courseId} lessonId={lessonId} />
            )}
          </div>
        </div>

        {/* Right Column: Sidebar Playlist */}
        <div className="lg:col-span-4 h-fit">
          <SidebarPlaylist
            courseId={courseId}
            courseTitle={course.title}
            currentLessonId={lessonId}
            lessons={lessons}
            syllabus={course.syllabus}
          />
        </div>
      </div>
    </div>
  );
}
