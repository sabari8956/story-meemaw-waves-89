
import HoverWarpText from './HoverWarpText';
import ElectricButton from './ElectricButton';
import NoiseBackground from './NoiseBackground';
import { ArrowDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Noise background */}
      <NoiseBackground />
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Hover warp main heading */}
        <div className="mb-8 w-full max-w-6xl">
          <HoverWarpText 
            text="Story Meemaw"
            className="h-64 md:h-48 lg:h-56"
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
      
      {/* Subtle geometric overlays */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-white opacity-5 rotate-45"></div>
      <div className="absolute bottom-40 right-20 w-24 h-24 border border-white opacity-10 rounded-full"></div>
      <div className="absolute top-1/2 left-0 w-1 h-40 bg-white opacity-5"></div>
      <div className="absolute top-1/3 right-0 w-1 h-60 bg-white opacity-5"></div>
      
      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-white rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
    </div>
  );
};

export default HeroSection;
