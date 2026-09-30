import React, { useEffect, useRef } from 'react';
import { LogOut, ShieldCheck } from 'lucide-react';

export default function Navbar({
  currentPage = 'landing',
  onNavigate,
  currentUser = null,
  onOpenAuth,
  onLogout,
  detectedLocation = null,
  onDetectLocation = null
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let time = 0;
    let animId;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
    };

    resize();
    window.addEventListener('resize', resize);

    const blobs = [
      { x: 0.15, y: 0.50, r: 52, speedX: 0.016, speedY: 0.024, color: 'rgba(16, 185, 129, 0.55)' },
      { x: 0.45, y: 0.58, r: 65, speedX: -0.014, speedY: 0.018, color: 'rgba(52, 211, 153, 0.60)' },
      { x: 0.75, y: 0.42, r: 58, speedX: 0.018, speedY: -0.020, color: 'rgba(110, 231, 183, 0.50)' },
      { x: 0.90, y: 0.52, r: 44, speedX: -0.015, speedY: 0.015, color: 'rgba(5, 150, 105, 0.48)' },
      { x: 0.30, y: 0.36, r: 40, speedX: 0.020, speedY: 0.022, color: 'rgba(52, 211, 153, 0.45)' }
    ];

    const render = () => {
      if (!width || !height) resize();
      ctx.clearRect(0, 0, width, height);

      // 3 Layered turbulent flowing green liquid waves inside the glass tube
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, height);
        const yMid = height * (0.32 + i * 0.18);
        for (let x = 0; x <= width; x += 6) {
          const waveY = yMid 
            + Math.sin(x * 0.016 + time * 0.045 + i * 1.6) * (9 + i * 4)
            + Math.cos(x * 0.026 - time * 0.032) * 6;
          ctx.lineTo(x, waveY);
        }
        ctx.lineTo(width, height);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, 0, width, 0);
        if (i === 0) {
          grad.addColorStop(0, 'rgba(16, 185, 129, 0.50)');
          grad.addColorStop(0.5, 'rgba(52, 211, 153, 0.65)');
          grad.addColorStop(1, 'rgba(110, 231, 183, 0.48)');
        } else if (i === 1) {
          grad.addColorStop(0, 'rgba(5, 150, 105, 0.42)');
          grad.addColorStop(0.5, 'rgba(16, 185, 129, 0.58)');
          grad.addColorStop(1, 'rgba(52, 211, 153, 0.45)');
        } else {
          grad.addColorStop(0, 'rgba(52, 211, 153, 0.35)');
          grad.addColorStop(0.5, 'rgba(110, 231, 183, 0.42)');
          grad.addColorStop(1, 'rgba(16, 185, 129, 0.32)');
        }
        ctx.fillStyle = grad;
        ctx.fill();
      }

      blobs.forEach((b) => {
        const currentX = ((b.x + Math.sin(time * b.speedX) * 0.18) % 1) * width;
        const currentY = (b.y + Math.cos(time * b.speedY) * 0.28) * height;
        const radial = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, b.r);
        radial.addColorStop(0, b.color);
        radial.addColorStop(0.7, b.color.replace(/[\d\.]+\)$/, '0.18)'));
        radial.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(currentX, currentY, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      time += 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleNavClick = (page, sectionId = null) => {
    if (onNavigate) {
      onNavigate(page);
    }
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="no-print fixed top-4 sm:top-6 left-0 right-0 z-50 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pointer-events-none">
      <header className="navbar-liquid-glass relative rounded-full px-6 sm:px-8 py-3.5 flex items-center justify-between overflow-hidden shadow-2xl transition-all duration-300 pointer-events-auto">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full rounded-full pointer-events-none z-[1] opacity-90"
        />
        <div className="specular-sheen z-[2]"></div>

        <div className="relative z-10 flex items-center justify-between w-full">
          {/* Logo with Apricot Underline Accent & GPS Local Grid Indicator */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleNavClick('landing')}
              className="text-xl font-medium tracking-tight text-slate-900 relative inline-block group cursor-pointer text-left"
            >
              WattHacks
              <span className="absolute -bottom-1 left-0 w-6 h-[2px] bg-brand-apricot rounded-full transition-all duration-300 group-hover:w-full"></span>
            </button>

            {/* GPS / Network Local Grid Badge */}
            <button
              onClick={onDetectLocation}
              title={
                detectedLocation
                  ? (detectedLocation.isInternational || detectedLocation.isVpn)
                    ? `⚠️ International location detected (${detectedLocation.matchedRegionName}). Select an Indian Regional Hub to proceed.`
                    : `Calibrated to ${detectedLocation.matchedRegionName} (${detectedLocation.discom})`
                  : "Click to detect and calibrate with device location"
              }
              className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono transition cursor-pointer ${
                detectedLocation && (detectedLocation.isInternational || detectedLocation.isVpn)
                  ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-900'
                  : 'bg-slate-900/5 hover:bg-slate-900/10 border-slate-900/10 text-slate-700'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                detectedLocation && (detectedLocation.isInternational || detectedLocation.isVpn)
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              } animate-pulse`}></span>
              <span>
                {detectedLocation 
                  ? ((detectedLocation.isInternational || detectedLocation.isVpn)
                      ? `⚠️ ${(typeof detectedLocation.matchedRegionName === 'string' ? detectedLocation.matchedRegionName.split('&')[0]?.split('(')[0]?.trim() : '') || 'Outside India'}`
                      : `📍 ${(typeof detectedLocation.matchedRegionName === 'string' ? detectedLocation.matchedRegionName.split('&')[0]?.split('(')[0]?.trim() : '') || 'Local Grid'} • ${(typeof detectedLocation.discom === 'string' ? detectedLocation.discom.split('(')[0]?.trim() : '') || 'Grid'}`)
                  : "📍 Detect Local Grid"}
              </span>
            </button>
          </div>

          {/* Contextual Page Navigation Links (Current Page Only) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold tracking-wide text-slate-700">
            {currentPage === 'landing' && (
              <>
                <button
                  onClick={() => handleNavClick('landing', 'overview')}
                  className="hover:text-slate-950 transition-colors cursor-pointer py-1 px-2.5 rounded-lg text-slate-950 font-bold bg-slate-900/5"
                >
                  Overview
                </button>
                <button
                  onClick={() => handleNavClick('landing', 'comparison')}
                  className="hover:text-slate-950 transition-colors cursor-pointer py-1 px-2.5 rounded-lg text-slate-700"
                >
                  Vs Competitors
                </button>
                <button
                  onClick={() => handleNavClick('landing', 'features')}
                  className="hover:text-slate-950 transition-colors cursor-pointer py-1 px-2.5 rounded-lg text-slate-700"
                >
                  Features
                </button>
              </>
            )}

            {currentPage === 'bill-audit' && (
              <>
                <button
                  onClick={() => handleNavClick('landing')}
                  className="hover:text-slate-950 transition-colors cursor-pointer py-1 px-2.5 rounded-lg text-slate-500 hover:text-slate-900"
                >
                  ← Home
                </button>
                <button
                  onClick={() => handleNavClick('bill-audit', 'bill-upload-section')}
                  className="hover:text-slate-950 transition-colors cursor-pointer py-1 px-2.5 rounded-lg text-emerald-900 font-bold bg-emerald-500/10"
                >
                  1. Bill Upload & OCR
                </button>
                <button
                  onClick={() => handleNavClick('bill-audit', 'facility-info-section')}
                  className="hover:text-slate-950 transition-colors cursor-pointer py-1 px-2.5 rounded-lg text-slate-700"
                >
                  2. Facility Calibration
                </button>
              </>
            )}

            {currentPage === 'audit-report' && (
              <>
                <button
                  onClick={() => handleNavClick('bill-audit')}
                  className="hover:text-slate-950 transition-colors cursor-pointer py-1 px-2.5 rounded-lg text-slate-500 hover:text-slate-900"
                >
                  ← Back to Bill
                </button>
                <button
                  onClick={() => handleNavClick('audit-report', 'audit-summary')}
                  className="hover:text-slate-950 transition-colors cursor-pointer py-1 px-2.5 rounded-lg text-emerald-900 font-bold bg-emerald-500/10"
                >
                  Audit Summary
                </button>
                <button
                  onClick={() => handleNavClick('audit-report', 'audit-breakdown')}
                  className="hover:text-slate-950 transition-colors cursor-pointer py-1 px-2.5 rounded-lg text-slate-700"
                >
                  Line-Item Breakdown
                </button>
                <button
                  onClick={() => handleNavClick('audit-report', 'audit-dispatch')}
                  className="hover:text-slate-950 transition-colors cursor-pointer py-1 px-2.5 rounded-lg text-slate-700"
                >
                  24h Dispatch
                </button>
              </>
            )}

            {currentPage === 'live-console' && (
              <>
                <button
                  onClick={() => handleNavClick('landing')}
                  className="hover:text-slate-950 transition-colors cursor-pointer py-1 px-2.5 rounded-lg text-slate-500 hover:text-slate-900"
                >
                  ← Back to Home
                </button>
                <button
                  className="py-1 px-2.5 rounded-lg text-emerald-900 font-bold bg-emerald-500/10"
                >
                  Telemetry
                </button>
                <button
                  className="py-1 px-2.5 rounded-lg text-slate-700"
                >
                  Power Routing
                </button>
              </>
            )}
          </nav>

          {/* Action Area: Auth Portal + Contextual Page Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Facility Director Authentication Portal */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-slate-900/10 border border-slate-900/15 text-slate-900 text-xs font-semibold shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="hidden sm:inline max-w-[120px] truncate">
                  {typeof currentUser?.name === 'string'
                    ? currentUser.name
                    : typeof currentUser?.facilityName === 'string'
                    ? currentUser.facilityName
                    : typeof currentUser?.email === 'string'
                    ? currentUser.email
                    : 'Director'}
                </span>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1 rounded-full hover:bg-slate-900/10 text-slate-500 hover:text-rose-600 transition-colors ml-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-full border border-slate-300/80 bg-white/75 hover:bg-white text-slate-800 hover:text-slate-950 transition-all duration-300 text-xs font-semibold tracking-wide shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sign In</span>
              </button>
            )}

            {/* Page Contextual Action Button */}
            {currentPage === 'landing' && (
              <button
                onClick={() => handleNavClick('bill-audit')}
                className="px-4 sm:px-5 py-2 rounded-full border border-slate-900 bg-slate-900 hover:bg-slate-800 text-white transition-all duration-300 text-xs font-semibold tracking-wider shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>Try It Out →</span>
              </button>
            )}

            {currentPage === 'bill-audit' && (
              <button
                onClick={() => {
                  const formEl = document.getElementById('facility-info-section');
                  if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 sm:px-5 py-2 rounded-full border border-slate-900 bg-slate-900 hover:bg-slate-800 text-white transition-all duration-300 text-xs font-semibold tracking-wider shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>Facility Form ↓</span>
              </button>
            )}

            {currentPage === 'audit-report' && (
              <button
                onClick={() => window.print()}
                className="px-4 sm:px-5 py-2 rounded-full border border-slate-900 bg-slate-900 hover:bg-slate-800 text-white transition-all duration-300 text-xs font-semibold tracking-wider shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>Print PDF ↓</span>
              </button>
            )}

            {currentPage === 'live-console' && (
              <button
                onClick={() => handleNavClick('landing')}
                className="px-4 sm:px-5 py-2 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 transition-all duration-300 text-xs font-semibold tracking-wider shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>Exit Console ✕</span>
              </button>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
