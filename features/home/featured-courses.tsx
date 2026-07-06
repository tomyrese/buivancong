'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Star, ArrowRight, User } from 'lucide-react';
import { CourseService } from '@/services/courseService';

export default function FeaturedCourses() {
  const featuredCourses = CourseService.getFeaturedCourses();

  return (
    <section className="py-20 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Khóa học Nổi bật Miễn phí
            </h2>
            <p className="text-sm text-muted-foreground">
              Các khóa học chất lượng cao được thiết kế chi tiết, dễ tiếp cận và hoàn toàn miễn phí dành cho bạn.
            </p>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors self-start md:self-auto group"
          >
            Xem tất cả khóa học
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.map((course, index) => {
            const teacher = CourseService.getTeacherById(course.teacherId);
            
            // Resolve difficulty badges
            let difficultyColor = 'bg-blue-500/10 text-blue-500';
            if (course.difficulty === 'Cơ bản') difficultyColor = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            if (course.difficulty === 'Nâng cao') difficultyColor = 'bg-purple-500/10 text-purple-500 border-purple-500/20';

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col justify-between rounded-3xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="rounded-full bg-emerald-500 px-3 py-1 text-2xs font-bold text-white shadow-md">
                      Miễn phí
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-0.5 text-3xs font-semibold ${difficultyColor}`}>
                        {course.difficulty}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Rating, Duration, Lessons */}
                  <div className="flex items-center justify-between text-2xs text-muted-foreground border-y border-border/50 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-foreground">{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{course.lessonsCount} bài</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{course.duration} giờ</span>
                    </div>
                  </div>

                  {/* Teacher & CTA */}
                  <div className="flex items-center justify-between pt-2">
                    {teacher ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={teacher.avatar}
                          alt={teacher.name}
                          className="h-7 w-7 rounded-full object-cover ring-1 ring-border"
                        />
                        <span className="text-3xs font-medium text-muted-foreground truncate max-w-[100px]">
                          {teacher.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-3xs text-muted-foreground">
                        <User className="h-3.5 w-3.5" />
                        <span>Giảng viên</span>
                      </div>
                    )}

                    <Link
                      href={`/courses/${course.id}`}
                      className="inline-flex items-center justify-center gap-1 rounded-xl bg-primary/10 px-4 py-2 text-2xs font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300"
                    >
                      Học ngay
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
