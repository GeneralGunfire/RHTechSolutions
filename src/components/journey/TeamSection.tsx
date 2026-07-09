"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { FaLinkedinIn } from "react-icons/fa";
import { BeatShape, KeyframeCameraRig, type Track } from "./three-utils";

type Member = {
  name: string;
  role: string;
  initials: string;
  watermark: string;
  focus: string;
  linkedin?: string;
};

const MEMBERS: Member[] = [
  {
    name: "Rajen C",
    role: "CEO",
    initials: "RC",
    watermark: "R",
    focus: "Direction, engineering, delivery",
    linkedin: "#",
  },
  {
    name: "Huzayfa M",
    role: "Marketing & Product Design",
    initials: "HM",
    watermark: "H",
    focus: "Brand, interface, growth",
    linkedin: "#",
  },
];

/* Camera — dives to each member's shape, sweeps an arc while their card
   holds, and cranes between a high and a low angle across the two beats. */
const CAM_TARGET_X: Track = [
  [0.0, 0],
  [0.18, -0.9],
  [0.49, -0.9],
  [0.56, 0.9],
  [1.0, 0.9],
];

const CAM_RADIUS: Track = [
  [0.0, 5.6],
  [0.22, 2.4],
  [0.42, 3.6],
  [0.51, 4.8],
  [0.58, 3.8],
  [0.68, 2.3],
  [0.82, 3.5],
  [1.0, 5.4],
];

const CAM_ORBIT: Track = [
  [0.0, 0],
  [0.22, -0.55],
  [0.45, 0.4],
  [0.58, 0.55],
  [0.78, -0.45],
  [1.0, -0.1],
];

const CAM_HEIGHT: Track = [
  [0.0, 0.15],
  [0.22, 0.75],
  [0.45, -0.5],
  [0.58, -0.7],
  [0.78, 0.55],
  [1.0, 0.1],
];

// Beats: intro, member 1, member 2. [fadeIn, holdStart, holdEnd, fadeOut]
const INTRO_BEAT: [number, number, number, number] = [0, 0.04, 0.11, 0.17];
const MEMBER_BEATS: [number, number, number, number][] = [
  [0.2, 0.27, 0.42, 0.49],
  [0.55, 0.62, 0.77, 0.84],
];
const SHAPE_RANGES: [number, number][] = [
  [0.2, 0.49],
  [0.55, 0.84],
];
const OUTRO_BEAT: [number, number] = [0.88, 0.96];

