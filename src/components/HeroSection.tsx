
import DistortedText from './DistortedText';
import NoiseBackground from './NoiseBackground';
import { ArrowDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Noise background */}
      <NoiseBackground />
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Distorted main heading */}
        <div className="mb-4 w-full max-w-4xl">
          <DistortedText 
            text="Story Meemaw"
            className="h-32 md:h-40 lg:h-48"
          />
        </div>
        
        {/* Subtitle */}
        <p className="text-gray-300 font-poppins font-light text-lg md:text-xl lg:text-2xl text-center max-w-2xl mb-8 tracking-wide">
          AI-Powered Stories for Little Ones
        </p>
        
        {/* CTA Button */}
        <button className="group relative font-poppins font-medium text-sm uppercase tracking-wider px-8 py-3 border-2 border-white bg-transparent text-white transition-all duration-300 hover:bg-white hover:text-black rounded">
          <span className="relative z-10">Get Started</span>
          <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded"></div>
        </button>
        
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
