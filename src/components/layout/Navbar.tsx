import Image from "next/image";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="border-b border-white/5 bg-white/3 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:h-18 sm:px-8">
          <a
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Image
              src="/images/logo-transparent.png"
              alt="RH Tech Solutions"
              width={657}
              height={569}
              priority
              className="h-8 w-auto object-contain sm:h-9"
            />
          </a>

          <nav className="flex items-center gap-8">
            <a
              href="#work"
              className="hidden text-sm font-medium text-zinc-300 transition-colors hover:text-white sm:inline-block"
            >
              Work
            </a>
            <a
              href="mailto:tessyc@mweb.co.za"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/10"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
