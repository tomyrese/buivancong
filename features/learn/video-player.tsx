'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Settings, 
  Subtitles, 
  Sparkles, 
  Tv 
} from 'lucide-react';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any;

interface VideoPlayerProps {
  url: string;
  subtitles?: { time: string; text: string }[];
  onTimeUpdate?: (seconds: number) => void;
}

export default function VideoPlayer({ url, subtitles = [], onTimeUpdate }: VideoPlayerProps) {
  const [playing, setPlaying] = React.useState(true);
  const [volume, setVolume] = React.useState(0.8);
  const [muted, setMuted] = React.useState(false);
  const [playbackRate, setPlaybackRate] = React.useState(1.0);
  const [playedSeconds, setPlayedSeconds] = React.useState(0);
  const [showSubtitles, setShowSubtitles] = React.useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = React.useState(false);
  const [pip, setPip] = React.useState(false);
  const playerRef = React.useRef<any>(null);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentSubtitle = React.useMemo(() => {
    if (!showSubtitles || subtitles.length === 0) return '';
    
    // Convert time MM:SS to seconds
    const parseTimeToSeconds = (tStr: string) => {
      const parts = tStr.split(':');
      if (parts.length === 2) {
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
      }
      return 0;
    };

    // Find the matching subtitle block
    let activeText = '';
    for (let i = 0; i < subtitles.length; i++) {
      const currentSec = parseTimeToSeconds(subtitles[i].time);
      const nextSec = i + 1 < subtitles.length ? parseTimeToSeconds(subtitles[i + 1].time) : Infinity;
      
      if (playedSeconds >= currentSec && playedSeconds < nextSec) {
        activeText = subtitles[i].text;
        break;
      }
    }
    return activeText;
  }, [playedSeconds, subtitles, showSubtitles]);

  const handleProgress = (state: { playedSeconds: number }) => {
    setPlayedSeconds(state.playedSeconds);
    if (onTimeUpdate) {
      onTimeUpdate(state.playedSeconds);
    }
  };

  const togglePlay = () => setPlaying(!playing);
  const toggleMute = () => setMuted(!muted);
  const toggleSubtitles = () => setShowSubtitles(!showSubtitles);
  const togglePip = () => setPip(!pip);

  const handleFullscreen = () => {
    const playerEl = document.querySelector('.react-player-container');
    if (playerEl) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        playerEl.requestFullscreen();
      }
    }
  };

  const rates = [0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <div className="react-player-container relative w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-xl group/player">
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        muted={muted}
        playbackRate={playbackRate}
        pip={pip}
        onProgress={handleProgress}
        onEnablePIP={() => setPip(true)}
        onDisablePIP={() => setPip(false)}
        config={{
          youtube: {
            playerVars: { 
              controls: 0, 
              modestbranding: 1, 
              rel: 0,
              showinfo: 0,
              iv_load_policy: 3
            }
          }
        }}
      />

      {/* Subtitles Overlay Overlay */}
      {currentSubtitle && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-black/80 border border-white/10 text-white text-xs sm:text-sm text-center max-w-[80%] pointer-events-none select-none z-10 animate-fade-in">
          {currentSubtitle}
        </div>
      )}

      {/* Player Controller Panel (Only visible on hover) */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col justify-end opacity-0 group-hover/player:opacity-100 transition-opacity duration-300 z-20">
        
        {/* Actions bar */}
        <div className="flex items-center justify-between text-white text-xs mt-2">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button onClick={togglePlay} className="hover:text-primary transition-colors cursor-pointer">
              {playing ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white" />}
            </button>

            {/* Mute/Volume */}
            <button onClick={toggleMute} className="hover:text-primary transition-colors cursor-pointer">
              {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>

            {/* Playback time info */}
            <span>
              {formatTime(playedSeconds)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Subtitles toggle */}
            <button 
              onClick={toggleSubtitles} 
              className={`hover:text-primary transition-colors cursor-pointer ${showSubtitles ? 'text-primary' : 'text-white'}`}
              title="Phụ đề"
            >
              <Subtitles className="h-4.5 w-4.5" />
            </button>

            {/* Picture in Picture */}
            <button 
              onClick={togglePip} 
              className="hover:text-primary transition-colors cursor-pointer"
              title="Picture in Picture"
            >
              <Tv className="h-4.5 w-4.5" />
            </button>

            {/* Playback Speed Setting */}
            <div className="relative">
              <button 
                onClick={() => setShowSpeedMenu(!showSpeedMenu)} 
                className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer font-bold"
                title="Tốc độ"
              >
                <Settings className="h-4.5 w-4.5" />
                <span>{playbackRate}x</span>
              </button>

              {showSpeedMenu && (
                <>
                  <div className="fixed inset-0" onClick={() => setShowSpeedMenu(false)} />
                  <div className="absolute right-0 bottom-8 mb-2 w-24 rounded-xl border border-white/10 bg-black/90 p-1.5 shadow-xl text-xs z-30 flex flex-col gap-1 text-center">
                    {rates.map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setPlaybackRate(r);
                          setShowSpeedMenu(false);
                        }}
                        className={`rounded-lg py-1 hover:bg-white/10 transition-colors text-left px-2 cursor-pointer ${
                          playbackRate === r ? 'text-primary font-bold' : 'text-white/80'
                        }`}
                      >
                        {r}x
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Fullscreen toggle */}
            <button onClick={handleFullscreen} className="hover:text-primary transition-colors cursor-pointer">
              <Maximize2 className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
