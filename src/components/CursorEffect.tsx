
import { useEffect, useRef } from 'react';

const CursorEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const bee = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    vx: 0,
    vy: 0,
    wingOffset: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    let animationId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const drawBee = (x: number, y: number, wingOffset: number) => {
      // Bee body (oval)
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.ellipse(x, y, 12, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Black stripes
      ctx.fillStyle = '#000';
      ctx.fillRect(x - 8, y - 3, 3, 6);
      ctx.fillRect(x - 2, y - 3, 3, 6);
      ctx.fillRect(x + 4, y - 3, 3, 6);

      // Wings
      const wingFlap = Math.sin(wingOffset) * 0.3;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      
      // Left wing
      ctx.save();
      ctx.translate(x - 8, y - 5);
      ctx.rotate(wingFlap);
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Right wing
      ctx.save();
      ctx.translate(x + 8, y - 5);
      ctx.rotate(-wingFlap);
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Eyes
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(x - 6, y - 2, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x - 2, y - 2, 1.5, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update bee physics with spring and damping
      const spring = 0.015;
      const damping = 0.9;
      
      const dx = mousePos.current.x - bee.current.x;
      const dy = mousePos.current.y - bee.current.y;
      
      bee.current.vx += dx * spring;
      bee.current.vy += dy * spring;
      
      bee.current.vx *= damping;
      bee.current.vy *= damping;
      
      bee.current.x += bee.current.vx;
      bee.current.y += bee.current.vy;
      
      // Update wing animation
      bee.current.wingOffset += 0.5;
      
      // Draw the bee
      drawBee(bee.current.x, bee.current.y, bee.current.wingOffset);

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
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-20"
        style={{ mixBlendMode: 'normal' }}
      />
      <style jsx global>{`
        * {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M16 4c-4 0-8 2-8 6v8c0 4 4 6 8 6s8-2 8-6v-8c0-4-4-6-8-6z' fill='%23D2691E'/%3E%3Cpath d='M16 6c-3 0-6 1.5-6 4v8c0 2.5 3 4 6 4s6-1.5 6-4v-8c0-2.5-3-4-6-4z' fill='%23FFD700'/%3E%3Cpath d='M12 12h8v2h-8z' fill='%23D2691E'/%3E%3Cpath d='M12 16h8v2h-8z' fill='%23D2691E'/%3E%3C/svg%3E") 16 16, auto !important;
        }
        
        button, a, input, textarea, select {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M16 4c-4 0-8 2-8 6v8c0 4 4 6 8 6s8-2 8-6v-8c0-4-4-6-8-6z' fill='%23D2691E'/%3E%3Cpath d='M16 6c-3 0-6 1.5-6 4v8c0 2.5 3 4 6 4s6-1.5 6-4v-8c0-2.5-3-4-6-4z' fill='%23FFD700'/%3E%3Cpath d='M12 12h8v2h-8z' fill='%23D2691E'/%3E%3Cpath d='M12 16h8v2h-8z' fill='%23D2691E'/%3E%3C/svg%3E") 16 16, pointer !important;
        }
      `}</style>
    </>
  );
};

export default CursorEffect;
