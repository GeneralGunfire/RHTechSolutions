import Hero from "@/components/hero/Hero";
import SmoothScroll from "@/components/scroll/SmoothScroll";
import Reveal from "@/components/scroll/Reveal";
import SiteShowcase from "@/components/gallery/SiteShowcase";
import Services from "@/components/layout/Services";
import { ShuffleCards } from "@/components/ui/testimonial-cards-demo";
import TeamShowcaseDemo from "@/components/ui/team-showcase-demo";
import ContactSection from "@/components/layout/ContactSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <div className="flex flex-col bg-[#0a0c10]">
        {/* Act I — the hero journey */}
        <div className="bg-linear-to-b from-[#050607] via-[#0c0e11] to-[#0a0c10]">
          <Hero />
        </div>

        {/* Act II — the work, pinned horizontal gallery */}
        <div id="work">
          <SiteShowcase />
        </div>

        {/* Act III — who it's for */}
        <section className="flex w-full flex-col items-center px-6 pt-6 pb-24 sm:pb-32">
          <Reveal className="mb-20 flex flex-col items-center">
            <h2 className="max-w-3xl px-6 text-center font-(family-name:--font-space-grotesk) text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              <span className="bg-linear-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                Made for the average user.
              </span>
            </h2>
          </Reveal>
          <div className="flex w-full flex-col items-center gap-32 sm:gap-40">
            <ShuffleCards />
            <TeamShowcaseDemo />
          </div>
        </section>

        {/* Act IV — what we do */}
        <div id="services">
          <Services />
        </div>

        {/* Act V — the invitation */}
        <div id="contact">
          <ContactSection />
        </div>

        <Footer />
      </div>
    </SmoothScroll>
  );
}
