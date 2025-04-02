"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/global/ModeToggle";
import { useYear } from "@/components/context/YearContext";
import { useModal } from "@/hooks/use-modal-store";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { PromotionalImage } from "./promotional-image";
import { FooterLink } from "./footer-link";
import { NavItem } from "./nav-Item";
import { NavList } from "./nav-list";
import { animations } from "./animations";



export default function Nav({ setIsActive }: { 
  isActive: boolean;
  setIsActive: (value: boolean) => void;
}) {
  const [selectedLink, setSelectedLink] = useState({
    isActive: false,
    index: 0,
    isChild: false,
    parentIndex: 0
  });
  
  const { currentYear } = useYear();
  const { onOpen } = useModal();
  const { isSignedIn } = useAuth();

  const handleClose = () => setIsActive(false);

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
            <NavList 
              parentPages={currentYear?.pages || []}
              onClose={handleClose}
              selectedLink={selectedLink}
              setSelectedLink={setSelectedLink}
            />

            <NavItem
              key={5655}
              page={{ title: "structure", slug: "structure" }}
              onClose={handleClose}
              selectedLink={selectedLink}
              setSelectedLink={setSelectedLink}
              currentIndex={5655}
            />

            <NavItem
              key={8575}
              page={{ title: "analysis", slug: "analysis" }}
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
  );
}