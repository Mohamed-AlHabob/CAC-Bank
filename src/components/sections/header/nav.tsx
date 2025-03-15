"use client"

import { JSX, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/global/ModeToggle"
import { useYear } from "@/components/context/YearContext"
import { useModal } from "@/hooks/use-modal-store"

// Animation variants
const height = {
  initial: {
    height: 0,
  },
  enter: {
    height: "auto",
    transition: { duration: 1, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    height: 0,
    transition: { duration: 1, ease: [0.76, 0, 0.24, 1] },
  },
}

const blur = {
  initial: {
    filter: "blur(0px)",
    opacity: 1,
  },
  open: {
    filter: "blur(4px)",
    opacity: 0.6,
    transition: { duration: 0.3 },
  },
  closed: {
    filter: "blur(0px)",
    opacity: 1,
    transition: { duration: 0.3 },
  },
}

const translate = {
  initial: {
    y: "100%",
    opacity: 0,
  },
  enter: (i: never[]) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 1, ease: [0.76, 0, 0.24, 1], delay: i[0] },
  }),
  exit: (i: never[]) => ({
    y: "100%",
    opacity: 0,
    transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: i[1] },
  }),
}

const opacity = {
  initial: {
    opacity: 0,
  },
  open: {
    opacity: 1,
    transition: { duration: 0.35 },
  },
  closed: {
    opacity: 0,
    transition: { duration: 0.35 },
  },
}

export default function Nav() {
  const [selectedLink, setSelectedLink] = useState({ isActive: false, index: 0 })
  const { currentYear } = useYear();
  const { onOpen } = useModal();

  const getChars = (word: string) => {
    const chars: JSX.Element[] = []
    word.split("").forEach((char, i) => {
      chars.push(
        <motion.span
          custom={[i * 0.02, (word.length - i) * 0.01]}
          variants={translate}
          initial="initial"
          animate="enter"
          exit="exit"
          key={char + i}
        >
          {char}
        </motion.span>,
      )
    })
    return chars
  }

  return (
    <motion.div
      variants={height}
      initial="initial"
      animate="enter"
      exit="exit"
      className="overflow-hidden bg-background"
    >
      <div className="flex flex-col lg:flex-row lg:justify-between gap-12 mb-20 lg:mb-0 p-6">
        <div className="flex flex-col justify-between">
          <div className="mt-10 lg:mt-20">
            {currentYear?.pages.map((item, index) => (
              <div key={`section_${index}`} className="mb-6">
                <Link href={`/${currentYear.fiscalYear}/section/${item.slug}`}>
                  <motion.p
                    onMouseOver={() => {
                      setSelectedLink({ isActive: true, index })
                    }}
                    onMouseLeave={() => {
                      setSelectedLink({ isActive: false, index })
                    }}
                    variants={blur}
                    animate={selectedLink.isActive && selectedLink.index !== index ? "open" : "closed"}
                    className="flex overflow-hidden text-3xl lg:text-5xl pr-8 lg:pr-8 pt-2.5 font-light uppercase m-0"
                  >
                    {getChars(item.title)}
                  </motion.p>
                </Link>

                {/* {item.parentPageId.map((child, childIndex) => (
                  <Link href="#" key={`child_${index}_${childIndex}`}>
                    <p className="flex overflow-hidden text-lg lg:text-xl pr-8 pt-2 font-light ml-6 uppercase m-0">
                      {child}
                    </p>
                  </Link>
                ))} */}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap text-xs uppercase mt-10">
            <ul className="w-1/2 lg:w-auto mt-2.5 overflow-hidden list-none p-0 mr-6">
              <motion.li custom={[0.3, 0]} variants={translate} initial="initial" animate="enter" exit="exit">
                <span className="text-[#9f9689]">Made by:</span> Supernova
              </motion.li>
            </ul>
            <ul className="w-1/2 lg:w-auto mt-2.5 overflow-hidden list-none p-0 mr-6">
              <motion.li custom={[0.3, 0]} variants={translate} initial="initial" animate="enter" exit="exit">
                <span className="text-[#9f9689]">Created specifically for:</span> CAC Bank
              </motion.li>
            </ul>
            <ul className="w-1/2 lg:w-auto mt-2.5 overflow-hidden list-none p-0 mr-6">
              <motion.li custom={[0.3, 0]} variants={translate} initial="initial" animate="enter" exit="exit">
                <span className="text-[#9f9689]">Images:</span> CAC, Envato
              </motion.li>
            </ul>
            <ul className="w-1/2 lg:w-auto mt-2.5 overflow-hidden list-none p-0">
              <motion.li
                custom={[0.3, 0]}
                variants={translate}
                initial="initial"
                animate="enter"
                exit="exit"
                className="mr-4"
              >
                Privacy Policy
              </motion.li>
              <motion.li custom={[0.3, 0]} variants={translate} initial="initial" animate="enter" exit="exit">
                Terms & Conditions {currentYear?.fiscalYear}
              </motion.li>
            </ul>
            <ul className="w-1/2 lg:w-auto mt-2.5 overflow-hidden list-none p-0 ml-6">
              <motion.li custom={[0.3, 0]} variants={translate} initial="initial" animate="enter" exit="exit">
                <span className="text-[#9f9689]">Theme:</span> <ModeToggle/>
              </motion.li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <motion.div
            variants={opacity}
            initial="initial"
            animate={selectedLink.isActive ? "open" : "closed"}
            className="w-[300px] h-[300px] lg:w-[500px] lg:h-[450px] relative bg-gray-200 rounded-lg"
          >
            <div className="absolute inset-0 flex items-center justify-center text-gray-600">Image</div>
          </motion.div>

          <div className="mt-6">
            <Button className="rounded-full px-4 py-1.5 text-xs" onClick={() => onOpen("createPage")}>Button</Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

