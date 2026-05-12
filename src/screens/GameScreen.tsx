import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../store/gameStore';

// Simple entity logic
class GameEntity {
  x: number;
  y: number;
  distance: number; // 100 is far, 0 is jumpscare

  constructor() {
    this.distance = 100;
    this.x = Math.random() * 800; // Conceptual internal coordinates
    this.y = Math.random() * 600;
  }

  approach(amount: number) {
    this.distance = Math.max(0, this.distance - amount);
    // Random jitter as it approaches
    this.x += (Math.random() - 0.5) * 50;
    this.y += (Math.random() - 0.5) * 50;
  }
}

export default function GameScreen() {
  const { sanity, setSanity, setScreen, setTimeSurvived, timeSurvived } = useGameStore();
  const [eyesOpen, setEyesOpen] = useState(false);
  const [entities] = useState([new GameEntity()]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game loop stuff
  const requestRef = useRef<number>(null!);
  const lastTime = useRef<number>(performance.now());
  
  // Handlers
  const handlePointerDown = () => {
    setEyesOpen(true);
    if ('vibrate' in navigator) navigator.vibrate(20);
  };
  const handlePointerUp = () => {
    setEyesOpen(false);
    if ('vibrate' in navigator) navigator.vibrate(50);
  };

  useEffect(() => {
    // Only works if window is focused
    const loop = (time: number) => {
      const dt = (time - lastTime.current) / 1000;
      lastTime.current = time;

      // Update time survived
      setTimeSurvived((prev) => prev + dt);

      if (eyesOpen) {
        // Sanity drains while open
        setSanity((prev) => prev - 5 * dt);
        
        // Pushing entities back slowly when staring
        entities.forEach(ent => {
          ent.distance = Math.min(100, ent.distance + 2 * dt);
        });
        
        // Render
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx && canvasRef.current) {
          const w = canvasRef.current.width;
          const h = canvasRef.current.height;
          
          // Clear
          ctx.fillStyle = '#050505';
          ctx.fillRect(0, 0, w, h);
          
          // Draw entities (creepy shapes)
          entities.forEach(ent => {
             const scale = 1 - (ent.distance / 100); // 0 to 1
             const alpha = Math.min(1, scale * 2);
             
             ctx.fillStyle = `rgba(150, 0, 0, ${alpha})`;
             
             // Mapping internal 800x600 to canvas size
             const drawX = (ent.x / 800) * w;
             const drawY = (ent.y / 600) * h;
             const size = 20 + scale * 300; // Gets bigger as it approaches
             
             ctx.beginPath();
             ctx.arc(drawX, drawY, size, 0, Math.PI * 2);
             ctx.fill();
             
             // Scary eyes
             if (ent.distance < 50) {
               ctx.fillStyle = 'white';
               ctx.beginPath();
               ctx.arc(drawX - size/3, drawY - size/4, size/8, 0, Math.PI * 2);
               ctx.arc(drawX + size/3, drawY - size/4, size/8, 0, Math.PI * 2);
               ctx.fill();
             }
          });
        }
      } else {
        // Eyes closed
        // Sanity regains
        setSanity((prev) => prev + 15 * dt);
        
        // Entities move closer while closed!
        entities.forEach(ent => ent.approach(10 * dt));
      }

      // Check death conditions
      if (sanity <= 0) {
        // Die from insanity
        if ('vibrate' in navigator) navigator.vibrate([100, 50, 100, 50, 500]);
        setScreen('result');
        return;
      }
      
      const jumpscared = entities.some(e => e.distance <= 0);
      if (jumpscared) {
        // Die from entity
        if ('vibrate' in navigator) navigator.vibrate([200, 50, 200, 100, 800]);
        setScreen('result');
        return;
      }

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [eyesOpen, entities, sanity, setSanity, setScreen, setTimeSurvived]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine classes for sanity effects
  const sanityClass = sanity < 20 ? 'distortion-high' : sanity < 40 ? 'distortion-medium' : sanity < 60 ? 'distortion-low' : '';

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Canvas */}
      <canvas 
        ref={canvasRef} 
        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-150 ${eyesOpen ? 'opacity-100' : 'opacity-0'} ${sanityClass}`}
      />

      {/* Eyes Closed Black Screen Overlay */}
      <AnimatePresence>
        {!eyesOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute top-0 left-0 w-full h-full bg-black z-20 flex items-center justify-center pointer-events-none"
          >
            <p className="text-white/20 font-serif tracking-[0.5em] text-xs uppercase animate-pulse">Eyes Closed</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-30 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="w-1/3">
            <p className="text-[#B6CABD] font-mono text-[10px] mb-2 uppercase tracking-widest opacity-60">Sanity</p>
            <div className="h-1 w-full bg-white/10 relative">
              <div 
                className="absolute top-0 left-0 h-full bg-[#B6CABD] transition-all duration-300"
                style={{ width: `${sanity}%`, backgroundColor: sanity < 30 ? 'red' : '#B6CABD' }}
              />
            </div>
          </div>
          <div className="text-right">
             <p className="text-[#B6CABD] font-mono text-[10px] uppercase tracking-widest opacity-60">Survived</p>
             <p className="text-white font-mono text-lg">{Math.floor(timeSurvived)}s</p>
          </div>
        </div>

        <div className="text-center opacity-30 user-select-none">
           <p className="font-mono text-xs uppercase tracking-widest text-[#B6CABD]">
             {eyesOpen ? 'Release to Blink' : 'Hold to open eyes'}
           </p>
        </div>
      </div>
      
      {/* Vignette & Noise */}
      <div className="vignette" />
      <div className="noise-overlay" />
    </div>
  );
}
