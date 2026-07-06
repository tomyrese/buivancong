'use client';

import * as React from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center space-y-6 text-center px-4 animate-in fade-in duration-300">
      <div className="rounded-3xl bg-destructive/10 border border-destructive/20 p-4 text-destructive">
        <AlertOctagon className="h-10 w-10" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-xl font-extrabold text-foreground">Đã có lỗi xảy ra!</h2>
        <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
          Chúng tôi rất tiếc vì sự cố này. Vui lòng bấm thử lại hoặc quay lại trang chủ.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow shadow-primary/10 hover:bg-primary/95 transition-all active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
          Thử lại
        </button>
        <Link
          href="/"
          className="rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted"
        >
          Trang chủ
        </Link>
      </div>
    </div>
  );
}
