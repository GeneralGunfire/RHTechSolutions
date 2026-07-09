"use client";

import { motion, type Variants } from "framer-motion";
import TiltCard from "@/components/ui/TiltCard";

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

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const card: Variants = {
  hidden: { opacity: 0, y: 64, scale: 0.92, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Services() {
  return (
    <section className="relative w-full py-24 sm:py-32">
      {/* Dotted grid backdrop — continues the hero's atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(rgba(255,255,255,0.16)_1px,transparent_1px)] bg-size-[34px_34px] opacity-10 mask-[radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />

      <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mb-16 px-6 text-center sm:mb-20"
      >
        <h2 className="mx-auto max-w-3xl font-(family-name:--font-space-grotesk) text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          <span className="bg-linear-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            Software built end to end.
          </span>
        </h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 mx-auto grid max-w-6xl gap-5 px-5 sm:grid-cols-2 sm:gap-6 sm:px-10"
      >
        {SERVICES.map((service) => (
          <motion.div key={service.title} variants={card} style={{ transformPerspective: 1200 }}>
            <TiltCard className="group relative flex h-full flex-col gap-6 overflow-hidden rounded-2xl border border-white/15 bg-white/6 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300 hover:bg-white/10 sm:p-10">
              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-colors duration-300 group-hover:border-white/25 group-hover:bg-white/10">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-6 w-6 text-zinc-200 transition-transform duration-300 group-hover:scale-110"
                  >
                    {service.icon}
                  </svg>
                </span>
                <span className="font-(family-name:--font-space-grotesk) text-sm font-semibold text-white/20 transition-colors duration-300 group-hover:text-white/40">
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
              <div className="pointer-events-none absolute -bottom-1/2 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-white/3 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
