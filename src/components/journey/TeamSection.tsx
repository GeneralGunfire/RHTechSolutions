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
import { FaLinkedinIn } from "react-icons/fa";
import { BeatShape, JourneyLogo, KeyframeCameraRig, type Track } from "./three-utils";

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

// Member 1 gets an extreme macro dive; member 2 a close orbiting shot.
const CAM_RADIUS: Track = [
  [0.0, 5.6],
  [0.22, 1.4],
  [0.42, 2.6],
  [0.51, 4.8],
  [0.58, 3.2],
  [0.68, 1.7],
  [0.82, 2.8],
  [1.0, 5.0],
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
const OUTRO_BEAT: [number, number] = [0.84, 0.9];

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


  return (
    <motion.div
      style={{ opacity, visibility, pointerEvents: events }}
      className="absolute inset-0 z-20"
    >
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

  // Intro beat — visible from p=0 so the incoming frame is never blank.
  const [ia, ib, ic, id] = INTRO_BEAT;
  const introOpacity = useTransform(progress, [ia, ib, ic, id], [1, 1, 1, 0]);
  const introY = useTransform(progress, [ia, id], [0, -90]);
  const introScale = useTransform(progress, [ia, id], [1, 1.08]);
  const introRotateX = useTransform(progress, [ia, id], [0, 14]);
  const introBlur = useTransform(progress, [ia, ib, ic, id], [0, 0, 0, 10]);
  const introFilter = useTransform(introBlur, (b) => `blur(${b}px)`);
  const introVisibility = useTransform(progress, (p) =>
    p <= id + 0.01 ? "visible" : "hidden"
  );

  // Outro beat — both monograms; releases before the section unpins so the
  // hand-off to the closing act stays seamless.
  const outroOpacity = useTransform(
    progress,
    [OUTRO_BEAT[0], OUTRO_BEAT[1], 1],
    [0, 1, 1]
  );
  const outroY = useTransform(progress, [OUTRO_BEAT[0], OUTRO_BEAT[1], 1], [40, 0, 0]);
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
        {/* 3D scene — the logo, one beat per member */}
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

            {/* The brand logo again — one beat per member, the camera rig
                framing it from a fresh high/low angle for each. */}
            <Suspense fallback={null}>
              <BeatShape progress={progress} range={SHAPE_RANGES[0]} xOffset={-1.2} spin={0.12}>
                <JourneyLogo />
              </BeatShape>
              <BeatShape progress={progress} range={SHAPE_RANGES[1]} xOffset={1.2} spin={0.18}>
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
