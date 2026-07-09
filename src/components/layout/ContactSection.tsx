export default function ContactSection() {
  return (
    <section
      id="contact"
      className="flex w-full flex-col items-center bg-[#0f1319] px-6 py-24 text-center sm:py-32"
    >
      <span className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
        Let&apos;s talk
      </span>
      <h2 className="mt-4 max-w-2xl font-(family-name:--font-space-grotesk) text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
        Have a project in mind?
      </h2>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
        Whether it&apos;s a new product, an existing platform that needs work,
        or an idea you want to pressure-test — we&apos;d like to hear about it.
      </p>

      <a
        href="mailto:tessyc@mweb.co.za"
        className="mt-10 rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#0f1319] transition-transform duration-200 hover:scale-105"
      >
        Start a conversation
      </a>
    </section>
  );
}
