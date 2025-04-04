"use client"

import Link from "next/link"
import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { File, Menu, Mountain, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { YearSwitcher } from "@/components/global/year-switcher"
import { useAuth, UserButton } from "@clerk/nextjs"
import Nav from "./nev"
import { ModeToggle } from "@/components/global/ModeToggle"

export default function Header() {
  const [isActive, setIsActive] = useState(false)
  const { isSignedIn } = useAuth()
  
  return (
    <header className="sticky top-0 z-50 w-full box-border p-2.5 md:p-5 backdrop-blur-md">
      <div className="flex justify-center items-center relative uppercase text-xs md:text-sm font-normal">
        <Link href="/" onClick={() => setIsActive(false) } className="absolute left-0 no-underline flex items-center gap-2">
          <Mountain className="h-8 w-8" />
          <h1>CAC Bank</h1>
        </Link>

        <div className="flex gap-4">
        <Button className="rounded-full px-4 py-1.5 text-xs">
            <File />
          </Button>
          <Button
            className="rounded-full p-1.5"
            onClick={() => {
              setIsActive(!isActive)
            }}
          >
            {isActive ? <X /> : <Menu />}
          </Button>
            <ModeToggle className="rounded-full px-4 py-1.5 text-xs" />
        </div>

        <div className="absolute right-0 flex items-center gap-6 justify-center cursor-pointer">
          {isSignedIn ? (
            <UserButton />
          ) : null}
          <YearSwitcher/>
        </div>
      </div>
      <AnimatePresence mode="wait">{isActive && <Nav setIsActive={setIsActive} isActive={false} />}</AnimatePresence>
    </header>
  )
}