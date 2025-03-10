
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
}

export const FeatureItem = ({ 
  title, 
  description, 
  icon, 
  index, 
  isPopular = false,
  isPartiallyVisible = false
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
  
  return (
    <motion.button
      className={cn(
        "relative w-full text-left group h-full flex flex-col",
        "rounded-xl sm:rounded-2xl transition-all duration-300",
        "bg-white hover:bg-white/95",
        // Enhanced border - more visible with color matching the icon theme
        `border border-${borderColorBase}-200/40`,
        // Consistent border radius
        "rounded-xl sm:rounded-xl",
        // Consistent shadow
        "shadow-sm hover:shadow-md",
        // Left border accent
        `before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:rounded-l-xl before:bg-gradient-to-b ${colorScheme.gradient} before:opacity-0 group-hover:before:opacity-100 before:transition-opacity`,
        // Consistent padding
        "p-4 sm:p-5 lg:p-6",
        "focus:outline-none focus:ring-2 focus:ring-primary/20",
        // Enhanced hover transition - less pronounced on mobile for better performance
        isMobile ? "active:translate-y-0" : "hover:-translate-y-1.5 hover:border-transparent",
        "transition-all duration-300",
        // For partially visible card
        isPartiallyVisible && "opacity-80 shadow-none"
      )}
      onClick={handleClick}
      aria-expanded={isExpanded}
      whileHover={isMobile ? {} : { 
        scale: 1.01,
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
      }}
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
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        // Very subtle background tint matching the card's theme color
        backgroundColor: `rgba(${borderColorBase === 'indigo' ? '237, 242, 255' : 
                                 borderColorBase === 'blue' ? '235, 245, 255' : 
                                 borderColorBase === 'violet' ? '243, 240, 255' : 
                                 borderColorBase === 'pink' ? '253, 242, 248' : 
                                 borderColorBase === 'emerald' ? '236, 253, 245' : 
                                 borderColorBase === 'amber' ? '255, 251, 235' : 
                                 borderColorBase === 'cyan' ? '236, 254, 255' : 
                                 borderColorBase === 'rose' ? '255, 241, 242' : 
                                 '255, 255, 255'}, 0.97)`,
        // For partially visible card
        clipPath: isPartiallyVisible ? "polygon(0 0, 100% 0, 100% 65%, 0 65%)" : "none",
        pointerEvents: isPartiallyVisible ? "none" : "auto"
      }}
    >
      {/* Standardized Popular Tag - consistent positioning for all cards */}
      {isPopular && (
        <div className="absolute -top-3 inset-x-0 flex justify-center z-10">
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
          
          {/* Learn more link - consistently visible for all cards */}
          <div className={cn(
            "mt-2 sm:mt-3 text-xs font-medium flex items-center gap-1.5", 
            colorScheme.text,
            "transition-opacity duration-300"
          )}>
            {isExpanded ? "Show less" : "Learn more"} <ChevronRight className={cn(
              "w-3 h-3 transition-transform duration-300",
              isExpanded ? "rotate-90" : ""
            )} />
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default FeatureItem;
