"use client";

import { useState } from "react";
import { FaLinkedinIn, FaTwitter, FaBehance, FaInstagram } from "react-icons/fa";
import { cn } from "@/lib/utils";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    behance?: string;
  };
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Rajen C",
    role: "CEO",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&h=1000&fit=crop&crop=faces",
    social: { linkedin: "#" },
  },
  {
    id: "2",
    name: "Huzayfa M",
    role: "Marketing & Product Design",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&h=1000&fit=crop&crop=faces",
    social: { linkedin: "#" },
  },
];

interface TeamShowcaseProps {
  members?: TeamMember[];
}

export default function TeamShowcase({ members = DEFAULT_MEMBERS }: TeamShowcaseProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
      {members.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
          hoveredId={hoveredId}
          onHover={setHoveredId}
        />
      ))}
    </div>
  );
}

function MemberCard({
  member,
  hoveredId,
  onHover,
}: {
  member: TeamMember;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;
  const hasSocial =
    member.social?.twitter ??
    member.social?.linkedin ??
    member.social?.instagram ??
    member.social?.behance;

  return (
    <div
      className={cn(
        "group relative aspect-3/4 w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 transition-opacity duration-300",
        isDimmed ? "opacity-60" : "opacity-100"
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      <img
        src={member.image}
        alt={member.name}
        className="absolute inset-0 h-full w-full object-cover transition-all duration-500"
        style={{
          filter: isActive ? "grayscale(0)" : "grayscale(1)",
          transform: isActive ? "scale(1.03)" : "scale(1)",
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
        <h3 className="font-(family-name:--font-space-grotesk) text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {member.name}
        </h3>
        <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/60 sm:text-sm">
          {member.role}
        </p>

        {hasSocial && (
          <div className="mt-4 flex items-center gap-2">
            {member.social?.twitter && (
              <a
                href={member.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="rounded-full border border-white/15 bg-white/5 p-2 text-white/70 transition-all duration-150 hover:border-white/30 hover:bg-white/15 hover:text-white"
                title="X / Twitter"
              >
                <FaTwitter size={14} />
              </a>
            )}
            {member.social?.linkedin && (
              <a
                href={member.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="rounded-full border border-white/15 bg-white/5 p-2 text-white/70 transition-all duration-150 hover:border-white/30 hover:bg-white/15 hover:text-white"
                title="LinkedIn"
              >
                <FaLinkedinIn size={14} />
              </a>
            )}
            {member.social?.instagram && (
              <a
                href={member.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="rounded-full border border-white/15 bg-white/5 p-2 text-white/70 transition-all duration-150 hover:border-white/30 hover:bg-white/15 hover:text-white"
                title="Instagram"
              >
                <FaInstagram size={14} />
              </a>
            )}
            {member.social?.behance && (
              <a
                href={member.social.behance}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="rounded-full border border-white/15 bg-white/5 p-2 text-white/70 transition-all duration-150 hover:border-white/30 hover:bg-white/15 hover:text-white"
                title="Behance"
              >
                <FaBehance size={14} />
              </a>
            )}
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 transition-all duration-300 group-hover:ring-white/25" />
    </div>
  );
}
