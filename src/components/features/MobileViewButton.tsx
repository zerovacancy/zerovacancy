
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
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleShowAllCards();
  };

  // Don't render anything if not on mobile
  if (!isMobile) return null;

  // Only render "Show less" on mobile when expanded
  if (isMobile && showAllCards) {
    return (
      <motion.div 
        className="mt-6 flex justify-center"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <Button 
          variant="outline" 
          size="lg"
          className="border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50/70 text-indigo-600 font-medium px-6"
          onClick={handleClick}
          aria-label="Show fewer services"
        >
          Show less
          <ChevronDown className="ml-2 h-4 w-4 rotate-180 transition-transform" />
        </Button>
      </motion.div>
    );
  }
  
  // Only render "View all services" on mobile when not expanded
  if (isMobile && !showAllCards) {
    return (
      <motion.div 
        className="mt-6 flex justify-center"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <Button 
          variant="default"
          size="lg" 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 shadow-md"
          onClick={handleClick}
          aria-label="View all services"
        >
          View all services
          <ArrowRight className="ml-2 h-4 w-4 transition-transform" />
        </Button>
      </motion.div>
    );
  }
  
  return null;
});

MobileViewButton.displayName = "MobileViewButton";

export default MobileViewButton;
