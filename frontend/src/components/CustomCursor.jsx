import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorRef = useRef(null);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    let targetX = -200;
    let targetY = -200;
    let currentX = -200;
    let currentY = -200;
    let animId;

    const updatePosition = (e) => {
      if (typeof e.clientX !== 'number' || typeof e.clientY !== 'number') return;
      // Filter out glitch 0,0 during certain drag events
      if (e.clientX === 0 && e.clientY === 0 && targetX !== -200) return;

      targetX = e.clientX;
      targetY = e.clientY;
      setIsVisible(true);

      const target = e.target;
      const isInteractive = Boolean(
        target &&
        (target.closest('button, a, input, select, textarea, label, [role="button"], .cursor-pointer, .liquid-glass, .glass-card, h1, h2, h3, p, strong, span') ||
         (target instanceof Element && window.getComputedStyle(target).cursor === 'pointer'))
      );
      setIsHovered(isInteractive);
    };

    const handlePointerDown = (e) => {
      updatePosition(e);
      setIsClicked(true);
    };

    const handlePointerUp = (e) => {
      updatePosition(e);
      setIsClicked(false);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // High refresh rate follow loop with exact geometric centering
    const render = () => {
      // 92% per-frame snappy response
      currentX += (targetX - currentX) * 0.92;
      currentY += (targetY - currentY) * 0.92;

      if (cursorRef.current) {
        // translate(-50%, -50%) centers the circle exactly on the cursor tip
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }
      animId = requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', updatePosition, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('mousemove', updatePosition, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('pointermove', updatePosition);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className="no-print fixed top-0 left-0 pointer-events-none z-[999999] flex items-center justify-center will-change-transform"
      style={{
        transform: 'translate3d(-200px, -200px, 0) translate(-50%, -50%)',
        mixBlendMode: 'difference'
      }}
    >
      {/* Pure Solid White Sphere with Difference Inversion Blending */}
      <div
        className={`rounded-full bg-white transition-[width,height,transform] duration-150 ease-out ${
          isHovered ? 'w-24 h-24' : 'w-14 h-14'
        } ${isClicked ? 'scale-75' : 'scale-100'}`}
      />
    </div>
  );
}
