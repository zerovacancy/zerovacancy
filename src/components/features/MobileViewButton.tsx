
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
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
  return (
    <motion.div 
      className={`${isMobile ? 'mt-8' : 'mt-12'} flex justify-center ${isMobile && !showAllCards ? 'md:hidden' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      key="view-all-button"
    >
      {isMobile && showAllCards ? (
        <Button 
          variant="outline" 
          size="lg"
          className="group border-indigo-300 hover:border-indigo-500 text-indigo-600 font-medium px-6"
          onClick={toggleShowAllCards}
          aria-expanded={showAllCards}
          aria-label="Show less services"
        >
          <span className="flex items-center whitespace-nowrap">
            Show less
            <ChevronDown className="ml-2 h-4 w-4 rotate-180 transition-transform" />
          </span>
        </Button>
      ) : (
        <Button 
          variant="default"
          size="lg" 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6"
          onClick={isMobile ? toggleShowAllCards : undefined}
          aria-label="View all services"
        >
          <span className="flex items-center whitespace-nowrap">
            View all services
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Button>
      )}
    </motion.div>
  );
};

export default MobileViewButton;
