
import { motion } from "framer-motion";
import { memo } from "react";

interface MobilePartialOverlayProps {
  showAllCards: boolean;
  toggleShowAllCards: () => void;
}

export const MobilePartialOverlay = memo(({ 
  showAllCards
}: MobilePartialOverlayProps) => {
  if (showAllCards) return null;
  
  return (
    <motion.div 
      className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent z-20 h-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }} // Faster animations for mobile
      style={{ 
        pointerEvents: "none",
        willChange: "opacity", // Hardware acceleration hint
        transform: "translateZ(0)", // Force GPU rendering
        backfaceVisibility: "hidden", // Prevent flickering
        WebkitBackfaceVisibility: "hidden", // For Safari
        WebkitFontSmoothing: "antialiased", // Smooth rendering
      }}
    />
  );
});

MobilePartialOverlay.displayName = "MobilePartialOverlay";

export default MobilePartialOverlay;
