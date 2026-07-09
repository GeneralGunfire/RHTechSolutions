import TeamShowcase from "@/components/ui/team-showcase";

export default function TeamShowcaseDemo() {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-14 max-w-xl text-center">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
          The people behind it
        </span>
        <h3 className="mt-4 font-(family-name:--font-space-grotesk) text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Meet the team.
        </h3>
      </div>

      <TeamShowcase />
    </div>
  );
}
