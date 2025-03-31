"use client"

import { useScroll, useTransform, motion } from "framer-motion"
import { useRef } from "react"
import { Mountain } from 'lucide-react'

export default function AnimatedLogo() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
  })

  // Transform values based on scroll position
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.5])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -40])
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0])
  const headerLogoOpacity = useTransform(scrollYProgress, [0.2, 0.3], [0, 1])

  return (
    <>
      {/* Hero logo (disappears on scroll) */}
      <motion.div 
        ref={scrollRef}
        style={{ 
          scale,
          y,
          opacity,
        }}
        className="fixed left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
      >
        <Mountain className="h-24 w-24 text-primary" />
      </motion.div>

      {/* Header logo (appears on scroll) */}
      <motion.div
        style={{ opacity: headerLogoOpacity }}
        className="fixed left-1/2 top-4 z-50 -translate-x-1/2 flex items-center justify-center"
      >
        <Mountain className="h-12 w-12 text-primary" />
      </motion.div>
    </>
  )
}
