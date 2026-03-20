const AtmosphericBackground = () => (
  <div className="fixed inset-0 -z-10 pointer-events-none">
    {/* Radial depth gradient */}
    <div
      className="absolute inset-0"
      style={{ background: "radial-gradient(ellipse 80% 70% at 50% 30%, #1E1E24 0%, #000000 70%)" }}
    />
    {/* Grid overlay */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 10%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 10%, transparent 80%)",
      }}
    />
    {/* Gold glow */}
    <div
      className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px]"
      style={{ background: "radial-gradient(circle, rgba(171,143,95,0.04) 0%, transparent 60%)" }}
    />
  </div>
);

export default AtmosphericBackground;
