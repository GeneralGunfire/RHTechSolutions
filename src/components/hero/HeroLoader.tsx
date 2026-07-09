"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export default function HeroLoader({
  onReady,
}: {
  onReady: () => void;
}) {
  const { active, progress } = useProgress();
  const [everStarted, setEverStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (active) setEverStarted(true);
  }, [active]);

  useEffect(() => {
    if (everStarted && !active && progress >= 100 && !done) {
      const id = setTimeout(() => {
        setDone(true);
        onReady();
      }, 250);
      return () => clearTimeout(id);
    }
  }, [everStarted, active, progress, done, onReady]);

  if (done) return null;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-linear-to-b from-[#1e2632] via-[#141a24] to-[#0f1319]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-white/70" />
    </div>
  );
}
