const PVMonogram = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* P — thin serif, architectural stroke */}
    <path
      d="M12 68V14h14c4.5 0 8 1.2 10.5 3.6S40 22.8 40 27.2c0 4.4-1.2 7.8-3.5 10.2S30.5 41 26 41H20.5v27H12z
         M20.5 34h4.8c3 0 5.2-.8 6.8-2.4 1.6-1.6 2.4-3.8 2.4-6.6s-.8-5-2.4-6.6c-1.6-1.6-3.8-2.4-6.8-2.4H20.5V34z"
      fill="hsl(39, 38%, 60%)"
    />
    {/* V — interlocked, shares vertical space with P's bowl */}
    <path
      d="M36 14l14.5 42h.6L65.5 14H74L56.8 68h-12L28 14h8z"
      fill="hsl(39, 38%, 60%)"
    />
    {/* Thin baseline rule — architectural alignment */}
    <rect x="12" y="72" width="62" height="0.8" fill="hsl(39, 38%, 60%)" opacity="0.4" />
  </svg>
);

export default PVMonogram;
