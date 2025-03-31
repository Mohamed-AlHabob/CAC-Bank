"use client";
import { stylesWithCssVar } from "@/utils/motion";
import { useScroll, useTransform, motion, MotionStyle } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { Chart } from "../global/Chart";
import { useYear } from "../context/YearContext";

export const Features = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);
    const { currentYear } = useYear();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.9, 1], [0.8, 0.8, 1]);
  const x = useTransform(scrollYProgress, [0.3, 1], ["50%", "0%"]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 0.6, 0.85, 0.9],
    [1, 1, 0.4, 0.4, 1]
  );

  const text1Opacity = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.5],
    [0, 1, 0]
  );
  const text1Y = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.5],
    ["30px", "0px", "-30px"]
  );

  const text2Opacity = useTransform(
    scrollYProgress,
    [0.5, 0.6, 0.7],
    [0, 1, 0]
  );
  const text2Y = useTransform(
    scrollYProgress,
    [0.5, 0.6, 0.7],
    ["30px", "0px", "-30px"]
  );

  const text3Opacity = useTransform(
    scrollYProgress,
    [0.7, 0.8, 0.9],
    [0, 1, 0]
  );
  const text3Y = useTransform(
    scrollYProgress,
    [0.7, 0.8, 0.9],
    ["30px", "0px", "-30px"]
  );

  const height = useTransform(scrollYProgress, [0, 0.9], [50, 0]);

  return (
    <section
      ref={targetRef}
      className="flex h-[500vh] flex-col items-center justify-start relative"
    >
      <div className="sticky top-0 z-20 w-full  backdrop-blur-md py-6">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="mt-20 text-2xl">
            &quot;{currentYear?.ceosMessage}.&quot;
          </p>
          <p className="mt-2 text-gray-500 italic">— Dr. Ibrahim Al-Houthi {currentYear?.fiscalYear}</p>
        </div>
      </div>

      <div className="sticky top-[16.7vh] h-[66.8vh] px-16 text-2xl leading-[1] [&_p]:w-[45rem] [&_p]:max-w-[90%]">
        <motion.div style={{ x, scale }} className="relative h-full">
          <motion.figure style={{ opacity }} className="h-full">
            <Chart />
          </motion.figure>
          <motion.figure style={{ opacity: text2Opacity }}>
            <Image
              src="/command-palette.svg"
              width={50}
              height={50}
              alt="Command Palette"
              className="absolute inset-0 h-full w-auto"
            />
          </motion.figure>
          <motion.figure style={{ opacity: text3Opacity }}>
            <Image
              src="/devtools.svg"
              width={50}
              height={50}
              alt="Devtools"
              className="absolute inset-0 h-full w-auto"
            />
          </motion.figure>
        </motion.div>
        <motion.p
          style={stylesWithCssVar({
            opacity: text1Opacity,
            "--y": text1Y,
          }) as MotionStyle}
          className="translate-y-centered-offset absolute top-1/2 left-0 text-white dark:text-black"
        >
          <span >Preconfigured environments</span>
          <br />
          We detect your environment so you don&apos;t need to fiddle with
          configuration files.
        </motion.p>
        <motion.p
          style={stylesWithCssVar({
            opacity: text2Opacity,
            "--y": text2Y,
          }) as MotionStyle}
          className="translate-y-centered-offset absolute top-1/2 left-0 text-white dark:text-black"
        >
          <span>Command Palette</span>
          <br />
          Access and complete any action in seconds with the command palette.
        </motion.p>
        <motion.p
          style={stylesWithCssVar({
            opacity: text3Opacity,
            "--y": text3Y,
          }) as MotionStyle}
          className="translate-y-centered-offset absolute top-1/2 left-0 text-white dark:text-black"
        >
          <span>Devtools</span>
          <br />
          We&apos;ve bundled useful tools to help you get your work done faster and
          more efficiently.
        </motion.p>
      </div>
      {/* --- Background Transition Element --- */}
      <motion.div style={{ height }} className="relative mt-[100px]">
        <div className="absolute h-[1550%] w-[120%] left-[-10%] rounded-b-[50%] bg-accent-foreground z-10 shadow-[0px_60px_50px_rgba(0,0,0,0.748)]"></div>
      </motion.div>
    </section>
  );
};
