
import { motion } from "framer-motion";
import { memo } from "react";

interface MobilePartialOverlayProps {
  showAllCards: boolean;
  toggleShowAllCards: () => void;
}

export const MobilePartialOverlay = memo(({ 
  showAllCards,
  toggleShowAllCards
}: MobilePartialOverlayProps) => {
  if (showAllCards) return null;
  
  return (
    <motion.div 
      className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent z-20 h-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={toggleShowAllCards}
      style={{ 
        cursor: "pointer",
      }}
    />
  );
});

MobilePartialOverlay.displayName = "MobilePartialOverlay";

export default MobilePartialOverlay;
