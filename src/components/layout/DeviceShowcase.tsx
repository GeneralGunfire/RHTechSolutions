"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function DeviceShowcase() {
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = imgWrapRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="flex w-full flex-col items-center bg-linear-to-b from-[#1e2632] via-[#141a24] to-[#1e2632] pt-20 pb-0 sm:pt-28">
      <div
        ref={imgWrapRef}
        className="relative w-full overflow-hidden transition-all duration-1000 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.98)",
        }}
      >
        <Image
          src="/images/sa-flag-banner.png"
          alt="A stylized South African flag, painted in brushstroke style"
          width={1983}
          height={793}
          sizes="100vw"
          quality={90}
          className="h-auto w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#1e2632] via-transparent to-[#1e2632] mask-[linear-gradient(to_bottom,black_0%,transparent_8%,transparent_92%,black_100%)]" />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_20px_rgba(20,26,36,0.55)]" />
      </div>
    </section>
  );
}
