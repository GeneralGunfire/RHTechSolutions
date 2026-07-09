"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export default function HeroLoader({
  onReady,
}: {
  onReady?: () => void;
}) {
  const { active, progress } = useProgress();
  const [everStarted, setEverStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (active) setEverStarted(true);
  }, [active]);

  useEffect(() => {
    if (everStarted && !active && progress >= 100 && !fadingOut) {
      setFadingOut(true);
      const id = setTimeout(() => {
        setDone(true);
        onReady?.();
      }, 420);
      return () => clearTimeout(id);
    }
  }, [everStarted, active, progress, fadingOut, onReady]);

  if (done) return null;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-10 z-30 flex flex-col items-center gap-3 transition-opacity duration-500 ease-out sm:bottom-14 lg:left-[12%] lg:right-[-12%]"
      style={{ opacity: fadingOut ? 0 : 1 }}
    >
      <div className="h-px w-32 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-linear-to-r from-[#5b7fff] to-white transition-[width] duration-200 ease-out"
          style={{ width: `${Math.max(6, Math.min(100, progress))}%` }}
        />
      </div>
    </div>
  );
}
