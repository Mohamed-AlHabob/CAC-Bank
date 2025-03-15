"use client"

import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Nav from "./nav"
import { File, Menu, Mountain, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { YearSwitcher } from "@/components/global/year-switcher"

// Animation variants
const transition = { duration: 1, ease: [0.76, 0, 0.24, 1] }

const background = {
  initial: {
    height: 0,
  },
  open: {
    height: "100vh",
    transition,
  },
  closed: {
    height: 0,
    transition,
  },
}

export default function Header() {
  const [isActive, setIsActive] = useState(false)
  
  return (
    <header className=" w-full box-border p-2.5 md:p-5">
      <div className="flex justify-center items-center relative uppercase text-xs md:text-sm font-normal">
        <Link href="/" className="absolute left-0 no-underline flex items-center gap-2">
          <Mountain className="h-8 w-8" />
          <h1>CAC Bank</h1>
        </Link>

        <div className="flex gap-4">
          <Button className="rounded-full px-4 py-1.5 text-xs">
            <File/>
          </Button>
          <Button className=" rounded-full p-1.5" onClick={() => {  setIsActive(!isActive)}}>
           {isActive ? <X/> : <Menu/>}
          </Button>
          <Button className=" rounded-full px-4 py-1.5 text-xs">
          <File/>
          </Button>
        </div>

        <div
          className="absolute right-0 flex items-center justify-center gap-2 cursor-pointer"
        >
        <YearSwitcher/>
        </div>
      </div>

      <motion.div
        variants={background}
        initial="initial"
        animate={isActive ? "open" : "closed"}
        className="absolute left-0 top-full w-full bg-black bg-opacity-50"
      />

      <AnimatePresence mode="wait">{isActive && <Nav />}</AnimatePresence>
    </header>
  )
}

