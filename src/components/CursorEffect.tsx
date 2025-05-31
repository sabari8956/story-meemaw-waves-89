
import { useEffect, useRef } from 'react';

const CursorEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const particles = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    targetX: number;
    targetY: number;
    size: number;
    opacity: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    let animationId: number;

    // Create initial particles
    for (let i = 0; i < 15; i++) {
      particles.current.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: 0,
        vy: 0,
        targetX: window.innerWidth / 2,
        targetY: window.innerHeight / 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        delay: i * 2
      });
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update particles with physics
      particles.current.forEach((particle, index) => {
        // Each particle follows with different delay and physics
        const delay = particle.delay;
        const spring = 0.02 + (index * 0.001);
        const friction = 0.9;
        
        // Calculate target position with offset
        const offsetRadius = 20 + (index * 8);
        const angle = (index / particles.current.length) * Math.PI * 2;
        particle.targetX = mousePos.current.x + Math.cos(angle) * (offsetRadius * 0.3);
        particle.targetY = mousePos.current.y + Math.sin(angle) * (offsetRadius * 0.3);
        
        // Apply spring physics
        const dx = particle.targetX - particle.x;
        const dy = particle.targetY - particle.y;
        
        particle.vx += dx * spring;
        particle.vy += dy * spring;
        
        // Apply friction
        particle.vx *= friction;
        particle.vy *= friction;
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
        
        // Add subtle glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.1})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default CursorEffect;
