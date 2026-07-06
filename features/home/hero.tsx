'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import gv07Img from '@/src/imgs/GV07.png';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-0 lg:pt-32 lg:pb-0">
      {/* Background Gradient Blurs */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[400px] w-[600px] rounded-full bg-primary/20 blur-[120px] dark:bg-primary/10" />
        <div className="absolute top-1/2 left-1/3 h-[300px] w-[500px] rounded-full bg-secondary/20 blur-[100px] dark:bg-secondary/10" />
        <div className="absolute bottom-10 right-1/4 h-[300px] w-[450px] rounded-full bg-accent/20 blur-[90px] dark:bg-accent/10" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
          {/* Hero Content */}
          <div className="lg:col-span-7 text-left space-y-6 lg:pb-16 pb-8">
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
            className="lg:col-span-5 flex justify-center lg:justify-end self-end z-10"
          >
            <div className="relative w-full max-w-[460px] lg:max-w-[500px] flex items-end justify-center">
              {/* Teacher Image with 3D drop shadow */}
              <Image 
                src={gv07Img} 
                alt="Teacher Model" 
                priority
                className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-[0_20px_35px_rgba(0,0,0,0.3)] filter dark:drop-shadow-[0_20px_35px_rgba(255,255,255,0.05)] transform hover:scale-[1.03] transition-transform duration-500 z-10 translate-y-1"
              />

              {/* Decorative Blur Orbs inside image container */}
              <div className="absolute top-10 left-10 h-16 w-16 rounded-full bg-accent/20 blur-md" />
              <div className="absolute bottom-10 right-10 h-24 w-24 rounded-full bg-secondary/20 blur-lg" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
