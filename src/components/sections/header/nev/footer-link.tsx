import { motion } from "framer-motion";
import { animations } from "./animations";

export const FooterLink = ({ label, value, customDelay }: { 
  label: string;
  value: React.ReactNode;
  customDelay?: number[];
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
);