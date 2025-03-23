
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Calendar, CalendarDays } from "lucide-react";
import { MobilePricingToggle } from "./MobilePricingToggle";
import { mobileOptimizationClasses as moc } from "@/utils/mobile-optimization";

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
      "text-center mx-auto transition-all duration-300 touch-action-pan-y overscroll-behavior-none",
      isSticky ? "max-w-full py-3 bg-white/95 backdrop-blur-sm shadow-md z-20" : "max-w-3xl py-0"
    )}
    style={{ touchAction: 'pan-y', overscrollBehavior: 'none' }}>
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
            {/* Main title - decorative blurs removed */}
            <h2 className={cn(
              "font-bold text-brand-purple-dark font-jakarta",
              moc.headingLarge, // Standardized mobile heading
              moc.spacingBetweenBlocks, // Standardized spacing
              isMobile ? "mt-3" : "text-3xl sm:text-4xl mt-3"
            )}>
              {title}
            </h2>
            
            {/* Decorative element under the heading */}
            <div className="w-20 h-1.5 bg-gradient-to-r from-[#4A2DD9] via-[#8A2BE2] to-[#4169E1] rounded-full mx-auto mb-4" />
            
            {/* Subtitle */}
            <p className={cn(
              "mx-auto text-brand-text-secondary font-inter",
              moc.bodyText, // Standardized body text
              moc.textContainer, // Control max-width for readability
              moc.spacingHeadingToContent, // Standardized spacing
              isMobile ? "px-4" : "text-base"
            )}>
              {subtitle}
            </p>
          </>
        )}
        
        {/* Conditionally render the appropriate toggle based on device */}
        {isMobile ? (
          <MobilePricingToggle 
            isYearly={isYearly}
            setIsYearly={setIsYearly}
            animateChange={animateChange}
          />
        ) : (
          <div className={cn(
            "flex items-center overflow-hidden rounded-full transition-all duration-300 w-full max-w-md mx-auto",
            isSticky ? "scale-90" : "",
            "bg-slate-100 p-1 border border-slate-200 shadow-sm"
          )}>
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                "flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                !isYearly 
                  ? "bg-white text-gray-700 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              )}
              aria-pressed={!isYearly}
            >
              Monthly
            </button>
            
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                "flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2",
                isYearly 
                  ? "bg-white text-[#8344FF] shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              )}
              aria-pressed={isYearly}
            >
              Annual
              
              {isYearly && (
                <span className={cn(
                  "text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full whitespace-nowrap",
                  animateChange ? "animate-pulse" : ""
                )}>
                  Save 20%
                </span>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PricingHeader;
