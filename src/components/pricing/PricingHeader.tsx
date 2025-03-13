
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { CalendarDays, Calendar } from "lucide-react";

interface PricingHeaderProps {
  title: string;
  subtitle: string;
  isSticky?: boolean;
  isYearly?: boolean;
  setIsYearly?: (isYearly: boolean) => void;
  animateChange?: boolean;
}

const PricingHeader = ({
  title,
  subtitle,
  isSticky = false,
  isYearly = true,
  setIsYearly = () => {},
  animateChange = false
}: PricingHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "text-center mx-auto transition-all duration-300",
      isSticky ? "max-w-full py-3 bg-white/95 backdrop-blur-sm shadow-md z-20" : "max-w-3xl py-0"
    )}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={cn(
          "flex flex-col items-center",
          isSticky ? "gap-2" : "gap-4"
        )}
      >
        {!isSticky && (
          <>
            {/* Decorative elements */}
            <div className="flex justify-center mb-2">
              <div className="relative">
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-purple-100 rounded-full blur-xl opacity-70" />
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-blue-100 rounded-full blur-xl opacity-70" />
                {/* Removed the "Transform Your Spaces" text here */}
              </div>
            </div>
            
            {/* Main title */}
            <h2 className={cn(
              "font-bold text-brand-purple-dark mb-2 tracking-tight font-jakarta",
              isMobile ? "text-2xl" : "text-3xl sm:text-4xl"
            )}>
              {title}
            </h2>
            
            {/* Decorative element under the heading */}
            <div className="w-20 h-1.5 bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1] rounded-full mx-auto mb-3" />
            
            {/* Subtitle */}
            <p className={cn(
              "mx-auto text-brand-text-secondary leading-relaxed mb-6 font-inter",
              isMobile ? "text-sm px-4" : "text-base"
            )}>
              {subtitle}
            </p>
          </>
        )}
        
        {/* Enhanced toggle with improved styling */}
        <div className={cn(
          "flex items-center justify-center w-full max-w-[280px] mx-auto",
          "bg-gray-100 p-1.5 rounded-full shadow-inner",
          isSticky ? "scale-90" : ""
        )}>
          <button
            onClick={() => setIsYearly(false)}
            className={cn(
              "relative w-full py-2 px-4 rounded-full text-sm font-medium transition-all duration-300",
              !isYearly 
                ? "bg-white text-violet-800 shadow-md" 
                : "text-gray-500 hover:text-gray-700"
            )}
            aria-pressed={!isYearly}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Calendar size={16} className={!isYearly ? "text-violet-600" : "text-gray-400"} />
              Monthly
            </span>
          </button>
          
          <button
            onClick={() => setIsYearly(true)}
            className={cn(
              "relative w-full py-2 px-4 rounded-full text-sm font-medium transition-all duration-300",
              isYearly 
                ? "bg-white text-violet-800 shadow-md" 
                : "text-gray-500 hover:text-gray-700"
            )}
            aria-pressed={isYearly}
          >
            <span className="flex items-center justify-center gap-1.5">
              <CalendarDays size={16} className={isYearly ? "text-violet-600" : "text-gray-400"} />
              Annual
              {isYearly && (
                <span className={cn(
                  "absolute -top-2 -right-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full border border-green-200",
                  animateChange ? "animate-pulse" : ""
                )}>
                  -20%
                </span>
              )}
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PricingHeader;
