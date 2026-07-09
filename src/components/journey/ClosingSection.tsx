"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { type Group } from "three";
import { FiArrowUpRight } from "react-icons/fi";
import { KeyframeCameraRig, type Track } from "./three-utils";

/* Camera — a straight fly-through: it starts far outside the ring gate,
   sways gently while the statements play, and pushes through the rings so
   the CTA lands with the camera inside the portal. */
const CAM_RADIUS: Track = [
  [0.0, 8.0],
  [0.18, 6.6],
  [0.34, 5.6],
  [0.5, 4.6],
  [0.66, 3.4],
  [0.82, 2.2],
  [1.0, 1.05],
];

const CAM_ORBIT: Track = [
  [0.0, 0],
  [0.2, 0.2],
  [0.4, -0.16],
  [0.6, 0.13],
  [0.8, -0.08],
  [1.0, 0],
];

const CAM_HEIGHT: Track = [
  [0.0, 0.4],
  [0.3, -0.3],
  [0.55, 0.25],
  [0.8, -0.12],
  [1.0, 0],
];

// Concentric wireframe rings the camera flies through — the "gate".
function RingGate() {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    group.children.forEach((ring, i) => {
      ring.rotation.z += delta * 0.06 * (i % 2 === 0 ? 1 : -1);
    });
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <torusGeometry args={[1.7, 0.02, 12, 80]} />
        <meshStandardMaterial wireframe transparent opacity={0.45} color="#dfe5ee" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, -1.6]} rotation={[0, 0, 0.5]}>
        <torusGeometry args={[2.4, 0.018, 10, 72]} />
        <meshStandardMaterial wireframe transparent opacity={0.3} color="#8b95a6" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, -3.4]} rotation={[0, 0, -0.4]}>
        <torusGeometry args={[3.2, 0.015, 10, 64]} />
        <meshStandardMaterial wireframe transparent opacity={0.2} color="#8b95a6" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 1.4]} rotation={[0, 0, 0.8]}>
        <torusGeometry args={[1.1, 0.014, 10, 56]} />
        <meshStandardMaterial wireframe transparent opacity={0.35} color="#ffffff" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

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

