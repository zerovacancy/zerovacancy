
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { iconColors, featureIcons } from "./feature-colors";
import { ChevronRight, Sparkles } from "lucide-react";
import { MovingBorder } from "@/components/ui/moving-border";

interface FeatureItemProps {
  title: string;
  description: string;
  icon: string;
  index: number;
  isPopular?: boolean;
  isPartiallyVisible?: boolean;
  actionText?: string;
}

export const FeatureItem = ({ 
  title, 
  description, 
  icon, 
  index, 
  isPopular = false,
  isPartiallyVisible = false,
  actionText
}: FeatureItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();
  
  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Get the color scheme for this icon
  const colorScheme = iconColors[icon as keyof typeof iconColors] || { bg: "bg-indigo-50", text: "text-indigo-600", gradient: "from-indigo-500 to-blue-500" };
  
  // Get the icon component
  const Icon = featureIcons[icon as keyof typeof featureIcons];
  
  // Extract the main color for border from the text color class
  const borderColorBase = colorScheme.text.split('-')[1];
  
  // Set a consistent character limit for descriptions - ensure truncation at sentence breaks
  const shortDescLimit = isMobile ? 60 : 85;
  const isLongDesc = description.length > shortDescLimit;
  
  // Find the last period, comma, or space before the limit to truncate at a logical break
  const findLogicalBreak = (text: string, limit: number) => {
    if (text.length <= limit) return text.length;
    
    const substring = text.substring(0, limit);
    const lastPeriod = substring.lastIndexOf('.');
    const lastComma = substring.lastIndexOf(',');
    const lastSpace = substring.lastIndexOf(' ');
    
    if (lastPeriod > limit - 15) return lastPeriod + 1;
    if (lastComma > limit - 12) return lastComma + 1;
    if (lastSpace > limit - 10) return lastSpace;
    
    return limit;
  };
  
  const truncationPoint = findLogicalBreak(description, shortDescLimit);
  
  // Map the borderColorBase to a suitable color for MovingBorder
  const getMovingBorderColors = (base: string) => {
    switch(base) {
      case 'indigo': return ["#6366f1", "#818cf8"];
      case 'blue': return ["#3b82f6", "#60a5fa"];
      case 'violet': return ["#8b5cf6", "#a78bfa"];
      case 'pink': return ["#ec4899", "#f472b6"];
      case 'emerald': return ["#10b981", "#34d399"];
      case 'amber': return ["#f59e0b", "#fbbf24"];
      case 'cyan': return ["#06b6d4", "#22d3ee"];
      case 'rose': return ["#f43f5e", "#fb7185"];
      default: return ["#8b5cf6", "#a78bfa"];
    }
  };
  
  const borderColors = getMovingBorderColors(borderColorBase);
  
  return (
    <motion.div
      className={cn(
        "relative w-full text-left group h-full",
        "bg-white/95 backdrop-blur-sm overflow-hidden",
        "rounded-xl sm:rounded-xl",
        // Consistent shadow
        "shadow-sm hover:shadow-md",
        // Consistent padding
        "focus:outline-none focus:ring-2 focus:ring-primary/20",
        // Enhanced hover transition
        isMobile ? "active:translate-y-0" : "hover:-translate-y-1.5",
        "transition-all duration-300",
        // For partially visible card
        isPartiallyVisible && "opacity-80 shadow-none"
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.4,
          delay: index * 0.05 + 0.1
        }
      }}
      viewport={{ once: true, margin: "-50px" }}
      style={{
        clipPath: isPartiallyVisible ? "polygon(0 0, 100% 0, 100% 65%, 0 65%)" : "none",
        pointerEvents: isPartiallyVisible ? "none" : "auto"
      }}
    >
      {/* Moving Border */}
      <div className="absolute inset-0 rounded-xl sm:rounded-xl overflow-hidden">
        <MovingBorder
          duration={isMobile ? 4000 : 3000} 
          rx="1rem"
          ry="1rem"
          pathClassName="stroke-[0.5px] md:stroke-[1px]"
          colors={borderColors}
          className="absolute inset-0 opacity-[0.3] group-hover:opacity-70 transition-opacity duration-500"
        >
          {/* Empty child needed for MovingBorder */}
          <div className="sr-only">Moving border animation</div>
        </MovingBorder>
      </div>
      
      <button
        onClick={handleClick}
        aria-expanded={isExpanded}
        className="w-full h-full flex flex-col p-4 sm:p-5 lg:p-6 z-10 relative text-left"
      >
        {/* Standardized Popular Tag - consistent positioning for all cards */}
        {isPopular && (
          <div className="absolute -top-3 inset-x-0 flex justify-center z-20">
            <div className="py-1 px-2.5 flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-purple-medium to-brand-purple text-white text-xs font-medium shadow-md">
              <Sparkles className="h-3 w-3" />
              <span className="font-medium">Popular</span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col items-start gap-3 sm:gap-4 h-full">
          {/* Icon container with consistent styling */}
          <motion.div 
            className={cn(
              "flex items-center justify-center",
              "w-12 h-12 sm:w-14 sm:h-14",
              "rounded-xl",
              "transition-all duration-300",
              "bg-gradient-to-br",
              colorScheme.gradient,
              "opacity-95",
              "group-hover:shadow-md",
              "border border-opacity-20",
              `border-${colorScheme.text.split('-')[1]}-100`,
            )}
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Icon className={cn(
              "w-6 h-6 sm:w-7 sm:h-7",
              "text-white",
              "transition-all duration-300",
              "group-hover:scale-110",
              "group-hover:animate-subtle-bounce"
            )} />
          </motion.div>
          
          <div className="text-left w-full flex-grow flex flex-col">
            {/* Standardized title style - all black for consistent hierarchy */}
            <h3 className={cn(
              "text-base sm:text-lg font-bold leading-tight font-space mb-2",
              "text-gray-900",
              "transition-colors duration-300"
            )}>
              {title}
            </h3>
            
            <div className={cn(
              "w-10 h-0.5 mb-2 sm:mb-3 bg-gradient-to-r",
              colorScheme.gradient,
              "rounded-full transition-all duration-300 transform origin-left",
              "group-hover:w-16"
            )} />
            
            {/* Standardized description truncation */}
            <p className="text-xs sm:text-sm text-gray-600 font-anek line-height-[1.6] group-hover:text-gray-700">
              {isExpanded || !isLongDesc ? 
                description : 
                (<>
                  {`${description.substring(0, truncationPoint).trim()}`}
                  <span className="text-indigo-500"> ...</span>
                </>)
              }
            </p>
            
            {/* Action text link - customized from feature data */}
            <div className={cn(
              "mt-2 sm:mt-3 text-xs font-medium flex items-center gap-1.5", 
              colorScheme.text,
              "transition-opacity duration-300"
            )}>
              {actionText || (isExpanded ? "Show less" : "Learn more")} <ChevronRight className={cn(
                "w-3 h-3 transition-transform duration-300",
                isExpanded ? "rotate-90" : ""
              )} />
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  );
};

export default FeatureItem;
