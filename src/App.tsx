/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { DUMMY_TRACKS } from './constants';
import { motion } from 'motion/react';
import { Terminal, Database, Activity, Wifi, ShieldAlert } from 'lucide-react';

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  return (
    <div className="h-screen bg-black text-[#00ffff] font-sans flex flex-col relative overflow-hidden selection:bg-[#ff00ff] selection:text-black">
      {/* GLITCH OVERLAYS */}
      <div className="absolute inset-0 pointer-events-none z-50">
        <div className="scanline" />
        <div className="absolute inset-0 bg-black opacity-10 animate-pulse pointer-events-none" />
      </div>

      {/* HEADER: SYSTEM STATUS */}
      <header className="h-16 border-b-2 border-[#00ffff] flex items-center justify-between px-8 bg-black z-20 glitch-border relative">
        <div className="flex items-center gap-4">
          <Activity className="w-6 h-6 animate-pulse text-[#ff00ff]" />
          <h1 className="text-2xl font-bold tracking-[0.2em] glitch-text uppercase">
            SNAKE_CORE.exe
          </h1>
        </div>
        <div className="hidden md:flex gap-10 text-[10px] items-center">
          <div className="flex items-center gap-2">
            <Wifi className="w-3 h-3 text-[#ff00ff]" />
            <span className="animate-[flicker_1s_infinite]">UP_LINK: ACTIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-3 h-3 text-[#ffff00]" />
            <span>THREAT_LEVEL: OMNI</span>
          </div>
          <div className="bg-[#00ffff] text-black px-2 py-0.5 font-bold">
            USER: GUEST_09
          </div>
        </div>
      </header>

      <main className="flex-1 flex p-4 gap-4 overflow-hidden z-10">
        {/* LEFT: NEURAL FLOW */}
        <aside className="w-64 bg-black border-2 border-[#00ffff] p-4 flex flex-col gap-4 glitch-border">
          <div className="flex items-center gap-2 border-b border-[#00ffff] pb-2">
            <Database className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">AUDIO_BUFFER</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
            {DUMMY_TRACKS.map((track, idx) => (
              <motion.div
                key={track.id}
                onClick={() => handleTrackSelect(idx)}
                whileHover={{ scale: 1.02 }}
                className={`p-3 border cursor-pointer transition-all ${
                  currentTrackIndex === idx 
                    ? 'bg-[#ff00ff] border-white text-black font-bold scale-[1.02]' 
                    : 'border-[#00ffff] hover:bg-[#00ffff]/10 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="text-[10px] truncate uppercase tracking-tighter">
                  {track.title}
                </div>
                <div className={`text-[8px] mt-1 font-mono ${currentTrackIndex === idx ? 'text-black' : 'text-[#ff00ff]'}`}>
                  {track.artist}
                </div>
              </motion.div>
            ))}
          </div>
          {/* SYSTEM LOG */}
          <div className="mt-4 border-t border-[#00ffff] pt-4 flex flex-col gap-2">
            <div className="text-[8px] font-mono text-gray-500 uppercase">System_Log:</div>
            <div className="text-[8px] font-mono text-[#ffff00] animate-pulse">
              {">"} STREAM_SYNC_COMPLETE
              <br />
              {">"} CORE_LOAD_98.2%
            </div>
          </div>
        </aside>

        {/* CENTER: EXECUTION_WINDOW */}
        <section className="flex-1 flex flex-col gap-4 relative overflow-hidden">
          <div className="bg-[#00ffff]/5 border-2 border-[#00ffff] flex-1 flex flex-col items-center justify-center relative glitch-border p-4">
            <div className="absolute top-4 left-6 flex items-end gap-6 z-20">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold tracking-[0.3em]">POINTS:</span>
                <span className="text-4xl font-bold glitch-text text-[#ff00ff] leading-none">{score.toString().padStart(4, '0')}</span>
              </div>
              <div className="w-[2px] h-10 bg-[#00ffff] skew-x-12 opacity-50"></div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold tracking-[0.3em] text-[#ffff00]">PEAK:</span>
                <span className="text-3xl font-bold text-[#00ffff] leading-none">{highScore.toString().padStart(4, '0')}</span>
              </div>
            </div>

            <div className="screen-tear relative bg-black shadow-[0_0_40px_rgba(255,0,255,0.2)]">
               <SnakeGame onScoreUpdate={setScore} onHighScoreUpdate={setHighScore} />
            </div>

            <div className="absolute bottom-6 flex gap-10 text-[8px] font-bold tracking-[0.5em] text-[#00ffff]/50 uppercase">
              <span>WASD_CONTROL</span>
              <span className="animate-pulse">_SESSION_ACTIVE_</span>
              <span>SPACE_RESET</span>
            </div>
          </div>
        </section>

        {/* RIGHT: ANALYTICS */}
        <aside className="w-56 flex flex-col gap-4">
          <div className="flex-1 bg-black border-2 border-[#ff00ff] p-4 flex flex-col gap-4 glitch-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#ff00ff]/5 to-transparent pointer-events-none" />
            <div className="flex items-center gap-2 border-b border-[#ff00ff] pb-2 text-[#ff00ff]">
              <Terminal className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">DATA_SPECTRE</span>
            </div>
            
            <div className="flex-1 flex gap-1 items-end">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    height: isPlaying ? [`${Math.random() * 90 + 5}%`, `${Math.random() * 90 + 5}%`, `${Math.random() * 90 + 5}%`] : '10%'
                  }}
                  transition={{ duration: 0.1, repeat: Infinity }}
                  className="flex-1 bg-[#ff00ff]"
                />
              ))}
            </div>

            <div className="space-y-3 font-mono text-[8px] text-[#00ffff]">
              <div className="flex justify-between">
                <span>FREQ_BIAS:</span>
                <span className="text-[#ff00ff]">942.2p</span>
              </div>
              <div className="flex justify-between">
                <span>VOLT_DROP:</span>
                <span className="text-[#ffff00]">CRITICAL</span>
              </div>
            </div>
          </div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="h-28 bg-[#ff00ff] text-black p-4 flex flex-col justify-center border-4 border-white cursor-help relative group"
          >
            <div className="text-[14px] font-black italic tracking-tighter leading-none mb-1">PRO_OVERRIDE</div>
            <p className="text-[8px] font-bold leading-tight uppercase">Bypass restriction. Access raw kernel data.</p>
            <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-black group-hover:scale-150 transition-transform" />
          </motion.div>
        </aside>
      </main>

      <MusicPlayer 
        currentTrackIndex={currentTrackIndex}
        setCurrentTrackIndex={setCurrentTrackIndex}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />
    </div>
  );
}
