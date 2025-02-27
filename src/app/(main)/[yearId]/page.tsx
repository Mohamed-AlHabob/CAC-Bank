import { Collaboration } from "@/components/sections/collaboration";
import { Features } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";
import { MoreFeatures } from "@/components/sections/more-features";
import { NoLockin } from "@/components/sections/no-lockin";
import { SamePage } from "@/components/sections/same-page";
import { StreamlinedExperience } from "@/components/sections/streamlined-experience";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <div className="relative z-10 w-full overflow-x-clip">
          <Collaboration />
          <SamePage />
          <StreamlinedExperience />
          <Features />
          <MoreFeatures />
          <NoLockin />
        </div>
      </main>
    </>
  );
}