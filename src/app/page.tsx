import Hero from "@/components/hero/Hero";
import SmoothScroll from "@/components/scroll/SmoothScroll";
import WorkJourney from "@/components/journey/WorkJourney";
import ServicesJourney from "@/components/journey/ServicesJourney";
import VoicesJourney from "@/components/journey/VoicesJourney";
import TeamSection from "@/components/journey/TeamSection";
import ClosingSection from "@/components/journey/ClosingSection";
import JourneyBackdrop from "@/components/journey/JourneyBackdrop";

export default function Home() {
  return (
    <SmoothScroll>
      {/* Viewport-locked atmosphere — never scrolls, so section hand-offs
          show no background movement. */}
      <JourneyBackdrop />

      <div className="relative flex flex-col">
        {/* Act I — the hero journey */}
        <Hero />

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
