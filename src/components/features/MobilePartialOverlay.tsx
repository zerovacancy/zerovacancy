import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

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
    <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent z-20 flex items-end justify-center pb-4">
      {/* Button removed from here - now handled by MobileViewButton component */}
    </div>
  );
};

export default MobilePartialOverlay;
