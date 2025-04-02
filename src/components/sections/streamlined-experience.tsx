"use client";
import { stylesWithCssVar } from "@/utils/motion";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const StreamlinedExperience = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end end"],
  });
  const textX = useTransform(scrollYProgress, [0.1, 0.7], ["100%", "-100%"]);
  const opacitySection = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0.7, 0.9], [1, 0.7]);

  const opacityBorder = useTransform(
    scrollYProgress,
    [0.7, 0.71, 0.72],
    [1, 1, 0]
  );
  const finalTextOpacity = useTransform(
    scrollYProgress,
    [0.7, 0.71, 0.72, 0.8, 0.9],
    [0, 0, 1, 1, 0]
  );

  const finalTextScale = useTransform(scrollYProgress, [0.8, 0.9], [1, 0.7]);

  return (
    <div className=" ">
    <motion.section
      style={stylesWithCssVar({
        opacity: opacitySection,
        "--scale": scale,
        "--opacity-border": opacityBorder,
      })}
      ref={targetRef}
      className="mt-[50vh] flex h-[500vh] items-start justify-start"
    >
      <div className="sticky top-1/2 left-1/2 min-h-[20rem] md:min-h-[30rem] lg:min-h-[50rem] min-w-[100vw] sm:min-w-[80vw] md:min-w-[60rem] lg:min-w-[50rem] md:-translate-x-1/2  -translate-y-1/2 whitespace-nowrap before:absolute before:inset-0 before:scale-[var(--scale)] before:border-[1rem] sm:before:border-[1.5rem] lg:before:border-[2.5rem] before:border-[#CEF144] before:opacity-[var(--opacity-border)]">
        <motion.p
          aria-hidden
          style={{ x: textX, y: "-50%" }}
          className="whitespace-nowrap min-w-screen absolute top-1/2 left-[calc(-50vw+12rem)] sm:left-[calc(-50vw+15rem)] md:left-[calc(-50vw+20rem)] lg:left-[calc(-50vw+25rem)] text-[8rem] sm:text-[12rem] md:text-[18rem] lg:text-[23rem] text-heading"
        >
          Steadfastness Experiences.
        </motion.p>
        <motion.p
          aria-hidden
          style={{ x: textX, y: "-50%" }}
          className="whitespace-nowrap min-w-screen absolute top-1/2 left-[calc(-50vw+12rem)] sm:left-[calc(-50vw+15rem)] md:left-[calc(-50vw+20rem)] lg:left-[calc(-50vw+25rem)] z-[11] text-[8rem] sm:text-[12rem] md:text-[18rem] lg:text-[23rem] text-transparent [-webkit-text-stroke:1px_var(--color-heading)]"
        >
          Steadfastness Experiences.
        </motion.p>

        <motion.p
          style={{
            opacity: finalTextOpacity,
            scale: finalTextScale,
            y: "-50%",
            x: "-50%",
          }}
          className="absolute left-1/2 top-1/2 text-[4rem] sm:text-[5.5rem] md:text-[7rem] lg:text-[8.8rem] leading-tight text-center"
        >
          Steadfastness
          <br />
          Experiences.
        </motion.p>
        <span className="absolute left-[calc(50%*var(--scale)+50%)] top-0 z-10 h-full w-[50vw] origin-left scale-[var(--scale)] bg-background opacity-[var(--opacity-border)]" />
        <span className="absolute left-[calc(50%*var(--scale)+50%-(1rem*var(--scale))] sm:left-[calc(50%*var(--scale)+50%-(1.5rem*var(--scale)))] lg:left-[calc(50%*var(--scale)+50%-(2.5rem*var(--scale)))] top-0 z-[12] h-full w-[50vw] origin-left scale-[var(--scale)] border-l-[1rem] sm:border-l-[1.5rem] lg:border-l-[2.5rem] border-[#CEF144] opacity-[var(--opacity-border)]" />
      </div>
    </motion.section>
    </div>
  );
};