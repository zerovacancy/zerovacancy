
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { CalendarDays } from "lucide-react";

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
        
        {/* Toggle switch matching the design in the screenshot */}
        <div className="relative w-full max-w-md mx-auto">
          <div className={cn(
            "h-10 bg-gray-100 rounded-full flex items-center p-1 relative",
            "shadow-sm border border-gray-200",
            isSticky ? "scale-90" : "",
            "max-w-xs mx-auto"
          )}>
            {/* Monthly option */}
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                "h-8 flex-1 z-10 rounded-full flex items-center justify-center",
                "text-sm transition-colors duration-200 font-medium",
                !isYearly ? "text-gray-800" : "text-gray-500"
              )}
              aria-pressed={!isYearly}
              aria-label="Monthly billing"
            >
              Monthly
            </button>
            
            {/* Annual option */}
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                "h-8 flex-1 z-10 rounded-full flex items-center justify-center",
                "text-sm transition-colors duration-200 font-medium",
                isYearly ? "text-gray-800" : "text-gray-500",
                "relative"
              )}
              aria-pressed={isYearly}
              aria-label="Annual billing"
            >
              Annual
              
              {isYearly && (
                <span className={cn(
                  "absolute -top-2 right-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full whitespace-nowrap",
                  animateChange ? "animate-pulse" : ""
                )}>
                  Save 20%
                </span>
              )}
            </button>
            
            {/* Active slider background */}
            <motion.div
              className="absolute top-1 h-8 rounded-full bg-white shadow-sm"
              style={{ width: 'calc(50% - 4px)' }}
              initial={false}
              animate={{
                x: isYearly ? 'calc(100% + 2px)' : '1px',
                scale: animateChange ? 1.03 : 1
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30
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
