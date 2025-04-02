import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";
import { animations } from "./animations";

interface NavItemProps {
    page: any;
    level?: number;
    onClose: () => void;
    selectedLink: {
      isActive: boolean;
      index: number;
      isChild: boolean;
      parentIndex: number;
    };
    setSelectedLink: (value: any) => void;
    currentIndex: number;
    parentIndex?: number;
    isChild?: boolean;
  }
  
export const NavItem = ({
    page,
    level = 0,
    onClose,
    selectedLink,
    setSelectedLink,
    currentIndex,
    parentIndex = 0,
    isChild = false
  }: NavItemProps) => {
    const { isSignedIn } = useAuth();
    const { onOpen } = useModal();
    
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
      ));
    };
  
    const hasChildren = page.childrenPages && page.childrenPages.length > 0;
    const textSizeClass = level === 0 
      ? "text-3xl lg:text-5xl" 
      : "text-3xl lg:text-3xl";
    const paddingClass = level === 0 
      ? "pr-8 lg:pr-8 pt-2.5" 
      : "pr-8 pt-2";
    const groupClass = level === 0 ? "group" : "group";
    const mlClass = level > 0 ? "ml-8" : "";
  
    return (
      <div className="relative">
        <div className={`${mlClass} mb-4 ${groupClass}`}>
          <div className="flex items-start ">
            <Link href={`/section/${page.slug}`} onClick={onClose} className="flex-1">
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
                {getChars(page.title)}
              </motion.p>
            </Link>
            
            {isSignedIn && (
              <div className={`opacity-0 ${groupClass}-hover:opacity-100 mt-${level === 0 ? 5 : 1} flex items-center gap-2`}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`${groupClass}-hover:opacity-100 transition-opacity`}
                  onClick={() => onOpen("createPage", { page })}
                >
                  Add
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`${groupClass}-hover:opacity-100 transition-opacity`}
                  onClick={() => onOpen("editPage", { page })}
                >
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`${groupClass}-hover:opacity-100 transition-opacity`}
                  onClick={() => onOpen("deletePage", { page })}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
  
        {hasChildren && (
          <div className="ml-4">
            {page.childrenPages.map((child: any, childIndex: number) => (
              <NavItem
                key={child._id}
                page={child}
                level={level + 1}
                onClose={onClose}
                selectedLink={selectedLink}
                setSelectedLink={setSelectedLink}
                currentIndex={childIndex}
                parentIndex={currentIndex}
                isChild={true}
              />
            ))}
          </div>
        )}
      </div>
    );
  };