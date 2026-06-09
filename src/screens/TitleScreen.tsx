import { motion } from 'motion/react';
import { useGameStore } from '../store/gameStore';
import { Wind } from 'lucide-react';

export default function TitleScreen() {
  const setScreen = useGameStore((s) => s.setScreen);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
      className="flex flex-col items-center justify-center w-full h-screen relative bg-[#0B0F19]"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none scale-150 blur-2xl ambient-glow w-[600px] h-[600px] rounded-full mix-blend-screen" />

      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="z-10 mb-8 text-[#BEE3F8]"
      >
        <Wind size={80} strokeWidth={1} />
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 2 }}
        className="text-4xl md:text-6xl font-serif text-[#F0F4F8] tracking-[0.2em] uppercase text-center drop-shadow-[0_0_15px_rgba(190,227,248,0.4)] z-10"
      >
        Blink &<br/><span className="text-[#90CDF4] text-3xl md:text-5xl">It Breathes</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 2 }}
        className="mt-8 text-xs md:text-sm font-mono tracking-[0.3em] text-[#A0AEC0] z-10 uppercase"
      >
        A Journey of Breath and Harmony
      </motion.p>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
        onClick={() => setScreen('sanctuary')}
        className="mt-16 px-8 py-3 border border-[#BEE3F8]/30 text-[#BEE3F8] font-mono tracking-[0.2em] uppercase text-xs hover:bg-[#BEE3F8]/10 transition-all duration-700 z-10 rounded-full backdrop-blur-sm"
      >
        Enter Sanctuary
      </motion.button>

      <div className="absolute bottom-8 right-8 text-[10px] font-mono text-[#4A5568] tracking-widest z-10">
        On-Chain Harmony / Base Mainnet
      </div>
    </motion.div>
  );
}
