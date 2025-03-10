
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ColorVariant } from "../PricingCardColors";
import { PricingCardHeader } from "./PricingCardHeader";
import { PricingCardActionButton } from "./PricingCardActionButton";
import { PricingCardFeatureList } from "./PricingCardFeatureList";
import { PricingCardFooter } from "./PricingCardFooter";
import { PricingFeature } from "../types";

interface PricingCardProps {
  title: string;
  price: number;
  interval: string;
  description: string; // Kept for backward compatibility 
  features: PricingFeature[];
  cta: string;
  color?: ColorVariant;
  highlighted?: boolean;
  showPopularTag?: boolean;
  valueProposition?: string;
  footerText?: string;
  subscription?: any;
  isLoading?: boolean;
  isCurrentPlan?: boolean;
}

export const PricingCard = ({
  title,
  price,
  interval,
  description, // Kept for backward compatibility
  features,
  cta,
  color = "blue",
  highlighted = false,
  showPopularTag = false,
  valueProposition,
  footerText,
  subscription,
  isLoading = false,
  isCurrentPlan = false
}: PricingCardProps) => {
  const isMobile = useIsMobile();
  
  // Handle subscription action
  const handleAction = () => {
    console.log(`Subscription action for ${title}`);
    // Add subscription logic here
  };

  const cardContent = (
    <div className={cn(
      "relative rounded-2xl flex flex-col h-full",
      "border bg-white/90",
      highlighted ? "border-2 shadow-xl" : "border border-slate-200/70",
      highlighted ? `border-${color}-200` : "border-slate-200/70",
      isMobile ? "p-5" : "p-6",
      !isMobile && "transition-all duration-300 hover:shadow-lg",
      "shadow-[0_4px_20px_rgba(0,0,0,0.06)]",
      !isMobile && highlighted && "hover:-translate-y-1",
      highlighted && !isMobile && "bg-gradient-to-b from-white to-slate-50/80"
    )}>
      <PricingCardHeader
        title={title}
        price={price}
        interval={interval}
        showPopularTag={showPopularTag}
        valueProposition={valueProposition}
        color={color}
        isCurrentPlan={isCurrentPlan}
      />
      
      <PricingCardActionButton
        cta={cta}
        color={color}
        isCurrentPlan={isCurrentPlan}
        onAction={handleAction}
      />
      
      <PricingCardFeatureList
        features={features}
        color={color}
      />
      
      <PricingCardFooter
        footerText={footerText}
        title={title}
      />
    </div>
  );

  // Use motion only on desktop
  if (isMobile) {
    return cardContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: title === "Professional" ? 0 : title === "Basic" ? 0.1 : 0.2 }}
    >
      {cardContent}
    </motion.div>
  );
};
