"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useEnvironment, Center, Bounds } from "@react-three/drei";
import type { Group } from "three";

export default function Model() {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF("/models/hero-model.glb");

  useFrame((state, delta) => {
    if (groupRef.current) {
      const speed = 0.12 + Math.sin(state.clock.elapsedTime * 0.15) * 0.06;
      groupRef.current.rotation.y += delta * speed;
    }
  });

  return (
    <Bounds fit clip margin={1.6}>
      <group ref={groupRef}>
        <Center>
          <primitive object={scene} />
        </Center>
      </group>
    </Bounds>
  );
}

useGLTF.preload("/models/hero-model.glb");
useEnvironment.preload({ preset: "city" });
