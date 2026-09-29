import React from 'react';
import { Zap } from 'lucide-react';

const NUM_STRIPS = 15;
const STAGGER_MS = 24;

// 15 Vibrant Luminous Emerald, Cyan & Mint Jewel-Toned Gradients
const STRIP_COLORS = [
  'linear-gradient(180deg, #022c22 0%, #064e3b 55%, #047857 100%)',
  'linear-gradient(180deg, #064e3b 0%, #047857 55%, #059669 100%)',
  'linear-gradient(180deg, #047857 0%, #059669 55%, #10b981 100%)',
  'linear-gradient(180deg, #059669 0%, #10b981 55%, #34d399 100%)',
  'linear-gradient(180deg, #0f766e 0%, #0d9488 55%, #14b8a6 100%)',
  'linear-gradient(180deg, #0d9488 0%, #14b8a6 55%, #2dd4bf 100%)',
  'linear-gradient(180deg, #047857 0%, #10b981 55%, #6ee7b7 100%)',
  'linear-gradient(180deg, #065f46 0%, #34d399 50%, #047857 100%)', // Center strip (7)
  'linear-gradient(180deg, #047857 0%, #10b981 55%, #6ee7b7 100%)',
  'linear-gradient(180deg, #0d9488 0%, #14b8a6 55%, #2dd4bf 100%)',
  'linear-gradient(180deg, #0f766e 0%, #0d9488 55%, #14b8a6 100%)',
  'linear-gradient(180deg, #059669 0%, #10b981 55%, #34d399 100%)',
  'linear-gradient(180deg, #047857 0%, #059669 55%, #10b981 100%)',
  'linear-gradient(180deg, #064e3b 0%, #047857 55%, #059669 100%)',
  'linear-gradient(180deg, #022c22 0%, #064e3b 55%, #047857 100%)'
];

/**
 * StripTransition Component
 * Renders 15 vertical strips (3x density) with rich, vibrant emerald/mint/teal
 * gradients that cascade across the screen in a synchronized sequence.
 *
 * @param {boolean} active - whether the transition overlay is active
 * @param {'cover' | 'reveal' | 'idle'} phase - current animation phase
 * @param {'down' | 'up'} direction - direction of the strip motion
 */
export default function StripTransition({ active, phase, direction = 'down' }) {
  if (!active || phase === 'idle') return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] pointer-events-auto grid overflow-hidden select-none"
      style={{ gridTemplateColumns: `repeat(${NUM_STRIPS}, minmax(0, 1fr))` }}
      aria-hidden="true"
    >
      {Array.from({ length: NUM_STRIPS }).map((_, i) => {
        const delayMs = i * STAGGER_MS;

        let animClass = '';
        if (phase === 'cover') {
          animClass = direction === 'up' ? 'strip-cover-up' : 'strip-cover-down';
        } else if (phase === 'reveal') {
          animClass = direction === 'up' ? 'strip-reveal-up' : 'strip-reveal-down';
        }

        const bgGradient = STRIP_COLORS[i % STRIP_COLORS.length];

        return (
          <div key={i} className="relative h-full w-full overflow-hidden">
            <div
              className={`absolute inset-0 w-full h-full border-r border-emerald-300/25 last:border-r-0 shadow-2xl flex flex-col justify-between ${animClass}`}
              style={{
                animationDelay: `${delayMs}ms`,
                willChange: 'transform',
                background: bgGradient
              }}
            >
              {/* High-sheen top ambient glow */}
              <div className="w-full h-32 bg-gradient-to-b from-white/20 via-emerald-200/10 to-transparent pointer-events-none" />

              {/* Glowing leading razor edge with high-luminance neon bloom */}
              {direction === 'down' ? (
                <div className="w-full h-[5px] bg-gradient-to-r from-emerald-200 via-white to-teal-200 shadow-[0_0_20px_#34D399,0_0_35px_#10B981]" />
              ) : (
                <div className="w-full h-[5px] bg-gradient-to-r from-emerald-200 via-white to-teal-200 shadow-[0_0_20px_#34D399,0_0_35px_#10B981] order-first" />
              )}
            </div>
          </div>
        );
      })}

      {/* Floating Center Badge at Peak Transition Moment with Smooth Reveal Fade */}
      <div className={`fixed inset-0 flex items-center justify-center pointer-events-none z-20 transition-opacity duration-300 ${phase === 'reveal' ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-950/90 border border-emerald-400 text-emerald-300 font-mono text-xs tracking-[0.28em] uppercase shadow-[0_0_40px_rgba(16,185,129,0.7)] backdrop-blur-xl animate-pulse">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-white">WATTHACKS AI</span>
        </div>
      </div>
    </div>
  );
}
