import Link from 'next/link';
import { HelpCircle, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] w-full flex-col items-center justify-center space-y-6 text-center px-4 animate-in fade-in duration-300">
      <div className="rounded-3xl bg-muted p-4 text-muted-foreground border border-border shadow-inner">
        <HelpCircle className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-black text-foreground">Không tìm thấy trang</h2>
        <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
          Đường dẫn bạn truy cập không tồn tại hoặc đã bị gỡ bỏ khỏi hệ thống.
        </p>
      </div>

      <Link
        href="/"
        className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow shadow-primary/10 hover:bg-primary/95 transition-all active:scale-95"
      >
        <span>Về trang chủ</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
