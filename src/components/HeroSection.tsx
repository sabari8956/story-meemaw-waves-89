
import ElectricButton from './ElectricButton';
import NoiseBackground from './NoiseBackground';
import HoverWarpText from './HoverWarpText';
import CursorEffect from './CursorEffect';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Noise background overlay */}
      <NoiseBackground />
      
      {/* Cursor effect */}
      <CursorEffect />
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Main title with hover effect */}
        <div className="mb-8 w-full max-w-7xl px-2 sm:px-4">
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
        <ElectricButton onClick={() => console.log('Under Construction clicked!')}>
          Under Construction
        </ElectricButton>
      </div>
    </div>
  );
};

export default HeroSection;
