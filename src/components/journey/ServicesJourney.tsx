"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  BeatShape,
  JourneyLogo,
  KeyframeCameraRig,
  type Track,
} from "./three-utils";

// Camera keyframe tracks — the same language as the hero's rig, but the
// camera now orbits the ACTIVE shape, not the origin: the lookAt target pans
// across to each subject, the radius dives to macro as a beat lands, the
// orbit sweeps a real arc around the shape WHILE its text holds, and the
// height keys give alternating high/low crane angles per beat.

// Where the camera is looking (x) — pans from shape to shape between beats.
const CAM_TARGET_X: Track = [
  [0.0, 0],
  [0.13, 0.9],
  [0.34, 0.9],
  [0.4, -0.9],
  [0.56, -0.9],
  [0.62, 0.9],
  [0.78, 0.9],
  [0.84, -0.9],
  [1.0, -0.9],
];

// Distance from the subject — each beat dives to a different framing:
// 01 close, 02 extreme macro, 03 a wider establishing shot, 04 close again.
const CAM_RADIUS: Track = [
  [0.0, 5.4],
  [0.15, 1.7],
  [0.29, 2.6],
  [0.36, 4.6],
  [0.42, 3.4],
  [0.51, 1.35],
  [0.58, 4.6],
  [0.64, 2.8],
  [0.73, 3.6],
  [0.8, 4.6],
  [0.86, 2.6],
  [0.97, 1.5],
  [1.0, 2.2],
];

// Orbit around the subject — each hold sweeps a full arc, alternating sides.
const CAM_ORBIT: Track = [
  [0.0, 0],
  [0.15, 0.6],
  [0.29, -0.4],
  [0.42, -0.6],
  [0.51, 0.45],
  [0.64, 0.6],
  [0.73, -0.45],
  [0.86, -0.55],
  [0.94, 0.4],
  [1.0, 0.1],
];

// Crane height — high angle looking down, then low angle looking up.
const CAM_HEIGHT: Track = [
  [0.0, 0.1],
  [0.15, 0.8],
  [0.29, -0.55],
  [0.42, -0.8],
  [0.51, 0.55],
  [0.64, 0.75],
  [0.73, -0.55],
  [0.86, -0.7],
  [0.94, 0.55],
  [1.0, 0.15],
];

type Range = [number, number];

type Service = {
  index: string;
  title: string;
  description: string;
};

const SERVICES: Service[] = [
  {
    index: "01",
    title: "Full-Stack Web Development",
    description:
      "End-to-end product builds — from architecture and backend systems to interfaces people actually enjoy using.",
  },
  {
    index: "02",
    title: "AI-Integrated Development",
    description:
      "Practical AI woven into real products, not bolted on — used to solve genuine workflow and data problems.",
  },
  {
    index: "03",
    title: "Government & Enterprise Systems",
    description:
      "Reliable platforms for municipalities and institutions, built to handle real-world data and scale.",
  },
  {
    index: "04",
    title: "Consumer Products",
    description:
      "Apps and platforms designed for everyday people — simple, fast, and built for the South African context.",
  },
];

// Text beats: [fadeInStart, holdStart, holdEnd, fadeOutEnd].
const TEXT_BEATS: [number, number, number, number][] = [
  [0.15, 0.2, 0.29, 0.34],
  [0.37, 0.42, 0.51, 0.56],
  [0.57, 0.62, 0.71, 0.76],
  // Last beat holds fully visible right through p=1 (holdEnd === fadeOutEnd)
  // so it rides out fully drawn at the hand-off. Framer Motion requires
  // transform input ranges within [0,1].
  [0.79, 0.84, 1, 1],
];

// Shape windows mirror the text beats (fade edges handled in-shader-side).
const SHAPE_RANGES: Range[] = [
  [0.15, 0.34],
  [0.37, 0.56],
  [0.57, 0.76],
  [0.79, 1],
];

function ServiceBeat({
  service,
  beat,
  align,
  progress,
}: {
  service: Service;
  beat: [number, number, number, number];
  align: "left" | "right";
  progress: MotionValue<number>;
}) {
  const [a, b, c, d] = beat;

  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  const y = useTransform(progress, [a, d], [70, -70]);
  const scale = useTransform(progress, [a, b, c, d], [0.92, 1, 1, 1.06]);
  const blur = useTransform(progress, [a, b, c, d], [8, 0, 0, 6]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);
  // The copy pans in from its own side and cranes with the camera — the DOM
  // layer moves with the same language as the 3D behind it.
  const x = useTransform(
    progress,
    [a, b, c, d],
    align === "left" ? [-70, 0, 0, 50] : [70, 0, 0, -50]
  );
  const rotateX = useTransform(
    progress,
    [a, b, c, d],
    align === "left" ? [12, 0, 0, -9] : [-12, 0, 0, 9]
  );
  const visibility = useTransform(progress, (p) =>
    p >= a && p <= d + 0.01 ? "visible" : "hidden"
  );

  return (
    <motion.div
      style={{
        opacity,
        x,
        y,
        scale,
        rotateX,
        transformPerspective: 1100,
        filter,
        visibility,
      }}
      className={`pointer-events-none absolute inset-0 z-20 mx-auto flex w-full max-w-7xl flex-col justify-center px-6 will-change-transform sm:px-10 lg:px-16 ${
        align === "right" ? "items-end text-right" : "items-start text-left"
      }`}
    >
      <span className="mb-4 font-(family-name:--font-geist-mono) text-[0.65rem] tracking-[0.3em] text-zinc-500 uppercase">
        {service.index} / 04
      </span>
      <h3 className="max-w-xl font-(family-name:--font-space-grotesk) text-4xl font-bold leading-[1.05] tracking-tight text-white [text-shadow:0_2px_32px_rgba(0,0,0,0.8)] sm:text-6xl md:text-7xl">
        {service.title}
      </h3>
      <p className="mt-5 max-w-sm text-sm leading-relaxed text-zinc-400 sm:text-base">
        {service.description}
      </p>
    </motion.div>
  );
}

