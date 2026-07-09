import Image from "next/image";

const SERVICES = [
  {
    index: "01",
    title: "Full-Stack Web Development",
    description:
      "End-to-end product builds — from architecture and backend systems to interfaces people actually enjoy using.",
    icon: (
      <path
        d="M9 17l-5-5 5-5M15 7l5 5-5 5"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    index: "02",
    title: "AI-Integrated Development",
    description:
      "Practical AI woven into real products, not bolted on — used to solve genuine workflow and data problems.",
    icon: (
      <>
        <circle cx="12" cy="12" r="3.2" strokeWidth={1.6} />
        <path
          d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M18.4 18.4l-2.1-2.1M7.7 7.7 5.6 5.6"
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    index: "03",
    title: "Government & Enterprise Systems",
    description:
      "Reliable platforms for municipalities and institutions, built to handle real-world data and scale.",
    icon: (
      <path
        d="M4 21V9l8-5 8 5v12M4 21h16M9 21v-6h6v6"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    index: "04",
    title: "Consumer Products",
    description:
      "Apps and platforms designed for everyday people — simple, fast, and built for the South African context.",
    icon: (
      <path
        d="M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM11 18h2"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function Services() {
  return (
    <section className="w-full bg-[#0a0c10] pt-16 pb-24 sm:pt-20 sm:pb-32">
      <div className="mb-16 px-6 text-center sm:mb-20">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
          What we do
        </span>
        <h2 className="mx-auto mt-4 max-w-3xl font-(family-name:--font-space-grotesk) text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
          Software built end to end.
        </h2>
      </div>

      <div className="relative w-full overflow-hidden">
        <Image
          src="/images/footer-showcase.png"
          alt="RH Tech Solutions across desktop, tablet, and mobile"
          width={1536}
          height={1024}
          sizes="100vw"
          quality={100}
          className="h-160 w-full object-cover [image-rendering:-webkit-optimize-contrast] sm:h-190 md:h-208"
          style={{ filter: "contrast(1.04) saturate(1.05)" }}
        />
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-5 px-5 sm:mt-20 sm:grid-cols-2 sm:gap-6 sm:px-10">
        {SERVICES.map((service) => (
            <div
              key={service.title}
              className="group relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-white/15 bg-white/6 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300 hover:bg-white/10 sm:p-10"
            >
              <div className="flex items-start justify-between">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="h-9 w-9 text-[#5b7fff] transition-transform duration-300 group-hover:scale-110"
                >
                  {service.icon}
                </svg>
                <span className="font-(family-name:--font-space-grotesk) text-sm font-semibold text-white/20 transition-colors duration-300 group-hover:text-white/35">
                  {service.index}
                </span>
              </div>

              <div>
                <h3 className="font-(family-name:--font-space-grotesk) text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {service.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400 sm:text-base">
                  {service.description}
                </p>
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-inset ring-white/20 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
        ))}
      </div>
    </section>
  );
}
