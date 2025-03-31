"use client";
import { useInView, motion } from 'framer-motion';
import { useRef } from 'react';
import Rounded from "@/components/global/button/RoundedButton";

export const slideUp = {
    initial: {
        y: "100%"
    },
    open: (i: number) => ({
        y: "0%",
        transition: {duration: 0.5, delay: 0.01 * i}
    }),
    closed: {
        y: "100%",
        transition: {duration: 0.5}
    }
};

export const opacity = {
    initial: {
        opacity: 0
    },
    open: {
        opacity: 1,
        transition: {duration: 0.5}
    },
    closed: {
        opacity: 0,
        transition: {duration: 0.5}
    }
};

export default function Description() {
    const phrase = "CAC Bank envisions a secure, innovative, and inclusive banking experience, leveraging AI and blockchain to empower individuals and businesses with seamless, transparent, and accessible financial services, fostering economic growth and trust worldwide.";
    const description = useRef(null);
    const isInView = useInView(description);

    return (
        <div 
            ref={description} 
            className="flex justify-center px-[50px] md:px-[100px] lg:px-[200px] mt-[200px]"
        >
            <div className="max-w-[1400px] flex flex-col lg:flex-row gap-[50px] relative">
                <p className="m-0 text-[24px] md:text-[30px] lg:text-[36px] leading-[1.3]">
                    {phrase.split(" ").map((word, index) => {
                        return (
                            <span key={index} className="relative overflow-hidden inline-flex mr-[3px]">
                                <motion.span 
                                    variants={slideUp} 
                                    custom={index} 
                                    animate={isInView ? "open" : "closed"} 
                                    key={index}
                                >
                                    {word}
                                </motion.span>
                            </span>
                        );
                    })}
                </p>
                
                <div className="lg:max-w-[80%]">
                    <motion.p 
                        variants={opacity} 
                        animate={isInView ? "open" : "closed"}
                        className="m-0 text-[16px] md:text-[18px] font-light"
                    >
                        Innovation, Security, Inclusion, Transparency, Growth, Trust, Accessibility, Technology, Empowerment, Excellence.
                    </motion.p>
                    
                    <div className="mt-[50px] lg:absolute lg:top-[80%] lg:left-[calc(100%-200px)]">
                        <Rounded className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] lg:w-[180px] lg:h-[180px] bg-[#1C1D20] text-white rounded-full flex items-center justify-center cursor-pointer absolute ">
                            <p className="m-0 text-[14px] md:text-[16px] font-light relative">
                                About CAC
                            </p>
                        </Rounded>
                    </div>
                </div>
            </div>
        </div>
    );
}