export default function ClosingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  const { scrollYProgress: progress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Beat 1 — "You've seen the work."
  const s1Opacity = useTransform(progress, [0.04, 0.11, 0.24, 0.31], [0, 1, 1, 0]);
  const s1Y = useTransform(progress, [0.04, 0.31], [70, -70]);
  const s1Scale = useTransform(progress, [0.04, 0.11, 0.24, 0.31], [0.92, 1, 1, 1.06]);
  const s1RotateX = useTransform(progress, [0.04, 0.11, 0.24, 0.31], [12, 0, 0, -9]);
  const s1Blur = useTransform(progress, [0.04, 0.11, 0.24, 0.31], [8, 0, 0, 6]);
  const s1Filter = useTransform(s1Blur, (v) => `blur(${v}px)`);
  const s1Visibility = useTransform(progress, (p) =>
    p >= 0.04 && p <= 0.32 ? "visible" : "hidden"
  );

  // Beat 2 — "Have a project in mind?"
  const s2Opacity = useTransform(progress, [0.36, 0.43, 0.56, 0.63], [0, 1, 1, 0]);
  const s2Y = useTransform(progress, [0.36, 0.63], [70, -70]);
  const s2Scale = useTransform(progress, [0.36, 0.43, 0.56, 0.63], [0.92, 1, 1, 1.06]);
  const s2RotateX = useTransform(progress, [0.36, 0.43, 0.56, 0.63], [-12, 0, 0, 9]);
  const s2Blur = useTransform(progress, [0.36, 0.43, 0.56, 0.63], [8, 0, 0, 6]);
  const s2Filter = useTransform(s2Blur, (v) => `blur(${v}px)`);
  const s2Visibility = useTransform(progress, (p) =>
    p >= 0.36 && p <= 0.64 ? "visible" : "hidden"
  );

  // Beat 3 — the CTA lands as the camera clears the gate, then the brand
  // materialises beneath it, exactly like the hero's closing move.
  const ctaOpacity = useTransform(progress, [0.68, 0.76, 1], [0, 1, 1]);
  const ctaScale = useTransform(progress, [0.68, 1], [0.94, 1]);
  const ctaEvents = useTransform(progress, (p) => (p > 0.7 ? "auto" : "none"));
  const ctaVisibility = useTransform(progress, (p) =>
    p >= 0.68 ? "visible" : "hidden"
  );

  const brandOpacity = useTransform(progress, [0.84, 0.98], [0, 1]);
  const brandY = useTransform(progress, [0.84, 0.98], [36, 0]);
  const brandTracking = useTransform(progress, [0.84, 0.98], ["0.5em", "0.14em"]);
  const brandBlur = useTransform(progress, [0.84, 0.98], [10, 0]);
  const brandFilter = useTransform(brandBlur, (b) => `blur(${b}px)`);

  const scrimOpacity = useTransform(progress, [0.04, 0.12, 1], [0, 0.3, 0.42]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.02 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full">
      <div className="relative h-[340vh] w-full">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Dotted grid + glow */}
          <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] bg-[size:34px_34px] opacity-10 [mask-image:radial-gradient(ellipse_at_50%_50%,black_25%,transparent_72%)]" />
          <div className="pointer-events-none absolute left-1/2 top-1/3 z-0 h-140 w-140 -translate-x-1/2 rounded-full bg-[#aab4c5]/12 blur-[140px]" />

          {/* 3D scene — the ring gate */}
          <div className="absolute inset-0 z-10 touch-pan-y">
            <Canvas
              camera={{ position: [0, 0.4, 8], fov: 42 }}
              dpr={[1, 1.25]}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              frameloop={inView ? "always" : "never"}
            >
              <ambientLight intensity={0.35} />
              <directionalLight position={[5, 6, 5]} intensity={1.0} color="#e8edf5" />
              <directionalLight position={[-6, -1, -4]} intensity={0.3} color="#c3cbd8" />
              <directionalLight position={[0, -4, 2]} intensity={0.25} color="#3a4150" />

              <RingGate />
              <Sparkles count={110} scale={[12, 10, 10]} size={2.2} speed={0.3} opacity={0.4} color="#dfe5ee" />
              <Sparkles count={140} scale={[18, 14, 8]} size={1.3} speed={0.18} opacity={0.25} color="#8b95a6" />

              <KeyframeCameraRig
                progress={progress}
                radius={CAM_RADIUS}
                orbit={CAM_ORBIT}
                height={CAM_HEIGHT}
              />
            </Canvas>
          </div>

          {/* Scrim + vignette */}
          <motion.div
            style={{ opacity: scrimOpacity, willChange: "opacity" }}
            className="pointer-events-none absolute inset-0 z-[14] bg-black"
          />
          <div className="pointer-events-none absolute inset-0 z-[15] bg-[radial-gradient(ellipse_at_50%_45%,transparent_50%,rgba(0,0,0,0.5)_100%)]" />

          {/* Beat 1 */}
          <motion.div
            style={{
              opacity: s1Opacity,
              y: s1Y,
              scale: s1Scale,
              rotateX: s1RotateX,
              transformPerspective: 1100,
              filter: s1Filter,
              visibility: s1Visibility,
            }}
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center will-change-transform"
          >
            <span className="mb-4 font-(family-name:--font-geist-mono) text-[0.65rem] tracking-[0.3em] text-zinc-500 uppercase">
              The invitation
            </span>
            <p className="font-(family-name:--font-space-grotesk) text-5xl font-bold tracking-tight text-white [text-shadow:0_2px_32px_rgba(0,0,0,0.8)] sm:text-7xl md:text-8xl">
              You&apos;ve seen the work.
            </p>
          </motion.div>

          {/* Beat 2 */}
          <motion.div
            style={{
              opacity: s2Opacity,
              y: s2Y,
              scale: s2Scale,
              rotateX: s2RotateX,
              transformPerspective: 1100,
              filter: s2Filter,
              visibility: s2Visibility,
            }}
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center will-change-transform"
          >
            <p className="max-w-3xl font-(family-name:--font-space-grotesk) text-5xl font-bold tracking-tight [text-shadow:0_2px_32px_rgba(0,0,0,0.8)] sm:text-7xl md:text-8xl">
              <span className="bg-linear-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                Have a project in mind?
              </span>
            </p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              Whether it&apos;s a new product, an existing platform that needs
              work, or an idea you want to pressure-test.
            </p>
          </motion.div>

          {/* Beat 3 — CTA */}
          <motion.div
            style={{
              opacity: ctaOpacity,
              scale: ctaScale,
              pointerEvents: ctaEvents,
              visibility: ctaVisibility,
            }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-8 px-6 text-center will-change-transform"
          >
            <p className="font-(family-name:--font-space-grotesk) text-4xl font-bold leading-[1.1] tracking-tight text-white [text-shadow:0_2px_32px_rgba(0,0,0,0.8)] sm:text-6xl md:text-7xl">
              Let&apos;s talk.
            </p>

            <MagneticCTA />

            <motion.span
              style={{
                opacity: brandOpacity,
                y: brandY,
                letterSpacing: brandTracking,
                filter: brandFilter,
              }}
              className="mt-2 bg-linear-to-b from-white via-zinc-300 to-zinc-600 bg-clip-text font-(family-name:--font-space-grotesk) text-2xl font-bold uppercase text-transparent will-change-transform sm:text-4xl md:text-5xl"
            >
              RH Tech Solutions
            </motion.span>
          </motion.div>
        </div>
      </div>

      {/* Footer — normal flow after the finale */}
      <div className="relative z-10 w-full border-t border-white/8 px-6 py-14 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex max-w-7xl flex-col items-center gap-8"
        >
          <Image
            src="/images/logo-transparent.png"
            alt="RH Tech Solutions"
            width={657}
            height={569}
            className="h-11 w-auto object-contain opacity-90 transition-opacity duration-300 hover:opacity-100 sm:h-14"
          />

          <nav className="flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#work" className="transition-colors hover:text-white">
              Work
            </a>
            <a href="#services" className="transition-colors hover:text-white">
              Services
            </a>
          </nav>

          <div className="h-px w-full max-w-xs bg-white/10" />

          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} RH Tech Solutions. All rights reserved.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
