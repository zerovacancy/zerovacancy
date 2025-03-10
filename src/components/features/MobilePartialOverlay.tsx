import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobilePartialOverlayProps {
  showAllCards: boolean;
  toggleShowAllCards: () => void;
}

export const MobilePartialOverlay = ({ 
  showAllCards, 
  toggleShowAllCards 
}: MobilePartialOverlayProps) => {
  if (showAllCards) return null;
  
  return (
    <div className={cn(
      "absolute left-0 right-0 bottom-0",
      "bg-gradient-to-t from-white via-white/95 to-transparent",
      "z-20 flex items-end justify-center pb-4",
      // Add height to make sure the gradient covers enough of the content
      "h-48"
    )}>
      {/* Button removed from here - now handled by MobileViewButton component */}
    </div>
  );
};

export default MobilePartialOverlay;
