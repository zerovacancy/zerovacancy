
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";

interface MobileViewButtonProps {
  showAllCards: boolean;
  toggleShowAllCards: () => void;
  isMobile: boolean;
}

export const MobileViewButton = ({ 
  showAllCards, 
  toggleShowAllCards, 
  isMobile 
}: MobileViewButtonProps) => {
  // Simplified animations optimized for performance
  const motionProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  };

  return (
    <motion.div 
      className={`h-[72px] flex justify-center items-center ${isMobile ? '-mt-4' : 'mt-12 sm:mt-14'}`}
      {...motionProps}
      style={{
        contain: 'layout',
        willChange: 'opacity, transform',
        transform: 'translateZ(0)',
        position: isMobile ? 'relative' : 'static',
        zIndex: isMobile ? 20 : 'auto'
      }}
    >
      {isMobile && showAllCards ? (
        <Button 
          variant="outline" 
          size="lg"
          className="group border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50/70 text-indigo-600 font-medium px-6"
          onClick={toggleShowAllCards}
        >
          Show less
          <ChevronDown className="ml-2 h-4 w-4 rotate-180 transition-transform" />
        </Button>
      ) : (
        <Button 
          variant="default"
          size="lg" 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 shadow-md"
          onClick={isMobile ? toggleShowAllCards : undefined}
        >
          View all services
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      )}
    </motion.div>
  );
};

export default MobileViewButton;
