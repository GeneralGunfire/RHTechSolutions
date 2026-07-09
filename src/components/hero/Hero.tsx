"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import Model from "./Model";
import CameraDolly from "./CameraDolly";
import HeroLoader from "./HeroLoader";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const [userInteracting, setUserInteracting] = useState(false);
  const [inView, setInView] = useState(true);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleStart = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    setUserInteracting(true);
  };

  const handleEnd = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setUserInteracting(false), 5000);
  };

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden"
    >
      <div className="pointer-events-none absolute right-[-8%] top-1/2 z-0 h-[42rem] w-[42rem] -translate-y-1/2 rounded-full bg-[#3a6bff]/22 blur-[130px]" />
      <div className="pointer-events-none absolute -left-32 bottom-0 z-0 h-96 w-96 rounded-full bg-[#5b7fff]/12 blur-[110px]" />
      <div className="pointer-events-none absolute inset-x-[8%] bottom-[6%] z-[5] h-40 rounded-[100%] bg-[#4f7bff]/18 blur-[90px] lg:left-[30%] lg:right-[-4%]" />

      <div
        ref={fadeRef}
        className="absolute inset-0 z-10 touch-pan-y lg:left-[12%] lg:right-[-12%]"
        style={{ willChange: "opacity" }}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 40 }}
          dpr={[1, 1.25]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          frameloop={inView ? "always" : "never"}
        >
          <ambientLight intensity={0.35} />
          <directionalLight position={[5, 6, 5]} intensity={1.0} color="#7ea2ff" />
          <directionalLight position={[-6, -1, -4]} intensity={0.3} color="#6b8cff" />
          <directionalLight position={[0, -4, 2]} intensity={0.25} color="#3a4a6b" />
          <Suspense fallback={null}>
            <Model />
            <Environment preset="city" />
            <ContactShadows
              frames={1}
              position={[0, -1.4, 0]}
              opacity={0.55}
              scale={12}
              blur={2.2}
              far={4.5}
              color="#0a0e18"
            />
          </Suspense>
          <CameraDolly
            paused={userInteracting}
            controlsRef={controlsRef}
            fadeElementRef={fadeRef}
          />
          <OrbitControls
            ref={controlsRef}
            makeDefault
            enableDamping={false}
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.8}
            onStart={handleStart}
            onEnd={handleEnd}
          />
        </Canvas>
      </div>

      <HeroLoader />

      <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-1 items-center px-6 sm:px-10 lg:px-16">
        <div className="pointer-events-none flex max-w-xl flex-col items-start text-left">
          <span className="text-xs font-medium uppercase tracking-[0.35em] text-zinc-400">
            RH Tech Solutions
          </span>
          <h1 className="mt-5 font-(family-name:--font-space-grotesk) text-4xl font-bold leading-[1.05] tracking-tight text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.6)] sm:text-6xl md:text-7xl">
            South African Ready Software
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-300 sm:text-lg">
            Built, tested, ready. Custom software for schools &amp;
            businesses.
          </p>

          <div className="pointer-events-auto mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#work"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#0a0c10] transition-transform duration-200 hover:scale-105"
            >
              View Projects
            </a>
            <a
              href="mailto:tessyc@mweb.co.za"
              className="rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:border-white/40 hover:bg-white/10"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
