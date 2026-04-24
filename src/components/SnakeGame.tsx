/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Direction, Point } from '../types';
import { GRID_SIZE, CELL_SIZE, INITIAL_SNAKE_SPEED, MIN_SNAKE_SPEED, SPEED_INCREMENT } from '../constants';
import { Trophy, RotateCcw, Play } from 'lucide-react';

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
  onHighScoreUpdate: (highScore: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreUpdate, onHighScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>(Direction.RIGHT);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SNAKE_SPEED);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection(Direction.RIGHT);
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreUpdate(0);
    setSpeed(INITIAL_SNAKE_SPEED);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case Direction.UP: newHead.y -= 1; break;
        case Direction.DOWN: newHead.y += 1; break;
        case Direction.LEFT: newHead.x -= 1; break;
        case Direction.RIGHT: newHead.x += 1; break;
      }

      // Check collision
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          onScoreUpdate(newScore);
          if (newScore > highScore) {
            setHighScore(newScore);
            onHighScoreUpdate(newScore);
          }
          return newScore;
        });
        setFood(generateFood(newSnake));
        setSpeed(prevSpeed => Math.max(MIN_SNAKE_SPEED, prevSpeed - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood, highScore, isGameOver, isPaused, onScoreUpdate, onHighScoreUpdate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': if (direction !== Direction.DOWN) setDirection(Direction.UP); break;
        case 'ArrowDown': case 's': case 'S': if (direction !== Direction.UP) setDirection(Direction.DOWN); break;
        case 'ArrowLeft': case 'a': case 'A': if (direction !== Direction.RIGHT) setDirection(Direction.LEFT); break;
        case 'ArrowRight': case 'd': case 'D': if (direction !== Direction.LEFT) setDirection(Direction.RIGHT); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [moveSnake, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Minimal Pixel Style)
    ctx.strokeStyle = '#00ffff11';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw Food (RAW MAGENTA)
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(
      food.x * CELL_SIZE + 2,
      food.y * CELL_SIZE + 2,
      CELL_SIZE - 4,
      CELL_SIZE - 4
    );

    // Draw Snake (RAW CYAN)
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00ffff' : '#00ffff99';
      ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
      // Glitch detail: random pixels on head
      if (index === 0 && Math.random() > 0.8) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, 4, 4);
      }
    });

  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Game Board */}
      <div className="relative p-1 border-4 border-[#00ffff] bg-black glitch-border group transition-all duration-100 shadow-[0_0_20px_#00ffff]">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="bg-black block"
          id="snake-canvas"
        />
        
        {/* Overlays */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
            >
              {isGameOver ? (
                <div className="text-center space-y-6 p-4 border-2 border-[#ff00ff] bg-black glitch-border">
                  <h2 className="text-2xl font-bold text-[#ff00ff] uppercase italic tracking-tighter glitch-text">
                    KERNEL_PANIC: CRASH
                  </h2>
                  <p className="text-[#00ffff]/70 font-mono text-[10px] uppercase">
                    Buffer overflow at {score} pts.
                  </p>
                  <button
                    onClick={resetGame}
                    className="px-8 py-3 bg-[#ff00ff] text-black font-black hover:bg-white transiton-colors uppercase tracking-widest text-xs"
                    id="restart-button"
                  >
                    REBOOT_SESSION
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <h2 className="text-3xl font-bold text-[#00ffff] uppercase glitch-text">
                    IDLE_MODE
                  </h2>
                  <div 
                    onClick={() => setIsPaused(false)}
                    className="w-20 h-20 border-4 border-[#00ffff] flex items-center justify-center cursor-pointer hover:bg-[#00ffff] hover:text-black transition-all group/play glitch-border"
                  >
                    <Play className="w-10 h-10 fill-current" />
                  </div>
                  <p className="text-[#00ffff]/50 font-mono text-[10px] uppercase tracking-widest animate-pulse">
                    {"//"} Pushing space to cycle
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
