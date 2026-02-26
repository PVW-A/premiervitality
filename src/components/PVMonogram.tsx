const PVMonogram = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <text
      x="50%"
      y="62"
      textAnchor="middle"
      fontFamily="'Cormorant Garamond', serif"
      fontSize="60"
      fontWeight="300"
      fontStyle="italic"
      fill="hsl(39, 38%, 60%)"
      letterSpacing="-4"
    >
      PV
    </text>
  </svg>
);

export default PVMonogram;
