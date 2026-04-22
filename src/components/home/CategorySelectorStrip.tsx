import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  category: string;
  onNext: () => void;
  onPrev: () => void;
  onClick?: () => void;
}

const CategorySelectorStrip = ({ category, onNext, onPrev, onClick }: Props) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = (e: React.TouchEvent) => {
    if (!touchStart || !touchEnd) {
      return;
    }
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      onNext();
      e.preventDefault(); // Preventive measure to stop click after swipe
    } else if (isRightSwipe) {
      onPrev();
      e.preventDefault();
    }
    // reset touches to prevent stale data
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div 
      className="w-full h-[40px] md:h-[50px] bg-white/10 backdrop-blur-md flex items-center justify-between px-4 md:px-8"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEndHandler}
    >
      <button 
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="text-white p-2 h-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors z-10 min-w-[50px] outline-none"
        aria-label="Previous Category"
      >
        <ChevronLeft strokeWidth={1} className="w-7 h-7 md:w-9 md:h-9 opacity-80" />
      </button>

      <div 
        className="flex-1 overflow-hidden flex items-center justify-center relative h-full cursor-pointer"
        onClick={(e) => { e.stopPropagation(); if(onClick) onClick(); }}
      >
         <AnimatePresence mode="wait">
           <motion.span
             key={category}
             initial={{ opacity: 0, y: 5 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -5 }}
             transition={{ duration: 0.15, ease: "easeInOut" }}
             className="font-serif text-white text-[22px] md:text-[28px] font-medium tracking-wide absolute"
           >
             {category}
           </motion.span>
         </AnimatePresence>
      </div>

      <button 
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="text-white p-2 h-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors z-10 min-w-[50px] outline-none"
        aria-label="Next Category"
      >
        <ChevronRight strokeWidth={1} className="w-7 h-7 md:w-9 md:h-9 opacity-80" />
      </button>
    </div>
  );
};

export default CategorySelectorStrip;
