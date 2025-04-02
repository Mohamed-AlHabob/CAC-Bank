"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/global/ModeToggle"
import { useYear } from "@/components/context/YearContext"
import { useModal } from "@/hooks/use-modal-store"
import { SignInButton, useAuth } from "@clerk/nextjs"

// Animation variants
const animations = {
  height: {
    initial: { height: 0 },
    enter: { 
      height: "auto",
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
    },
    exit: { 
      height: 0,
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
    }
  },
  blur: {
    initial: { filter: "blur(0px)", opacity: 1 },
    open: { 
      filter: "blur(4px)", 
      opacity: 0.6,
      transition: { duration: 0.3 }
    },
    closed: { 
      filter: "blur(0px)", 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  },
  translate: {
    initial: { y: "100%", opacity: 0 },
    enter: (i: number[]) => ({
      y: 0,
      opacity: 1,
      transition: { 
        duration: 1, 
        ease: [0.76, 0, 0.24, 1], 
        delay: i[0] 
      }
    }),
    exit: (i: number[]) => ({
      y: "100%",
      opacity: 0,
      transition: { 
        duration: 0.7, 
        ease: [0.76, 0, 0.24, 1], 
        delay: i[1] 
      }
    })
  },
  opacity: {
    initial: { opacity: 0 },
    open: { 
      opacity: 1,
      transition: { duration: 0.35 }
    },
    closed: { 
      opacity: 0,
      transition: { duration: 0.35 }
    }
  }
}

interface NavLinkProps {
  href: string
  title: string
  level?: number
  page?: any
  onClose: () => void
  selectedLink: {
    isActive: boolean
    index: number
    isChild: boolean
    parentIndex: number
  }
  setSelectedLink: (value: any) => void
  currentIndex: number
  parentIndex?: number
  isChild?: boolean
}

const NavLink = ({
  href,
  title,
  level = 0,
  page,
  onClose,
  selectedLink,
  setSelectedLink,
  currentIndex,
  parentIndex = 0,
  isChild = false
}: NavLinkProps) => {
  const { isSignedIn } = useAuth()
  const { onOpen } = useModal()
  
  const getChars = (word: string) => {
    return word.split("").map((char, i) => (
      <motion.span
        key={char + i}
        custom={[i * 0.02, (word.length - i) * 0.01]}
        variants={animations.translate}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {char}
      </motion.span>
    ))
  }

  const textSizeClass = level === 0 
    ? "text-3xl lg:text-5xl" 
    : "text-3xl lg:text-xl"
  const paddingClass = level === 0 
    ? "pr-8 lg:pr-8 pt-2.5" 
    : "pr-8 pt-2"
  const groupClass = level === 0 ? "group" : "group-child"
  const mlClass = level > 0 ? "ml-8" : ""

  return (
    <div className={`${mlClass} mb-6 ${groupClass} relative`}>
      <div className="flex items-start">
        <Link href={href} onClick={onClose} className="flex-1">
          <motion.p
            onMouseOver={() => setSelectedLink({ 
              isActive: true, 
              index: currentIndex, 
              isChild, 
              parentIndex 
            })}
            onMouseLeave={() => setSelectedLink({ 
              isActive: false, 
              index: 0, 
              isChild: false, 
              parentIndex: 0 
            })}
            variants={animations.blur}
            animate={
              selectedLink.isActive && 
              (selectedLink.index !== currentIndex || 
               selectedLink.isChild !== isChild || 
               selectedLink.parentIndex !== parentIndex) 
                ? "open" 
                : "closed"
            }
            className={`flex overflow-hidden ${textSizeClass} ${paddingClass} font-light uppercase m-0`}
          >
            {getChars(title)}
          </motion.p>
        </Link>
        
        {isSignedIn && (
          <div className={`mt-${level === 0 ? 5 : 1} items-center justify-center gap-4`}>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`opacity-0 ${groupClass}-hover:opacity-100 transition-opacity`}
              onClick={() => onOpen("createPage", { page })}
            >
              Add Child
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`opacity-0 ${groupClass}-hover:opacity-100 transition-opacity`}
              onClick={() => onOpen("editPage", { page })}
            >
              Edit Page
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`opacity-0 ${groupClass}-hover:opacity-100 transition-opacity`}
              onClick={() => onOpen("deletePage", { page })}
            >
              Delete Page
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

const FooterLink = ({ label, value, customDelay }: { 
  label: string
  value: React.ReactNode
  customDelay?: number[]
}) => (
  <motion.li 
    custom={customDelay || [0.3, 0]} 
    variants={animations.translate} 
    initial="initial" 
    animate="enter" 
    exit="exit"
    className="mt-2.5 overflow-hidden list-none p-0 mr-6"
  >
    {label && <span className="text-[#9f9689]">{label}</span>} {value}
  </motion.li>
)

const PromotionalImage = ({ selectedLink, currentYear }: { 
  selectedLink: {
    isActive: boolean
    index: number
    isChild: boolean
    parentIndex: number
  }
  currentYear: any
}) => {
  // Memoize the image data to prevent unnecessary recalculations
  const imageData = useMemo(() => {
    if (!selectedLink.isActive || !currentYear) return null
    
    const page = selectedLink.isChild
      ? currentYear?.pages[selectedLink.parentIndex]?.childrenPages?.[selectedLink.index]
      : currentYear?.pages[selectedLink.index]

    return {
      imageUrl: page?.initialPromotionalImage,
      title: page?.title,
      key: selectedLink.isChild 
        ? `child-${selectedLink.parentIndex}-${selectedLink.index}` 
        : `parent-${selectedLink.index}`
    }
  }, [selectedLink, currentYear])

  return (
    <div className="w-[300px] h-[300px] lg:w-[500px] lg:h-[450px] relative rounded-lg ">
      <AnimatePresence mode="wait">
        {imageData && (
          <motion.div
            key={imageData.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 w-full h-full"
          >
            {imageData.imageUrl ? (
              <Image
                src={imageData.imageUrl}
                alt={imageData.title || "Promotional content"}
                fill
                className="object-cover rounded-lg"
                priority
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-2xl font-bold text-center p-4">
                  {imageData.title}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  )
}

export default function Nav({ setIsActive }: { 
  isActive: boolean
  setIsActive: (value: boolean) => void 
}) {
  const [selectedLink, setSelectedLink] = useState({
    isActive: false,
    index: 0,
    isChild: false,
    parentIndex: 0
  })
  
  const { currentYear } = useYear()
  const { onOpen } = useModal()
  const { isSignedIn } = useAuth()

  const handleClose = () => setIsActive(false)

  return (
    <motion.div
      variants={animations.height}
      initial="initial"
      animate="enter"
      exit="exit"
      className="overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row lg:justify-between gap-12 mb-20 lg:mb-0 p-6">
        <div className="flex flex-col justify-between">
          <div className="mt-10 lg:mt-20">
            {currentYear?.pages.map((item, index) => (
              <div key={`section_${index}`}>
                <NavLink
                  href={`/section/${item.slug}`}
                  title={item.title}
                  page={item}
                  onClose={handleClose}
                  selectedLink={selectedLink}
                  setSelectedLink={setSelectedLink}
                  currentIndex={index}
                />
                
                {item.childrenPages?.map((child, childIndex) => (
                  <NavLink
                    key={`child_${index}_${childIndex}`}
                    href={`/section/${child.slug}`}
                    title={child.title}
                    level={1}
                    page={child}
                    onClose={handleClose}
                    selectedLink={selectedLink}
                    setSelectedLink={setSelectedLink}
                    currentIndex={childIndex}
                    parentIndex={index}
                    isChild
                  />
                ))}
              </div>
            ))}

            <NavLink
              href="/structure"
              title="structure"
              onClose={handleClose}
              selectedLink={selectedLink}
              setSelectedLink={setSelectedLink}
              currentIndex={565}
            />

            <NavLink
              href="/analysis"
              title="analysis"
              onClose={handleClose}
              selectedLink={selectedLink}
              setSelectedLink={setSelectedLink}
              currentIndex={8575}
            />
          </div>

          <div className="flex flex-wrap text-xs uppercase mt-10">
            <FooterLink label="Made by:" value="Supernova" />
            <FooterLink label="Created specifically for:" value="CAC Bank" />
            <FooterLink label="Images:" value="CAC, Envato" />
            
            {!isSignedIn && (
              <FooterLink 
                label="Login:" 
                value={
                  <SignInButton mode="modal">
                    <Button variant="link" className="text-xs uppercase p-0 ml-1 h-auto">
                      Sign In
                    </Button>
                  </SignInButton>
                } 
              />
            )}
            
            <FooterLink label="" value="Privacy Policy" customDelay={[0.3, 0]} />
            <FooterLink 
              label="" 
              value={`Terms & Conditions ${currentYear?.fiscalYear}`} 
              customDelay={[0.3, 0]} 
            />
            <FooterLink label="Theme:" value={<ModeToggle />} />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <PromotionalImage 
            selectedLink={selectedLink} 
            currentYear={currentYear} 
          />
          
          {isSignedIn && (
            <div className="mt-6">
              <Button 
                className="rounded-full px-4 py-1.5 text-xs" 
                onClick={() => onOpen("createPage")}
              >
                Add New Page
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}