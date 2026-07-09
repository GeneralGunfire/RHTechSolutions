import Hero from "@/components/hero/Hero";
import SiteShowcase from "@/components/gallery/SiteShowcase";
import StatsBar from "@/components/layout/StatsBar";
import StatementSection from "@/components/layout/StatementSection";
import Services from "@/components/layout/Services";
import DeviceShowcase from "@/components/layout/DeviceShowcase";
import { ShuffleCards } from "@/components/ui/testimonial-cards-demo";
import TeamShowcaseDemo from "@/components/ui/team-showcase-demo";
import ContactSection from "@/components/layout/ContactSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <div className="h-24 w-full bg-[#0f1319] sm:h-40" />
      <StatsBar />
      <div className="h-8 w-full bg-[#1e2632] sm:h-12" />
      <div id="work">
        <SiteShowcase />
      </div>
      <div className="h-24 w-full bg-[#0f1319] sm:h-40" />
      <StatementSection />
      <DeviceShowcase />
      <section className="flex w-full flex-col items-center bg-linear-to-b from-[#242e3d] to-[#0f1319] px-6 pt-10 pb-24 sm:pt-14 sm:pb-32">
        <h2 className="mb-20 max-w-3xl px-6 text-center font-(family-name:--font-space-grotesk) text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
          Made for the average user.
        </h2>
        <div className="flex w-full flex-col items-center gap-32 sm:gap-40">
          <ShuffleCards />
          <TeamShowcaseDemo />
        </div>
      </section>
      <div className="h-16 w-full bg-[#0f1319] sm:h-24" />
      <Services />
      <ContactSection />
      <Footer />
    </div>
  );
}
