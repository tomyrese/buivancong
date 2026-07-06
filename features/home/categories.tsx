'use client';

import * as Icons from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CourseService } from '@/services/courseService';

export default function Categories() {
  const categories = CourseService.getCategories();

  return (
    <section className="py-16 border-t border-border/40 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Danh mục Học tập Đa dạng
          </h2>
          <p className="text-sm text-muted-foreground">
            Lựa chọn lĩnh vực bạn yêu thích và bắt đầu xây dựng lộ trình học tập chuyên nghiệp miễn phí từ hôm nay.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            // Resolve icon dynamically
            const IconComponent = (Icons as any)[category.icon] || Icons.BookOpen;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  href={`/courses?category=${category.id}`}
                  className="group relative block rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 overflow-hidden"
                >
                  {/* Decorative background gradient */}
                  <div className={`absolute top-0 right-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-gradient-to-br ${category.color} opacity-[0.03] group-hover:opacity-10 group-hover:scale-125 transition-all duration-300 blur-sm`} />

                  <div className="flex items-start gap-4">
                    {/* Icon Container */}
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} text-white shadow-md shadow-primary/10 transition-transform group-hover:scale-105 duration-300`}>
                      <IconComponent className="h-6 w-6" />
                    </div>

                    {/* Content */}
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
