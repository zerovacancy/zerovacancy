
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
        
        {/* Single unified toggle for both mobile and desktop */}
        <div className={cn(
          "flex items-center overflow-hidden rounded-full transition-all duration-300 w-full max-w-md mx-auto",
          isSticky ? "scale-90" : "",
          isMobile ? "bg-[#8853FF]/20" : "bg-slate-100",
          "p-1"
        )}>
          <button
            onClick={() => setIsYearly(false)}
            className={cn(
              "flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              !isYearly 
                ? isMobile
                  ? "bg-[#8853FF] text-white shadow-sm"
                  : "bg-white text-gray-700 shadow-sm" 
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
                ? isMobile
                  ? "bg-white text-[#8853FF] shadow-sm"
                  : "bg-white text-[#8344FF] shadow-sm" 
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
      </motion.div>
    </div>
  );
};

export default PricingHeader;
