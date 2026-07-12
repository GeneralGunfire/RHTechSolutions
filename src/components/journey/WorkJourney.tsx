"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

type Project = {
  index: string;
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  image: string;
};

const PROJECTS: Project[] = [
  {
    index: "01",
    name: "AutoEnforce ZA",
    tagline: "Enforcement, automated.",
    description:
      "Automated traffic enforcement platform for South African municipalities — detection, processing, and payment in one pipeline.",
    tags: ["Municipal", "Automation", "Payments"],
    image: "/images/site-autoenforce.webp",
  },
  {
    index: "02",
    name: "Meridian",
    tagline: "Government data, organised.",
    description:
      "The most comprehensive South African government data collection — indexed, searchable, and built for scale.",
    tags: ["Data platform", "Search", "Scale"],
    image: "/images/site-meridian.webp",
  },
  {
    index: "03",
    name: "Ikhaya Analytics",
    tagline: "Property intelligence, mapped.",
    description:
      "Deep, data-driven property insights across South Africa — search, compare, and understand the market before you buy or rent.",
    tags: ["Property", "Analytics", "Data"],
    image: "/images/site-ikhaya.webp",
  },
  {
    index: "04",
    name: "Prospect",
    tagline: "One platform for every school.",
    description:
      "The all-in-one platform for South African schools, students, and teachers — timetables, marks, and communication in one place.",
    tags: ["Education", "Platform", "SaaS"],
    image: "/images/site-prospect.webp",
  },
];

// [fadeInStart, holdStart, holdEnd, fadeOutEnd] per beat.
const BEAT_WINDOWS: [number, number, number, number][] = [
  [0.16, 0.22, 0.31, 0.36],
  [0.38, 0.44, 0.53, 0.58],
  [0.58, 0.64, 0.73, 0.78],
  // Last beat holds fully visible right through p=1 (holdEnd === fadeOutEnd)
  // so the fully drawn scene rides out with the hand-off, never fading to a
  // blank frame. Framer Motion requires transform input ranges within [0,1].
  [0.8, 0.85, 1, 1],
];

