"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Sparkles, useGLTF } from "@react-three/drei";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Box3, MathUtils, Vector3, type Group } from "three";
import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";
import HeroLoader from "./HeroLoader";

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

// Camera dolly track: starts in extreme macro close-up on the logo,
// pulls back as the user scrolls until the full logo is in frame.
const CAM_TRACK: [number, number][] = [
  [0.0, 1.9],
  [0.15, 2.55],
  [0.3, 3.2],
  [0.5, 3.9],
  [0.7, 4.6],
  [0.9, 5.3],
  [1.0, 5.7],
];

// Orbit track (radians): while the statement beats play, the camera also
// swings around the logo — angle changes, not just spin — and settles back
// to a frontal framing for the closing beat.
const ORBIT_TRACK: [number, number][] = [
  [0.0, 0],
  [0.16, 0.04],
  [0.3, 0.55],
  [0.47, -0.5],
  [0.62, 0.45],
  [0.8, -0.25],
  [0.92, 0],
  [1.0, 0],
];

// Height track: the camera rises and dips through the beats for a
// crane-shot feel alongside the orbit.
const HEIGHT_TRACK: [number, number][] = [
  [0.0, 0],
  [0.24, 0.2],
  [0.4, 0.5],
  [0.56, -0.4],
  [0.74, 0.3],
  [0.9, 0],
  [1.0, 0],
];

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

