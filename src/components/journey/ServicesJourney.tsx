"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  MathUtils,
  type Group,
  type Material,
  type Mesh,
} from "three";

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function sampleTrack(track: [number, number][], p: number) {
  let a = track[0];
  let b = track[track.length - 1];
  for (let i = 0; i < track.length - 1; i++) {
    if (p >= track[i][0] && p <= track[i + 1][0]) {
      a = track[i];
      b = track[i + 1];
      break;
    }
  }
  return MathUtils.lerp(a[1], b[1], smoothstep(a[0], b[0], p));
}

// Camera keyframe tracks — the same language as the hero's rig, but the
// camera now orbits the ACTIVE shape, not the origin: the lookAt target pans
// across to each subject, the radius dives to macro as a beat lands, the
// orbit sweeps a real arc around the shape WHILE its text holds, and the
// height keys give alternating high/low crane angles per beat.

// Where the camera is looking (x) — pans from shape to shape between beats.
const CAM_TARGET_X: [number, number][] = [
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

// Distance from the subject — macro dive on each beat, pull-out between.
const CAM_RADIUS: [number, number][] = [
  [0.0, 5.4],
  [0.15, 2.3],
  [0.29, 3.7],
  [0.36, 4.6],
  [0.42, 3.9],
  [0.51, 2.3],
  [0.58, 4.6],
  [0.64, 2.2],
  [0.73, 3.7],
  [0.8, 4.6],
  [0.86, 3.9],
  [0.94, 2.4],
  [1.0, 5.2],
];

// Orbit around the subject — each hold sweeps a full arc, alternating sides.
const CAM_ORBIT: [number, number][] = [
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
const CAM_HEIGHT: [number, number][] = [
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

/* ------------------------------------------------------------------ */
/*  3D layer — one wireframe object per service, crossfaded by scroll */
/* ------------------------------------------------------------------ */

type Range = [number, number];

// Each service owns a scroll window; its shape fades/scales in and out.
function BeatShape({
  progress,
  range,
  xOffset,
  spin = 0.22,
  children,
}: {
  progress: MotionValue<number>;
  range: Range;
  xOffset: number;
  spin?: number;
  children: ReactNode;
}) {
  const groupRef = useRef<Group>(null);
  const time = useRef(0);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    time.current += delta;
    const p = progress.get();
    const [a, b] = range;
    const vis =
      smoothstep(a - 0.03, a + 0.05, p) * (1 - smoothstep(b - 0.05, b + 0.03, p));

    group.visible = vis > 0.005;
    if (!group.visible) return;

    // Slower self-spin — the camera provides the angle changes now, and a
    // fast-spinning subject would cancel the orbit out visually.
    group.scale.setScalar(0.85 + vis * 0.35);
    group.position.set(xOffset, (1 - vis) * -0.4, 0);
    group.rotation.y = time.current * spin * 0.5 + p * Math.PI;
    group.rotation.x = Math.sin(time.current * 0.16) * 0.18;

    group.traverse((obj) => {
      const material = (obj as Mesh).material as Material | undefined;
      if (material) material.opacity = vis;
    });
  });

  return <group ref={groupRef}>{children}</group>;
}

function CameraRig({ progress }: { progress: MotionValue<number> }) {
  const { camera } = useThree();
  const lookX = useRef(0);

  useFrame((_, delta) => {
    const p = progress.get();
    const targetX = sampleTrack(CAM_TARGET_X, p);
    const radius = sampleTrack(CAM_RADIUS, p);
    const theta = sampleTrack(CAM_ORBIT, p);
    const height = sampleTrack(CAM_HEIGHT, p);

    // Orbit the active subject, not the origin — this is what makes the
    // framing actually change angle instead of just translating.
    camera.position.x = MathUtils.damp(
      camera.position.x,
      targetX + Math.sin(theta) * radius,
      5,
      delta
    );
    camera.position.z = MathUtils.damp(camera.position.z, Math.cos(theta) * radius, 5, delta);
    camera.position.y = MathUtils.damp(camera.position.y, height, 5, delta);
    lookX.current = MathUtils.damp(lookX.current, targetX, 5, delta);
    camera.lookAt(lookX.current, 0, 0);
  });

  return null;
}

/* ------------------------------------------------------------------ */

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
  [0.59, 0.64, 0.73, 0.78],
  [0.81, 0.86, 0.94, 0.99],
];

