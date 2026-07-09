import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/8 bg-[#0f1319] px-6 py-16 sm:py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8">
        <Image
          src="/images/logo-transparent.png"
          alt="RH Tech Solutions"
          width={657}
          height={569}
          className="h-11 w-auto object-contain opacity-90 sm:h-14"
        />

        <nav className="flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#work" className="transition-colors hover:text-white">
            Work
          </a>
          <a href="#contact" className="transition-colors hover:text-white">
            Contact
          </a>
          <a
            href="mailto:tessyc@mweb.co.za"
            className="transition-colors hover:text-white"
          >
            tessyc@mweb.co.za
          </a>
        </nav>

        <div className="h-px w-full max-w-xs bg-white/10" />

        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} RH Tech Solutions. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
