'use client';

import { motion } from 'framer-motion';
import { BookOpen, Video, Users, Award } from 'lucide-react';

export default function Stats() {
  const stats = [
    { id: 1, name: 'Khóa học chất lượng', value: '100+', icon: BookOpen, color: 'text-primary' },
    { id: 2, name: 'Video bài giảng', value: '10,000+', icon: Video, color: 'text-secondary' },
    { id: 3, name: 'Học viên tin tưởng', value: '100,000+', icon: Users, color: 'text-accent' },
  ];

  return (
    <section className="relative py-16 bg-muted/10 border-t border-border/40 overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-64 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[80px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-3xl p-8 text-center flex flex-col items-center justify-center space-y-4 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-black/5"
              >
                {/* Icon Circle */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted border border-border">
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>

                <div className="space-y-1">
                  <motion.p 
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 + 0.2 }}
                    className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {stat.name}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
