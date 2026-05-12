import { create } from 'zustand';

export type GameScreen = 'title' | 'saferoom' | 'game' | 'result' | 'leaderboard';

interface GameState {
  screen: GameScreen;
  sanity: number; // 0 to 100
  timeSurvived: number; // in seconds
  isPlaying: boolean;
  
  setScreen: (screen: GameScreen) => void;
  setSanity: (sanity: number | ((prev: number) => number)) => void;
  setTimeSurvived: (time: number | ((prev: number) => number)) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  screen: 'title',
  sanity: 100,
  timeSurvived: 0,
  isPlaying: false,
  
  setScreen: (screen) => set({ screen }),
  setSanity: (sanity) => set((state) => ({ 
    sanity: Math.max(0, Math.min(100, typeof sanity === 'function' ? sanity(state.sanity) : sanity)) 
  })),
  setTimeSurvived: (time) => set((state) => ({
    timeSurvived: typeof time === 'function' ? time(state.timeSurvived) : time
  })),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  resetGame: () => set({ sanity: 100, timeSurvived: 0, isPlaying: false })
}));
