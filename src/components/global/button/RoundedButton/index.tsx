"use client";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Magnetic from '../Magnetic';

interface RoundedButtonProps {
  children: React.ReactNode;
  backgroundColor?: string;
  className?: string;
  [key: string]: any;
}

export default function RoundedButton({
  children,
  backgroundColor = "#455CE9",
  className = "",
  ...attributes
}: RoundedButtonProps) {
  const circle = useRef<HTMLDivElement | null>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  let timeoutId: NodeJS.Timeout | null = null;

  useEffect(() => {
    timeline.current = gsap.timeline({ paused: true });
    if (timeline.current && circle.current) {
      timeline.current
        .to(circle.current, { top: "-25%", width: "150%", duration: 0.4, ease: "power3.in" }, "enter")
        .to(circle.current, { top: "-150%", width: "125%", duration: 0.25 }, "exit");
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const manageMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeline.current?.tweenFromTo('enter', 'exit');
  };

  const manageMouseLeave = () => {
    timeoutId = setTimeout(() => {
      timeline.current?.play();
    }, 300);
  };

  return (
    <Magnetic>
      <button
        className={`
          relative flex items-center justify-center 
          rounded-full border border-gray-400 cursor-pointer
          px-8 py-3 md:px-12 md:py-4 lg:px-16 lg:py-4
          overflow-hidden transition-colors duration-300
          hover:text-white ${className}
        `}
        onMouseEnter={manageMouseEnter}
        onMouseLeave={manageMouseLeave}
        {...attributes}
      >
        <span className="relative z-10 transition-colors duration-400">
          {children}
        </span>
        <div
          ref={circle}
          className="absolute w-full h-[150%] rounded-full top-full"
          style={{ backgroundColor }}
        />
      </button>
    </Magnetic>
  );
}