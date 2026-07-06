'use client';

import * as React from 'react';
import { Sparkles, X, Send, BrainCircuit, Bot, User, ArrowRight, RotateCcw } from 'lucide-react';
import { CourseService, Course } from '@/services/courseService';
import Link from 'next/link'; // Wait, let's use 'next/link' instead of next/next-link!
import { MarkdownRenderer } from '@/components/markdown-renderer';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIRecommendationModal({ isOpen, onClose }: AIModalProps) {
  const DEFAULT_WELCOME: Message = {
    role: 'assistant',
    content: 'Chào bạn! Tôi là Trợ lý AI chuyên trách luyện thi ĐGNL lớp Thầy Bùi Văn Công. Tôi có thể giúp bạn thiết kế lộ trình ôn tập và tư vấn các combo khóa học (Toán học, Suy luận Khoa học) phù hợp nhất. Bạn đang cần ôn luyện về môn học nào?'
  };

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const courses = React.useMemo(() => CourseService.getCourses(), []);

  // Load chat history from localStorage on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('istudent_ai_messages');
      if (saved) {
        try {
          setMessages(JSON.parse(saved));
        } catch (e) {
          console.error('Error loading saved messages:', e);
          setMessages([DEFAULT_WELCOME]);
        }
      } else {
        setMessages([DEFAULT_WELCOME]);
      }
    } else {
      setMessages([DEFAULT_WELCOME]);
    }
  }, []);

  // Save chat history when messages change
  React.useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      if (messages.length === 1 && messages[0].content === DEFAULT_WELCOME.content) {
        localStorage.removeItem('istudent_ai_messages');
      } else {
        localStorage.setItem('istudent_ai_messages', JSON.stringify(messages));
      }
    }
  }, [messages]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      document.body.style.overflow = 'hidden';
    } else {
      setInput('');
      setLoading(false);
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleResetChat = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện với AI?')) {
      setMessages([DEFAULT_WELCOME]);
      localStorage.removeItem('istudent_ai_messages');
    }
  };

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || loading) return;

    if (!textToSend) setInput('');

    const newMessages: Message[] = [...messages, { role: 'user', content: messageText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error('AI request failed');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Xin lỗi, kết nối tới máy chủ AI gặp sự cố. Bạn vui lòng thử lại sau giây lát!'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'Tư vấn Combo Suy luận Khoa học',
    'Lộ trình học Toán 10, 11, 12 thi ĐGNL',
    'Thầy Bùi Văn Công dạy những môn nào?',
    'Mẹo học Atlat Địa lý 12'
  ];

  // Extracts course recommendations based on "[Mã: id]" tags in response
  const getCoursesFromResponse = (content: string): Course[] => {
    const regex = /\[Mã:\s*([a-zA-Z0-9-]+)\]/g;
    const ids: string[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      ids.push(match[1]);
    }
    return courses.filter((c) => ids.includes(c.id));
  };

  // Strip course ID codes from the displayed message bubble text for visual clarity
  const formatResponseText = (content: string) => {
    return content.replace(/\[Mã:\s*[a-zA-Z0-9-]+\]/g, '').trim();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Chat Modal Panel */}
      <div className="relative w-full max-w-2xl transform rounded-3xl border border-border bg-card shadow-2xl transition-all duration-300 z-10 overflow-hidden flex flex-col h-[600px] animate-in zoom-in-95 duration-200">
        {/* Background glow decorator */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-36 w-36 rounded-full bg-secondary/10 blur-xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border p-4 bg-card shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
              <BrainCircuit className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Trợ lý AI Luyện thi ĐGNL</h3>
              <p className="text-3xs text-muted-foreground">Tư vấn lộ trình học lớp Thầy Bùi Văn Công chính xác</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleResetChat}
              title="Xóa lịch sử trò chuyện"
              className="rounded-xl border border-border p-2 hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button 
              onClick={onClose}
              className="rounded-xl border border-border p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Chat History Messages Container */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg, index) => {
            const isAI = msg.role === 'assistant';
            const recommendedCourses = isAI ? getCoursesFromResponse(msg.content) : [];
            const cleanText = isAI ? formatResponseText(msg.content) : msg.content;

            return (
              <div 
                key={index} 
                className={`flex gap-3 max-w-[85%] ${isAI ? 'mr-auto text-left' : 'ml-auto flex-row-reverse text-right'}`}
              >
                {/* Avatar Icon */}
                <div className={`h-8 w-8 rounded-xl shrink-0 flex items-center justify-center border text-xs font-semibold ${
                  isAI 
                    ? 'bg-secondary/10 text-secondary border-secondary/20' 
                    : 'bg-primary/10 text-primary border-primary/20'
                }`}>
                  {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                {/* Message Bubble Container */}
                <div className="space-y-3">
                  <div className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm border ${
                    isAI 
                      ? 'bg-card text-foreground border-border' 
                      : 'bg-primary text-white border-primary/10 whitespace-pre-line'
                  }`}>
                    {isAI ? (
                      <MarkdownRenderer content={cleanText} />
                    ) : (
                      cleanText
                    )}
                  </div>

                  {/* Render dynamic clickable course suggestion cards if found in AI message */}
                  {recommendedCourses.length > 0 && (
                    <div className="space-y-2 max-w-md">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Khóa học được đề xuất:</p>
                      <div className="grid grid-cols-1 gap-2">
                        {recommendedCourses.map((course) => (
                          <div 
                            key={course.id}
                            className="flex items-center justify-between rounded-xl border border-border p-2.5 bg-card hover:border-secondary/40 transition-all shadow-2xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img 
                                src={course.thumbnail} 
                                alt={course.title}
                                className="h-10 w-14 object-cover rounded-lg shrink-0"
                              />
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-foreground truncate">{course.title}</h4>
                                <p className="text-[10px] text-muted-foreground">Thời lượng: {course.duration} giờ • {course.difficulty}</p>
                              </div>
                            </div>
                            <Link
                              href={`/courses/${course.id}`}
                              onClick={onClose}
                              className="rounded-lg bg-secondary/10 hover:bg-secondary text-secondary hover:text-white p-1.5 transition-all text-xs font-semibold shrink-0"
                            >
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Loading Indicator Bubble */}
          {loading && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="h-8 w-8 rounded-xl shrink-0 flex items-center justify-center border bg-secondary/10 text-secondary border-secondary/20">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-card border border-border flex items-center gap-1.5 shadow-sm">
                <span className="h-1.5 w-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input & Quick Suggestion Area Footer */}
        <div className="p-4 border-t border-border bg-card shrink-0 space-y-3">
          {/* Quick Prompts Suggestions (only show when not loading & chat is fresh or user wants ideas) */}
          {messages.length === 1 && !loading && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Chọn nhanh câu hỏi gợi ý:</p>
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(p)}
                    className="rounded-full border border-border bg-muted/40 hover:bg-muted px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-all hover:scale-[1.02]"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Text Form */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Hỏi về khóa học, combo môn ôn thi của Thầy..."
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !input.trim()}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-white shadow-md shadow-secondary/20 hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:pointer-events-none shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
