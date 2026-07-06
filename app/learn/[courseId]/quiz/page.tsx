'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CourseService, Quiz, QuizQuestion } from '@/services/courseService';
import { useProgressStore, Certificate } from '@/store/useProgressStore';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  RefreshCw, 
  Clock, 
  Download, 
  ShieldCheck, 
  ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const { user, addXP } = useAuthStore();
  const { saveQuizAttempt, issueCertificate, certificates } = useProgressStore();

  const course = React.useMemo(() => CourseService.getCourseById(courseId), [courseId]);
  const quiz = React.useMemo(() => CourseService.getQuizByCourseId(courseId), [courseId]);

  // States
  const [questions, setQuestions] = React.useState<QuizQuestion[]>([]);
  const [shuffledAnswers, setShuffledAnswers] = React.useState<string[][]>([]); // mapping of question index to shuffled options
  const [shuffledCorrectIndices, setShuffledCorrectIndices] = React.useState<number[]>([]); // mapping of question index to correct answers in shuffled list
  
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<number[]>([]); // stores selected indices in shuffled list
  const [isFinished, setIsFinished] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [timeRemaining, setTimeRemaining] = React.useState(180); // 3 minutes countdown
  const [activeCertificate, setActiveCertificate] = React.useState<Certificate | null>(null);
  const [isClient, setIsClient] = React.useState(false);

  // Hydration fix
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize Quiz: Shuffle questions and answers
  React.useEffect(() => {
    if (quiz) {
      // Create a shallow copy of questions
      const qList = [...quiz.questions];
      setQuestions(qList);
      setSelectedAnswers(new Array(qList.length).fill(-1));

      // For each question, shuffle options and track correct answer index
      const shufAns: string[][] = [];
      const shufCorr: number[] = [];

      qList.forEach((q) => {
        const correctText = q.options[q.correctAnswer];
        
        // Shuffle options
        const optionsCopy = [...q.options];
        const shuffled = optionsCopy.sort(() => Math.random() - 0.5);
        
        // Find new correct index
        const newCorrIdx = shuffled.indexOf(correctText);
        
        shufAns.push(shuffled);
        shufCorr.push(newCorrIdx);
      });

      setShuffledAnswers(shufAns);
      setShuffledCorrectIndices(shufCorr);
    }
  }, [quiz]);

  // Countdown timer
  React.useEffect(() => {
    if (isFinished || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, questions]);

  if (!isClient) return null;

  if (!course || !quiz || questions.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-4">
        <Award className="h-12 w-12 text-muted-foreground mx-auto" />
        <h2 className="text-lg font-bold text-foreground">Không tìm thấy bài trắc nghiệm cho khóa học này</h2>
        <Link href={`/learn/${courseId}/quiz`} onClick={() => router.back()} className="text-xs text-primary font-bold hover:underline flex items-center justify-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Quay lại bài học
        </Link>
      </div>
    );
  }

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIdx: number) => {
    const nextAnswers = [...selectedAnswers];
    nextAnswers[currentIdx] = optIdx;
    setSelectedAnswers(nextAnswers);
  };

  const handleSubmitQuiz = () => {
    // Calculate Score
    let correctCount = 0;
    selectedAnswers.forEach((ans, idx) => {
      if (ans === shuffledCorrectIndices[idx]) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setIsFinished(true);

    const isPass = finalScore >= 80;
    saveQuizAttempt(courseId, correctCount, questions.length, isPass);

    if (isPass) {
      addXP(100); // 100 XP award for passing quiz
      
      // Issue certificate
      const cert = issueCertificate(courseId, course.title, user?.name || 'Học Viên iStudent');
      setActiveCertificate(cert);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswers(new Array(questions.length).fill(-1));
    setIsFinished(false);
    setTimeRemaining(180);
    setActiveCertificate(null);
    
    // Shuffle again
    const shufAns: string[][] = [];
    const shufCorr: number[] = [];
    questions.forEach((q) => {
      const correctText = q.options[q.correctAnswer];
      const optionsCopy = [...q.options];
      const shuffled = optionsCopy.sort(() => Math.random() - 0.5);
      const newCorrIdx = shuffled.indexOf(correctText);
      shufAns.push(shuffled);
      shufCorr.push(newCorrIdx);
    });
    setShuffledAnswers(shufAns);
    setShuffledCorrectIndices(shufCorr);
  };

  const printCertificate = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6 print:py-0">
      {/* Back button */}
      {!isFinished && (
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group print:hidden"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Hủy bài kiểm tra
        </button>
      )}

      {/* Main View */}
      {!isFinished ? (
        /* Quiz Form */
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h1 className="text-lg font-bold text-foreground">Bài kiểm tra cuối khóa</h1>
              <p className="text-2xs text-muted-foreground mt-0.5">{course.title}</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 text-xs font-bold text-amber-500">
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          </div>

          {/* Question Index Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-2xs font-semibold text-muted-foreground">
              <span>Câu hỏi {currentIdx + 1} / {questions.length}</span>
              <span>Đạt từ 80% trở lên để nhận chứng nhận</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Content */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm sm:text-base font-bold text-foreground leading-snug">
              {questions[currentIdx]?.question}
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {shuffledAnswers[currentIdx]?.map((option, idx) => {
                const isSelected = selectedAnswers[currentIdx] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`flex items-center w-full rounded-2xl border p-4 text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border bg-card/60 hover:bg-muted text-foreground'
                    }`}
                  >
                    <span className={`mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-xl border text-xs ${
                      isSelected ? 'border-primary bg-primary text-white font-bold' : 'border-border'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nav buttons */}
          <div className="flex justify-between pt-4 border-t border-border/40">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="rounded-xl border border-border px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted disabled:opacity-40 transition-colors"
            >
              Câu trước
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx(prev => prev + 1)}
                disabled={selectedAnswers[currentIdx] === -1}
                className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/10 hover:bg-primary/95 disabled:opacity-40 transition-all"
              >
                Tiếp theo
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={selectedAnswers.includes(-1)}
                className="rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/10 hover:bg-emerald-600 disabled:opacity-40 transition-all"
              >
                Nộp bài thi
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Finished & Results presentation */
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Main Results Panel */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl text-center space-y-6 print:hidden">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-muted">
              {score >= 80 ? (
                <CheckCircle className="h-10 w-10 text-emerald-500" />
              ) : (
                <XCircle className="h-10 w-10 text-destructive" />
              )}
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-extrabold text-foreground">
                Kết quả kiểm tra: {score}%
              </h1>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                {score >= 80 
                  ? 'Chúc mừng bạn đã vượt qua bài kiểm tra xuất sắc và nhận được chứng nhận học tập từ iStudent!'
                  : 'Rất tiếc, bạn cần đạt từ 80% trở lên để vượt qua kỳ thi và nhận chứng chỉ. Đừng nản lòng, hãy ôn lại kiến thức và thử sức lại nhé!'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleRestart}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted transition-all active:scale-95"
              >
                <RefreshCw className="h-4 w-4" />
                Kiểm tra lại
              </button>
              
              <Link
                href={`/learn/${courseId}/${course.syllabus[0]?.lessonIds[0] || 'quiz'}`}
                className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-primary/95 transition-all"
              >
                Quay lại học tiếp
              </Link>
            </div>
          </div>

          {/* Certificate Generation Area */}
          {activeCertificate && (
            <div className="space-y-6">
              {/* Desktop view certificate */}
              <div 
                id="certificate-print"
                className="relative mx-auto max-w-3xl rounded-3xl border-8 border-double border-primary/20 bg-card p-8 sm:p-12 shadow-2xl text-center space-y-8 overflow-hidden aspect-[1.414/1] flex flex-col justify-between print:border-8 print:border-double print:shadow-none print:p-8"
              >
                {/* Visual Borders & Accents */}
                <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-primary/45 rounded-tl-2xl print:hidden" />
                <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-primary/45 rounded-tr-2xl print:hidden" />
                <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-primary/45 rounded-bl-2xl print:hidden" />
                <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-primary/45 rounded-br-2xl print:hidden" />
                <div className="absolute inset-4 border border-border/60 rounded-2xl pointer-events-none" />

                {/* Header Logo */}
                <div className="flex flex-col items-center space-y-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-extrabold shadow shadow-primary/10">
                    <span>i</span>
                  </div>
                  <span className="text-xs font-black tracking-widest text-primary uppercase mt-1">iStudent Foundation</span>
                </div>

                {/* Main Content */}
                <div className="space-y-4">
                  <span className="text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase">Chứng nhận tốt nghiệp</span>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground max-w-md mx-auto leading-snug">
                    {activeCertificate.studentName}
                  </h2>
                  <p className="text-[11px] text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Đã hoàn thành xuất sắc các bài học, bài thực hành và kiểm tra trắc nghiệm chuyên sâu của khóa học trực tuyến:
                  </p>
                  <h3 className="text-sm sm:text-base font-extrabold text-primary max-w-lg mx-auto">
                    {activeCertificate.courseTitle}
                  </h3>
                </div>

                {/* Signatures & Verification */}
                <div className="grid grid-cols-3 gap-4 items-end pt-4">
                  {/* Date issued */}
                  <div className="text-left space-y-1">
                    <span className="text-[9px] text-muted-foreground block border-b border-border pb-1">Ngày cấp</span>
                    <span className="text-3xs font-semibold text-foreground">{activeCertificate.date}</span>
                  </div>

                  {/* QR code mock */}
                  <div className="flex flex-col items-center space-y-1">
                    <svg className="h-14 w-14 border border-border/80 p-1 bg-white rounded-lg shadow-sm" viewBox="0 0 100 100" aria-hidden="true">
                      {/* Fake pixelated QR code */}
                      <rect x="10" y="10" width="20" height="20" fill="black" />
                      <rect x="15" y="15" width="10" height="10" fill="white" />
                      <rect x="70" y="10" width="20" height="20" fill="black" />
                      <rect x="75" y="15" width="10" height="10" fill="white" />
                      <rect x="10" y="70" width="20" height="20" fill="black" />
                      <rect x="15" y="75" width="10" height="10" fill="white" />
                      {/* Random pixels */}
                      <rect x="40" y="20" width="10" height="10" fill="black" />
                      <rect x="50" y="40" width="10" height="10" fill="black" />
                      <rect x="30" y="50" width="20" height="10" fill="black" />
                      <rect x="60" y="70" width="10" height="20" fill="black" />
                      <rect x="80" y="50" width="10" height="10" fill="black" />
                    </svg>
                    <span className="text-[7px] text-muted-foreground font-mono">{activeCertificate.verifyCode}</span>
                  </div>

                  {/* Representative signature */}
                  <div className="text-right space-y-1">
                    <span className="text-[9px] text-muted-foreground block border-b border-border pb-1">Đại diện iStudent</span>
                    <span className="text-3xs font-semibold text-primary font-serif italic">iStudent Team</span>
                  </div>
                </div>
              </div>

              {/* Actions for certificate */}
              <div className="flex justify-center print:hidden">
                <button
                  onClick={printCertificate}
                  className="flex items-center gap-1.5 rounded-2xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/95 active:scale-95 transition-all"
                >
                  <Download className="h-4 w-4" />
                  Tải chứng chỉ (PDF) / In ấn
                </button>
              </div>
            </div>
          )}

          {/* Question Review Section (Self Explanations) */}
          <div className="space-y-4 print:hidden">
            <h2 className="text-base font-bold text-foreground">Xem lại đáp án câu hỏi</h2>
            <div className="space-y-4">
              {questions.map((q, idx) => {
                const userAns = selectedAnswers[idx];
                const corrAns = shuffledCorrectIndices[idx];
                const isCorrect = userAns === corrAns;

                return (
                  <div 
                    key={q.id}
                    className={`rounded-2xl border p-5 space-y-3 bg-card/80 ${
                      isCorrect ? 'border-emerald-500/20' : 'border-destructive/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xs sm:text-sm font-bold text-foreground leading-snug">
                        Câu {idx + 1}: {q.question}
                      </h3>
                      {isCorrect ? (
                        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-3xs font-semibold text-emerald-500 shrink-0">
                          Đúng
                        </span>
                      ) : (
                        <span className="rounded-full bg-destructive/10 border border-destructive/20 px-2.5 py-0.5 text-3xs font-semibold text-destructive shrink-0">
                          Sai
                        </span>
                      )}
                    </div>

                    {/* Options status */}
                    <div className="space-y-2 text-xs">
                      {shuffledAnswers[idx].map((option, optIdx) => {
                        const isSelected = userAns === optIdx;
                        const isRight = corrAns === optIdx;

                        let optionStyle = 'border-border';
                        if (isSelected) optionStyle = 'border-destructive bg-destructive/5 text-destructive';
                        if (isRight) optionStyle = 'border-emerald-500 bg-emerald-500/5 text-emerald-500';

                        return (
                          <div 
                            key={optIdx}
                            className={`flex items-center rounded-xl border p-3 font-semibold ${optionStyle}`}
                          >
                            <span className={`mr-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border text-3xs ${
                              isRight 
                                ? 'border-emerald-500 bg-emerald-500 text-white font-bold' 
                                : isSelected 
                                ? 'border-destructive bg-destructive text-white font-bold' 
                                : 'border-border'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            {option}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="rounded-xl bg-muted/60 p-3.5 text-xs text-muted-foreground leading-relaxed border border-border/50">
                      <span className="font-bold text-foreground block mb-1">💡 Giải thích đáp án:</span>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
