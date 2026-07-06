import { Award } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center space-y-4 animate-pulse">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white font-extrabold shadow shadow-primary/10 animate-spin">
        <span>i</span>
      </div>
      <p className="text-xs font-semibold text-muted-foreground">Đang chuẩn bị không gian học tập cho bạn...</p>
    </div>
  );
}
