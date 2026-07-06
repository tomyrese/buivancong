'use client';

import { motion } from 'framer-motion';
import { Search, Play, FileCheck, CheckCircle } from 'lucide-react';

export default function Benefits() {
  const steps = [
    {
      id: 1,
      title: 'Khám phá & Chọn lựa',
      description: 'Lựa chọn các khóa học phù hợp với nhu cầu từ kho dữ liệu hoặc nhận tư vấn từ AI thông minh.',
      icon: Search,
      color: 'bg-primary/10 text-primary border-primary/20',
    },
    {
      id: 2,
      title: 'Học tập Chủ động',
      description: 'Học thông qua các video bài giảng trực quan, tài liệu đọc phong phú và hệ thống ghi chú Markdown tự động lưu.',
      icon: Play,
      color: 'bg-secondary/10 text-secondary border-secondary/20',
    },
    {
      id: 3,
      title: 'Thực hành & Trắc nghiệm',
      description: 'Kiểm tra mức độ nắm bắt kiến thức sau mỗi bài học bằng hệ thống câu hỏi trắc nghiệm khách quan ngẫu nhiên.',
      icon: FileCheck,
      color: 'bg-accent/10 text-accent border-accent/20',
    },
    {
      id: 4,
      title: 'Chứng nhận & Chia sẻ',
      description: 'Hoàn thành khóa học xuất sắc để nhận chứng chỉ số chuyên nghiệp có mã QR xác minh trực tuyến và tải về định dạng PDF.',
      icon: CheckCircle,
      color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    },
  ];

  return (
    <section className="py-20 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Lộ trình Học tập Toàn diện
          </h2>
          <p className="text-sm text-muted-foreground">
            Bốn bước đơn giản giúp bạn nâng tầm kỹ năng công nghệ chuyên môn và chuẩn bị sẵn sàng cho sự nghiệp tương lai.
          </p>
        </div>

        {/* Timeline Desktop/Mobile */}
        <div className="relative mx-auto max-w-4xl">
          {/* Vertical Connecting Line */}
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border hidden md:block md:left-1/2 md:-ml-[1px]" />

          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div 
                  key={step.id} 
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Badge (Icon) */}
                  <div className="absolute left-0 md:left-1/2 md:-ml-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-card border border-border z-10 shadow-sm transition-transform hover:scale-105">
                    <Icon className={`h-6 w-6 ${step.id === 1 ? 'text-primary' : step.id === 2 ? 'text-secondary' : step.id === 3 ? 'text-accent' : 'text-emerald-500'}`} />
                  </div>

                  {/* Content Card */}
                  <div className={`w-full pl-16 md:pl-0 md:w-1/2 ${isEven ? 'md:pl-12' : 'md:pr-12'}`}>
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? 20 : -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="glass-card rounded-3xl p-6 shadow-md border border-border/50 hover:shadow-lg transition-shadow duration-300"
                    >
                      <span className="text-3xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                        Bước {step.id}
                      </span>
                      <h3 className="text-base font-bold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
