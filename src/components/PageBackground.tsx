const PageBackground = () => (
  <div className="fixed inset-0 -z-10 pointer-events-none">
    {/* Depth gradient */}
    <div
      className="absolute inset-0"
      style={{ background: "radial-gradient(ellipse 80% 70% at 50% 40%, #1E1E24 0%, #000000 70%)" }}
    />

    {/* Grid overlay */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(hsl(var(--foreground) / 0.02) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.02) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        maskImage:
          "radial-gradient(ellipse 70% 60% at 50% 40%, black 10%, transparent 80%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 60% at 50% 40%, black 10%, transparent 80%)",
      }}
    />

    {/* Radial glow */}
    <div
      className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
      style={{
        background: "radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 60%)",
      }}
    />
  </div>
);

export default PageBackground;
