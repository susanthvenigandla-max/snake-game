/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Layout } from 'lucide-react';
import { DUMMY_TRACKS } from '../constants';

interface MusicPlayerProps {
  currentTrackIndex: number;
  setCurrentTrackIndex: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  currentTrackIndex, 
  setCurrentTrackIndex, 
  isPlaying, 
  setIsPlaying 
}) => {
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((currentTrackIndex + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((currentTrackIndex - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [currentTrackIndex, isPlaying, setIsPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    };

    const handleEnded = () => nextTrack();

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  return (
    <footer className="h-24 bg-black border-t-2 border-[#00ffff] flex items-center px-8 gap-12 shrink-0 z-50 overflow-hidden relative glitch-border">
      <div className="absolute inset-0 bg-[#00ffff]/5 pointer-events-none" />
      
      {/* Now Playing */}
      <div className="w-64 flex items-center gap-4 shrink-0 z-10">
        <div className="w-12 h-12 bg-black border border-[#00ffff] shrink-0 flex items-center justify-center text-[#ff00ff] overflow-hidden relative">
          <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all" />
          <div className="absolute inset-x-0 bottom-0 h-1 bg-[#ff00ff] animate-pulse" />
        </div>
        <div className="overflow-hidden">
          <div className="text-[10px] font-black truncate text-white uppercase tracking-tight glitch-text">
            {currentTrack.title}
          </div>
          <div className="text-[8px] text-[#ff00ff] uppercase tracking-tighter truncate font-mono mt-1">
             AI_GEN:: {currentTrack.artist}
          </div>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex-1 flex flex-col items-center gap-2 z-10">
        <div className="flex items-center gap-8">
          <button 
            onClick={prevTrack}
            className="text-[#00ffff] hover:text-[#ff00ff] transition-colors p-2"
            id="prev-track"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          <button
            onClick={togglePlay}
            className="w-14 h-14 bg-[#00ffff] text-black border-2 border-white flex items-center justify-center hover:bg-[#ff00ff] transition-all active:scale-90 shadow-[0_0_15px_#00ffff]"
            id="play-pause"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </button>
          <button 
            onClick={nextTrack}
            className="text-[#00ffff] hover:text-[#ff00ff] transition-colors p-2"
            id="next-track"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>
        <div className="w-full max-w-xl flex items-center gap-3">
          <span className="text-[8px] font-mono text-[#00ffff] w-12 text-right">
            {Math.floor((audioRef.current?.currentTime || 0) / 60)}:
            {Math.floor((audioRef.current?.currentTime || 0) % 60).toString().padStart(2, '0')}
          </span>
          <div className="flex-1 h-2 bg-gray-900 border border-[#00ffff]/30 relative">
            <motion.div 
              className="absolute left-0 top-0 h-full bg-[#ff00ff] shadow-[0_0_10px_#ff00ff]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[8px] font-mono text-[#00ffff] w-12">03:30</span>
        </div>
      </div>

      {/* Volume/Misc */}
      <div className="w-64 flex justify-end items-center gap-6 shrink-0 z-10">
        <div className="flex items-center gap-2 w-32">
          <Volume2 className="w-4 h-4 text-[#00ffff]" />
          <div className="flex-1 h-1 bg-gray-900 border border-[#00ffff]/30 relative">
            <div className="w-3/4 h-full bg-[#ff00ff]"></div>
            <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border border-black" />
          </div>
        </div>
        <div className="text-[#00ffff] hover:text-[#ff00ff] cursor-pointer transition-colors p-1 border border-transparent hover:border-[#ff00ff]">
          <Layout className="w-5 h-5" />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        preload="auto"
      />
    </footer>
  );
};
