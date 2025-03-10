
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ColorVariant, colorVariants } from "../PricingCardColors";
import { useIsMobile } from "@/hooks/use-mobile";

interface PricingCardHeaderProps {
  title: string;
  price: number;
  interval: string;
  showPopularTag?: boolean;
  valueProposition?: string;
  color?: ColorVariant;
  isCurrentPlan?: boolean;
}

export const PricingCardHeader = ({
  title,
  price,
  interval,
  showPopularTag = false,
  valueProposition,
  color = "blue",
  isCurrentPlan = false
}: PricingCardHeaderProps) => {
  const colorStyles = colorVariants[color];
  const isMobile = useIsMobile();
  
  return (
    <div className="mb-6">
      {/* Popular tag with animated effect and improved positioning */}
      {showPopularTag && (
        <div className="absolute -top-5 inset-x-0 flex justify-center z-10">
          {isMobile ? (
            <div className={cn(
              "py-1 px-4 rounded-full text-white text-xs font-medium shadow-[0_2px_10px_rgba(0,0,0,0.15)]",
              "bg-gradient-to-r from-brand-purple-medium to-brand-purple"
            )}>
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Most Popular
              </span>
            </div>
          ) : (
            <motion.div 
              className={cn(
                "py-1 px-4 rounded-full text-white text-xs font-medium shadow-[0_2px_10px_rgba(0,0,0,0.15)]",
                "bg-gradient-to-r from-brand-purple-medium to-brand-purple",
                "shadow-glow"
              )}
              animate={{ 
                boxShadow: ['0 0 10px rgba(139, 92, 246, 0.3)', '0 0 20px rgba(139, 92, 246, 0.5)', '0 0 10px rgba(139, 92, 246, 0.3)']
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Most Popular
              </span>
            </motion.div>
          )}
        </div>
      )}
      
      <h3 className={cn(
        "text-xl font-bold font-jakarta",
        colorStyles.accent
      )}>
        {title}
      </h3>
      <div className="mt-3 flex items-baseline">
        {price > 0 ? (
          <>
            <span className="text-5xl font-bold tracking-tight font-jakarta text-brand-purple-dark">${price}</span>
            <span className="ml-1 text-sm text-slate-500 font-inter">/{interval}</span>
          </>
        ) : (
          <span className="text-5xl font-bold tracking-tight font-jakarta text-brand-purple-dark">Free</span>
        )}
      </div>
      
      {valueProposition && (
        <p className={cn(
          "mt-3 text-sm font-medium font-inter",
          colorStyles.accent
        )}>
          {valueProposition}
        </p>
      )}
    </div>
  );
};
