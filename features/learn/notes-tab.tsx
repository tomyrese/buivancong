'use client';

import * as React from 'react';
import { useProgressStore, Note } from '@/store/useProgressStore';
import { PlayCircle, Trash2, FileOutput, Save, FileText } from 'lucide-react';

interface NotesTabProps {
  courseId: string;
  lessonId: string;
  currentVideoTime: number; // in seconds
  onSeek: (seconds: number) => void;
}

export default function NotesTab({ courseId, lessonId, currentVideoTime, onSeek }: NotesTabProps) {
  const { notes, saveNote, deleteNote } = useProgressStore();
  const [content, setContent] = React.useState('');
  const [timestampStr, setTimestampStr] = React.useState('00:00');
  const [secondsValue, setSecondsValue] = React.useState(0);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter notes for the current course and lesson
  const currentNotes = React.useMemo(() => {
    return notes
      .filter((n) => n.courseId === courseId && n.lessonId === lessonId)
      .sort((a, b) => {
        const timeToSec = (t: string) => {
          const parts = t.split(':');
          return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        };
        return timeToSec(a.timestamp) - timeToSec(b.timestamp);
      });
  }, [notes, courseId, lessonId]);

  // Capture current timestamp
  const captureTimestamp = () => {
    setTimestampStr(formatSeconds(currentVideoTime));
    setSecondsValue(Math.floor(currentVideoTime));
  };

  // Convert time string to seconds for seeking
  const parseTimeToSeconds = (tStr: string) => {
    const parts = tStr.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
  };

  const handleSave = () => {
    if (!content.trim()) return;
    saveNote(courseId, lessonId, timestampStr, content);
    setContent(''); // clear after save
  };

  // Simple PDF / Print layout export
  const exportPDF = () => {
    const win = window.open('', '_blank');
    if (win) {
      const notesHTML = currentNotes
        .map(
          (n) => `
        <div style="margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px solid #eee;">
          <div style="font-weight: bold; color: #2563EB;">Mốc thời gian: ${n.timestamp}</div>
          <div style="margin-top: 8px; font-family: monospace; white-space: pre-wrap;">${n.content}</div>
        </div>
      `
        )
        .join('');

      win.document.write(`
        <html>
          <head>
            <title>Ghi chú bài học - iStudent</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
              h1 { border-bottom: 2px solid #333; padding-bottom: 10px; }
            </style>
          </head>
          <body>
            <h1>Danh sách ghi chú bài học</h1>
            <p>Khóa học ID: ${courseId} • Bài học ID: ${lessonId}</p>
            <div style="margin-top: 30px;">
              ${notesHTML || '<p>Không có ghi chú nào.</p>'}
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      win.document.close();
    }
  };

  return (
    <div className="space-y-6">
      {/* Editor block */}
      <div className="rounded-2xl border border-border bg-card/40 p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">Ghi chú tại mốc:</span>
            <button
              onClick={captureTimestamp}
              className="rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1 text-2xs font-semibold text-primary hover:bg-primary/20 transition-all flex items-center gap-1.5"
            >
              <PlayCircle className="h-3.5 w-3.5" />
              {timestampStr}
            </button>
          </div>
          
          <button
            onClick={handleSave}
            disabled={!content.trim()}
            className="rounded-lg bg-primary px-3 py-1 text-2xs font-semibold text-white hover:bg-primary/95 transition-all disabled:opacity-50 flex items-center gap-1"
          >
            <Save className="h-3.5 w-3.5" />
            Lưu nháp
          </button>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Viết ghi chú của bạn bằng Markdown tại đây... (Nội dung tự lưu khi bấm lưu nháp)"
          rows={3}
          className="w-full text-xs rounded-xl border border-border bg-background p-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-y"
        />
      </div>

      {/* Saved notes list header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-foreground flex items-center gap-1">
          <FileText className="h-4 w-4 text-primary" />
          Ghi chú của bạn ({currentNotes.length})
        </h3>
        {currentNotes.length > 0 && (
          <button
            onClick={exportPDF}
            className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors border border-border bg-card rounded-lg px-2.5 py-1"
          >
            <FileOutput className="h-3.5 w-3.5" />
            Xuất PDF
          </button>
        )}
      </div>

      {/* Notes lists */}
      {currentNotes.length > 0 ? (
        <div className="space-y-3">
          {currentNotes.map((note) => (
            <div
              key={note.id}
              className="rounded-2xl border border-border/80 bg-card p-4 space-y-2.5 flex items-start justify-between gap-4 group"
            >
              <div className="space-y-1.5 flex-1">
                {/* Clickable timestamp to seek */}
                <button
                  onClick={() => onSeek(parseTimeToSeconds(note.timestamp))}
                  className="inline-flex items-center gap-1 rounded-md bg-secondary/10 px-2 py-0.5 text-3xs font-bold text-secondary border border-secondary/20 hover:bg-secondary/20"
                >
                  <PlayCircle className="h-3 w-3" />
                  {note.timestamp}
                </button>
                <div className="text-xs text-foreground leading-relaxed font-sans whitespace-pre-wrap select-text">
                  {note.content}
                </div>
              </div>

              <button
                onClick={() => deleteNote(note.id)}
                className="opacity-0 group-hover:opacity-100 rounded p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all self-start"
                title="Xóa ghi chú"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 rounded-2xl border border-dashed border-border text-xs text-muted-foreground">
          Chưa có ghi chú nào cho bài học này. Hãy viết ghi chú đầu tiên để lưu trữ kiến thức nhé!
        </div>
      )}
    </div>
  );
}
