"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import Image from "next/image"
import Rounded from "@/components/global/button/RoundedButton"
import { useYear } from "@/components/context/YearContext"
import Link from "next/link"


const scaleAnimation = {
  initial: { scale: 0, x: "-50%", y: "-50%" },
  enter: { scale: 1, x: "-50%", y: "-50%", transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } },
  closed: { scale: 0, x: "-50%", y: "-50%", transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] } },
}

function Project({ index, title, manageModal, slug }: { 
  index: number; 
  title: string; 
  manageModal: (active: boolean, index: number, x: number, y: number) => void;
  slug: string;
}) {
  return (
    <Link 
      href={`/section/${slug}`}
      className="flex w-full justify-between items-center px-6 sm:px-12 md:px-24 lg:px-[100px] py-8 md:py-12 lg:py-[50px] border-t border-[rgb(201,201,201)] cursor-pointer transition-all duration-200 hover:opacity-50 last:border-b"
      onMouseEnter={(e) => {
        manageModal(true, index, e.clientX, e.clientY)
      }}
      onMouseLeave={(e) => {
        manageModal(false, index, e.clientX, e.clientY)
      }}
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[60px] m-0 font-normal transition-all duration-400 group-hover:translate-x-[-10px]">
        {title}
      </h2>
      <p className="font-light transition-all duration-400 group-hover:translate-x-[10px]">View Details</p>
    </Link>
  )
}

const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

export const PageSictionShowcase = () => {
  const { currentYear } = useYear()
  const [modal, setModal] = useState({ active: false, index: 0 })
  const { active, index } = modal
  const modalContainer = useRef(null)
  const cursor = useRef(null)
  const cursorLabel = useRef(null)

  const xMoveContainer = useRef<gsap.QuickToFunc | null>(null)
  const yMoveContainer = useRef<gsap.QuickToFunc | null>(null)
  const xMoveCursor = useRef<gsap.QuickToFunc | null>(null)
  const yMoveCursor = useRef<gsap.QuickToFunc | null>(null)
  const xMoveCursorLabel = useRef<gsap.QuickToFunc | null>(null)
  const yMoveCursorLabel = useRef<gsap.QuickToFunc | null>(null)

  const pagesWithColors = currentYear?.pages?.map(page => ({
    ...page,
    color: getRandomColor()
  })) || []

  useEffect(() => {
    xMoveContainer.current = gsap.quickTo(modalContainer.current, "left", { duration: 0.8, ease: "power3" })
    yMoveContainer.current = gsap.quickTo(modalContainer.current, "top", { duration: 0.8, ease: "power3" })
    xMoveCursor.current = gsap.quickTo(cursor.current, "left", { duration: 0.5, ease: "power3" })
    yMoveCursor.current = gsap.quickTo(cursor.current, "top", { duration: 0.5, ease: "power3" })
    xMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "left", { duration: 0.45, ease: "power3" })
    yMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "top", { duration: 0.45, ease: "power3" })
  }, [])

  const moveItems = (x: number, y: number) => {
    if (xMoveContainer.current) xMoveContainer.current(x)
    if (yMoveContainer.current) yMoveContainer.current(y)
    if (xMoveCursor.current) xMoveCursor.current(x)
    if (yMoveCursor.current) yMoveCursor.current(y)
    if (xMoveCursorLabel.current) xMoveCursorLabel.current(x)
    if (yMoveCursorLabel.current) yMoveCursorLabel.current(y)
  }

  const manageModal = (active: any, index: any, x: any, y: any) => {
    moveItems(x, y)
    setModal({ active, index })
  }

  if (!currentYear || !currentYear.pages || currentYear.pages.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No pages available for this year.</p>
      </div>
    )
  }

  return (
    <main
      onMouseMove={(e) => {
        moveItems(e.clientX, e.clientY)
      }}
      className="flex items-center px-4 sm:px-8 md:px-16 lg:px-[200px] flex-col mt-[200px] sm:mt-[250px] md:mt-[300px] mb-[300px] sm:mb-[350px] md:mb-[400px]"
    >
      <div className="max-w-[1400px] w-full flex flex-col items-center justify-center mb-[50px] sm:mb-[75px] md:mb-[100px]">
        {pagesWithColors.map((page, index) => (
          <Project index={index} title={page.title} slug={page.slug} manageModal={manageModal} key={index} />
        ))}
      </div>

      <Rounded>
        <p>More</p>
      </Rounded>

      <>
        <motion.div
          ref={modalContainer}
          variants={scaleAnimation}
          initial="initial"
          animate={active ? "enter" : "closed"}
          className="h-[250px] sm:h-[300px] md:h-[350px] w-[300px] sm:w-[350px] md:w-[400px] fixed top-1/2 left-1/2 bg-white pointer-events-none overflow-hidden z-[3]"
        >
          <div
            style={{ top: index * -100 + "%" }}
            className="h-full w-full relative transition-[top] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
          >
            {pagesWithColors.map((page, index) => {
              const { color, initialPromotionalImage } = page
              return (
                <div
                  className="h-full w-full flex items-center justify-center"
                  style={{ backgroundColor: color }}
                  key={`modal_${index}`}
                >
                  {initialPromotionalImage ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={initialPromotionalImage}
                        alt={page.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ):
                  (<div
                    className="h-full w-full flex items-center justify-center"
                    style={{ backgroundColor: color }}
                    key={`modal_${index}`}
                  >
                    <div className="text-white text-2xl font-bold">{page.title}</div>
                  </div>)
                  }
                </div>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          ref={cursor}
          className="w-20 h-20 rounded-full bg-[#455CE9] text-white fixed z-[3] flex items-center justify-center pointer-events-none"
          variants={scaleAnimation}
          initial="initial"
          animate={active ? "enter" : "closed"}
        ></motion.div>
       <motion.div
         ref={cursorLabel}
         className="w-20 h-20 rounded-full bg-transparent text-white fixed z-[3] flex items-center justify-center text-sm font-light pointer-events-none"
         variants={scaleAnimation}
         initial="initial"
         animate={active ? "enter" : "closed"}
       >
         View
       </motion.div>
      </>
    </main>
  )
}