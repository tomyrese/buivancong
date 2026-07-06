'use client';

import Link from 'next/link';
import { useProgressStore } from '@/store/useProgressStore';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, PlayCircle, HelpCircle, Award } from 'lucide-react';
import { CourseService, Lesson } from '@/services/courseService';

interface SidebarPlaylistProps {
  courseId: string;
  courseTitle: string;
  currentLessonId: string;
  lessons: Lesson[];
  syllabus: { id: string; title: string; lessonIds: string[] }[];
}

export default function SidebarPlaylist({
  courseId,
  courseTitle,
  currentLessonId,
  lessons,
  syllabus
}: SidebarPlaylistProps) {
  const { completedLessons, completeLesson, uncompleteLesson, getCourseProgressPercentage } = useProgressStore();

  const lessonIds = lessons.map(l => l.id);
  const progressPercent = getCourseProgressPercentage(courseId, lessonIds);

  const handleCheckboxToggle = (lessonId: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating when checking box
    e.stopPropagation();
    
    if (completedLessons.includes(lessonId)) {
      uncompleteLesson(lessonId);
    } else {
      completeLesson(lessonId);
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-card/60 flex flex-col h-full overflow-hidden shadow-lg">
      {/* Header Info */}
      <div className="p-4 border-b border-border space-y-3 bg-muted/20">
        <h3 className="text-xs font-bold text-foreground line-clamp-1">{courseTitle}</h3>
        <div>
          <div className="flex items-center justify-between text-3xs font-semibold mb-1 text-muted-foreground">
            <span>Tiến độ học tập</span>
            <span className="text-primary font-bold">{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 rounded-full" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Chapters & Lessons list */}
      <div className="flex-1 overflow-y-auto max-h-[450px]">
        {syllabus.map((chapter, chapIdx) => (
          <div key={chapter.id} className="border-b border-border/40 last:border-b-0">
            {/* Chapter Title */}
            <div className="px-4 py-2.5 bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {chapter.title}
            </div>

            {/* Chapter Lessons */}
            <div className="divide-y divide-border/20">
              {chapter.lessonIds.map((lessonId) => {
                const lesson = lessons.find(l => l.id === lessonId);
                if (!lesson) return null;

                const isActive = lesson.id === currentLessonId;
                const isCompleted = completedLessons.includes(lesson.id);

                return (
                  <Link
                    key={lesson.id}
                    href={`/learn/${courseId}/${lesson.id}`}
                    className={cn(
                      "flex items-start justify-between p-3.5 hover:bg-muted/30 transition-colors text-xs gap-3 group",
                      isActive ? "bg-primary/5 hover:bg-primary/5 border-l-2 border-primary" : ""
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      {/* Completion checkmark box */}
                      <button
                        onClick={(e) => handleCheckboxToggle(lesson.id, e)}
                        className="mt-0.5 text-muted-foreground hover:text-primary transition-colors shrink-0"
                        title={isCompleted ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-emerald-500/10" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground/60 group-hover:text-primary" />
                        )}
                      </button>
                      
                      <div className="space-y-1">
                        <p className={cn(
                          "font-medium leading-snug line-clamp-2",
                          isActive ? "text-primary font-bold" : "text-foreground"
                        )}>
                          {lesson.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                          <PlayCircle className="h-3 w-3" />
                          {lesson.duration} phút
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quiz Final Test Button */}
      <div className="p-4 border-t border-border bg-muted/20">
        <Link
          href={`/learn/${courseId}/quiz`}
          className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-secondary py-3 text-xs font-bold text-white shadow hover:bg-secondary/90 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <Award className="h-4 w-4" />
          Bài kiểm tra cuối khóa
        </Link>
      </div>
    </div>
  );
}
