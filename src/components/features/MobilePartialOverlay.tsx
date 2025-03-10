
import { motion } from "framer-motion";

interface MobilePartialOverlayProps {
  showAllCards: boolean;
  toggleShowAllCards: () => void;
}

// We're removing the gradient overlay that was causing scroll jumps
export const MobilePartialOverlay = ({ 
  showAllCards, 
  toggleShowAllCards 
}: MobilePartialOverlayProps) => {
  // Return null to effectively remove this component
  return null;
};

export default MobilePartialOverlay;