function CameraRig({ progress }: { progress: MotionValue<number> }) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    const p = progress.get();
    const radius = sampleTrack(CAM_TRACK, p);
    const theta = sampleTrack(ORBIT_TRACK, p);
    const height = sampleTrack(HEIGHT_TRACK, p);

    camera.position.x = MathUtils.damp(camera.position.x, Math.sin(theta) * radius, 5, delta);
    camera.position.z = MathUtils.damp(camera.position.z, Math.cos(theta) * radius, 5, delta);
    camera.position.y = MathUtils.damp(camera.position.y, height, 5, delta);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function ScrollModel({ progress }: { progress: MotionValue<number> }) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF("/models/hero-model.glb");
  const time = useRef(0);

  // Normalize the model (~2.4 world units) and find its centering offset.
  const { norm, offset } = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return { norm: 2.4 / maxDim, offset: center.multiplyScalar(-1) };
  }, [scene]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    time.current += delta;
    const p = progress.get();

    // The model holds center frame; the camera does the zooming. A slight
    // starting offset keeps macro detail under the headline at the top.
    const x = MathUtils.lerp(0.7, 0, MathUtils.clamp(p * 2.5, 0, 1));
    group.position.set(x, 0, 0);
    group.scale.setScalar(norm * 1.6);

    // Scroll drives the spin directly — the page physically turns the logo.
    group.rotation.y = time.current * 0.12 + p * Math.PI * 4;
    group.rotation.x = Math.sin(p * Math.PI) * 0.2;
  });

  return (
    <group ref={groupRef}>
      <group position={offset}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

function StarLayers({ progress }: { progress: MotionValue<number> }) {
  const nearRef = useRef<Group>(null);
  const farRef = useRef<Group>(null);

  useFrame((_, delta) => {
    const p = progress.get();
    // Layers rush upward at different speeds — depth parallax while scrolling.
    if (nearRef.current) {
      nearRef.current.position.y = MathUtils.damp(nearRef.current.position.y, p * 7, 5, delta);
    }
    if (farRef.current) {
      farRef.current.position.y = MathUtils.damp(farRef.current.position.y, p * 3, 5, delta);
    }
  });

  return (
    <>
      <group ref={nearRef}>
        <Sparkles count={80} scale={[14, 16, 6]} size={2.4} speed={0.35} opacity={0.5} color="#dfe5ee" />
      </group>
      <group ref={farRef} position={[0, 0, -4]}>
        <Sparkles count={130} scale={[20, 20, 4]} size={1.4} speed={0.2} opacity={0.3} color="#8b95a6" />
      </group>
    </>
  );
}

const headlineLines = ["South African", "Ready Software"];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);

  // Lenis already smooths the scroll — use raw progress for DOM layers
  // (a spring on top double-smooths and makes the text feel laggy).
  const { scrollYProgress: progress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Beat 1 — headline, parallax layers moving at different speeds.
  // Exits with a deliberate fade + rise + blur + scale-down rather than a
  // plain slide, so it reads as a considered transition instead of a cut.
  const line1Y = useTransform(progress, [0, 0.15], [0, -140]);
  const line2Y = useTransform(progress, [0, 0.15], [0, -220]);
  const subY = useTransform(progress, [0, 0.15], [0, -300]);
  const ctaY = useTransform(progress, [0, 0.15], [0, -360]);
  const beat1Opacity = useTransform(progress, [0, 0.08, 0.15], [1, 1, 0]);
  const beat1Scale = useTransform(progress, [0, 0.15], [1, 0.94]);
  const beat1Blur = useTransform(progress, [0, 0.08, 0.15], [0, 0, 6]);
  const beat1Filter = useTransform(beat1Blur, (b) => `blur(${b}px)`);
  const beat1Visibility = useTransform(progress, (p) =>
    p < 0.15 ? "visible" : "hidden"
  );
  const beat1Events = useTransform(progress, (p) => (p < 0.14 ? "auto" : "none"));

  // Statement beats — each line holds on screen for a long, clear plateau,
  // with a dead gap between beats so only one is ever visible at a time.
  // Each beat now gets more scroll runway (longer hold, slower fade in/out)
  // and animates with a subtle scale + blur alongside the rise, so entries
  // and exits feel considered rather than an abrupt slide.
  const s1Opacity = useTransform(progress, [0.18, 0.24, 0.36, 0.42], [0, 1, 1, 0]);
  const s1Y = useTransform(progress, [0.18, 0.42], [60, -60]);
  const s1Scale = useTransform(progress, [0.18, 0.24, 0.36, 0.42], [0.92, 1, 1, 1.05]);
  const s1Blur = useTransform(progress, [0.18, 0.24, 0.36, 0.42], [8, 0, 0, 6]);
  const s1Filter = useTransform(s1Blur, (b) => `blur(${b}px)`);
  const s1Visibility = useTransform(progress, (p) =>
    p >= 0.18 && p <= 0.43 ? "visible" : "hidden"
  );

  const s2Opacity = useTransform(progress, [0.45, 0.51, 0.62, 0.68], [0, 1, 1, 0]);
  const s2Y = useTransform(progress, [0.45, 0.68], [60, -60]);
  const s2Scale = useTransform(progress, [0.45, 0.51, 0.62, 0.68], [0.92, 1, 1, 1.05]);
  const s2Blur = useTransform(progress, [0.45, 0.51, 0.62, 0.68], [8, 0, 0, 6]);
  const s2Filter = useTransform(s2Blur, (b) => `blur(${b}px)`);
  const s2Visibility = useTransform(progress, (p) =>
    p >= 0.45 && p <= 0.69 ? "visible" : "hidden"
  );

  const s3Opacity = useTransform(progress, [0.71, 0.77, 0.84, 0.89], [0, 1, 1, 0]);
  const s3Y = useTransform(progress, [0.71, 0.89], [60, -60]);
  const s3Scale = useTransform(progress, [0.71, 0.77, 0.84, 0.89], [0.92, 1, 1, 1.05]);
  const s3Blur = useTransform(progress, [0.71, 0.77, 0.84, 0.89], [8, 0, 0, 6]);
  const s3Filter = useTransform(s3Blur, (b) => `blur(${b}px)`);
  const s3Visibility = useTransform(progress, (p) =>
    p >= 0.71 && p <= 0.9 ? "visible" : "hidden"
  );

  // Final beat — "Let's build yours." lands, holds, and then the brand
  // name materialises beneath it as the user keeps scrolling.
  const beat3Opacity = useTransform(progress, [0.91, 0.95, 1], [0, 1, 1]);
  const beat3Scale = useTransform(progress, [0.91, 1], [0.96, 1]);
  const beat3Events = useTransform(progress, (p) => (p > 0.91 ? "auto" : "none"));
  const beat3Visibility = useTransform(progress, (p) =>
    p >= 0.91 ? "visible" : "hidden"
  );

  // Brand reveal — fades in below the closing line: blur sharpens, letter
  // spacing tightens, and it rises into place, all driven by scroll.
  const brandOpacity = useTransform(progress, [0.955, 1], [0, 1]);
  const brandY = useTransform(progress, [0.955, 1], [36, 0]);
  const brandTracking = useTransform(progress, [0.955, 1], ["0.5em", "0.14em"]);
  const brandBlur = useTransform(progress, [0.955, 1], [10, 0]);
  const brandFilter = useTransform(brandBlur, (b) => `blur(${b}px)`);

  // Scrim dims the logo while statement beats are on screen.
  const scrimOpacity = useTransform(
    progress,
    [0.15, 0.24, 0.94, 1],
    [0, 0.42, 0.5, 0.58]
  );

  const glowX = useTransform(progress, [0, 1], ["0%", "-45%"]);
  const hintOpacity = useTransform(progress, [0, 0.06], [1, 0]);

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
    <section ref={sectionRef} className="relative h-[480vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Dotted grid backdrop */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] bg-[size:34px_34px] opacity-15 [mask-image:radial-gradient(ellipse_at_60%_45%,black_25%,transparent_72%)]" />

        {/* Ambient glows */}
        <motion.div
          style={{ x: glowX }}
          className="pointer-events-none absolute right-[-10%] top-1/2 z-0 h-184 w-184 -translate-y-1/2 rounded-full bg-[#aab4c5]/25 blur-[140px]"
        />
        <div className="pointer-events-none absolute -left-32 bottom-0 z-0 h-96 w-96 rounded-full bg-[#8b95a6]/12 blur-[110px]" />

        {/* 3D scene */}
        <div className="absolute inset-0 z-10 touch-pan-y">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 42 }}
            dpr={[1, 1.25]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            frameloop={inView ? "always" : "never"}
          >
            <ambientLight intensity={0.35} />
            <directionalLight position={[5, 6, 5]} intensity={1.0} color="#e8edf5" />
            <directionalLight position={[-6, -1, -4]} intensity={0.3} color="#c3cbd8" />
            <directionalLight position={[0, -4, 2]} intensity={0.25} color="#3a4150" />
            <Suspense fallback={null}>
              <ScrollModel progress={progress} />
              <StarLayers progress={progress} />
              <Environment preset="city" />
            </Suspense>
            <CameraRig progress={progress} />
          </Canvas>
        </div>

        {/* Scrim — dims the logo while statement beats are on screen */}
        <motion.div
          style={{ opacity: scrimOpacity, willChange: "opacity" }}
          className="pointer-events-none absolute inset-0 z-[14] bg-black"
        />

        {/* Vignette — pulls focus to center */}
        <div className="pointer-events-none absolute inset-0 z-[15] bg-[radial-gradient(ellipse_at_55%_45%,transparent_50%,rgba(0,0,0,0.5)_100%)]" />

        <HeroLoader />

        {/* Beat 1 — headline */}
        <motion.div
          style={{
            opacity: beat1Opacity,
            scale: beat1Scale,
            filter: beat1Filter,
            visibility: beat1Visibility,
            pointerEvents: beat1Events,
          }}
          className="relative z-20 mx-auto flex h-full w-full max-w-7xl items-center px-6 will-change-transform sm:px-10 lg:px-16"
        >
          <div className="flex max-w-2xl flex-col items-start text-left">
            <h1 className="mt-7 font-(family-name:--font-space-grotesk) text-5xl font-bold leading-[1.02] tracking-tight [text-shadow:0_2px_28px_rgba(0,0,0,0.6)] sm:text-7xl md:text-8xl">
              {headlineLines.map((line, i) => (
                <motion.span
                  key={line}
                  style={{ y: i === 0 ? line1Y : line2Y }}
                  initial={{ y: 60 }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.25 + i * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={
                    i === 0
                      ? "block text-white will-change-transform"
                      : "block bg-linear-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent will-change-transform"
                  }
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            <motion.p
              style={{ y: subY }}
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg"
            >
              Built, tested, ready.{" "}
              <span className="text-zinc-200">Custom software</span> for schools
              &amp; businesses.
            </motion.p>

            <motion.div
              style={{ y: ctaY }}
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full bg-white py-3.5 pr-6 pl-7 text-sm font-semibold text-[#0a0c10] shadow-[0_0_30px_rgba(255,255,255,0.12)] transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_45px_rgba(255,255,255,0.22)]"
              >
                View Projects
                <FiArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="mailto:tessyc@mweb.co.za"
                className="rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:border-white/35 hover:bg-white/10"
              >
                Contact Us
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* Statement beats — each passes through the frame on its own */}
        <motion.div
          style={{
            opacity: s1Opacity,
            y: s1Y,
            scale: s1Scale,
            filter: s1Filter,
            visibility: s1Visibility,
          }}
          className="pointer-events-none absolute inset-0 z-20 mx-auto flex w-full max-w-7xl flex-col items-start justify-center px-6 text-left will-change-transform sm:px-10 lg:px-16"
        >
          <span className="mb-4 font-(family-name:--font-geist-mono) text-[0.65rem] tracking-[0.3em] text-zinc-500 uppercase">
            01
          </span>
          <p className="font-(family-name:--font-space-grotesk) text-5xl font-bold tracking-tight text-white [text-shadow:0_2px_32px_rgba(0,0,0,0.8)] sm:text-7xl md:text-8xl">
            We design.
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400 sm:text-base">
            Interfaces people actually enjoy using — clean, fast, considered.
          </p>
        </motion.div>

        <motion.div
          style={{
            opacity: s2Opacity,
            y: s2Y,
            scale: s2Scale,
            filter: s2Filter,
            visibility: s2Visibility,
          }}
          className="pointer-events-none absolute inset-0 z-20 mx-auto flex w-full max-w-7xl flex-col items-end justify-center px-6 text-right will-change-transform sm:px-10 lg:px-16"
        >
          <span className="mb-4 font-(family-name:--font-geist-mono) text-[0.65rem] tracking-[0.3em] text-zinc-500 uppercase">
            02
          </span>
          <p className="font-(family-name:--font-space-grotesk) text-5xl font-bold tracking-tight text-white [text-shadow:0_2px_32px_rgba(0,0,0,0.8)] sm:text-7xl md:text-8xl">
            We build.
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400 sm:text-base">
            Robust platforms, engineered and tested end to end.
          </p>
        </motion.div>

        <motion.div
          style={{
            opacity: s3Opacity,
            y: s3Y,
            scale: s3Scale,
            filter: s3Filter,
            visibility: s3Visibility,
          }}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center will-change-transform"
        >
          <span className="mb-4 font-(family-name:--font-geist-mono) text-[0.65rem] tracking-[0.3em] text-zinc-500 uppercase">
            03
          </span>
          <p className="font-(family-name:--font-space-grotesk) text-5xl font-bold tracking-tight [text-shadow:0_2px_32px_rgba(0,0,0,0.8)] sm:text-7xl md:text-8xl">
            <span className="bg-linear-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
              We ship.
            </span>
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400 sm:text-base">
            Real products, live today across South Africa.
          </p>
        </motion.div>

        {/* Beat 3 — closing CTA */}
        <motion.div
          style={{
            opacity: beat3Opacity,
            scale: beat3Scale,
            pointerEvents: beat3Events,
            visibility: beat3Visibility,
          }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-8 px-6 text-center will-change-transform"
        >
          <p className="font-(family-name:--font-space-grotesk) text-4xl font-bold leading-[1.1] tracking-tight text-white [text-shadow:0_2px_32px_rgba(0,0,0,0.8)] sm:text-6xl md:text-7xl">
            Let&apos;s build yours.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:tessyc@mweb.co.za"
              className="group inline-flex items-center gap-2 rounded-full bg-white py-3.5 pr-6 pl-7 text-sm font-semibold text-[#0a0c10] shadow-[0_0_30px_rgba(255,255,255,0.12)] transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_45px_rgba(255,255,255,0.22)]"
            >
              Start a project
              <FiArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#work"
              className="rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:border-white/35 hover:bg-white/10"
            >
              See the work
            </a>
          </div>

          <motion.span
            style={{
              opacity: brandOpacity,
              y: brandY,
              letterSpacing: brandTracking,
              filter: brandFilter,
            }}
            className="mt-4 bg-linear-to-b from-white via-zinc-300 to-zinc-600 bg-clip-text font-(family-name:--font-space-grotesk) text-2xl font-bold uppercase text-transparent will-change-transform sm:text-4xl md:text-5xl"
          >
            RH Tech Solutions
          </motion.span>
        </motion.div>

        {/* Bottom bar — footnote metadata + scroll cue */}
        <motion.div
          style={{ opacity: hintOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between px-6 pb-8 sm:px-10 lg:px-16"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-zinc-400"
          >
            <FiArrowDown className="h-4 w-4" />
          </motion.div>

          <p className="hidden max-w-55 font-(family-name:--font-geist-mono) text-[0.6rem] leading-relaxed tracking-wide text-zinc-500 uppercase sm:block">
            4 products shipped — software engineered for South African schools
            &amp; businesses.
          </p>

          <div className="hidden flex-col items-center gap-2 sm:flex">
            <span className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-zinc-500">
              Scroll
            </span>
            <motion.div
              animate={{ scaleY: [1, 0.4, 1], opacity: [0.7, 0.3, 0.7] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="h-8 w-px origin-top bg-linear-to-b from-white/60 to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

useGLTF.preload("/models/hero-model.glb");
