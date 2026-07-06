'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CourseService, Course, Lesson, QuizQuestion } from '@/services/courseService';
import { useProgressStore } from '@/store/useProgressStore';
import SidebarPlaylist from '@/features/learn/sidebar-playlist';
import DiscussionTab from '@/features/learn/discussion-tab';
import { BookOpen, FileText, Settings, ShieldAlert, Sparkles, Bookmark, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { MarkdownRenderer } from '@/components/markdown-renderer';

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const { enrolledCourses, completedLessons, completeLesson, toggleBookmark, bookmarks } = useProgressStore();

  const [activeTab, setActiveTab] = React.useState<'docs' | 'discussion'>('docs');
  const [userAnswers, setUserAnswers] = React.useState<{ [key: string]: number }>({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = React.useState(0);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
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
    setCurrentQuestionIdx(0);
    setIsSubmitted(false);
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
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-sm sm:text-base font-bold text-foreground">
                  Câu hỏi luyện tập
                </h2>
              </div>
              {lessonQuestions.length > 0 && !isSubmitted && (
                <span className="text-xs font-bold text-primary">
                  Câu hỏi: {currentQuestionIdx + 1} / {lessonQuestions.length}
                </span>
              )}
            </div>

            {lessonQuestions.length > 0 ? (
              <div>
                {!isSubmitted ? (
                  /* Single Question Runner */
                  <div className="space-y-6">
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300 rounded-full"
                        style={{ width: `${((currentQuestionIdx + 1) / lessonQuestions.length) * 100}%` }}
                      />
                    </div>

                    {/* Question Content */}
                    {(() => {
                      const q = lessonQuestions[currentQuestionIdx];
                      const selectedAns = userAnswers[q.id];
                      const isAnswered = selectedAns !== undefined;
                      const isCorrect = isAnswered && selectedAns === q.correctAnswer;

                      return (
                        <div className="space-y-4">
                          <h3 className="text-xs sm:text-sm font-bold text-foreground leading-snug">
                            {q.question}
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
                                  buttonClass = 'border-red-500 bg-red-500/5 text-red-600';
                                  badgeClass = 'border-red-500 bg-red-500 text-white font-bold';
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
                                <span className={`h-2 w-2 rounded-full ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                <span className={`font-bold ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                                  {isCorrect ? 'Chính xác!' : 'Chưa chính xác!'}
                                </span>
                              </div>
                              <p className="font-bold text-foreground inline">Giải thích: </p>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Navigation buttons */}
                    <div className="flex justify-between items-center pt-4 border-t border-border/40">
                      <button
                        onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIdx === 0}
                        className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted disabled:opacity-40 transition-colors"
                      >
                        Câu trước
                      </button>

                      {(() => {
                        const q = lessonQuestions[currentQuestionIdx];
                        const isAnswered = userAnswers[q.id] !== undefined;

                        if (currentQuestionIdx < lessonQuestions.length - 1) {
                          return (
                            <button
                              onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                              disabled={!isAnswered}
                              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-primary/95 disabled:opacity-40 transition-all"
                            >
                              Tiếp theo
                            </button>
                          );
                        } else {
                          return (
                            <button
                              onClick={() => {
                                setIsSubmitted(true);
                                handleMarkAsCompleted();
                              }}
                              disabled={!isAnswered}
                              className="rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-600 disabled:opacity-40 transition-all"
                            >
                              Nộp bài
                            </button>
                          );
                        }
                      })()}
                    </div>
                  </div>
                ) : (
                  /* Practice Finished & Review Summary */
                  <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Score display */}
                    {(() => {
                      let correctCount = 0;
                      lessonQuestions.forEach(q => {
                        if (userAnswers[q.id] === q.correctAnswer) {
                          correctCount++;
                        }
                      });
                      const scorePercent = Math.round((correctCount / lessonQuestions.length) * 100);

                      return (
                        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 text-center space-y-3">
                          <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                          <div className="space-y-1">
                            <h3 className="text-sm sm:text-base font-bold text-emerald-600">
                              Hoàn thành luyện tập: {correctCount} / {lessonQuestions.length} câu đúng ({scorePercent}%)
                            </h3>
                            <p className="text-3xs text-muted-foreground leading-relaxed">
                              Tuyệt vời! Bạn đã kết thúc bài học. Hãy xem lại các đáp án chi tiết và phần giải thích ở bên dưới nhé.
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setUserAnswers({});
                              setCurrentQuestionIdx(0);
                              setIsSubmitted(false);
                            }}
                            className="rounded-xl border border-border bg-card px-4 py-2 text-3xs font-bold text-muted-foreground hover:bg-muted transition-all"
                          >
                            Luyện tập lại
                          </button>
                        </div>
                      );
                    })()}

                    {/* List of all questions for review */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-foreground">Xem lại toàn bộ đáp án:</h4>
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                        {lessonQuestions.map((q, idx) => {
                          const userAns = userAnswers[q.id];
                          const isCorrect = userAns === q.correctAnswer;

                          return (
                            <div 
                              key={q.id}
                              className={`rounded-2xl border p-4 space-y-3 bg-card/40 ${
                                isCorrect ? 'border-emerald-500/20' : 'border-red-500/20'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <h5 className="text-xs font-bold text-foreground leading-snug">
                                  Câu {idx + 1}: {q.question}
                                </h5>
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 ${
                                  isCorrect ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                }`}>
                                  {isCorrect ? 'Đúng' : 'Sai'}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                {q.options.map((option, oIdx) => {
                                  const isSelected = userAns === oIdx;
                                  const isRight = q.correctAnswer === oIdx;

                                  let optionStyle = 'border-border bg-card/20';
                                  if (isSelected) optionStyle = 'border-red-500 bg-red-500/5 text-red-600';
                                  if (isRight) optionStyle = 'border-emerald-500 bg-emerald-500/5 text-emerald-500';

                                  return (
                                    <div 
                                      key={oIdx}
                                      className={`flex items-center rounded-lg border p-2.5 text-2xs font-semibold ${optionStyle}`}
                                    >
                                      <span className={`mr-2 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border text-[9px] ${
                                        isRight 
                                          ? 'border-emerald-500 bg-emerald-500 text-white font-bold' 
                                          : isSelected 
                                          ? 'border-red-500 bg-red-500 text-white font-bold' 
                                          : 'border-border'
                                      }`}>
                                        {String.fromCharCode(65 + oIdx)}
                                      </span>
                                      {option}
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="rounded-xl bg-muted/60 p-3 text-3xs text-muted-foreground leading-relaxed border border-border/50">
                                <span className="font-bold text-foreground block mb-0.5">💡 Giải thích:</span>
                                {q.explanation}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
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
              <div className="space-y-6">
                {/* Main Content Card */}
                <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-12 -mt-12 h-24 w-24 rounded-full bg-primary/5 blur-xl pointer-events-none" />
                  
                  <div className="flex items-center gap-2 border-b border-border/50 pb-4 mb-2">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Nội dung Tóm tắt lý thuyết</h4>
                      <p className="text-[10px] text-muted-foreground">Tài liệu học tập chính thức do thầy Bùi Văn Công biên soạn</p>
                    </div>
                  </div>

                  <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    <MarkdownRenderer content={lesson.content} />
                  </div>
                </div>

                {/* Resources Card */}
                {lesson.resources.length > 0 && (
                  <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                      <div className="h-9 w-9 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">Tài liệu đính kèm (PDF)</h4>
                        <p className="text-[10px] text-muted-foreground">Bao gồm lý thuyết đầy đủ, bài tập tự luyện và đáp án giải chi tiết</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {lesson.resources.map((res, i) => (
                        <div 
                          key={i} 
                          className="flex items-center justify-between rounded-2xl border border-border bg-card/60 p-4 hover:border-primary/30 hover:shadow-md transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 font-bold shrink-0 border border-red-500/20 group-hover:bg-red-500 group-hover:text-white transition-all text-xs">
                              PDF
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-xs text-foreground truncate block group-hover:text-primary transition-colors">
                                {res.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground">Dung lượng: {res.size}</span>
                            </div>
                          </div>
                          <a
                            href={res.url}
                            className="rounded-xl bg-primary text-white hover:bg-primary/95 px-4 py-2 text-3xs font-extrabold shadow shadow-primary/10 active:scale-95 transition-all flex items-center gap-1.5"
                          >
                            Tải tài liệu
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
