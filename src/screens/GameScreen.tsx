import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../store/gameStore';

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;

  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5 + 0.2;
    this.size = Math.random() * 2 + 1;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.phase = Math.random() * Math.PI * 2;
  }

  update(dt: number, breathingStage: number) {
    this.x += this.vx;
    this.y -= this.vy * (1 + breathingStage * 2);
    this.phase += dt * 2;

    if (this.y < 0) this.y = window.innerHeight;
    if (this.y > window.innerHeight) this.y = 0;
    if (this.x < 0) this.x = window.innerWidth;
    if (this.x > window.innerWidth) this.x = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgba(190, 227, 248, ${this.alpha + Math.sin(this.phase)*0.1})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = Math.random() * 100 + 150;
    this.alpha = 0.8;
  }

  update(dt: number) {
    this.radius += 100 * dt;
    this.alpha -= 0.5 * dt;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0) return;
    ctx.strokeStyle = `rgba(246, 224, 94, ${this.alpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export default function GameScreen() {
  const { harmony, setHarmony, setScreen, setSessionDuration, sessionDuration } = useGameStore();
  const [isBreathingIn, setIsBreathingIn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const breathingVal = useRef(0);
  const ripples = useRef<Ripple[]>([]);
  const particles = useRef<Particle[]>([]);

  const requestRef = useRef<number>(null!);
  const lastTime = useRef<number>(performance.now());
  const downTime = useRef<number>(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsBreathingIn(true);
    downTime.current = performance.now();
    if ('vibrate' in navigator) navigator.vibrate(10);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsBreathingIn(false);
    const upTime = performance.now();
    const duration = upTime - downTime.current;

    if (duration < 300) {
       ripples.current.push(new Ripple(e.clientX, e.clientY));
       if ('vibrate' in navigator) navigator.vibrate([15, 30, 15]);
       setHarmony(prev => prev + 5);
    } else {
       if ('vibrate' in navigator) navigator.vibrate(10);
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      particles.current = Array.from({length: 50}).map(() => new Particle(w, h));
    }

    const loop = (time: number) => {
      const dt = (time - lastTime.current) / 1000;
      lastTime.current = time;

      setSessionDuration((prev) => prev + dt);

      if (isBreathingIn) {
        breathingVal.current = Math.min(1, breathingVal.current + dt * 0.5);
        setHarmony(prev => prev - 1 * dt);
      } else {
        breathingVal.current = Math.max(0, breathingVal.current - dt * 0.4);
        setHarmony(prev => prev + 2 * dt);
      }

      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && canvasRef.current) {
        const w = canvasRef.current.width;
        const h = canvasRef.current.height;

        ctx.fillStyle = `rgba(11, 15, 25, 0.3)`;
        ctx.fillRect(0, 0, w, h);

        const cx = w/2;
        const cy = h/2;
        const radius = 50 + breathingVal.current * 80 + Math.sin(time/500)*5;

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 2);
        gradient.addColorStop(0, `rgba(190, 227, 248, ${0.4 + breathingVal.current*0.4})`);
        gradient.addColorStop(1, 'rgba(11, 15, 25, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, ${0.8 + breathingVal.current*0.2})`;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        particles.current.forEach(p => {
          p.update(dt, breathingVal.current);
          p.draw(ctx);
        });

        ripples.current = ripples.current.filter(r => r.alpha > 0);
        ripples.current.forEach(r => {
          r.update(dt);
          r.draw(ctx);
        });
      }

      if (harmony <= 0 || sessionDuration > 300) {
        setScreen('result');
        return;
      }

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isBreathingIn, harmony, setHarmony, setScreen, setSessionDuration, sessionDuration]);

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

  const themeClass = harmony > 80 ? 'hue-rotate-15 saturate-150' : harmony < 30 ? 'grayscale opacity-70' : '';

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      <canvas
        ref={canvasRef}
        className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-1000 ${themeClass}`}
      />

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-30 p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="w-1/3">
            <p className="text-[#90CDF4] font-mono text-[10px] mb-2 uppercase tracking-[0.2em] opacity-70">Inner Harmony</p>
            <div className="h-1 w-full bg-white/10 relative rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#90CDF4] to-[#F6E05E] transition-all duration-300"
                style={{ width: `${harmony}%` }}
              />
            </div>
          </div>
          <div className="text-right">
             <p className="text-[#90CDF4] font-mono text-[10px] uppercase tracking-[0.2em] opacity-70">Session Time</p>
             <p className="text-white font-mono text-lg">{Math.floor(sessionDuration)}s</p>
          </div>
        </div>

        <div className="text-center opacity-50 select-none">
           <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#BEE3F8]">
             {isBreathingIn ? 'Release to exhale gently' : 'Hold to inhale deep, tap to blink'}
           </p>
        </div>
      </div>
    </div>
  );
}
