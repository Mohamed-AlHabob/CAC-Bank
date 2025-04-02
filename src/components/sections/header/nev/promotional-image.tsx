import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import Image from "next/image"

export const PromotionalImage = ({ selectedLink, currentYear }: { 
  selectedLink: {
    isActive: boolean;
    index: number;
    isChild: boolean;
    parentIndex: number;
  };
  currentYear: any;
}) => {
  const imageData = useMemo(() => {
    if (!selectedLink.isActive || !currentYear) return null;
    
    const page = selectedLink.isChild
      ? currentYear?.pages[selectedLink.parentIndex]?.childrenPages?.[selectedLink.index]
      : currentYear?.pages[selectedLink.index];

    return {
      imageUrl: page?.initialPromotionalImage,
      title: page?.title,
      key: selectedLink.isChild 
        ? `child-${selectedLink.parentIndex}-${selectedLink.index}` 
        : `parent-${selectedLink.index}`
    };
  }, [selectedLink, currentYear]);

  return (
    <div className="w-[300px] h-[300px] lg:w-[500px] lg:h-[450px] relative rounded-lg">
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
              <div className="h-full w-full flex items-center justify-center bg-muted rounded-lg">
                <div className="text-2xl font-bold text-center p-4">
                  {imageData.title}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};