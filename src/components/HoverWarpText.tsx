interface HoverWarpTextProps {
  text: string;
  className?: string;
}
const HoverWarpText = ({
  text,
  className = ''
}: HoverWarpTextProps) => {
  return <div className={`relative ${className}`}>
      {/* Text without any effects */}
      <h1 className="relative z-10 font-orbitron font-black text-white tracking-tighter leading-none text-center text-big xs:text-huge sm:text-6xl md:text-massive lg:text-ultra xl:text-mega select-none">
        {text}
      </h1>
    </div>;
};
export default HoverWarpText;