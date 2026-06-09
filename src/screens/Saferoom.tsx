import { motion } from 'motion/react';
import { useGameStore } from '../store/gameStore';

export default function Saferoom() {
  const { setScreen, resetGame } = useGameStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center w-full h-screen bg-[#0B0F19] text-[#E2E8F0] p-6 relative"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl max-h-2xl rounded-full bg-gradient-to-r from-[#2B6CB0]/10 to-[#319795]/10 blur-3xl pointer-events-none" />

      <div className="text-center max-w-md z-10 backdrop-blur-md bg-white/5 p-8 rounded-3xl border border-white/10 shadow-2xl">
        <h2 className="text-2xl font-serif mb-6 tracking-[0.2em] uppercase text-[#90CDF4]">The Sanctuary</h2>

        <div className="text-left font-mono text-xs leading-relaxed space-y-6 text-[#CBD5E0]">
          <p className="text-center italic text-[#A0AEC0]">Find your center before the journey.</p>
          <div className="space-y-4">
             <p><span className="text-[#63B3ED] font-bold">HOLD</span> the screen to slowly inhale and draw energy.</p>
             <p><span className="text-[#63B3ED] font-bold">RELEASE</span> to exhale and bring calm to the world.</p>
             <p><span className="text-[#F6E05E] font-bold">TAP (BLINK)</span> at the peak of exhalation to create Harmony Ripples.</p>
             <p>Guide the luminous creature. Sync your rhythm to maintain <span className="text-[#9AE6B4]">Harmony</span>.</p>
          </div>
        </div>

        <button
          onClick={() => {
            resetGame();
            setScreen('game');
          }}
          className="mt-12 px-10 py-4 bg-gradient-to-r from-[#2B6CB0]/20 to-[#319795]/20 border border-[#BEE3F8]/30 text-[#BEE3F8] font-mono tracking-widest text-xs hover:bg-[#BEE3F8]/20 transition-all duration-500 rounded-full w-full"
        >
          BEGIN SESSION
        </button>
      </div>
    </motion.div>
  );
}
