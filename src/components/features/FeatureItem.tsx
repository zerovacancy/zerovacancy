
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
  
  // Set a consistent character limit for descriptions
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
  
  // Scale back animations for mobile to prevent flickering
  const motionProps = isMobile ? {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    whileHover: {}
  } : {
    initial: { opacity: 0, y: 20 },
    whileInView: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.05 + 0.1
      }
    },
    viewport: { once: true, margin: "-10%" },
    whileHover: { 
      scale: 1.01,
      boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
    }
  };
  
  // Add alternating backgrounds for mobile cards (odd/even)
  const cardBackground = isMobile 
    ? index % 2 === 0 ? "bg-white hover:bg-white/95" : "bg-indigo-50/20 hover:bg-indigo-50/30" 
    : "bg-white hover:bg-white/95";
  
  return (
    <motion.button
      className={cn(
        "relative w-full text-left group h-full flex flex-col",
        "rounded-xl sm:rounded-2xl transition-all duration-300",
        cardBackground,
        // Enhanced border - more visible with color matching the icon theme
        `border border-${borderColorBase}-200/40`,
        // Consistent shadow
        "shadow-sm hover:shadow-md",
        // Left border accent
        `before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:rounded-l-xl before:bg-gradient-to-b ${colorScheme.gradient} before:opacity-0 group-hover:before:opacity-100 before:transition-opacity`,
        // Consistent padding
        "p-4 sm:p-5",
        "focus:outline-none focus:ring-2 focus:ring-primary/20",
        // Less pronounced hover on mobile for better performance
        isMobile ? "active:translate-y-0" : "hover:-translate-y-1.5 hover:border-transparent",
        "transition-all duration-300",
        // For partially visible card
        isPartiallyVisible && "opacity-80 shadow-none",
        // Add mobile-optimize class from App.css
        isMobile && "mobile-optimize"
      )}
      onClick={handleClick}
      aria-expanded={isExpanded}
      {...motionProps}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Popular Tag */}
      {isPopular && (
        <div className="absolute -top-3 inset-x-0 flex justify-center z-10">
          <div className="py-1 px-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-purple-medium to-brand-purple text-white text-xs font-medium shadow-md">
            <Sparkles className="h-3 w-3" />
            <span className="font-medium">Popular</span>
          </div>
        </div>
      )}
      
      <div className="flex flex-col items-start gap-4 h-full">
        {/* Icon container */}
        <div 
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
        >
          <Icon className={cn(
            "w-6 h-6 sm:w-7 sm:h-7",
            "text-white",
            "transition-all duration-300",
            "group-hover:scale-110",
            !isMobile && "group-hover:animate-subtle-bounce" 
          )} />
        </div>
        
        <div className="text-left w-full flex-grow flex flex-col">
          {/* Title */}
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
          
          {/* Description with truncation */}
          <p className="text-xs sm:text-sm text-gray-600 font-inter leading-relaxed group-hover:text-gray-700">
            {isExpanded || !isLongDesc ? 
              description : 
              (<>
                {`${description.substring(0, truncationPoint).trim()}`}
                <span className="text-indigo-500"> ...</span>
              </>)
            }
          </p>
          
          {/* Learn more link */}
          <div className={cn(
            "mt-3 text-xs font-medium flex items-center gap-1.5", 
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
