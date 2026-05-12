import { motion } from 'motion/react';
import { useGameStore } from '../store/gameStore';

export default function Saferoom() {
  const { setScreen, resetGame } = useGameStore();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center w-full h-screen bg-[#050510] text-[#B6CABD] p-6 relative"
    >
      <div className="text-center max-w-md z-10">
        <h2 className="text-3xl font-serif mb-6 tracking-widest uppercase border-b border-[#B6CABD]/30 pb-4">The Safe Room</h2>
        
        <div className="text-left font-mono text-xs leading-relaxed space-y-4 text-[#B6CABD]/80">
          <p>You have found a temporary reprieve.</p>
          <p className="text-white">MECHANICS:</p>
          <ul className="list-disc pl-4 space-y-2">
             <li><span className="text-red-400">HOLD</span> the screen to keep your eyes open.</li>
             <li><span className="text-red-400">RELEASE</span> to blink.</li>
             <li>Entities move <span className="underline">only</span> when your eyes are closed.</li>
             <li>Keeping your eyes open too long drains <span className="text-blue-300">Sanity</span>.</li>
             <li>Low sanity causes hallucinations and death.</li>
          </ul>
        </div>

        <button
          onClick={() => {
            resetGame();
            setScreen('game');
          }}
          className="mt-12 px-8 py-4 border border-[#B6CABD]/40 text-[#B6CABD] font-mono tracking-widest text-sm hover:bg-[#B6CABD] hover:text-[#050510] transition-colors duration-300 w-full"
        >
          DESCENT
        </button>
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)]"></div>
    </motion.div>
  );
}
