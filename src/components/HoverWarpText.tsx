
import { useEffect, useRef, useState } from 'react';

interface HoverWarpTextProps {
  text: string;
  className?: string;
}

const HoverWarpText = ({ text, className = '' }: HoverWarpTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const generateLines = () => {
    const lines = [];
    const lineCount = 40;
    const containerWidth = 100;
    const containerHeight = 100;
    
    for (let i = 0; i < lineCount; i++) {
      const y = (i / (lineCount - 1)) * containerHeight;
      let path = `M 0 ${y}`;
      
      if (isHovered) {
        // Create wave distortion based on mouse position
        const segments = 20;
        for (let j = 1; j <= segments; j++) {
          const x = (j / segments) * containerWidth;
          const distanceFromMouse = Math.sqrt(
            Math.pow(x - (mousePosition.x / containerRef.current!.offsetWidth) * 100, 2) +
            Math.pow(y - (mousePosition.y / containerRef.current!.offsetHeight) * 100, 2)
          );
          
          const warpIntensity = Math.max(0, 8 - distanceFromMouse * 0.3);
          const warpY = y + Math.sin(x * 0.2 + Date.now() * 0.01) * warpIntensity;
          
          path += ` L ${x} ${warpY}`;
        }
      } else {
        path += ` L ${containerWidth} ${y}`;
      }
      
      lines.push(
        <path
          key={i}
          d={path}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
          fill="none"
          style={{
            transition: isHovered ? 'none' : 'all 0.3s ease-out'
          }}
        />
      );
    }
    return lines;
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {generateLines()}
      </svg>
      
      {/* Text */}
      <h1 className="relative z-10 font-orbitron font-black text-white tracking-tighter leading-none text-center text-mega lg:text-ultra md:text-massive sm:text-6xl select-none">
        {text.split('').map((char, index) => (
          <span
            key={index}
            className="inline-block transition-all duration-300 ease-out"
            style={{
              transform: isHovered 
                ? `translateY(${Math.sin(index * 0.5 + Date.now() * 0.005) * 4}px) scale(${1 + Math.sin(index * 0.3 + Date.now() * 0.003) * 0.05})`
                : 'translateY(0px) scale(1)',
              animationDelay: `${index * 50}ms`
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default HoverWarpText;
