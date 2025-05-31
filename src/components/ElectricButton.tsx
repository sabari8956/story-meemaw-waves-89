import { useEffect, useRef, useState } from 'react';

interface ElectricButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const ElectricButton = ({ children, onClick }: ElectricButtonProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef<number>();
  const ripplesRef = useRef<Array<{x: number, y: number, radius: number, intensity: number}>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const button = buttonRef.current;
    if (!canvas || !button) return;

    const ctx = canvas.getContext('2d')!;
    let time = 0;

    const resizeCanvas = () => {
      const rect = button.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const animate = () => {
      time += 0.01; // Slowed down from 0.02
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Electric border effect
      if (isHovered) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const segments = 20;
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments) * canvas.width;
          const jitter = Math.sin(time * 2 + i * 0.5) * 2; // Slowed down from time * 3
          
          if (i === 0) {
            ctx.moveTo(x, 0 + jitter);
          } else {
            ctx.lineTo(x, 0 + jitter);
          }
        }
        
        for (let i = 0; i <= segments; i++) {
          const y = (i / segments) * canvas.height;
          const jitter = Math.cos(time * 2 + i * 0.5) * 2; // Slowed down from time * 3
          ctx.lineTo(canvas.width + jitter, y);
        }
        
        for (let i = segments; i >= 0; i--) {
          const x = (i / segments) * canvas.width;
          const jitter = Math.sin(time * 2 + i * 0.5) * 2; // Slowed down from time * 3
          ctx.lineTo(x, canvas.height + jitter);
        }
        
        for (let i = segments; i >= 0; i--) {
          const y = (i / segments) * canvas.height;
          const jitter = Math.cos(time * 2 + i * 0.5) * 2; // Slowed down from time * 3
          ctx.lineTo(0 + jitter, y);
        }
        
        ctx.closePath();
        ctx.stroke();
      }

      // Ripple effects
      ripplesRef.current = ripplesRef.current.filter(ripple => {
        ripple.radius += 2;
        ripple.intensity *= 0.95;
        
        if (ripple.intensity > 0.01) {
          const gradient = ctx.createRadialGradient(
            ripple.x, ripple.y, 0,
            ripple.x, ripple.y, ripple.radius
          );
          gradient.addColorStop(0, `rgba(255, 255, 255, ${ripple.intensity * 0.3})`);
          gradient.addColorStop(0.7, `rgba(255, 255, 255, ${ripple.intensity * 0.1})`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
          ctx.fill();
          
          return true;
        }
        return false;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = buttonRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Add multiple ripples on click
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        ripplesRef.current.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          radius: 0,
          intensity: 1
        });
      }, i * 100);
    }
    
    onClick?.();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isHovered) return;
    
    const rect = buttonRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (Math.random() < 0.1) {
      ripplesRef.current.push({
        x,
        y,
        radius: 0,
        intensity: 0.5
      });
    }
  };

  return (
    <button
      ref={buttonRef}
      className="group relative font-exo font-medium text-sm uppercase tracking-wider px-8 py-3 bg-transparent text-white transition-all duration-500 hover:bg-white hover:text-black overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default ElectricButton;
