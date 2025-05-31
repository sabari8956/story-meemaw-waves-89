
import { useState } from 'react';

interface HoverWarpTextProps {
  text: string;
  className?: string;
}

const HoverWarpText = ({ text, className = '' }: HoverWarpTextProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h1 
        className={`font-orbitron font-black text-white transition-all duration-300 ease-out ${
          isHovered 
            ? 'transform scale-110 skew-x-3 tracking-widest filter drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]' 
            : 'transform scale-100 skew-x-0 tracking-normal'
        }`}
        style={{
          fontSize: 'clamp(4rem, 15vw, 12rem)',
          lineHeight: '0.8',
          textShadow: isHovered 
            ? '0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(255,255,255,0.4)' 
            : '0 0 10px rgba(255,255,255,0.2)',
        }}
      >
        {text.split('').map((char, index) => (
          <span
            key={index}
            className={`inline-block transition-all duration-300 ${
              isHovered ? 'animate-pulse' : ''
            }`}
            style={{
              animationDelay: `${index * 0.1}s`,
              transform: isHovered 
                ? `translateY(${Math.sin(index * 0.5) * 10}px) rotate(${Math.sin(index) * 5}deg)` 
                : 'translateY(0px) rotate(0deg)',
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
