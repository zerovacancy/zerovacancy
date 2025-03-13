
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Calendar, CalendarDays } from "lucide-react";

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
        
        {/* Replace buttons with a proper toggle switch for both mobile and desktop */}
        <div className="relative w-full max-w-md mx-auto">
          <div className={cn(
            "pricing-toggle-container",
            "border border-gray-200 shadow-sm",
            "promote-layer gpu-accelerated",
            "overflow-hidden relative",
            isSticky ? "scale-90" : ""
          )}>
            {/* Monthly Option */}
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                "pricing-toggle-button",
                "touch-manipulation focus:outline-none",
                "transition-colors duration-200",
                "hover:bg-gray-50",
                "touch-target",
                "z-10",
                !isYearly ? "text-brand-purple-dark font-semibold" : "text-slate-600"
              )}
              aria-pressed={!isYearly}
              aria-label="Monthly billing"
            >
              <motion.span
                animate={{ 
                  scale: !isYearly ? 1.05 : 1 
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20 
                }}
              >
                Monthly
              </motion.span>
            </button>
            
            {/* Annual Option */}
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                "pricing-toggle-button",
                "touch-manipulation focus:outline-none",
                "transition-colors duration-200",
                "hover:bg-gray-50",
                "touch-target",
                "z-10",
                isYearly ? "text-brand-purple-dark font-semibold" : "text-slate-600"
              )}
              aria-pressed={isYearly}
              aria-label="Annual billing"
            >
              <motion.span
                animate={{ 
                  scale: isYearly ? 1.05 : 1 
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20 
                }}
              >
                Annual
                
                {isYearly && (
                  <span className={cn(
                    "ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full whitespace-nowrap",
                    animateChange ? "animate-pulse" : ""
                  )}>
                    Save 20%
                  </span>
                )}
              </motion.span>
            </button>
            
            {/* Active slider with improved animation */}
            <motion.div
              className={cn(
                "pricing-toggle-slider",
                "shadow-md",
                "backface-visibility-hidden",
                "will-change-transform",
                animateChange && isYearly ? "ring-2 ring-brand-purple/30 ring-offset-1" : ""
              )}
              initial={false}
              animate={{
                x: isYearly ? "100%" : "0%",
                scale: animateChange ? 1.03 : 1
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                mass: 1
              }}
              aria-hidden="true"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PricingHeader;
