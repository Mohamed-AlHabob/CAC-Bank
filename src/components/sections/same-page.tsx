"use client";
import { BranchIcon } from "@/icons/branch";
import { stylesWithCssVar } from "@/utils/motion";
import { useScroll, useTransform, motion, MotionStyle } from "framer-motion";
import { useRef } from "react";
import { useYear } from "../context/YearContext";
import { AnnualReportChart } from "../global/annual-report-chart";

const animationOrder = {
  initial: 0,
  fadeInEnd: 0.15,
  showParagraphOne: 0.25,
  hideParagraphOne: 0.3,
  showParagraphTwoStart: 0.35,
  showParagraphTwoEnd: 0.4,
  hideParagraphTwo: 0.5,
  showLoadingScreenStart: 0.53,
  showLoadingScreenEnd: 0.58,
  createBranchStart: 0.65,
  createBranchEnd: 0.7,
  createBranchFadeInStart: 0.78,
  createBranchFadeInEnd: 0.85,
  endTextFadeInStart: 0.95,
  endTextFadeInEnd: 1,
};

export const SamePage = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { currentYear } = useYear();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end end"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [
      animationOrder.initial,
      animationOrder.fadeInEnd,
      animationOrder.createBranchEnd,
      animationOrder.endTextFadeInStart,
    ],
    [0, 1, 1, 0]
  );
  const scale = useTransform(
    scrollYProgress,
    [
      animationOrder.initial,
      animationOrder.fadeInEnd,
      animationOrder.showLoadingScreenEnd,
      animationOrder.createBranchStart,
    ],
    [3, 1, 1, 0.5]
  );
  const x = useTransform(
    scrollYProgress,
    [
      animationOrder.initial,
      animationOrder.showParagraphOne,
      animationOrder.hideParagraphOne,
      animationOrder.showParagraphTwoStart,
      animationOrder.showParagraphTwoEnd,
      animationOrder.hideParagraphTwo,
      animationOrder.showLoadingScreenStart,
      animationOrder.showLoadingScreenEnd,
      animationOrder.createBranchEnd,
    ],
    ["50%", "50%", "55%", "-50%", "-50%", "-55%", "0%", "0%", "-27%"]
  );

  const loadingScreenOpacity = useTransform(
    scrollYProgress,
    [
      animationOrder.showLoadingScreenStart,
      animationOrder.showLoadingScreenEnd,
    ],
    [0, 1]
  );
  const loadingScreenX = useTransform(
    scrollYProgress,
    [animationOrder.createBranchStart, animationOrder.createBranchEnd],
    ["0%", "27%"]
  );
  const loadingScreenscale = useTransform(
    scrollYProgress,
    [animationOrder.createBranchStart, animationOrder.createBranchEnd],
    [1, 0.5]
  );

  const paragraph1Opacity = useTransform(
    scrollYProgress,
    [
      animationOrder.fadeInEnd + 0.02,
      animationOrder.showParagraphOne,
      animationOrder.hideParagraphOne,
    ],
    [0, 1, 0]
  );
  const paragraph1TranslateY = useTransform(
    scrollYProgress,
    [
      animationOrder.fadeInEnd + 0.02,
      animationOrder.showParagraphOne,
      animationOrder.hideParagraphOne,
    ],
    ["4rem", "0rem", "-4rem"]
  );

  const paragraph2Opacity = useTransform(
    scrollYProgress,
    [
      animationOrder.showParagraphTwoStart,
      animationOrder.showParagraphTwoEnd,
      animationOrder.hideParagraphTwo,
    ],
    [0, 1, 0]
  );
  const paragraph2TranslateY = useTransform(
    scrollYProgress,
    [
      animationOrder.showParagraphTwoStart,
      animationOrder.showParagraphTwoEnd,
      animationOrder.hideParagraphTwo,
    ],
    ["4rem", "0rem", "-4rem"]
  );

  const newBranchOpacity = useTransform(
    scrollYProgress,
    [
      animationOrder.createBranchFadeInStart,
      animationOrder.createBranchFadeInEnd,
    ],
    [0, 1]
  );

  const endTextOpacity = useTransform(
    scrollYProgress,
    [animationOrder.endTextFadeInStart, animationOrder.endTextFadeInEnd],
    [0, 1]
  );

  const endTexty = useTransform(
    scrollYProgress,
    [animationOrder.endTextFadeInStart, animationOrder.endTextFadeInEnd],
    ["4rem", "0rem"]
  );

  const position = useTransform(scrollYProgress, (pos) =>
    pos >= 1 ? "relative" : "fixed"
  );

  return (
    <section ref={targetRef}>
      <div className="relative h-[800vh] sm:h-[600vh] md:h-[700vh]"> {/* Adjust height based on screen size */}
        <div className="sticky top-1/2 flex origin-center -translate-y-1/2 justify-center">
          <motion.div
            className="translate-x-centered-offset absolute left-1/2 top-1/2 flex w-[50vw] sm:w-[60vw] md:w-[50vw] -translate-y-1/2 scale-[var(--scale)] flex-col items-center justify-center"
            style={stylesWithCssVar({
              opacity,
              "--x": x,
              "--scale": scale,
            }) as MotionStyle}
          >
            <AnnualReportChart />
            <motion.span
              className="mt-3 block text-2xl sm:text-3xl lg:text-4xl"  // Adjust text size
              style={{ opacity: newBranchOpacity }}
            >
              <BranchIcon className="mr-3 inline-block h-12 w-12 sm:h-16 sm:w-16" />
              2024
            </motion.span>
          </motion.div>
          <motion.div
            className="translate-x-centered-offset absolute left-1/2 top-1/2 flex w-[50vw] sm:w-[60vw] md:w-[50vw] -translate-y-1/2 scale-[var(--scale)] flex-col items-center justify-center"
            style={stylesWithCssVar({
              opacity: loadingScreenOpacity,
              "--x": loadingScreenX,
              "--scale": loadingScreenscale,
            }) as MotionStyle}
          >
            <AnnualReportChart />
            <motion.div
              style={{ opacity: newBranchOpacity }}
              className="absolute inset-0"
            >
              <AnnualReportChart />
            </motion.div>
            <motion.span
              className="mt-3 block text-2xl sm:text-3xl lg:text-4xl"
              style={{ opacity: newBranchOpacity }}
            >
              <BranchIcon className="mr-3 inline-block h-12 w-12 sm:h-16 sm:w-16" />
              {currentYear?.fiscalYear}
            </motion.span>
          </motion.div>

          <motion.p
            className="translate-y-centered-offset absolute top-1/2 left-[calc(50%-60rem)] w-[50rem] sm:w-[40rem] md:w-[45rem] pl-18 text-2xl sm:text-3xl lg:text-4xl leading-tight"
            style={stylesWithCssVar({
              opacity: endTextOpacity,
              "--y": endTexty,
            }) as MotionStyle}
          >
            <span className="">Financial farewell statistics</span>
            <br />
            during the year {currentYear?.fiscalYear}.
          </motion.p>
        </div>

        <motion.p
          style={stylesWithCssVar({
            opacity: paragraph1Opacity,
            "--y": paragraph1TranslateY,
            position,
          }) as MotionStyle}
          className="translate-y-centered-offset top-1/2 left-[20px] w-[300px] sm:w-[350px] md:w-[400px] pl-16 text-2xl sm:text-3xl lg:text-4xl leading-tight "
        >
          The numbers speak for us,
          <br />
          <span className="text-primary">share the context.</span>
        </motion.p>

        <motion.p
          style={stylesWithCssVar({
            opacity: paragraph2Opacity,
            "--y": paragraph2TranslateY,
            position,
          }) as MotionStyle}
          className="translate-y-centered-offset top-1/2 right-[20px] w-[300px] sm:w-[350px] md:w-[400px] pr-16 text-xl sm:text-2xl md:text-3xl leading-tight"
        >
          Develop, learn and build a ready team.
          <br />
          <span className="text-primary">
            It is the reason for the difference between one year and another.
          </span>
        </motion.p>
      </div>
    </section>
  );
};
