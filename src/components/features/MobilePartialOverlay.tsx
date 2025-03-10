
import { Button } from "@/components/ui/button";
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
    <div 
      className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent z-20 h-40 flex flex-col items-center justify-end pb-4"
    >
      <Button 
        variant="outline" 
        size="lg"
        className="group border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50/70 text-indigo-600 font-medium px-6 touch-manipulation"
        onClick={toggleShowAllCards}
      >
        View all services
        <ChevronDown className="ml-2 h-4 w-4 transition-transform" />
      </Button>
    </div>
  );
};

export default MobilePartialOverlay;
