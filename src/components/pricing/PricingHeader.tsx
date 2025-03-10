
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePricing } from "./PricingContext";
import { useEffect, useState } from "react";

interface PricingHeaderProps {
  title: string;
  subtitle: string;
  isSticky?: boolean;
}

const PricingHeader = ({
  title,
  subtitle,
  isSticky = false
}: PricingHeaderProps) => {
  const isMobile = useIsMobile();
  const { isYearly, setIsYearly, animateChange } = usePricing();

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
                <div className={cn(
                  "inline-flex items-center px-4 py-1.5 rounded-full",
                  "bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100/50",
                  "text-indigo-800 text-sm font-medium shadow-sm"
                )}>
                  Simple & Transparent
                </div>
              </div>
            </div>
            
            {/* Main title */}
            <h2 className={cn(
              "font-bold text-slate-900 mb-2 tracking-tight",
              isMobile ? "text-2xl" : "text-4xl",
              "bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700"
            )}>
              {title}
            </h2>
            
            {/* Decorative element under the heading */}
            <div className="w-20 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-3" />
            
            {/* Subtitle */}
            <p className={cn(
              "mx-auto text-slate-600 leading-relaxed mb-6",
              isMobile ? "text-sm px-4" : "text-lg"
            )}>
              {subtitle}
            </p>
          </>
        )}
        
        {/* Toggle container with simplified UI */}
        <div className={cn(
          "flex items-center space-x-2 bg-slate-100 p-1 rounded-lg transition-all duration-300",
          isSticky ? "scale-90" : ""
        )}>
          <button
            onClick={() => setIsYearly(false)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
              !isYearly 
                ? "bg-white text-brand-purple shadow-sm" 
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            )}
            aria-pressed={!isYearly}
          >
            Monthly
          </button>
          
          <button
            onClick={() => setIsYearly(true)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2",
              isYearly 
                ? "bg-white text-brand-purple shadow-sm" 
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            )}
            aria-pressed={isYearly}
          >
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
