
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface CompareAllFeaturesButtonProps {
  onClick?: () => void;
  className?: string;
}

export const CompareAllFeaturesButton = ({
  onClick,
  className
}: CompareAllFeaturesButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
    onClick?.();
  };
  
  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "touch-manipulation mx-auto flex items-center justify-center gap-1.5",
        "rounded-full py-3 px-5 min-h-[48px] shadow-sm",
        "bg-[#f5f5f7] text-brand-purple text-sm font-medium",
        "border border-slate-200/80 transition-all duration-200",
        "hover:bg-slate-100 active:bg-slate-200",
        "w-[70%] max-w-[280px]",
        isPressed ? "bg-slate-100" : "",
        className
      )}
    >
      <span>Compare all features</span>
      <ChevronDown className="h-4 w-4 opacity-80" />
    </motion.button>
  );
};
