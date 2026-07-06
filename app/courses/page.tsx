'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import SearchFilters from '@/features/courses/search-filters';
import AIRecommendationModal from '@/features/courses/ai-recommendation-modal';
import { CourseService, Course } from '@/services/courseService';
import { useDebounce } from '@/hooks/useDebounce';
import { BookOpen, Star, Clock, ArrowRight, Smile } from 'lucide-react';
import Link from 'next/link';

function CoursesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const triggerAI = searchParams.get('ai') === 'true';

  // Search & Filter state
  const [search, setSearch] = React.useState('');
  const [filters, setFilters] = React.useState<{
    categoryId: string;
    difficulty: string;
    durationRange: 'all' | 'short' | 'medium' | 'long';
    sortBy: 'newest' | 'popular' | 'rating';
  }>({
    categoryId: initialCategory,
    difficulty: 'all',
    durationRange: 'all',
    sortBy: 'newest',
  });

  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  const [isAIModalOpen, setIsAIModalOpen] = React.useState(false);
  const [visibleCount, setVisibleCount] = React.useState(6);
  const [loading, setLoading] = React.useState(false);

  const debouncedSearch = useDebounce(search, 300);

  // Sync category from query params
  React.useEffect(() => {
    if (initialCategory !== filters.categoryId) {
      setFilters(prev => ({ ...prev, categoryId: initialCategory }));
    }
  }, [initialCategory]);

  // Trigger AI Suggestion modal if ?ai=true
  React.useEffect(() => {
    if (triggerAI) {
      setIsAIModalOpen(true);
    }
  }, [triggerAI]);

  // Load recent searches from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('istudent-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleAddRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const nextSearches = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(nextSearches);
    localStorage.setItem('istudent-recent-searches', JSON.stringify(nextSearches));
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('istudent-recent-searches');
  };

  const handleFilterChange = (updates: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
    setVisibleCount(6); // reset page count
  };

  // Run Search & Filters
  const filteredCourses = React.useMemo(() => {
    return CourseService.searchCourses(debouncedSearch, filters);
  }, [debouncedSearch, filters]);

  // Simulate loading on search/filter changes
  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [debouncedSearch, filters]);

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 3);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight sm:text-3xl">
          Tìm kiếm Khóa học
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Khám phá danh sách khóa học phong phú được cập nhật liên tục bởi các chuyên gia hàng đầu.
        </p>
      </div>

      {/* Filter Area */}
      <SearchFilters
        search={search}
        onSearchChange={setSearch}
        filters={filters}
        onFilterChange={handleFilterChange}
        onOpenAI={() => setIsAIModalOpen(true)}
        recentSearches={recentSearches}
        onAddRecent={handleAddRecentSearch}
        onClearRecent={handleClearRecentSearches}
      />

      {/* Results Section */}
      <div className="space-y-6">
        {loading && visibleCount === 6 ? (
          /* Skeletons */
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-3xl border border-border bg-card overflow-hidden h-[360px] animate-pulse">
                <div className="aspect-video w-full bg-muted" />
                <div className="p-6 space-y-4">
                  <div className="h-4 w-1/4 rounded bg-muted" />
                  <div className="h-6 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-10 w-full rounded bg-muted pt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <>
            {/* Grid of Results */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.slice(0, visibleCount).map((course) => {
                const teacher = CourseService.getTeacherById(course.teacherId);
                let difficultyColor = 'bg-blue-500/10 text-blue-500';
                if (course.difficulty === 'Cơ bản') difficultyColor = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
                if (course.difficulty === 'Nâng cao') difficultyColor = 'bg-purple-500/10 text-purple-500 border-purple-500/20';

                return (
                  <div
                    key={course.id}
                    className="group flex flex-col justify-between rounded-3xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-0.5"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-muted shrink-0">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 right-3 rounded-full bg-emerald-500 px-3 py-1 text-2xs font-bold text-white shadow">
                        Miễn phí
                      </span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <span className={`rounded-full border px-2.5 py-0.5 text-3xs font-semibold ${difficultyColor}`}>
                          {course.difficulty}
                        </span>
                        <h3 className="text-base font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {course.description}
                        </p>
                      </div>

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

                      <div className="flex items-center justify-between pt-2">
                        {teacher && (
                          <div className="flex items-center gap-2">
                            <img
                              src={teacher.avatar}
                              alt={teacher.name}
                              className="h-7 w-7 rounded-full object-cover"
                            />
                            <span className="text-3xs font-semibold text-muted-foreground max-w-[100px] truncate">
                              {teacher.name}
                            </span>
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
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {visibleCount < filteredCourses.length && (
              <div className="flex justify-center pt-6">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="rounded-2xl border border-border bg-card px-6 py-3 text-xs font-semibold text-foreground hover:bg-muted transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Đang tải...' : 'Tải thêm khóa học'}
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty state */
          <div className="py-16 text-center space-y-4 rounded-3xl border border-dashed border-border bg-card/45">
            <Smile className="h-12 w-12 text-muted-foreground mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">Không tìm thấy khóa học nào</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Hãy thử tìm kiếm với các từ khóa khác hoặc sử dụng công cụ Gợi ý AI để tìm lộ trình phù hợp nhất.
              </p>
            </div>
            <button
              onClick={() => {
                setSearch('');
                setFilters({
                  categoryId: 'all',
                  difficulty: 'all',
                  durationRange: 'all',
                  sortBy: 'newest',
                });
              }}
              className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* AI recommendation modal */}
      <AIRecommendationModal
        isOpen={isAIModalOpen}
        onClose={() => {
          setIsAIModalOpen(false);
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            if (url.searchParams.has('ai')) {
              url.searchParams.delete('ai');
              window.history.replaceState(null, '', url.pathname + url.search);
            }
          }
        }}
      />
    </div>
  );
}

export default function CoursesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-xs text-muted-foreground">
          Đang tải dữ liệu khóa học...
        </div>
      }
    >
      <CoursesContent />
    </React.Suspense>
  );
}
