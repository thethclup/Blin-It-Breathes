import { create } from 'zustand';

export type GameScreen = 'title' | 'sanctuary' | 'game' | 'result' | 'leaderboard';

interface GameState {
  screen: GameScreen;
  harmony: number; // 0 to 100
  sessionDuration: number; // in seconds
  isPlaying: boolean;

  setScreen: (screen: GameScreen) => void;
  setHarmony: (harmony: number | ((prev: number) => number)) => void;
  setSessionDuration: (time: number | ((prev: number) => number)) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  screen: 'title',
  harmony: 50,
  sessionDuration: 0,
  isPlaying: false,

  setScreen: (screen) => set({ screen }),
  setHarmony: (harmony) => set((state) => ({
    harmony: Math.max(0, Math.min(100, typeof harmony === 'function' ? harmony(state.harmony) : harmony))
  })),
  setSessionDuration: (time) => set((state) => ({
    sessionDuration: typeof time === 'function' ? time(state.sessionDuration) : time
  })),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  resetGame: () => set({ harmony: 50, sessionDuration: 0, isPlaying: false })
}));

