import { AnimatePresence } from 'motion/react';
import { useGameStore } from './store/gameStore';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { Sun } from 'lucide-react';

import TitleScreen from './screens/TitleScreen';
import Saferoom from './screens/Saferoom';
import GameScreen from './screens/GameScreen';
import ResultScreen from './screens/ResultScreen';

export default function App() {
  const { screen } = useGameStore();
  const { isConnected, address } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const sendGMTransaction = () => {
    if (!address) return;
    const gmData = "0x" + Array.from(new TextEncoder().encode("GM"))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    sendTransaction({
      to: '0xc35B9997B63B1CE14f8F513f7eddD9a7ABbB33d7',
      data: gmData as `0x${string}`,
      value: parseEther('0'),
    });
  };

  return (
    <main className="w-full h-screen bg-[#0B0F19] overflow-hidden relative">
      <AnimatePresence mode="wait">
        {screen === 'title' && <TitleScreen key="title" />}
        {screen === 'sanctuary' && <Saferoom key="sanctuary" />}
        {screen === 'game' && <GameScreen key="game" />}
        {screen === 'result' && <ResultScreen key="result" />}
      </AnimatePresence>

      {isConnected && (
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={sendGMTransaction}
            className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold shadow-lg shadow-[#E8A020]/10 backdrop-blur-md"
          >
            <Sun size={14} />
            Say GM
          </button>
        </div>
      )}
    </main>
  );
}

