
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ColorVariant, colorVariants } from "../PricingCardColors";

interface PricingCardActionButtonProps {
  cta: string;
  color?: ColorVariant;
  isCurrentPlan?: boolean;
  onAction: () => void;
}

export const PricingCardActionButton = ({
  cta,
  color = "blue",
  isCurrentPlan = false,
  onAction
}: PricingCardActionButtonProps) => {
  const colorStyles = colorVariants[color];
  
  // Basic button without animations for mobile
  const buttonContent = (
    <button
      onClick={onAction}
      className={cn(
        "mt-2 w-full px-4 py-4 rounded-xl text-white font-medium font-inter",
        "desktop-transition",
        isCurrentPlan ? "bg-green-500 cursor-default" : `bg-gradient-to-r ${colorStyles.highlight}`,
        "desktop-hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] active:opacity-90",
        "group"
      )}
      disabled={isCurrentPlan}
    >
      {isCurrentPlan ? "Current Plan" : (
        <span className="flex items-center justify-center">
          {cta}
          <span className="ml-1.5 inline-block desktop-transition desktop-group-hover:translate-x-1">
            →
          </span>
        </span>
      )}
    </button>
  );

  // On mobile, return the basic button without motion
  return (
    <div className="mobile-button">
      {buttonContent}
    </div>
  );
};
