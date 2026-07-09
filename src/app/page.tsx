import Hero from "@/components/hero/Hero";
import SiteShowcase from "@/components/gallery/SiteShowcase";
import StatsBar from "@/components/layout/StatsBar";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <div className="h-10 w-full bg-[#0f1319] sm:h-16" />
      <StatsBar />
      <div id="work">
        <SiteShowcase />
      </div>
    </div>
  );
}
