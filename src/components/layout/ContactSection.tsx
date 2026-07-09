"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

function MagneticCTA() {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18 });
  const springY = useSpring(y, { stiffness: 200, damping: 18 });

  const handleMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative">
      <motion.span
        animate={{ scale: [1, 1.45], opacity: [0.35, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        className="pointer-events-none absolute inset-0 rounded-full border border-white/40"
      />
      <motion.a
        ref={ref}
        href="mailto:tessyc@mweb.co.za"
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={{ x: springX, y: springY }}
        className="group relative inline-flex items-center gap-2 rounded-full bg-white py-4 pr-7 pl-8 text-sm font-semibold text-[#0a0c10] shadow-[0_0_30px_rgba(255,255,255,0.12)] transition-shadow duration-200 hover:shadow-[0_0_45px_rgba(255,255,255,0.22)]"
      >
        Start a conversation
        <FiArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </motion.a>
    </div>
  );
}

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // The backdrop drifts and the whole block gently scales as it crosses
  // the viewport — continues the parallax depth from the rest of the page.
  const glowY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const gridY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const contentScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 0.94]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[85vh] w-full flex-col items-center justify-center overflow-hidden px-6 py-24 text-center sm:py-36"
    >
      {/* Dotted grid + silver glow — echoes the hero, both parallaxing */}
      <motion.div
        style={{ y: gridY }}
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)] bg-size-[34px_34px] opacity-10 mask-[radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
      />
      <motion.div
        style={{ y: glowY }}
        className="pointer-events-none absolute left-1/2 top-0 z-0 h-96 w-160 -translate-x-1/2 rounded-full bg-[#aab4c5]/10 blur-[130px]"
      />

      <motion.div
        style={{ scale: contentScale }}
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        <h2 className="max-w-2xl font-(family-name:--font-space-grotesk) text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          <span className="bg-linear-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            Have a project in mind?
          </span>
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          Whether it&apos;s a new product, an existing platform that needs work,
          or an idea you want to pressure-test — we&apos;d like to hear about it.
        </p>

        <div className="mt-10">
          <MagneticCTA />
        </div>
      </motion.div>
    </section>
  );
}
