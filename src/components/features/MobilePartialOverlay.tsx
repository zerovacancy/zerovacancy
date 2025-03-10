
import { motion } from "framer-motion";

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
    <motion.div 
      className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent z-20 h-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ pointerEvents: "none" }} // Make sure overlay doesn't block interaction
    />
  );
};

export default MobilePartialOverlay;
