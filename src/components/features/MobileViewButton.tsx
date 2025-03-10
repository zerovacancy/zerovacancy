
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
      className={`${isMobile ? 'mt-6' : 'mt-12 sm:mt-14'} flex justify-center ${isMobile && !showAllCards ? 'md:hidden' : ''}`}
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
          className="group border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50/70 text-indigo-600 font-medium px-6 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
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
        isMobile ? (
          // Mobile version with enhanced shimmer effect
          <motion.button 
            className={cn(
              "inline-flex items-center justify-center px-6 py-3",
              "rounded-lg",
              "bg-gradient-to-r from-gray-50 to-indigo-50/30",
              "text-indigo-600/80 font-medium",
              "border border-indigo-100/50",
              "shadow-sm",
              "hover:shadow-md hover:bg-indigo-50/50 transition-all duration-200",
              "text-sm w-[85%] mx-auto",
              "relative overflow-hidden group",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            )}
            onClick={toggleShowAllCards}
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.3
            }}
            whileTap={{
              scale: 0.98
            }}
            aria-expanded={showAllCards}
            aria-label="View all services"
            tabIndex={0}
            role="button"
          >
            <span className="relative z-10 flex items-center whitespace-nowrap">
              View all services
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            
            {/* Subtle shimmer effect with enhanced border/glow */}
            <span className="absolute inset-0 z-0 animate-shimmer-slide bg-gradient-to-r from-transparent via-indigo-100/20 to-transparent border border-indigo-200/30 shadow-[0_0_8px_rgba(129,140,248,0.15)]" />
          </motion.button>
        ) : (
          // Desktop version - keep the original button
          <Button 
            variant="default"
            size="lg" 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 shadow-md focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
            onClick={isMobile ? toggleShowAllCards : undefined}
            aria-label="View all services"
          >
            <span className="flex items-center whitespace-nowrap">
              View all services
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        )
      )}
    </motion.div>
  );
};

export default MobileViewButton;
