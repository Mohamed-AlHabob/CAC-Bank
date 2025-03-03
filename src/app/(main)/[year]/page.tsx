import { Collaboration } from "@/components/sections/collaboration";
import { Features } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";
import { SamePage } from "@/components/sections/same-page";
import { StreamlinedExperience } from "@/components/sections/streamlined-experience";

export default function Home() {
  return (
    <>
      <main>
        <div className=" mt-70">
        <Hero />
        </div>
        <div className="relative z-10 w-full overflow-x-clip">
          <Collaboration />
          <SamePage />
          <StreamlinedExperience />
          <Features />
        </div>
      </main>
    </>
  );
}