// Shape windows mirror the text beats (fade edges handled in-shader-side).
const SHAPE_RANGES: Range[] = [
  [0.15, 0.34],
  [0.37, 0.56],
  [0.59, 0.78],
  [0.81, 0.99],
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

  // Intro beat — tilts away overhead as the camera dives to the first shape.
  const introOpacity = useTransform(progress, [0, 0.03, 0.08, 0.13], [0, 1, 1, 0]);
  const introY = useTransform(progress, [0, 0.13], [50, -90]);
  const introScale = useTransform(progress, [0, 0.13], [0.96, 1.08]);
  const introRotateX = useTransform(progress, [0, 0.13], [0, 14]);
  const introBlur = useTransform(progress, [0, 0.03, 0.08, 0.13], [6, 0, 0, 10]);
  const introFilter = useTransform(introBlur, (b) => `blur(${b}px)`);
  const introVisibility = useTransform(progress, (p) =>
    p <= 0.14 ? "visible" : "hidden"
  );

  const barScale = useTransform(progress, [0.05, 0.97], [0, 1]);
  const railOpacity = useTransform(progress, [0.09, 0.15], [0, 1]);

  // Scrim keeps text readable over the brightest shape angles.
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
        {/* Dotted grid backdrop */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] bg-[size:34px_34px] opacity-12 [mask-image:radial-gradient(ellipse_at_50%_50%,black_25%,transparent_72%)]" />

        {/* Ambient glows */}
        <div className="pointer-events-none absolute -left-40 top-1/4 z-0 h-160 w-160 rounded-full bg-[#aab4c5]/15 blur-[140px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 z-0 h-96 w-96 rounded-full bg-[#8b95a6]/10 blur-[110px]" />

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

            {/* 01 — Full-stack: interlocking structure */}
            <BeatShape progress={progress} range={SHAPE_RANGES[0]} xOffset={1.3}>
              <mesh>
                <icosahedronGeometry args={[1.2, 1]} />
                <meshStandardMaterial wireframe transparent color="#dfe5ee" metalness={0.6} roughness={0.3} />
              </mesh>
              <mesh rotation={[0.4, 0.8, 0]}>
                <icosahedronGeometry args={[0.7, 0]} />
                <meshStandardMaterial wireframe transparent color="#8b95a6" metalness={0.6} roughness={0.4} />
              </mesh>
            </BeatShape>

            {/* 02 — AI: continuous woven knot */}
            <BeatShape progress={progress} range={SHAPE_RANGES[1]} xOffset={-1.3} spin={0.3}>
              <mesh>
                <torusKnotGeometry args={[0.85, 0.24, 140, 18]} />
                <meshStandardMaterial wireframe transparent color="#dfe5ee" metalness={0.6} roughness={0.3} />
              </mesh>
            </BeatShape>

            {/* 03 — Government & enterprise: nested lattice */}
            <BeatShape progress={progress} range={SHAPE_RANGES[2]} xOffset={1.3} spin={0.16}>
              <mesh>
                <boxGeometry args={[1.6, 1.6, 1.6]} />
                <meshStandardMaterial wireframe transparent color="#dfe5ee" metalness={0.6} roughness={0.3} />
              </mesh>
              <mesh rotation={[0.79, 0.79, 0]}>
                <boxGeometry args={[1.0, 1.0, 1.0]} />
                <meshStandardMaterial wireframe transparent color="#8b95a6" metalness={0.6} roughness={0.4} />
              </mesh>
              <mesh rotation={[0.4, 0.4, 0.4]}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial wireframe transparent color="#ffffff" metalness={0.7} roughness={0.3} />
              </mesh>
            </BeatShape>

            {/* 04 — Consumer: a sphere of individual points (people) */}
            <BeatShape progress={progress} range={SHAPE_RANGES[3]} xOffset={-1.3} spin={0.12}>
              <points>
                <sphereGeometry args={[1.2, 28, 28]} />
                <pointsMaterial size={0.028} transparent color="#dfe5ee" sizeAttenuation />
              </points>
              <mesh>
                <sphereGeometry args={[0.55, 20, 20]} />
                <meshStandardMaterial wireframe transparent color="#8b95a6" metalness={0.6} roughness={0.4} />
              </mesh>
            </BeatShape>

            <Sparkles count={90} scale={[14, 12, 6]} size={2.2} speed={0.3} opacity={0.4} color="#dfe5ee" />
            <Sparkles count={120} scale={[20, 16, 4]} size={1.3} speed={0.18} opacity={0.25} color="#8b95a6" />

            <CameraRig progress={progress} />
          </Canvas>
        </div>

        {/* Scrim + vignette */}
        <motion.div
          style={{ opacity: scrimOpacity, willChange: "opacity" }}
          className="pointer-events-none absolute inset-0 z-[14] bg-black"
        />
        <div className="pointer-events-none absolute inset-0 z-[15] bg-[radial-gradient(ellipse_at_50%_45%,transparent_50%,rgba(0,0,0,0.5)_100%)]" />

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
