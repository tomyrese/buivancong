'use client';

import * as React from 'react';
import { Search, X, SlidersHorizontal, Sparkles, Trash2, ArrowUpDown } from 'lucide-react';
import { CourseService, Category } from '@/services/courseService';
import { cn } from '@/lib/utils';

interface SearchFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  filters: {
    categoryId: string;
    difficulty: string;
    durationRange: 'all' | 'short' | 'medium' | 'long';
    sortBy: 'newest' | 'popular' | 'rating';
  };
  onFilterChange: (updates: Partial<SearchFiltersProps['filters']>) => void;
  onOpenAI: () => void;
  recentSearches: string[];
  onAddRecent: (term: string) => void;
  onClearRecent: () => void;
}

export default function SearchFilters({
  search,
  onSearchChange,
  filters,
  onFilterChange,
  onOpenAI,
  recentSearches,
  onAddRecent,
  onClearRecent
}: SearchFiltersProps) {
  const categories = CourseService.getCategories();
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const popularSearches = ['Toán 12', 'Vật lý 12', 'Hóa học 12', 'Sinh học 12', 'Lịch sử 12', 'Địa lý 12'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      onAddRecent(search.trim());
    }
  };

  const handlePopularClick = (term: string) => {
    onSearchChange(term);
    onAddRecent(term);
  };

  return (
    <div className="space-y-6">
      {/* Top Search bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm tên khóa học, mô tả giảng dạy..."
            className="w-full rounded-2xl border border-border bg-card/50 backdrop-blur-sm pl-12 pr-10 py-3.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-sm"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-3.5 rounded-full p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* AI Consultant button */}
        <button
          type="button"
          onClick={onOpenAI}
          className="flex items-center gap-1.5 rounded-2xl bg-secondary/10 px-5 text-sm font-semibold text-secondary hover:bg-secondary/20 transition-all border border-secondary/20 shadow-sm shrink-0"
        >
          <Sparkles className="h-4 w-4 text-secondary animate-pulse" />
          <span className="hidden sm:inline">Tư vấn AI</span>
        </button>

        {/* Advanced filter toggle button */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={cn(
            "flex items-center justify-center rounded-2xl border border-border p-3.5 transition-all shadow-sm bg-card hover:bg-muted shrink-0",
            showAdvanced ? "border-primary/40 bg-primary/5 text-primary" : "text-muted-foreground"
          )}
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </form>

      {/* Popular and Recent searches */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        {/* Popular searches */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground font-semibold">Tìm kiếm nhiều:</span>
          {popularSearches.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handlePopularClick(term)}
              className="rounded-full bg-card hover:bg-muted border border-border/80 px-3 py-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Recent searches */}
        {recentSearches.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground font-semibold">Vừa tìm:</span>
            {recentSearches.slice(0, 3).map((term, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handlePopularClick(term)}
                className="rounded-full bg-muted/60 hover:bg-muted px-2.5 py-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                {term}
              </button>
            ))}
            <button
              type="button"
              onClick={onClearRecent}
              className="text-destructive hover:text-destructive/80 transition-colors ml-1 p-0.5 rounded"
              title="Xóa lịch sử tìm kiếm"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex items-center overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none gap-2">
        <button
          onClick={() => onFilterChange({ categoryId: 'all' })}
          className={cn(
            "rounded-xl px-4 py-2 text-xs font-bold transition-all border shrink-0",
            filters.categoryId === 'all'
              ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
              : "bg-card border-border hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          Tất cả danh mục
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onFilterChange({ categoryId: cat.id })}
            className={cn(
              "rounded-xl px-4 py-2 text-xs font-bold transition-all border shrink-0",
              filters.categoryId === cat.id
                ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                : "bg-card border-border hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Advanced Filter options */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl border border-border bg-card/60 p-4 shadow-inner animate-in slide-in-from-top-2 duration-200">
          {/* Difficulty Filter */}
          <div className="space-y-1.5">
            <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider block">Độ khó</label>
            <select
              value={filters.difficulty}
              onChange={(e) => onFilterChange({ difficulty: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value="all">Tất cả trình độ</option>
              <option value="Cơ bản">Cơ bản</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Nâng cao">Nâng cao</option>
            </select>
          </div>

          {/* Duration Filter */}
          <div className="space-y-1.5">
            <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider block">Thời lượng</label>
            <select
              value={filters.durationRange}
              onChange={(e) => onFilterChange({ durationRange: e.target.value as any })}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value="all">Tất cả thời lượng</option>
              <option value="short">Ngắn (≤ 6 giờ)</option>
              <option value="medium">Trung bình (6 - 10 giờ)</option>
              <option value="long">Dài ( &gt; 10 giờ)</option>
            </select>
          </div>

          {/* Sort selection */}
          <div className="space-y-1.5">
            <label className="text-3xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <ArrowUpDown className="h-3 w-3" />
              Sắp xếp theo
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value="newest">Mới nhất</option>
              <option value="popular">Phổ biến nhất</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
