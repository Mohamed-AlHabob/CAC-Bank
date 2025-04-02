import { Hero } from "@/components/sections/hero";
import { Description } from "@/components/sections/Description";
import { PageSictionShowcase } from "@/components/sections/Projects";
import { Collaboration } from "@/components/sections/collaboration";
import { SamePage } from "@/components/sections/same-page";
import { StreamlinedExperience } from "@/components/sections/streamlined-experience";
import { CeoMessage } from "@/components/sections/ceo-message";
import { Features } from "@/components/sections/features";
import { SlidingImages } from "@/components/sections/sliding-images";
import { Footer } from "@/components/sections/footer";


export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Description />
        <PageSictionShowcase />
        <div className="relative z-10 w-full overflow-x-clip">
          <Collaboration />
          <SamePage />
          <StreamlinedExperience />
          <CeoMessage/>
          <Features />
          <SlidingImages />
          <Footer />
        </div>
      </main>
    </>
  );
}