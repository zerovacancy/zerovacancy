
import { cn } from "@/lib/utils";
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
      "p-5 sm:p-6",
      "desktop-transition desktop-hover:shadow-lg",
      "shadow-[0_4px_20px_rgba(0,0,0,0.06)]",
      "desktop-hover:translate-y-0 sm:desktop-hover:-translate-y-1",
      highlighted && "desktop-only-bg-gradient-to-b desktop-only-from-white desktop-only-to-slate-50/80"
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

  // Simple render without animations
  return (
    <div className="pricing-card-container">
      {cardContent}
    </div>
  );
};
