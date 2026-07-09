"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

type Site = {
  name: string;
  description: string;
  image: string;
  url: string;
};

const SITES: Site[] = [
  {
    name: "AutoEnforce ZA",
    description: "Automated traffic enforcement platform for South African municipalities.",
    image: "/images/site-autoenforce.png",
    url: "#",
  },
  {
    name: "Meridian",
    description: "The most comprehensive South African government data collection.",
    image: "/images/site-meridian.png",
    url: "#",
  },
  {
    name: "Private Player",
    description: "A personal music player with a refined, minimal listening experience.",
    image: "/images/site-privateplayer.png",
    url: "#",
  },
  {
    name: "Prospect",
    description: "The all-in-one platform for South African schools, students, and teachers.",
    image: "/images/site-prospect.png",
    url: "#",
  },
];

// Card geometry (vw units) — used to derive the horizontal track shift.
const CARD_W = 84;
const CARD_GAP = 3;
const FIRST_OFFSET = (100 - CARD_W) / 2;

function GalleryCard({
  site,
  index,
  progress,
}: {
  site: Site;
  index: number;
  progress: MotionValue<number>;
}) {
  const count = SITES.length;
  // Inner image drifts against the track — depth parallax per card.
  const imgX = useTransform(
    progress,
    [Math.max(0, (index - 1) / count), Math.min(1, (index + 1) / count)],
    ["-5%", "5%"]
  );

  return (
    <a
      href={site.url}
      className="group relative h-[80vh] w-[92vw] shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_30px_80px_rgba(0,0,0,0.5)] sm:w-[84vw]"
    >
      <motion.div
        style={{ x: imgX, willChange: "transform" }}
        className="absolute inset-y-0 -inset-x-[6%]"
      >
        <Image
          src={site.image}
          alt={site.name}
          fill
          sizes="92vw"
          quality={70}
          loading={index === 0 ? "eager" : "lazy"}
          priority={index === 0}
          className="object-cover transition-transform duration-1200 ease-out will-change-transform group-hover:scale-105"
        />
      </motion.div>
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-black/25" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-8 sm:p-12">
        <h3 className="flex items-center gap-3 font-(family-name:--font-space-grotesk) text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          {site.name}
          <FiArrowUpRight className="h-6 w-6 text-white/0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white/80 sm:h-9 sm:w-9" />
        </h3>
        <p className="max-w-md text-sm text-zinc-300 sm:text-base">
          {site.description}
        </p>
      </div>
    </a>
  );
}

export default function SiteShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Vertical scroll drives the track sideways while the section is pinned.
  const lastShift = FIRST_OFFSET - (SITES.length - 1) * (CARD_W + CARD_GAP);
  const x = useTransform(
    scrollYProgress,
    [0.06, 0.94],
    [`${FIRST_OFFSET}vw`, `${lastShift}vw`]
  );
  const barScale = useTransform(scrollYProgress, [0.06, 0.94], [0, 1]);

  return (
    <section ref={sectionRef} className="relative h-[320vh] w-full">
      <div className="sticky top-0 flex h-screen w-full flex-col justify-center gap-8 overflow-hidden py-10 sm:gap-10">
        {/* Faint grid keeps the hero's atmosphere going */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[size:34px_34px] opacity-10 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

        <motion.div style={{ x }} className="relative z-10 flex gap-[3vw] will-change-transform">
          {SITES.map((site, i) => (
            <GalleryCard key={site.name} site={site} index={i} progress={scrollYProgress} />
          ))}
        </motion.div>

        {/* Track progress */}
        <div className="relative z-10 mx-auto h-px w-44 overflow-hidden rounded-full bg-white/10 sm:w-56">
          <motion.div
            style={{ scaleX: barScale }}
            className="h-full w-full origin-left bg-white/60"
          />
        </div>
      </div>
    </section>
  );
}
