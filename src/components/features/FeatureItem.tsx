
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
  
  // Create more subtle gradient backgrounds based on the icon color scheme
  const getSubtleGradient = (index: number) => {
    const baseColor = colorScheme.text.split('-')[1];
    
    // Alternate between different complementary subtle gradients
    const gradients = [
      `bg-gradient-to-br from-white to-${baseColor}-50/30`,
      `bg-gradient-to-tr from-${baseColor}-50/20 via-white to-purple-50/10`,
      `bg-gradient-to-bl from-white to-${baseColor}-50/20`,
      `bg-gradient-to-tl from-purple-50/10 via-white to-${baseColor}-50/20`
    ];
    
    return gradients[index % gradients.length];
  };
  
  return (
    <motion.button
      className={cn(
        "relative w-full text-left group flex flex-col",
        "rounded-lg sm:rounded-xl transition-all duration-300",
        // Replace the fixed background with a more subtle gradient
        isMobile ? getSubtleGradient(index) : "bg-white hover:bg-white/95",
        // Simplified border - lighter and more subtle
        "border border-gray-100",
        // Lighter shadow
        isMobile ? "shadow-sm" : "shadow-sm hover:shadow-md",
        // Replace the left border accent with a top border (more subtle)
        isMobile ? "border-t-2" : "",
        isMobile ? `border-t-${colorScheme.text.split('-')[1]}-200/30` : "",
        // Smaller padding for mobile
        isMobile ? "p-3" : "p-4 sm:p-5",
        "focus:outline-none focus:ring-2 focus:ring-primary/20",
        // Less pronounced hover on mobile for better performance
        isMobile ? "active:translate-y-0" : "hover:-translate-y-1 hover:border-transparent",
        "transition-all duration-300",
        // For partially visible card
        isPartiallyVisible && "opacity-80 shadow-none",
        // Add mobile-optimize class
        isMobile && "mobile-optimize"
      )}
      onClick={handleClick}
      aria-expanded={isExpanded}
      {...motionProps}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Popular Tag */}
      {isPopular && (
        <div className="absolute -top-2 inset-x-0 flex justify-center z-10">
          <div className="py-0.5 px-2 flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-purple-medium to-brand-purple text-white text-xs font-medium shadow-md">
            <Sparkles className="h-2.5 w-2.5" />
            <span className="font-medium text-[10px]">Popular</span>
          </div>
        </div>
      )}
      
      <div className="flex items-start gap-3 h-full">
        {/* Smaller Icon container for mobile */}
        <div 
          className={cn(
            "flex items-center justify-center",
            isMobile ? "w-9 h-9 flex-shrink-0" : "w-12 h-12 sm:w-14 sm:h-14",
            "rounded-lg",
            "transition-all duration-300",
            colorScheme.gradient,
            "opacity-90",
            "group-hover:shadow-sm",
          )}
        >
          <Icon className={cn(
            isMobile ? "w-4.5 h-4.5" : "w-6 h-6 sm:w-7 sm:h-7",
            "text-white",
            "transition-all duration-300",
            "group-hover:scale-105",
          )} />
        </div>
        
        <div className="text-left flex-grow flex flex-col">
          {/* Smaller title on mobile */}
          <h3 className={cn(
            isMobile ? "text-sm" : "text-base sm:text-lg",
            "font-bold leading-tight font-space mb-1.5",
            "text-gray-900",
          )}>
            {title}
          </h3>
          
          {/* Description with truncation */}
          <p className={cn(
            isMobile ? "text-xs leading-tight" : "text-xs sm:text-sm",
            "text-gray-600 font-inter group-hover:text-gray-700"
          )}>
            {isExpanded || !isLongDesc ? 
              description : 
              (<>
                {`${description.substring(0, truncationPoint).trim()}`}
                <span className="text-indigo-500"> ...</span>
              </>)
            }
          </p>
          
          {/* Learn more link - smaller and more subtle */}
          <div className={cn(
            "mt-2 text-xs font-medium flex items-center gap-1", 
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
