"use client";

import { useRef, type ReactNode } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, type Group, type Material, type Mesh } from "three";
import type { MotionValue } from "framer-motion";

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export type Track = [number, number][];

export function sampleTrack(track: Track, p: number) {
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

// Keyframe camera rig — the hero's language, reusable. Position is spherical
// around a pannable lookAt target: radius = dolly, orbit = swing around the
// subject, height = crane. All values damped so the moves feel weighted.
export function KeyframeCameraRig({
  progress,
  radius,
  orbit,
  height,
  targetX,
}: {
  progress: MotionValue<number>;
  radius: Track;
  orbit: Track;
  height: Track;
  targetX?: Track;
}) {
  const { camera } = useThree();
  const lookX = useRef(0);

  useFrame((_, delta) => {
    const p = progress.get();
    const tx = targetX ? sampleTrack(targetX, p) : 0;
    const r = sampleTrack(radius, p);
    const theta = sampleTrack(orbit, p);
    const h = sampleTrack(height, p);

    camera.position.x = MathUtils.damp(camera.position.x, tx + Math.sin(theta) * r, 5, delta);
    camera.position.z = MathUtils.damp(camera.position.z, Math.cos(theta) * r, 5, delta);
    camera.position.y = MathUtils.damp(camera.position.y, h, 5, delta);
    lookX.current = MathUtils.damp(lookX.current, tx, 5, delta);
    camera.lookAt(lookX.current, 0, 0);
  });

  return null;
}

// A group that owns a scroll window: fades/scales in for its beat, spins
// slowly (the camera provides the real angle changes), fades back out.
export function BeatShape({
  progress,
  range,
  xOffset = 0,
  spin = 0.11,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  xOffset?: number;
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

    group.scale.setScalar(0.85 + vis * 0.35);
    group.position.set(xOffset, (1 - vis) * -0.4, 0);
    group.rotation.y = time.current * spin + p * Math.PI;
    group.rotation.x = Math.sin(time.current * 0.16) * 0.18;

    group.traverse((obj) => {
      const material = (obj as Mesh).material as Material | undefined;
      if (material) material.opacity = vis;
    });
  });

  return <group ref={groupRef}>{children}</group>;
}
