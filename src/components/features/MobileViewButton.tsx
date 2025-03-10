
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  // Only show on mobile when not showing all cards
  if (!isMobile || showAllCards) {
    return null;
  }

  // Simplified animations optimized for performance
  const motionProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  };

  return (
    <motion.div 
      className={cn(
        "absolute bottom-0 left-0 right-0",
        "flex justify-center items-center py-4",
        "mobile-content-padding"
      )}
      {...motionProps}
      style={{
        contain: 'layout',
        willChange: 'opacity, transform',
        transform: 'translateZ(0)',
        zIndex: 20
      }}
    >
      <Button 
        variant="default"
        size="lg" 
        className={cn(
          "bg-gradient-to-r from-indigo-600 to-purple-600", 
          "hover:from-indigo-700 hover:to-purple-700",
          "text-white font-medium px-6 shadow-md",
          "mobile-button-size"
        )}
        onClick={toggleShowAllCards}
      >
        View all services
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </motion.div>
  );
};

export default MobileViewButton;
