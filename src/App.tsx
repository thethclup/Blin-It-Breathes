import { AnimatePresence } from 'motion/react';
import { useGameStore } from './store/gameStore';

import TitleScreen from './screens/TitleScreen';
import Saferoom from './screens/Saferoom';
import GameScreen from './screens/GameScreen';
import ResultScreen from './screens/ResultScreen';

export default function App() {
  const { screen } = useGameStore();

  return (
    <main className="w-full h-screen bg-black overflow-hidden relative">
      <AnimatePresence mode="wait">
        {screen === 'title' && <TitleScreen key="title" />}
        {screen === 'saferoom' && <Saferoom key="saferoom" />}
        {screen === 'game' && <GameScreen key="game" />}
        {screen === 'result' && <ResultScreen key="result" />}
      </AnimatePresence>
    </main>
  );
}

