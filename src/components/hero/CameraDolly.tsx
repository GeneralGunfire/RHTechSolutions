"use client";

import { useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Spherical, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const HOLD_CLOSE = 10500;
const FADE_OUT = 400;
const FADE_IN = 500;
const CLOSE_FACTOR = 0.014;
const WIDE_FACTOR = 0.014;
const ANGLE_SHIFT = Math.PI * 0.65;
const CLOSE_PHI = Math.PI * 0.55;
const WIDE_PHI = Math.PI * 0.5;

type Phase = "close" | "fadeOut" | "cut" | "fadeIn" | "wide";

export default function CameraDolly({
  paused,
  controlsRef,
  fadeElementRef,
}: {
  paused: boolean;
  controlsRef: RefObject<OrbitControlsImpl | null>;
  fadeElementRef?: RefObject<HTMLDivElement | null>;
}) {
  const { camera } = useThree();
  const baseRadius = useRef(0);
  const baseTheta = useRef(0);
  const elapsed = useRef(0);
  const phase = useRef<Phase>("close");
  const phaseElapsed = useRef(0);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls || paused) return;

    const dt = delta * 1000;
    elapsed.current += dt;
    phaseElapsed.current += dt;

    const current = new Spherical().setFromVector3(
      camera.position.clone().sub(controls.target)
    );

    if (phase.current === "close") {
      // Track the live fitted distance/angle so our close framing is
      // always relative to whatever Bounds actually set up.
      baseRadius.current = current.radius / CLOSE_FACTOR;
      baseTheta.current = current.theta;
      current.radius = baseRadius.current * CLOSE_FACTOR;
      current.phi = CLOSE_PHI;

      if (elapsed.current >= HOLD_CLOSE) {
        phase.current = "fadeOut";
        phaseElapsed.current = 0;
      }
    } else if (phase.current === "fadeOut") {
      current.radius = baseRadius.current * CLOSE_FACTOR;
      current.phi = CLOSE_PHI;
      if (fadeElementRef?.current) {
        const t = Math.min(1, phaseElapsed.current / FADE_OUT);
        fadeElementRef.current.style.opacity = String(1 - t);
      }
      if (phaseElapsed.current >= FADE_OUT) {
        phase.current = "cut";
      }
    } else if (phase.current === "cut") {
      current.radius = baseRadius.current * WIDE_FACTOR;
      current.theta = baseTheta.current + ANGLE_SHIFT;
      current.phi = WIDE_PHI;
      const position = new Vector3().setFromSpherical(current).add(controls.target);
      camera.position.copy(position);
      controls.update();
      phase.current = "fadeIn";
      phaseElapsed.current = 0;
      return;
    } else if (phase.current === "fadeIn") {
      current.radius = baseRadius.current * WIDE_FACTOR;
      current.phi = WIDE_PHI;
      if (fadeElementRef?.current) {
        const t = Math.min(1, phaseElapsed.current / FADE_IN);
        fadeElementRef.current.style.opacity = String(t);
      }
      if (phaseElapsed.current >= FADE_IN) {
        phase.current = "wide";
      }
    } else {
      current.radius = baseRadius.current * WIDE_FACTOR;
      current.phi = WIDE_PHI;
    }

    const position = new Vector3().setFromSpherical(current).add(controls.target);
    camera.position.copy(position);
    controls.update();
  });

  return null;
}
