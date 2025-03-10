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
  
  // Set a consistent character limit for descriptions
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
  
  // Card background color based on icon - to match the example image
  const getCardBgColor = () => {
    switch(icon) {
      case 'Camera': return 'bg-blue-50';
      case 'Image': return 'bg-sky-50';
      case 'Video': return 'bg-purple-50';
      case 'UserCheck': return 'bg-green-50';
      case 'Clock': return 'bg-amber-50';
      case 'CreditCard': return 'bg-cyan-50';
      case 'Award': return 'bg-pink-50';
      case 'Instagram': return 'bg-rose-50';
      default: return 'bg-blue-50';
    }
  };
  
  return (
    <div className={cn(
      "relative pt-4",
      isMobile && "mb-4 feature-item-mobile"
    )}>
      {/* Popular Tag - Positioned at the top left */}
      {isPopular && (
        <div className="absolute top-0 left-4 z-20">
          <div className="py-1.5 px-3.5 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-medium shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-medium">Popular</span>
          </div>
        </div>
      )}
      
      <motion.div
        className={cn(
          "relative w-full text-left group",
          getCardBgColor(), // Apply background color based on icon type
          "rounded-xl",
          // Fixed heights based on screen size, adjusted for mobile
          isMobile ? "h-auto min-h-[200px]" : "h-[250px] sm:h-[280px]",
          // Shadow and transition
          "shadow-sm",
          // Consistent padding
          isMobile ? "p-4" : "p-5",
          // For partially visible card
          isPartiallyVisible && "opacity-80 shadow-none"
        )}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ 
          opacity: 1, 
          y: 0,
          transition: {
            duration: isMobile ? 0.3 : 0.4,
            delay: isMobile ? index * 0.03 + 0.1 : index * 0.05 + 0.1
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
          <div className="flex flex-col items-start gap-5 h-full">
            {/* Standardized icon container - consistent sizing for all icons */}
            <div 
              className={cn(
                "flex items-center justify-center",
                isMobile ? "w-10 h-10" : "w-12 h-12 sm:w-14 sm:h-14", // Smaller on mobile
                "rounded-lg",
                colorScheme.gradient ? `bg-gradient-to-br ${colorScheme.gradient}` : colorScheme.bg
              )}
            >
              {/* Standardized icon size */}
              <Icon className={cn(
                "text-white",
                isMobile ? "w-5 h-5" : "w-6 h-6 sm:w-7 sm:h-7"
              )} aria-hidden="true" />
            </div>
            
            <div className="text-left w-full flex-grow flex flex-col">
              <div>
                {/* Title style to match example */}
                <h3 className={cn(
                  "text-base font-bold leading-tight uppercase mb-2 text-gray-900",
                  isMobile && "text-sm"
                )}>
                  {title}
                </h3>
                
                {/* Colored bar below title to match example */}
                <div 
                  className={cn(
                    "w-12 h-0.5 mb-3",
                    "rounded-full",
                    colorScheme.gradient ? `bg-gradient-to-r ${colorScheme.gradient}` : colorScheme.bg
                  )} 
                />
                
                {/* Description with proper truncation */}
                <p className={cn(
                  "text-sm text-gray-600 leading-relaxed",
                  isMobile && "text-xs"
                )}>
                  {isExpanded || !isLongDesc ? 
                    description : 
                    <>
                      {description.substring(0, truncationPoint).trim()}
                      <span className="text-indigo-500"> ...</span>
                    </>
                  }
                </p>
              </div>
              
              {/* Action text link positioned at bottom to match example */}
              <div className={cn(
                "mt-auto pt-3 flex items-center", 
                colorScheme.text,
                isMobile ? "text-xs" : "text-sm font-medium"
              )}>
                {actionText || (isExpanded ? "Show less" : "Learn more")} 
                <ChevronRight className={cn(
                  "ml-1",
                  isMobile ? "w-3 h-3" : "w-4 h-4"
                )} />
              </div>
            </div>
          </div>
        </button>
      </motion.div>
    </div>
  );
};

export default FeatureItem;
