'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Hoàng Nam',
    role: 'Đỗ ĐH Bách khoa - ĐHQG TP.HCM',
    content: 'Khóa học ôn thi ĐGNL của thầy Công thực sự là bệ phóng giúp mình đạt điểm số 115/150. Các chuyên đề Suy luận Khoa học Vật lý và Hóa học được thầy tóm tắt vô cùng logic và dễ nhớ.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Thu Trang',
    role: 'Đỗ ĐH Ngoại thương CS2 - TP.HCM',
    content: 'Em cực kỳ ấn tượng với phương pháp giải nhanh Toán trắc nghiệm của thầy Bùi Văn Công. Nhờ khóa học của thầy mà phần tư duy định lượng của em đạt điểm số gần như tối đa.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Khánh Linh',
    role: 'Đỗ ĐH Y Dược TP.HCM',
    content: 'Tài liệu ôn thi ĐGNL môn Sinh học và Địa lý của thầy Bùi Văn Công cực kỳ bám sát đề thi thực tế. Giao diện học tập trực quan và các bài trắc nghiệm tính giờ rất giống thi thật!',
    rating: 5,
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-muted/20 border-t border-border/40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Cảm nhận từ Học viên
          </h2>
          <p className="text-sm text-muted-foreground">
            Khám phá những trải nghiệm thực tế từ các học viên đã và đang đồng hành cùng iStudent.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative mx-auto max-w-3xl px-4">
          <div className="absolute top-0 left-0 -translate-x-3 -translate-y-6 text-primary/10 select-none hidden sm:block">
            <Quote className="h-28 w-28 rotate-180" />
          </div>

          <div className="relative z-10 glass-card rounded-3xl p-8 sm:p-12 shadow-xl border border-border/60">
            <div className="min-h-[160px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Stars */}
                  <div className="flex gap-1 justify-center sm:justify-start">
                    {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Feedback Text */}
                  <p className="text-sm sm:text-base text-foreground italic leading-relaxed text-center sm:text-left">
                    &ldquo;{testimonials[activeIndex].content}&rdquo;
                  </p>

                  {/* Student profile */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 text-center sm:text-left justify-center sm:justify-start">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white uppercase select-none ring-2 ring-primary/20">
                      {testimonials[activeIndex].name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        {testimonials[activeIndex].name}
                      </h4>
                      <p className="text-2xs text-muted-foreground">
                        {testimonials[activeIndex].role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-1.5">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex ? 'w-6 bg-primary' : 'w-2 bg-border'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
