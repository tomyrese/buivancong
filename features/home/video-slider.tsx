'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, ArrowLeft, ArrowRight } from 'lucide-react';

interface VideoItem {
  id: number;
  url: string;
}

const videosData: VideoItem[] = [
  { id: 1, url: '/videos/1.mp4' },
  { id: 2, url: '/videos/2.mp4' },
  { id: 3, url: '/videos/3.mp4' },
  { id: 4, url: '/videos/4.mp4' },
  { id: 5, url: '/videos/5.mp4' },
];

export default function VideoSlider() {
  const [playingId, setPlayingId] = React.useState<number | null>(null);
  const [muted, setMuted] = React.useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const videoRefs = React.useRef<{ [key: number]: HTMLVideoElement | null }>({});

  const handlePlayToggle = (id: number) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (playingId === id) {
      video.pause();
      setPlayingId(null);
    } else {
      if (playingId !== null) {
        const currentVideo = videoRefs.current[playingId];
        if (currentVideo) currentVideo.pause();
      }
      video.play().catch(err => console.log('Video play interrupted:', err));
      setPlayingId(id);
    }
  };

  const toggleMute = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const video = videoRefs.current[id];
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleMouseEnter = (id: number) => {
    const video = videoRefs.current[id];
    if (!video) return;
    
    if (playingId !== null && playingId !== id) {
      const currentVideo = videoRefs.current[playingId];
      if (currentVideo) currentVideo.pause();
    }

    video.play().catch(() => {});
    setPlayingId(id);
  };

  const handleMouseLeave = (id: number) => {
    const video = videoRefs.current[id];
    if (!video) return;
    video.pause();
    if (playingId === id) {
      setPlayingId(null);
    }
  };

  return (
    <section className="relative py-10 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-border/40 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl text-left">
            <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              Kho Video bài giảng ngắn
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Xem ngay các bài giảng ngắn, mẹo ôn thi và hướng dẫn thực hành của thầy Bùi Văn Công.
            </p>
          </div>

          <a
            href="https://www.tiktok.com/@dgnlhcm.thaybuivancong"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-5 py-3 text-xs font-semibold text-foreground shadow-sm hover:bg-slate-50 active:scale-[0.98] transition-all hover:border-slate-300 w-fit shrink-0"
          >
            <svg className="h-4 w-4 text-foreground fill-current" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
            </svg>
            Kênh TikTok của Thầy
          </a>
        </div>

        {/* Video Slider Container with relative arrow overlays */}
        <div className="relative group/slider px-2 sm:px-4">
          {/* Video Slider Wrapper */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory touch-pan-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {videosData.map((video) => {
              const isPlaying = playingId === video.id;
              return (
                <motion.div
                  key={video.id}
                  className="flex-shrink-0 w-[240px] sm:w-[280px] snap-start relative group rounded-2xl overflow-hidden border border-border bg-black shadow-lg aspect-[9/16] transition-transform duration-300 hover:shadow-xl cursor-pointer"
                  whileHover={{ y: -4 }}
                  onClick={() => handlePlayToggle(video.id)}
                  onMouseEnter={() => handleMouseEnter(video.id)}
                  onMouseLeave={() => handleMouseLeave(video.id)}
                >
                  {/* Video Tag */}
                  <video
                    ref={(el) => {
                      videoRefs.current[video.id] = el;
                    }}
                    src={video.url}
                    loop
                    muted={muted}
                    playsInline
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                  />

                  {/* Hover Play Button Glow */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: isPlaying ? 1.1 : 1, opacity: isPlaying ? 0 : 0.85 }}
                      transition={{ duration: 0.2 }}
                      className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-md group-hover:scale-105 transition-transform"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5 text-white fill-white" />
                      ) : (
                        <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                      )}
                    </motion.div>
                  </div>

                  {/* Volume Mute Controller Overlay */}
                  <div className="absolute bottom-4 right-4 z-10">
                    <button
                      onClick={(e) => toggleMute(e, video.id)}
                      className="rounded-full bg-black/60 backdrop-blur-md p-2 hover:bg-black/80 border border-white/10 text-white transition-colors"
                      title={muted ? 'Unmute' : 'Mute'}
                    >
                      {muted ? (
                        <VolumeX className="h-4 w-4 text-white" />
                      ) : (
                        <Volume2 className="h-4 w-4 text-white" />
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Absolute Left Navigation Arrow */}
          <button
            onClick={() => handleScroll('left')}
            className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/95 backdrop-blur-md text-foreground hover:bg-white hover:scale-105 transition-all shadow-lg duration-200"
            aria-label="Scroll left"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {/* Absolute Right Navigation Arrow */}
          <button
            onClick={() => handleScroll('right')}
            className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/95 backdrop-blur-md text-foreground hover:bg-white hover:scale-105 transition-all shadow-lg duration-200"
            aria-label="Scroll right"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
