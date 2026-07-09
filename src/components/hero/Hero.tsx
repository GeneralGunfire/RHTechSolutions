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
  const [ready, setReady] = useState(false);
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
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-linear-to-b from-[#1e2632] via-[#141a24] to-[#0f1319]"
    >
      <div
        ref={fadeRef}
        className="absolute inset-0 z-10 touch-pan-y"
        style={{ willChange: "opacity" }}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 40 }}
          dpr={[1, 1.25]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          frameloop={inView ? "always" : "never"}
        >
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 6, 5]} intensity={1.1} color="#a9c3ff" />
          <directionalLight position={[-6, -1, -4]} intensity={0.45} color="#ff9d5c" />
          <directionalLight position={[0, -4, 2]} intensity={0.25} color="#3a4a6b" />
          <Suspense fallback={null}>
            <Model />
            <Environment preset="city" />
            <ContactShadows
              frames={1}
              position={[0, -1.4, 0]}
              opacity={0.35}
              scale={10}
              blur={2.5}
              far={4}
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

      <HeroLoader onReady={() => setReady(true)} />

      <div
        className="pointer-events-none relative z-20 flex flex-col items-center px-6 text-center transition-opacity duration-700 ease-out"
        style={{ opacity: ready ? 1 : 0 }}
      >
        <h1 className="font-(family-name:--font-space-grotesk) text-5xl font-bold tracking-tight text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.6)] sm:text-7xl md:text-8xl">
          RH Tech Solutions
        </h1>
      </div>
    </section>
  );
}