function MemberBeat({
  member,
  beat,
  align,
  progress,
}: {
  member: Member;
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
  // The card swings in like a door from its own side, cranes with the
  // camera, and swings back out the other way.
  const x = useTransform(
    progress,
    [a, b, c, d],
    align === "left" ? [-90, 0, 0, 60] : [90, 0, 0, -60]
  );
  const rotateY = useTransform(
    progress,
    [a, b, c, d],
    align === "left" ? [22, 0, 0, -14] : [-22, 0, 0, 14]
  );
  const rotateX = useTransform(progress, [a, b, c, d], [8, 0, 0, -6]);
  const visibility = useTransform(progress, (p) =>
    p >= a && p <= d + 0.01 ? "visible" : "hidden"
  );
  const events = useTransform(progress, (p) =>
    p >= b && p <= c ? "auto" : "none"
  );

  // The watermark letter drifts faster than the card — parallax depth.
  const watermarkY = useTransform(progress, [a, d], [120, -120]);

  return (
    <motion.div
      style={{ opacity, visibility, pointerEvents: events }}
      className="absolute inset-0 z-20"
    >
      {/* Ghosted initial — deep layer */}
      <motion.span
        aria-hidden
        style={{ y: watermarkY }}
        className={`absolute top-[8%] font-(family-name:--font-space-grotesk) text-[36vw] font-bold leading-none text-white/4 select-none sm:text-[24vw] ${
          align === "left" ? "right-[4%]" : "left-[4%]"
        }`}
      >
        {member.watermark}
      </motion.span>

      <motion.div
        style={{
          x,
          y,
          scale,
          rotateY,
          rotateX,
          transformPerspective: 1300,
          filter,
        }}
        className={`mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-6 will-change-transform sm:px-10 lg:px-16 ${
          align === "right" ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`flex max-w-lg flex-col gap-6 rounded-3xl border border-white/12 bg-white/5 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl backdrop-saturate-150 sm:p-10 ${
            align === "right" ? "items-end text-right" : "items-start text-left"
          }`}
        >
          <div className={`flex w-full items-center justify-between ${align === "right" ? "flex-row-reverse" : ""}`}>
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/5 font-(family-name:--font-space-grotesk) text-base font-bold text-zinc-200">
              {member.initials}
            </span>
            <span className="font-(family-name:--font-geist-mono) text-[0.6rem] tracking-[0.3em] text-zinc-500 uppercase">
              Founding team
            </span>
          </div>

          <div>
            <h3 className="font-(family-name:--font-space-grotesk) text-4xl font-bold tracking-tight text-white [text-shadow:0_2px_32px_rgba(0,0,0,0.8)] sm:text-6xl">
              {member.name}
            </h3>
            <p className="mt-2.5 text-xs font-medium uppercase tracking-[0.25em] text-white/60 sm:text-sm">
              {member.role}
            </p>
          </div>

          <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
            {member.focus}
          </p>

          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 py-2.5 pr-5 pl-3.5 text-xs font-semibold text-white/80 transition-all duration-150 hover:border-white/35 hover:bg-white/12 hover:text-white"
            >
              <FaLinkedinIn size={13} />
              LinkedIn
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  const { scrollYProgress: progress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Intro beat — tilts away as the camera dives to the first member.
  const [ia, ib, ic, id] = INTRO_BEAT;
  const introOpacity = useTransform(progress, [ia, ib, ic, id], [0, 1, 1, 0]);
  const introY = useTransform(progress, [ia, id], [50, -90]);
  const introScale = useTransform(progress, [ia, id], [0.96, 1.08]);
  const introRotateX = useTransform(progress, [ia, id], [0, 14]);
  const introBlur = useTransform(progress, [ia, ib, ic, id], [6, 0, 0, 10]);
  const introFilter = useTransform(introBlur, (b) => `blur(${b}px)`);
  const introVisibility = useTransform(progress, (p) =>
    p <= id + 0.01 ? "visible" : "hidden"
  );

  // Outro beat — both monograms, held to the end.
  const outroOpacity = useTransform(progress, [OUTRO_BEAT[0], OUTRO_BEAT[1]], [0, 1]);
  const outroY = useTransform(progress, [OUTRO_BEAT[0], 1], [40, 0]);
  const outroVisibility = useTransform(progress, (p) =>
    p >= OUTRO_BEAT[0] ? "visible" : "hidden"
  );

  const scrimOpacity = useTransform(progress, [0.16, 0.24], [0, 0.3]);

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
    <section ref={sectionRef} className="relative h-[380vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Dotted grid + glows */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] bg-[size:34px_34px] opacity-12 [mask-image:radial-gradient(ellipse_at_50%_50%,black_25%,transparent_72%)]" />
        <div className="pointer-events-none absolute -left-40 top-1/4 z-0 h-160 w-160 rounded-full bg-[#aab4c5]/12 blur-[140px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 z-0 h-96 w-96 rounded-full bg-[#8b95a6]/10 blur-[110px]" />

        {/* 3D scene — one abstract subject per member */}
        <div className="absolute inset-0 z-10 touch-pan-y">
          <Canvas
            camera={{ position: [0, 0, 5.6], fov: 42 }}
            dpr={[1, 1.25]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            frameloop={inView ? "always" : "never"}
          >
            <ambientLight intensity={0.35} />
            <directionalLight position={[5, 6, 5]} intensity={1.0} color="#e8edf5" />
            <directionalLight position={[-6, -1, -4]} intensity={0.3} color="#c3cbd8" />
            <directionalLight position={[0, -4, 2]} intensity={0.25} color="#3a4150" />

            {/* Rajen — structure: nested dodecahedron */}
            <BeatShape progress={progress} range={SHAPE_RANGES[0]} xOffset={-1.2}>
              <mesh>
                <dodecahedronGeometry args={[1.15, 0]} />
                <meshStandardMaterial wireframe transparent color="#dfe5ee" metalness={0.6} roughness={0.3} />
              </mesh>
              <mesh rotation={[0.5, 0.7, 0]}>
                <icosahedronGeometry args={[0.6, 0]} />
                <meshStandardMaterial wireframe transparent color="#8b95a6" metalness={0.6} roughness={0.4} />
              </mesh>
            </BeatShape>

            {/* Huzayfa — craft: ring around a core */}
            <BeatShape progress={progress} range={SHAPE_RANGES[1]} xOffset={1.2} spin={0.15}>
              <mesh rotation={[1.1, 0.3, 0]}>
                <torusGeometry args={[1.05, 0.035, 12, 64]} />
                <meshStandardMaterial wireframe transparent color="#dfe5ee" metalness={0.6} roughness={0.3} />
              </mesh>
              <mesh rotation={[0.4, 1.2, 0.5]}>
                <torusGeometry args={[0.78, 0.03, 10, 56]} />
                <meshStandardMaterial wireframe transparent color="#8b95a6" metalness={0.6} roughness={0.4} />
              </mesh>
              <mesh>
                <icosahedronGeometry args={[0.42, 1]} />
                <meshStandardMaterial wireframe transparent color="#ffffff" metalness={0.7} roughness={0.3} />
              </mesh>
            </BeatShape>

            <Sparkles count={90} scale={[14, 12, 6]} size={2.2} speed={0.3} opacity={0.4} color="#dfe5ee" />
            <Sparkles count={120} scale={[20, 16, 4]} size={1.3} speed={0.18} opacity={0.25} color="#8b95a6" />

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
            The people behind it
          </span>
          <h2 className="max-w-3xl font-(family-name:--font-space-grotesk) text-5xl font-bold tracking-tight [text-shadow:0_2px_32px_rgba(0,0,0,0.8)] sm:text-7xl md:text-8xl">
            <span className="bg-linear-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              Small team. Full ownership.
            </span>
          </h2>
        </motion.div>

        {/* Member beats */}
        {MEMBERS.map((member, i) => (
          <MemberBeat
            key={member.name}
            member={member}
            beat={MEMBER_BEATS[i]}
            align={i % 2 === 0 ? "left" : "right"}
            progress={progress}
          />
        ))}

        {/* Outro beat */}
        <motion.div
          style={{ opacity: outroOpacity, y: outroY, visibility: outroVisibility }}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 px-6 text-center will-change-transform"
        >
          <div className="flex items-center gap-4">
            {MEMBERS.map((member) => (
              <span
                key={member.initials}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/5 font-(family-name:--font-space-grotesk) text-base font-bold text-zinc-200 backdrop-blur-sm"
              >
                {member.initials}
              </span>
            ))}
          </div>
          <p className="max-w-md font-(family-name:--font-space-grotesk) text-2xl font-bold tracking-tight text-white [text-shadow:0_2px_32px_rgba(0,0,0,0.8)] sm:text-4xl">
            Two people. Every detail.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
