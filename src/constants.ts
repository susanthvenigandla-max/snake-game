/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Track } from './types';

export const GRID_SIZE = 20;
export const CELL_SIZE = 20;
export const INITIAL_SNAKE_SPEED = 150;
export const MIN_SNAKE_SPEED = 60;
export const SPEED_INCREMENT = 2;

export const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Pulse',
    artist: 'SynthWave AI',
    coverUrl: 'https://picsum.photos/seed/cyberpulse/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder audio
  },
  {
    id: '2',
    title: 'Neon Nights',
    artist: 'Lofi Glitch',
    coverUrl: 'https://picsum.photos/seed/neonnights/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'Glitch Core',
    artist: 'Digital Chaos',
    coverUrl: 'https://picsum.photos/seed/glitchcore/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  }
];
