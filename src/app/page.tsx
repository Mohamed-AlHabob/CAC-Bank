import About from "@/components/sections/About";
import { Collaboration } from "@/components/sections/collaboration";
import Description from "@/components/sections/Description";
import { Features } from "@/components/sections/features";
import Footer from "@/components/sections/footer";

import  Hero  from "@/components/sections/hero";
import PageSictionShowcase from "@/components/sections/Projects";
import { SamePage } from "@/components/sections/same-page";
import SlidingImages from "@/components/sections/sliding-images";
import { StreamlinedExperience } from "@/components/sections/streamlined-experience";


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
          <About/>
          <Features />
          <SlidingImages />
          <Footer />
        </div>
      </main>
    </>
  );
}