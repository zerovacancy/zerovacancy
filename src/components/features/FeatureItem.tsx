
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { iconColors, featureIcons } from "./feature-colors";
import { ChevronRight, Sparkles } from "lucide-react";

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
  const shortDescLimit = isMobile ? 100 : 120;
  const isLongDesc = description.length > shortDescLimit;
  
  // Find the last period, comma, or space before the limit to truncate at a logical break
  const findLogicalBreak = (text: string, limit: number) => {
    if (text.length <= limit) return text.length;
    
    const substring = text.substring(0, limit);
    const lastPeriod = substring.lastIndexOf('.');
    const lastComma = substring.lastIndexOf(',');
    const lastSpace = substring.lastIndexOf(' ');
    
    if (lastPeriod > limit - 20) return lastPeriod + 1;
    if (lastComma > limit - 15) return lastComma + 1;
    if (lastSpace > limit - 10) return lastSpace;
    
    return limit;
  };
  
  const truncationPoint = findLogicalBreak(description, shortDescLimit);
  
  return (
    <motion.div
      className={cn(
        "relative w-full text-left group",
        "bg-white/95 backdrop-blur-sm overflow-hidden",
        "rounded-xl sm:rounded-xl",
        // Fixed standard height
        "min-h-[280px] sm:min-h-[300px]",
        // Consistent shadow
        "shadow-sm hover:shadow-md",
        // Consistent padding
        "p-5 sm:p-6 lg:px-6 lg:py-8",
        // Enhanced hover transition
        isMobile ? "active:translate-y-0" : "hover:-translate-y-1.5",
        "transition-all duration-300",
        // For partially visible card
        isPartiallyVisible && "opacity-80 shadow-none",
        // Add subtle border
        `border border-${borderColorBase}-100 border-opacity-30`,
        // Add some top margin for popular tag
        isPopular && "mt-5 sm:mt-7 pt-2 sm:pt-3"
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
      <button
        onClick={handleClick}
        aria-expanded={isExpanded}
        className="w-full h-full flex flex-col z-10 relative text-left"
      >
        {/* Popular Tag - Improved positioning to prevent cutoff */}
        {isPopular && (
          <div className="absolute -top-7 sm:-top-8 inset-x-0 flex justify-center z-20 px-2">
            <div className="py-1.5 px-3.5 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-purple-medium to-brand-purple text-white text-xs font-medium shadow-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="font-medium">Popular</span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col items-start gap-4 sm:gap-5 h-full">
          {/* Icon container with consistent sizing */}
          <motion.div 
            className={cn(
              "flex items-center justify-center",
              "w-14 h-14 sm:w-16 sm:h-16",
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
              "w-7 h-7 sm:w-8 sm:h-8",
              "text-white",
              "transition-all duration-300",
              "group-hover:scale-110",
              "group-hover:animate-subtle-bounce"
            )} />
          </motion.div>
          
          <div className="text-left w-full flex-grow flex flex-col justify-between">
            <div>
              {/* Standardized title style */}
              <h3 className={cn(
                "text-base sm:text-lg font-bold leading-tight font-space mb-2 sm:mb-3",
                "text-gray-900",
                "transition-colors duration-300"
              )}>
                {title}
              </h3>
              
              <div className={cn(
                "w-12 h-0.5 mb-3 sm:mb-4 bg-gradient-to-r",
                colorScheme.gradient,
                "rounded-full transition-all duration-300 transform origin-left",
                "group-hover:w-16"
              )} />
              
              {/* Improved description with proper truncation and line height */}
              <p className="text-xs sm:text-sm text-gray-600 font-anek leading-relaxed line-clamp-4 sm:line-clamp-3 group-hover:text-gray-700">
                {isExpanded || !isLongDesc ? 
                  description : 
                  (<>
                    {`${description.substring(0, truncationPoint).trim()}`}
                    <span className="text-indigo-500"> ...</span>
                  </>)
                }
              </p>
            </div>
            
            {/* Action text link positioned at bottom */}
            <div className={cn(
              "mt-4 pt-2 border-t border-gray-100 text-xs font-medium flex items-center gap-1.5", 
              colorScheme.text,
              "transition-opacity duration-300"
            )}>
              {actionText || (isExpanded ? "Show less" : "Learn more")} <ChevronRight className={cn(
                "w-3.5 h-3.5 transition-transform duration-300",
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
