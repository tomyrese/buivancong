'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'iStudent có thực sự miễn phí không?',
    answer: 'Có, iStudent là nền tảng học tập phi lợi nhuận. Toàn bộ tài liệu đọc, video bài giảng, hệ thống trắc nghiệm và chứng chỉ số tại đây đều hoàn toàn miễn phí 100% cho mọi người.',
  },
  {
    question: 'Tôi sẽ nhận được chứng chỉ sau khi hoàn thành khóa học chứ?',
    answer: 'Chắc chắn rồi. Sau khi bạn hoàn thành 100% thời lượng các bài học và đạt điểm đỗ (từ 80% trở lên) trong bài kiểm tra Quiz cuối khóa, iStudent sẽ cấp chứng chỉ số chính thức có tích hợp mã QR để bên thứ ba dễ dàng xác minh trực tuyến.',
  },
  {
    question: 'Làm thế nào để tích lũy điểm kinh nghiệm (XP) và tăng cấp độ?',
    answer: 'Hệ thống tự động chấm điểm XP cho bạn khi hoàn thành mỗi bài học (+50 XP), hoàn thành bài Quiz (+100 XP) và duy trì chuỗi học tập liên tiếp hàng ngày (Streak). Khi tích lũy đủ XP, cấp độ tài khoản của bạn sẽ tự động được nâng lên.',
  },
  {
    question: 'Lộ trình học tập của các khóa học được sắp xếp như thế nào?',
    answer: 'Các khóa học trên iStudent được phân loại theo chuyên đề ôn thi ĐGNL bám sát cấu trúc đề. Bạn có thể tự do lựa chọn học theo từng môn riêng lẻ hoặc mua các combo toàn diện để có lộ trình ôn luyện hệ thống từ cơ bản đến nâng cao.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Các câu hỏi Thường gặp
          </h2>
          <p className="text-sm text-muted-foreground">
            Giải đáp nhanh các thắc mắc phổ biến nhất về cách vận hành, tích lũy điểm và chứng chỉ tại iStudent.
          </p>
        </div>

        {/* Accordions */}
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-border bg-card/60 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-foreground hover:bg-muted/40 transition-colors"
                >
                  <span>{faq.question}</span>
                  <span className="ml-4 shrink-0 rounded-lg border border-border p-1 bg-background text-muted-foreground">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="border-t border-border/40 p-5 text-xs sm:text-sm text-muted-foreground leading-relaxed bg-muted/10">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
