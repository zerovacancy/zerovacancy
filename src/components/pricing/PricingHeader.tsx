
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
        
        {/* Enhanced toggle container with improved mobile styling */}
        <div className={cn(
          "flex items-center space-x-2 p-1 rounded-lg transition-all duration-300 w-full max-w-md mx-auto",
          isMobile ? 
            "bg-[#F5F0FF] border border-[#E0E0E0] shadow-[0_2px_8px_rgba(0,0,0,0.06)]" : 
            "bg-slate-100",
          isSticky ? "scale-90" : ""
        )}>
          <button
            onClick={() => setIsYearly(false)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 font-space flex items-center gap-2",
              !isYearly 
                ? "bg-white text-brand-purple shadow-sm" 
                : "text-brand-text-secondary hover:text-brand-text-primary hover:bg-white/50"
            )}
            aria-pressed={!isYearly}
          >
            {isMobile && <Calendar size={16} className="text-gray-600" />}
            Monthly
          </button>
          
          <button
            onClick={() => setIsYearly(true)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 font-space",
              isYearly 
                ? isMobile ? "bg-white text-[#7B3DFF] shadow-sm" : "bg-white text-brand-purple shadow-sm"
                : "text-brand-text-secondary hover:text-brand-text-primary hover:bg-white/50"
            )}
            aria-pressed={isYearly}
          >
            {isMobile && <CalendarDays size={16} className="text-gray-600" />}
            Annual
            {isYearly && (
              <span className={cn(
                "text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full",
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
