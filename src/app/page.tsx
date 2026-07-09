import Hero from "@/components/hero/Hero";
import SmoothScroll from "@/components/scroll/SmoothScroll";
import WorkJourney from "@/components/journey/WorkJourney";
import ServicesJourney from "@/components/journey/ServicesJourney";
import VoicesJourney from "@/components/journey/VoicesJourney";
import TeamSection from "@/components/journey/TeamSection";
import ClosingSection from "@/components/journey/ClosingSection";

export default function Home() {
  return (
    <SmoothScroll>
      <div className="flex flex-col bg-[#0a0c10]">
        {/* Act I — the hero journey */}
        <div className="bg-linear-to-b from-[#050607] via-[#0c0e11] to-[#0a0c10]">
          <Hero />
        </div>

        {/* Act II — the work, drawn in code, one beat per product */}
        <div id="work">
          <WorkJourney />
        </div>

        {/* Act III — what we do, told in 3D */}
        <div id="services">
          <ServicesJourney />
        </div>

        {/* Act IV — the people who use it */}
        <VoicesJourney />

        {/* Act V — the people behind it */}
        <TeamSection />

        {/* Act VI — the invitation */}
        <div id="contact">
          <ClosingSection />
        </div>
      </div>
    </SmoothScroll>
  );
}
