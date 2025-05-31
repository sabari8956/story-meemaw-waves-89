
import ElectricButton from './ElectricButton';
import NoiseBackground from './NoiseBackground';
import HoverWarpText from './HoverWarpText';
import { ArrowDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Noise background overlay */}
      <NoiseBackground />
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Main title with hover effect */}
        <div className="mb-8 w-full max-w-6xl">
          <HoverWarpText 
            text="STORY MEEMAW"
            className="mb-8"
          />
        </div>
        
        {/* Subtitle */}
        <p className="text-gray-300 font-exo font-light text-xl md:text-2xl lg:text-3xl text-center max-w-3xl mb-12 tracking-wide">
          AI-Powered Stories for Little Ones
        </p>
        
        {/* Electric CTA Button */}
        <ElectricButton onClick={() => console.log('Get Started clicked!')}>
          Get Started
        </ElectricButton>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <ArrowDown 
            className="w-6 h-6 text-white animate-pulse-glow" 
            strokeWidth={1}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
