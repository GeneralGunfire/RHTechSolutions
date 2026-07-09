import Image from "next/image";

const SERVICES = [
  {
    title: "Full-Stack Web Development",
    description:
      "End-to-end product builds — from architecture and backend systems to interfaces people actually enjoy using.",
  },
  {
    title: "AI-Integrated Development",
    description:
      "Practical AI woven into real products, not bolted on — used to solve genuine workflow and data problems.",
  },
  {
    title: "Government & Enterprise Systems",
    description:
      "Reliable platforms for municipalities and institutions, built to handle real-world data and scale.",
  },
  {
    title: "Consumer Products",
    description:
      "Apps and platforms designed for everyday people — simple, fast, and built for the South African context.",
  },
];

export default function Services() {
  return (
    <section className="w-full bg-[#0f1319] pt-16 pb-24 sm:pt-20 sm:pb-32">
      <div className="mb-16 px-6 text-center">
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

      <div className="mx-auto grid max-w-[110rem] gap-5 px-5 pt-16 sm:grid-cols-2 sm:gap-6 sm:px-10 sm:pt-20">
        {SERVICES.map((service) => (
          <div
            key={service.title}
            className="group rounded-2xl border border-white/10 bg-white/4 p-7 text-center transition-colors duration-300 hover:bg-white/[0.07] sm:p-9"
          >
            <h3 className="font-(family-name:--font-space-grotesk) text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {service.title}
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400 sm:text-base">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
