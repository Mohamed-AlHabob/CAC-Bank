"use client";
import Image from 'next/image';
import Rounded from '@/components/global/button/RoundedButton';
import { useRef } from 'react';
import { useScroll, motion, useTransform } from 'framer-motion';
import Magnetic from '@/components/global/button/Magnetic';
import { useYear } from '@/components/context/YearContext';

export default function Footer() {
  const { currentYear } = useYear();
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end end"]
  });

  // Adjust animations using fixed values for responsiveness
  const x = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y = useTransform(scrollYProgress, [0, 1], [-500, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [120, 90]);
  const scale = useTransform(scrollYProgress, [0, 1], [2, 1.5]);

  return (
    <motion.div 
      style={{ y }} 
      ref={container} 
      className="flex flex-col items-center justify-center relative"
    >
      <div className="pt-[50px] md:pt-[200px] w-full max-w-[1800px] px-5 md:px-0">
        {/* Title Section */}
        <div className="border-b border-[rgb(134,134,134)] pb-[50px] md:pb-[100px] mx-5 md:mx-[50px] lg:mx-[200px] relative">
          <span className="flex items-center">
            <div className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] relative rounded-full overflow-hidden">
              <Image 
                fill
                alt="Supernova logo"
                src="https://ucarecdn.com/a3aceb6b-8e6c-49e6-865e-19d85a84d14d/-/preview/780x1000/"
                className="object-cover"
                sizes="(max-width: 768px) 60px, 100px"
              />
            </div>
            <h2 className="text-[8vw] md:text-[5vw] ml-[0.3em] font-bold">Created by</h2>
          </span>
          <h2 className="text-[8vw] md:text-[5vw] font-extrabold">Supernova</h2>
          
          <motion.div 
            style={{ x }} 
            className="absolute left-[calc(100%-150px)] md:left-[calc(100%-400px)] top-[calc(100%-40px)] md:top-[calc(100%-75px)]"
          >
            <Rounded backgroundColor="#334BD3" className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] bg-[#455CE9] text-white rounded-full absolute flex items-center justify-center cursor-pointer">
              <p className="m-0 text-[12px] md:text-[16px] font-light z-[2] relative">Contact Supernova</p>
            </Rounded>
          </motion.div>
          
          <motion.svg 
            style={{ rotate, scale }} 
            className="absolute top-[30%] left-[80%] md:left-full"
            width="9" 
            height="9" 
            viewBox="0 0 9 9" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 8.5C8.27614 8.5 8.5 8.27614 8.5 8L8.5 3.5C8.5 3.22386 8.27614 3 8 3C7.72386 3 7.5 3.22386 7.5 3.5V7.5H3.5C3.22386 7.5 3 7.72386 3 8C3 8.27614 3.22386 8.5 3.5 8.5L8 8.5ZM0.646447 1.35355L7.64645 8.35355L8.35355 7.64645L1.35355 0.646447L0.646447 1.35355Z" fill="white"/>
          </motion.svg>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row gap-5 mt-[50px] md:mt-[100px] mx-5 md:mx-[50px] lg:mx-[200px]">
          <Rounded className="w-full md:w-auto text-center md:text-left">
            <p className="text-sm md:text-base">supernovasoftwareco@gmail.com</p>
          </Rounded>
          <Rounded className="w-full md:w-auto text-center md:text-left">
            <p className="text-sm md:text-base">+967 77 643 643 0</p>
          </Rounded>
        </div>

        {/* Footer Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between mt-[50px] md:mt-[100px] lg:mt-[200px] p-5 gap-10 md:gap-0">
          <div className="flex gap-2.5 items-end">
            <span className="flex flex-col gap-[10px] md:gap-[15px]">
              <h3 className="text-gray-500 cursor-default font-light text-sm md:text-base">Version</h3>
              <p className="m-0 p-[2.5px] cursor-pointer relative after:content-[''] after:w-0 after:h-[1px] after:bg-white after:block after:mt-[2px] after:relative after:left-1/2 after:transform after:-translate-x-1/2 after:transition-all after:duration-200 after:ease-linear hover:after:w-full">
                {currentYear?.fiscalYear} © Edition
              </p>
            </span>
          </div>
          <div className="flex flex-wrap items-end gap-2.5">
            <span className="flex flex-col gap-[10px] md:gap-[15px]">
              <h3 className="text-gray-500 cursor-default font-light text-sm md:text-base">Socials</h3>
              <Magnetic>
                <p className="m-0 p-[2.5px] cursor-pointer relative after:content-[''] after:w-0 after:h-[1px] after:bg-white after:block after:mt-[2px] after:relative after:left-1/2 after:transform after:-translate-x-1/2 after:transition-all after:duration-200 after:ease-linear hover:after:w-full">
                  cac website
                </p>
              </Magnetic>
            </span>
            <Magnetic>
              <p className="m-0 p-[2.5px] cursor-pointer relative after:content-[''] after:w-0 after:h-[1px] after:bg-white after:block after:mt-[2px] after:relative after:left-1/2 after:transform after:-translate-x-1/2 after:transition-all after:duration-200 after:ease-linear hover:after:w-full">
                Instagram
              </p>
            </Magnetic>
            <Magnetic>
              <p className="m-0 p-[2.5px] cursor-pointer relative after:content-[''] after:w-0 after:h-[1px] after:bg-white after:block after:mt-[2px] after:relative after:left-1/2 after:transform after:-translate-x-1/2 after:transition-all after:duration-200 after:ease-linear hover:after:w-full">
                Linkedin
              </p>
            </Magnetic>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
