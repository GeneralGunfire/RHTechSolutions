"use client";

import Image from "next/image";

type Site = {
  name: string;
  description: string;
  image: string;
  url: string;
};

const SITES: Site[] = [
  {
    name: "AutoEnforce ZA",
    description: "Automated traffic enforcement platform for South African municipalities.",
    image: "/images/site-autoenforce.png",
    url: "#",
  },
  {
    name: "Meridian",
    description: "The most comprehensive South African government data collection.",
    image: "/images/site-meridian.png",
    url: "#",
  },
  {
    name: "Private Player",
    description: "A personal music player with a refined, minimal listening experience.",
    image: "/images/site-privateplayer.png",
    url: "#",
  },
  {
    name: "Prospect",
    description: "The all-in-one platform for South African schools, students, and teachers.",
    image: "/images/site-prospect.png",
    url: "#",
  },
];

export default function SiteShowcase() {
  return (
    <section className="flex flex-col">
      {SITES.map((site, i) => (
        <a
          key={site.name}
          href={site.url}
          className="group relative flex h-screen w-full items-end justify-start overflow-hidden bg-black"
        >
          <Image
            src={site.image}
            alt={site.name}
            fill
            sizes="100vw"
            quality={70}
            loading={i === 0 ? "eager" : "lazy"}
            priority={i === 0}
            className="object-cover transition-transform duration-1400 ease-out will-change-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />

          <div className="relative z-10 flex w-full flex-col gap-3 px-8 pb-16 sm:px-16 sm:pb-24">
            <h2 className="w-fit text-4xl font-semibold tracking-tight text-white underline decoration-white/0 underline-offset-8 transition-all duration-300 group-hover:decoration-white/70 sm:text-6xl">
              {site.name}
            </h2>
            <p className="max-w-md text-sm text-zinc-300 sm:text-base">
              {site.description}
            </p>
          </div>
        </a>
      ))}
    </section>
  );
}
