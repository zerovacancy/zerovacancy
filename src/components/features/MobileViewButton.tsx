
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { memo } from "react";

interface MobileViewButtonProps {
  showAllCards: boolean;
  toggleShowAllCards: () => void;
  isMobile: boolean;
}

export const MobileViewButton = memo(({ 
  showAllCards, 
  toggleShowAllCards, 
  isMobile 
}: MobileViewButtonProps) => {
  // Improved click handler to prevent default behavior and propagation
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleShowAllCards();
  };

  // Don't render anything if not on mobile and cards are shown
  if (!isMobile && showAllCards) return null;

  // Animation settings optimized for mobile performance
  const buttonAnimationSettings = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { 
      duration: 0.3, 
      ease: "easeOut",
      // Reduced animation complexity for mobile
      delay: 0.1
    }
  };

  return (
    <motion.div 
      className={`mt-8 flex justify-center ${isMobile && !showAllCards ? 'md:hidden' : ''}`}
      {...buttonAnimationSettings}
      key={`view-button-${showAllCards ? 'less' : 'more'}`}
      layout="position"
      style={{ 
        willChange: "transform, opacity", 
        transform: "translateZ(0)" // Force GPU rendering
      }}
    >
      {isMobile && showAllCards ? (
        <Button 
          variant="outline" 
          size="lg"
          className="group border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50/70 text-indigo-600 font-medium px-6 touch-manipulation"
          onClick={handleClick}
          aria-label="Show fewer services"
        >
          Show less
          <ChevronDown className="ml-2 h-4 w-4 rotate-180 transition-transform" />
        </Button>
      ) : (
        <Button 
          variant="default"
          size="lg" 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 shadow-md touch-manipulation"
          onClick={handleClick}
          aria-label="View all services"
        >
          View all services
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      )}
    </motion.div>
  );
});

MobileViewButton.displayName = "MobileViewButton";

export default MobileViewButton;