function ProjectBeat({
  project,
  beat,
  align,
  dollyIn,
  progress,
}: {
  project: Project;
  beat: [number, number, number, number];
  align: "left" | "right";
  dollyIn: boolean;
  progress: MotionValue<number>;
}) {
  const [a, b, c, d] = beat;

  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  const visibility = useTransform(progress, (p) =>
    p >= a && p <= d + 0.01 ? "visible" : "hidden"
  );

  // The "camera" — each beat gets its own move so no two feel alike.
  // Odd beats dolly in toward the interface, even beats pull back out of it;
  // a perspective tilt + slow roll makes the screenshot read as a surface
  // the camera is flying past rather than a flat image.
  const imgScale = useTransform(
    progress,
    [a, d],
    dollyIn ? [1.04, 1.24] : [1.26, 1.06]
  );
  const imgY = useTransform(progress, [a, d], ["-3.5%", "3.5%"]);
  const rotateX = useTransform(progress, [a, d], dollyIn ? [-5, 4] : [6, -4]);
  const rotateZ = useTransform(
    progress,
    [a, d],
    align === "left" ? [1.4, -1] : [-1.4, 1]
  );

  // Text rides its own slower move over the surface.
  const textY = useTransform(progress, [a, d], [80, -80]);
  const textScale = useTransform(progress, [a, b, c, d], [0.94, 1, 1, 1.05]);
  const textBlur = useTransform(progress, [a, b, c, d], [10, 0, 0, 8]);
  const textFilter = useTransform(textBlur, (v) => `blur(${v}px)`);


  return (
    <motion.div
      style={{ opacity, visibility }}
      className="pointer-events-none absolute inset-0 z-10 will-change-[opacity]"
    >
      {/* Full-bleed screenshot, pulled into the site's palette */}
      <motion.div
        style={{
          scale: imgScale,
          y: imgY,
          rotateX,
          rotateZ,
          transformPerspective: 1400,
          willChange: "transform",
        }}
        className="absolute -inset-[4%]"
      >
        <Image
          src={project.image}
          alt={project.name}
          fill
          sizes="100vw"
          quality={75}
          className="object-cover [filter:saturate(0.95)_brightness(0.8)_contrast(1.04)]"
        />
      </motion.div>

      {/* Reading scrims — kept to the text's corner so the product stays vivid */}
      <div className="absolute inset-0 bg-linear-to-t from-[#050607]/90 via-[#0a0c10]/10 to-[#0a0c10]/35" />
      <div
        className={`absolute inset-0 ${
          align === "left"
            ? "bg-linear-to-r from-[#050607]/70 via-[#0a0c10]/10 to-transparent"
            : "bg-linear-to-l from-[#050607]/70 via-[#0a0c10]/10 to-transparent"
        }`}
      />

      {/* Copy */}
      <motion.div
        style={{ y: textY, scale: textScale, filter: textFilter }}
        className={`absolute inset-0 z-20 mx-auto flex w-full max-w-7xl flex-col justify-end px-6 pb-28 will-change-transform sm:px-10 sm:pb-32 lg:px-16 ${
          align === "right" ? "items-end text-right" : "items-start text-left"
        }`}
      >
        <span className="mb-4 font-(family-name:--font-geist-mono) text-[0.65rem] tracking-[0.3em] text-zinc-400 uppercase">
          {project.index} / 04
        </span>
        <h3 className="font-(family-name:--font-space-grotesk) text-5xl font-bold tracking-tight text-white [text-shadow:0_2px_40px_rgba(0,0,0,0.9)] sm:text-7xl md:text-8xl">
          {project.name}
        </h3>
        <p className="mt-3 bg-linear-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text font-(family-name:--font-space-grotesk) text-xl font-semibold tracking-tight text-transparent sm:text-3xl">
          {project.tagline}
        </p>
        <p
          className={`mt-5 max-w-md text-sm leading-relaxed text-zinc-300 [text-shadow:0_1px_16px_rgba(0,0,0,0.9)] sm:text-base ${
            align === "right" ? "text-right" : ""
          }`}
        >
          {project.description}
        </p>
        <div className={`mt-6 flex flex-wrap gap-2 ${align === "right" ? "justify-end" : ""}`}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/15 bg-[#0a0c10]/60 px-3.5 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-zinc-300 backdrop-blur-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function WorkJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: progress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Intro beat — already fully visible at p=0 so the frame that slides in
  // during the hand-off carries content, never a blank screen.
  const introOpacity = useTransform(progress, [0, 0.09, 0.14], [1, 1, 0]);
  const introY = useTransform(progress, [0, 0.14], [0, -90]);
  const introScale = useTransform(progress, [0, 0.14], [1, 1.08]);
  const introRotateX = useTransform(progress, [0, 0.14], [0, 14]);
  const introBlur = useTransform(progress, [0, 0.09, 0.14], [0, 0, 10]);
  const introFilter = useTransform(introBlur, (b) => `blur(${b}px)`);
  const introVisibility = useTransform(progress, (p) =>
    p <= 0.15 ? "visible" : "hidden"
  );

  const barScale = useTransform(progress, [0.05, 0.97], [0, 1]);
  const railOpacity = useTransform(progress, [0.1, 0.16], [0, 1]);

  return (
    <section ref={sectionRef} className="relative h-[560vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Backdrop is the shared fixed JourneyBackdrop — the section itself
            stays transparent so hand-offs show no background movement. */}

        {/* Project beats — full-bleed cinematic scenes */}
        {PROJECTS.map((project, i) => (
          <ProjectBeat
            key={project.name}
            project={project}
            beat={BEAT_WINDOWS[i]}
            align={i % 2 === 0 ? "left" : "right"}
            dollyIn={i % 2 === 1}
            progress={progress}
          />
        ))}

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
            Selected work
          </span>
          <h2 className="font-(family-name:--font-space-grotesk) text-5xl font-bold tracking-tight [text-shadow:0_2px_32px_rgba(0,0,0,0.8)] sm:text-7xl md:text-8xl">
            <span className="bg-linear-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              Built. Shipped. Live.
            </span>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-400 sm:text-base">
            Four products in production across South Africa.
          </p>
        </motion.div>

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
