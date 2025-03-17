
import { motion } from "framer-motion";

interface AnimateTextProps {
  title: string;
}

const AnimateText: React.FC<AnimateTextProps> = ({ title }) => {

  return (
    <motion.p
      className="flex overflow-hidden text-3xl lg:text-5xl pr-8 lg:pr-8 pt-2.5 font-light m-0"
    >
      {title}
    </motion.p>
  );
};

export default AnimateText;