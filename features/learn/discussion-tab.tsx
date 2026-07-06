'use client';

import * as React from 'react';
import { Send, MessageSquare, CornerDownRight } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  role: 'student' | 'admin' | 'instructor';
  content: string;
  date: string;
  replies?: Comment[];
}

interface DiscussionTabProps {
  courseId: string;
  lessonId: string;
}

export default function DiscussionTab({ courseId, lessonId }: DiscussionTabProps) {
  const { user } = useAuthStore();
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [newComment, setNewComment] = React.useState('');

  // Initial mock comments based on lessonId to make it look active
  React.useEffect(() => {
    const mockComments: Record<string, Comment[]> = {
      'l-1-1': [
        {
          id: 'comm-1',
          userName: 'Minh Quân',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          role: 'student',
          content: 'Thầy cho em hỏi, GPT-4o khác gì so với GPT-4 Turbo về mặt kiến trúc vậy ạ?',
          date: '2 ngày trước',
          replies: [
            {
              id: 'comm-1-r1',
              userName: 'Dr. Minh Nguyễn',
              userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              role: 'instructor',
              content: 'Chào Quân, GPT-4o là mô hình Omnimodal (tích hợp xử lý cả văn bản, âm thanh và hình ảnh đồng thời trong một nơ-ron mạng) thay vì chạy riêng các sub-model như GPT-4 Turbo cũ. Nhờ đó tốc độ phản hồi nhanh hơn rất nhiều.',
              date: '1 ngày trước',
            }
          ]
        },
        {
          id: 'comm-2',
          userName: 'Thu Trang',
          userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          role: 'student',
          content: 'Bài học ngắn gọn dễ hiểu quá thầy ơi!',
          date: '3 ngày trước',
        }
      ],
      'l-2-1': [
        {
          id: 'comm-3',
          userName: 'Thanh Hải',
          userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
          role: 'student',
          content: 'Có nhất thiết phải chuyển toàn bộ các component sang Server Components không thầy?',
          date: '5 giờ trước',
          replies: [
            {
              id: 'comm-3-r1',
              userName: 'Alex Trần',
              userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
              role: 'instructor',
              content: 'Chào Hải, không cần thiết em nhé. Những component nào có tương tác nút bấm, form, useEffect/useState thì cứ dùng Client Components. Quy tắc chung là đặt Client Components xa nhất có thể trong cây thư mục để tối ưu SEO.',
              date: '3 giờ trước',
            }
          ]
        }
      ]
    };

    setComments(mockComments[lessonId] || [
      {
        id: 'comm-default',
        userName: 'Học Viên Chăm Chỉ',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: 'student',
        content: 'Chào cả lớp, chúc mọi người một ngày học tập hiệu quả!',
        date: 'Vừa xong',
      }
    ]);
  }, [lessonId]);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const postedComment: Comment = {
      id: `comm-new-${Date.now()}`,
      userName: user.name,
      userAvatar: user.avatar,
      role: user.role,
      content: newComment.trim(),
      date: 'Vừa xong',
      replies: [],
    };

    setComments([postedComment, ...comments]);
    setNewComment('');
  };

  return (
    <div className="space-y-6">
      {/* Post comment form */}
      {user ? (
        <form onSubmit={handlePost} className="flex gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-8 w-8 rounded-full object-cover shrink-0 ring-1 ring-border"
          />
          <div className="flex-1 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Hỏi đáp hoặc thảo luận về bài học này..."
              rows={2}
              className="w-full text-xs rounded-2xl border border-border bg-card/45 p-3 pr-10 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="absolute right-3 bottom-3 text-primary hover:text-primary/80 transition-colors disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Send comment"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl border border-border bg-muted/20 p-4 text-center text-xs text-muted-foreground">
          Vui lòng đăng nhập để tham gia thảo luận.
        </div>
      )}

      {/* Discussion list header */}
      <h3 className="text-xs font-bold text-foreground flex items-center gap-1">
        <MessageSquare className="h-4 w-4 text-primary" />
        Thảo luận ({comments.length})
      </h3>

      {/* List of comments */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-3">
            {/* Parent comment */}
            <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={comment.userAvatar}
                    alt={comment.userName}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                  <div>
                    <span className="text-xs font-bold text-foreground mr-1.5">{comment.userName}</span>
                    {comment.role === 'instructor' && (
                      <span className="rounded bg-primary/15 border border-primary/20 px-1.5 py-0.5 text-[9px] font-extrabold text-primary uppercase mr-1.5">
                        Giảng viên
                      </span>
                    )}
                    {comment.role === 'admin' && (
                      <span className="rounded bg-amber-500/15 border border-amber-500/20 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-500 uppercase mr-1.5">
                        Quản trị
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground">{comment.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-9">
                {comment.content}
              </p>
            </div>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="pl-6 space-y-3">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-2 items-start">
                    <CornerDownRight className="h-4 w-4 text-muted-foreground/45 shrink-0 mt-2" />
                    <div className="flex-1 rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={reply.userAvatar}
                            alt={reply.userName}
                            className="h-7 w-7 rounded-full object-cover"
                          />
                          <div>
                            <span className="text-xs font-bold text-foreground mr-1.5">{reply.userName}</span>
                            {reply.role === 'instructor' && (
                              <span className="rounded bg-primary/15 border border-primary/20 px-1.5 py-0.5 text-[9px] font-extrabold text-primary uppercase mr-1.5">
                                Giảng viên
                              </span>
                            )}
                            <span className="text-[10px] text-muted-foreground">{reply.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-9">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
