export type Testimonial = {
  id: number;
  testimonial: string;
  author: string;
  avatar: string;
};

export function TestimonialCard({ testimonial, author, avatar }: Testimonial) {
  const [name, role] = author.split(" - ");

  return (
    <div className="group relative flex flex-1 flex-col justify-between gap-8 overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-white/[0.06] to-white/[0.02] p-8 transition-colors duration-300 hover:border-white/20 sm:p-9">
      <svg
        className="h-8 w-8 text-white/15 transition-colors duration-300 group-hover:text-white/25"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M9.5 8.5C6.46 8.5 4 10.96 4 14s2.46 5.5 5.5 5.5c.34 0 .67-.03 1-.09-.6 1.4-1.9 2.5-3.5 2.87v1.72c3.3-.5 6-3.36 6-7 0-4.42-1.58-8-3.5-8zm10 0c-3.04 0-5.5 2.46-5.5 5.5s2.46 5.5 5.5 5.5c.34 0 .67-.03 1-.09-.6 1.4-1.9 2.5-3.5 2.87v1.72c3.3-.5 6-3.36 6-7 0-4.42-1.58-8-3.5-8z" />
      </svg>

      <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">{testimonial}</p>

      <div className="flex items-center gap-3 border-t border-white/10 pt-6">
        <img
          src={avatar}
          alt={`Avatar of ${author}`}
          className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-white/15"
        />
        <div>
          <div className="text-sm font-semibold text-white">{name}</div>
          {role && <div className="text-xs text-zinc-500">{role}</div>}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
}
