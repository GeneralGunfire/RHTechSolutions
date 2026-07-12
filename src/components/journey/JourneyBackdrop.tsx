// One viewport-locked backdrop for the entire journey. Every section used to
// carry its own grid/glow/vignette inside its sticky container, which made
// the background visibly scroll at each section hand-off. Fixed positioning
// means the atmosphere never moves — only the content travels.
export default function JourneyBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-[#0a0c10]">
      {/* Dotted grid */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] bg-[size:34px_34px] opacity-8 [mask-image:radial-gradient(ellipse_at_50%_45%,black_25%,transparent_72%)]" />

      {/* Ambient glows */}
      <div className="absolute -right-40 top-1/4 h-160 w-160 rounded-full bg-[#aab4c5]/15 blur-[140px]" />
      <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-[#8b95a6]/10 blur-[110px]" />

      {/* Vignette — pulls focus to center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_50%,rgba(0,0,0,0.5)_100%)]" />
    </div>
  );
}
