import React, { useEffect, useRef } from 'react';

export default function WaveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let time = 0;
    let animId;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let mouse = { x: width * 0.7, y: height * 0.5 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Calibrated wave surges: 25% less aggressive amplitude and 20% smoother speed
    const waves = [
      { amplitude: 105, frequency: 0.0016, speed: 0.016, colorStart: 'rgba(52, 211, 153, 0.18)', strokeColor: 'rgba(52, 211, 153, 0.48)', strokeWidth: 2.0, baseY: 0.46, phase: 0 },
      { amplitude: 130, frequency: 0.0011, speed: 0.012, colorStart: 'rgba(16, 185, 129, 0.20)', strokeColor: 'rgba(16, 185, 129, 0.50)', strokeWidth: 2.2, baseY: 0.54, phase: 2.2 },
      { amplitude: 86, frequency: 0.0022, speed: 0.019, colorStart: 'rgba(110, 231, 183, 0.16)', strokeColor: 'rgba(110, 231, 183, 0.42)', strokeWidth: 1.6, baseY: 0.62, phase: 4.1 },
      { amplitude: 71, frequency: 0.0028, speed: 0.022, colorStart: 'rgba(5, 150, 105, 0.20)', strokeColor: 'rgba(52, 211, 153, 0.52)', strokeWidth: 1.8, baseY: 0.70, phase: 1.4 },
      { amplitude: 98, frequency: 0.0014, speed: 0.013, colorStart: 'rgba(251, 146, 60, 0.10)', strokeColor: 'rgba(251, 146, 60, 0.35)', strokeWidth: 1.4, baseY: 0.76, phase: 3.1 }
    ];

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.6,
      speedY: Math.random() * 0.20 + 0.08,
      speedX: (Math.random() - 0.5) * 0.16,
      alpha: Math.random() * 0.4 + 0.15,
      pulse: Math.random() * Math.PI * 2
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, height);
        const yAnchor = height * wave.baseY;

        for (let x = 0; x <= width; x += 4) {
          const distanceToMouse = Math.abs(x - mouse.x);
          const mouseInfluence = Math.max(0, 1 - distanceToMouse / 600) * 13.5;
          const y = yAnchor 
            + Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * (wave.amplitude + mouseInfluence)
            + Math.cos(x * wave.frequency * 0.6 + time * wave.speed * 0.8) * (wave.amplitude * 0.3);

          if (x === 0) ctx.lineTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, yAnchor - wave.amplitude, 0, height);
        gradient.addColorStop(0, wave.colorStart);
        gradient.addColorStop(0.6, wave.colorStart.replace(/[\d\.]+\)$/, '0.02)'));
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.strokeStyle = wave.strokeColor;
        ctx.lineWidth = wave.strokeWidth;
        ctx.stroke();
      });

      // Bioluminescent Particles
      particles.forEach((p) => {
        p.y -= p.speedY; p.x += p.speedX; p.pulse += 0.02;
        if (p.y < 0) p.y = height + 10;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52, 211, 153, ${currentAlpha})`;
        ctx.shadowColor = '#10B981';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      time += 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
}
