"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

type Voice = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

const VOICES: Voice[] = [
  {
    quote:
      "RH Tech Solutions took a process that used to take our team days and turned it into something that just works.",
    name: "Naledi Khumalo",
    role: "Operations Lead, Municipal Services",
    initials: "NK",
  },
  {
    quote:
      "Our staff and students actually enjoy using the platform, which says a lot. It was built for real people, not just for a demo.",
    name: "Thandiwe Nkosi",
    role: "Head of IT, School District",
    initials: "TN",
  },
];

// [fadeInStart, holdStart, holdEnd, fadeOutEnd] per quote. The first beat is
// already visible at p=0 (fadeInStart === 0) and the last beat holds fully
// visible through p=1 (holdEnd === fadeOutEnd), so the frames that slide
// in/out at the section hand-offs always carry content. Framer Motion
// requires transform input ranges within [0,1].
const BEATS: [number, number, number, number][] = [
  [0, 0.02, 0.4, 0.48],
  [0.54, 0.62, 1, 1],
];

function BeatDot({
  index,
  active,
}: {
  index: number;
  active: MotionValue<number>;
}) {
  const opacity = useTransform(active, (a) => (a === index ? 1 : 0.25));
  const scale = useTransform(active, (a) => (a === index ? 1.4 : 1));
  return (
    <motion.span
      style={{ opacity, scale }}
      className="h-1.5 w-1.5 rounded-full bg-white"
    />
  );
}

function QuoteBeat({
  voice,
  beat,
  index,
  progress,
}: {
  voice: Voice;
  beat: [number, number, number, number];
  index: number;
  progress: MotionValue<number>;
}) {
  const [a, b, c, d] = beat;

  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  const y = useTransform(progress, [a, d], [70, -70]);
  const scale = useTransform(progress, [a, b, c, d], [0.92, 1, 1, 1.06]);
  const blur = useTransform(progress, [a, b, c, d], [8, 0, 0, 6]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);
  // Each quote tilts up out of the floor and falls away overhead — the same
  // crane-shot feel as the hero, alternating direction per beat.
  const rotateX = useTransform(
    progress,
    [a, b, c, d],
    index % 2 === 0 ? [14, 0, 0, -10] : [-14, 0, 0, 10]
  );
  const visibility = useTransform(progress, (p) =>
    p >= a && p <= d + 0.01 ? "visible" : "hidden"
  );

  return (
    <motion.div
      style={{
        opacity,
        y,
        scale,
        rotateX,
        transformPerspective: 1100,
        filter,
        visibility,
      }}
      className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center will-change-transform"
    >
      <span className="mb-6 font-(family-name:--font-geist-mono) text-[0.65rem] tracking-[0.3em] text-zinc-500 uppercase">
        What people say
      </span>

      <blockquote className="max-w-3xl font-(family-name:--font-space-grotesk) text-2xl font-bold leading-[1.2] tracking-tight text-white [text-shadow:0_2px_32px_rgba(0,0,0,0.8)] sm:text-4xl md:text-5xl">
        &ldquo;{voice.quote}&rdquo;
      </blockquote>

      <div className="mt-10 flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 font-(family-name:--font-space-grotesk) text-sm font-bold text-zinc-200 backdrop-blur-sm">
          {voice.initials}
        </span>
        <div className="text-left">
          <p className="text-sm font-semibold text-white">{voice.name}</p>
          <p className="mt-0.5 text-xs text-zinc-500">{voice.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function VoicesJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: progress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const dotActive = useTransform(progress, (p) => {
    for (let i = BEATS.length - 1; i >= 0; i--) {
      if (p >= BEATS[i][0]) return i;
    }
    return 0;
  });

  return (
    <section ref={sectionRef} className="relative h-[300vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {VOICES.map((voice, i) => (
          <QuoteBeat
            key={voice.name}
            voice={voice}
            beat={BEATS[i]}
            index={i}
            progress={progress}
          />
        ))}

        {/* Beat dots */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex items-center justify-center gap-2.5">
          {VOICES.map((_, i) => (
            <BeatDot key={i} index={i} active={dotActive} />
          ))}
        </div>
      </div>
    </section>
  );
}
