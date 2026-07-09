"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-4 z-50 px-4 sm:top-5 sm:px-6"
    >
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between rounded-full border border-white/10 bg-[#0b0d10]/70 pr-2 pl-5 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl backdrop-saturate-150">
        <a
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Image
            src="/images/logo-nav.png"
            alt="RH Tech Solutions"
            width={651}
            height={462}
            priority
            className="h-8 w-auto object-contain"
          />
        </a>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="mailto:tessyc@mweb.co.za"
          className="group inline-flex items-center gap-1.5 rounded-full bg-white py-2 pr-3 pl-4 text-sm font-semibold text-[#0a0c10] transition-all duration-200 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]"
        >
          Start a project
          <FiArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </motion.header>
  );
}