export default function ServicesJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  const { scrollYProgress: progress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Intro beat — visible from p=0 so the incoming frame is never blank.
  const introOpacity = useTransform(progress, [0, 0.08, 0.13], [1, 1, 0]);
  const introY = useTransform(progress, [0, 0.13], [0, -90]);
  const introScale = useTransform(progress, [0, 0.13], [1, 1.08]);
  const introRotateX = useTransform(progress, [0, 0.13], [0, 14]);
  const introBlur = useTransform(progress, [0, 0.08, 0.13], [0, 0, 10]);
  const introFilter = useTransform(introBlur, (b) => `blur(${b}px)`);
  const introVisibility = useTransform(progress, (p) =>
    p <= 0.14 ? "visible" : "hidden"
  );

  const barScale = useTransform(progress, [0.05, 0.97], [0, 1]);
  const railOpacity = useTransform(progress, [0.09, 0.15], [0, 1]);

  // Scrim keeps text readable over the brightest logo angles; it holds to
  // the end since the final beat now rides out fully drawn.
  const scrimOpacity = useTransform(progress, [0.13, 0.2], [0, 0.35]);

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
    <section ref={sectionRef} className="relative h-[560vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 3D scene — same lighting rig as the hero */}
        <div className="absolute inset-0 z-10 touch-pan-y">
          <Canvas
            camera={{ position: [0, 0, 4.4], fov: 42 }}
            dpr={[1, 1.25]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            frameloop={inView ? "always" : "never"}
          >
            <ambientLight intensity={0.35} />
            <directionalLight position={[5, 6, 5]} intensity={1.0} color="#e8edf5" />
            <directionalLight position={[-6, -1, -4]} intensity={0.3} color="#c3cbd8" />
            <directionalLight position={[0, -4, 2]} intensity={0.25} color="#3a4150" />

            {/* The brand logo carries every beat — the camera rig re-frames
                it from a new angle per service, so each beat reads as a
                different shot of the same subject. */}
            <Suspense fallback={null}>
              <BeatShape progress={progress} range={SHAPE_RANGES[0]} xOffset={1.3} spin={0.14}>
                <JourneyLogo />
              </BeatShape>
              <BeatShape progress={progress} range={SHAPE_RANGES[1]} xOffset={-1.3} spin={0.2}>
                <JourneyLogo />
              </BeatShape>
              <BeatShape progress={progress} range={SHAPE_RANGES[2]} xOffset={1.3} spin={0.1}>
                <JourneyLogo />
              </BeatShape>
              <BeatShape progress={progress} range={SHAPE_RANGES[3]} xOffset={-1.3} spin={0.17}>
                <JourneyLogo />
              </BeatShape>
              <Environment preset="city" />
            </Suspense>


            <KeyframeCameraRig
              progress={progress}
              targetX={CAM_TARGET_X}
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

        {/* Intro beat */}
        <motion.div
          style={{
            opacity: introOpacity,
            y: introY,
            scale: introScale,
            rotateX: introRotateX,
            transformPerspective: 1000,
            filter: introFilter,
            visibility: introVisibility,
          }}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center will-change-transform"
        >
          <span className="mb-4 font-(family-name:--font-geist-mono) text-[0.65rem] tracking-[0.3em] text-zinc-500 uppercase">
            What we do
          </span>
          <h2 className="max-w-3xl font-(family-name:--font-space-grotesk) text-5xl font-bold tracking-tight [text-shadow:0_2px_32px_rgba(0,0,0,0.8)] sm:text-7xl md:text-8xl">
            <span className="bg-linear-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              Software built end to end.
            </span>
          </h2>
        </motion.div>

        {/* Service beats */}
        {SERVICES.map((service, i) => (
          <ServiceBeat
            key={service.title}
            service={service}
            beat={TEXT_BEATS[i]}
            align={i % 2 === 0 ? "left" : "right"}
            progress={progress}
          />
        ))}

        {/* Progress rail */}
        <motion.div
          style={{ opacity: railOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-3"
        >
          <div className="h-px w-44 overflow-hidden rounded-full bg-white/10 sm:w-56">
            <motion.div
              style={{ scaleX: barScale }}
              className="h-full w-full origin-left bg-white/60"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
