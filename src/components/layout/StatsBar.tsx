const STATS = [
  { value: "4", label: "Products Shipped" },
  { value: "2", label: "Years Building" },
  { value: "AI", label: "Integrated AI Development" },
];

export default function StatsBar() {
  return (
    <div className="w-full border-y border-white/8 bg-linear-to-b from-[#1e2632] via-[#141a24] to-[#0f1319]">
      <div className="mx-auto grid max-w-5xl grid-cols-3 divide-x divide-white/8 px-6">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center gap-1 py-10 text-center sm:py-14"
          >
            <span className="font-(family-name:--font-space-grotesk) text-3xl font-bold text-white sm:text-4xl">
              {stat.value}
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 sm:text-sm">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
