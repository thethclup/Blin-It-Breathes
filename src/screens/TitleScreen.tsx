import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../store/gameStore';
import { Eye, EyeOff } from 'lucide-react';

export default function TitleScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
      className="flex flex-col items-center justify-center w-full h-screen relative bg-black"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none scale-150 blur-sm">
        {blink ? <EyeOff size={200} color="red" /> : <Eye size={200} color="white" />}
      </div>

      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 2 }}
        className="text-5xl md:text-7xl font-serif text-white tracking-widest uppercase text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] z-10"
      >
        Blink &<br/><span className="text-gray-500">It Breathes</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 2 }}
        className="mt-6 text-sm md:text-base font-mono tracking-widest text-gray-400 z-10"
      >
        TAP AND HOLD TO KEEP YOUR EYES OPEN.
      </motion.p>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
        onClick={() => setScreen('saferoom')}
        className="mt-16 px-8 py-3 border border-white/20 text-white font-mono tracking-[0.2em] uppercase text-xs hover:bg-white hover:text-black transition-all duration-500 z-10 rounded-none shadow-[0_0_15px_rgba(255,255,255,0.1)]"
      >
        Enter The Shadows
      </motion.button>
      
      <div className="absolute bottom-8 right-8 text-[10px] font-mono text-gray-600 tracking-widest z-10">
        On-Chain Survival / Base Mainnet
      </div>
    </motion.div>
  );
}
