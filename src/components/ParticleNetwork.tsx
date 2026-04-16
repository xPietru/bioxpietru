import React, { useEffect, useRef } from 'react';

export const ParticleNetwork = ({ isDark = true }: { isDark?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; size: number; vx: number; vy: number; baseVx: number; baseVy: number }[] = [];
    const particleCount = 80; // Not too many dots
    const repelRadius = 200; // Distance at which they start escaping the mouse
    const repelForce = 2; // How strongly they escape

    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1.5,
          vx: 0,
          vy: 0,
          baseVx: (Math.random() - 0.5) * 1,
          baseVy: (Math.random() - 0.5) * 1
        });
      }
    };
    init();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Calculate distance to mouse
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Repel from mouse
        if (distance < repelRadius) {
          const force = (repelRadius - distance) / repelRadius;
          p.vx += (dx / distance) * force * repelForce;
          p.vy += (dy / distance) * force * repelForce;
        }

        // Apply friction to the repel velocity so they slow down after escaping
        p.vx *= 0.9;
        p.vy *= 0.9;

        // Update position (base speed + repel speed)
        p.x += p.baseVx + p.vx;
        p.y += p.baseVy + p.vy;

        // Bounce off edges and keep within bounds
        if (p.x > canvas.width || p.x < 0) {
          p.baseVx *= -1;
          p.vx *= -1;
          p.x = Math.max(0, Math.min(canvas.width, p.x));
        }
        if (p.y > canvas.height || p.y < 0) {
          p.baseVy *= -1;
          p.vy *= -1;
          p.y = Math.max(0, Math.min(canvas.height, p.y));
        }

        // Draw dot
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [isDark]);

  // z-[1] ensures it is behind the card (which is in a z-10 container)
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1]" />;
};
