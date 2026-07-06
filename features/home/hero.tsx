'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play, GraduationCap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background Gradient Blurs */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[400px] w-[600px] rounded-full bg-primary/20 blur-[120px] dark:bg-primary/10" />
        <div className="absolute top-1/2 left-1/3 h-[300px] w-[500px] rounded-full bg-secondary/20 blur-[100px] dark:bg-secondary/10" />
        <div className="absolute bottom-10 right-1/4 h-[300px] w-[450px] rounded-full bg-accent/20 blur-[90px] dark:bg-accent/10" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Hero Content */}
          <div className="lg:col-span-7 text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary border border-primary/20"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Chương trình Ôn thi Đánh giá Năng lực chuyên sâu
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground"
            >
              Luyện thi ĐGNL cùng{' '}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent block sm:inline">
                Thầy Bùi Văn Công
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base text-muted-foreground sm:text-lg max-w-xl leading-relaxed"
            >
              Hệ thống hóa toàn bộ kiến thức ôn thi Đánh giá Năng lực với tổ hợp Suy luận Khoa học (Vật lý, Hóa học, Sinh học, Lịch sử, Địa lý, Kinh tế - Pháp luật) và chuyên đề Toán học.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Link
                href="/courses"
                className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Bắt đầu học ngay
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/packages"
                className="flex items-center gap-2 rounded-2xl border border-border bg-card/60 backdrop-blur-md px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-muted hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <GraduationCap className="h-4 w-4 text-secondary" />
                Xem Gói Khóa học (Combo)
              </Link>
            </motion.div>
          </div>

          {/* Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[420px] animate-float">
              {/* Glassmorphism Card Stack */}
              <div className="glass-card rounded-3xl p-6 shadow-2xl relative z-10 overflow-hidden">
                <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Tiến độ học tập</h4>
                      <p className="text-2xs text-muted-foreground">Cập nhật 2 phút trước</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-2xs font-semibold text-emerald-500">
                    Đang học
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-foreground">Suy luận Khoa học</span>
                      <span className="text-primary">75%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: '75%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-foreground">Toán học lớp 12</span>
                      <span className="text-secondary">25%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-secondary" style={{ width: '25%' }} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between rounded-2xl bg-muted/50 p-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-ping" />
                    <span className="font-medium text-muted-foreground">Bài học: Vật lý nhiệt</span>
                  </div>
                  <Link href="/learn/physics-12/l-phys12-1-1" className="flex items-center gap-1 font-bold text-primary hover:underline">
                    Học tiếp
                    <Play className="h-3 w-3 fill-primary" />
                  </Link>
                </div>
              </div>

              {/* Decorative Blur Orbs inside image container */}
              <div className="absolute -top-6 -left-6 h-12 w-12 rounded-full bg-accent/30 blur-md" />
              <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-secondary/30 blur-lg" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
