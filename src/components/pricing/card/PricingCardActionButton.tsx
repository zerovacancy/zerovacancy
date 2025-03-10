
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
  
  return (
    <motion.button
      onClick={onAction}
      className={cn(
        "mt-2 w-full px-4 py-4 rounded-xl text-white font-medium font-inter",
        "transition-all duration-300",
        isCurrentPlan ? "bg-green-500 cursor-default" : `bg-gradient-to-r ${colorStyles.highlight}`,
        !isCurrentPlan && "hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] active:translate-y-0 group"
      )}
      whileHover={{ scale: !isCurrentPlan ? 1.02 : 1 }}
      whileTap={{ scale: !isCurrentPlan ? 0.98 : 1 }}
    >
      {isCurrentPlan ? "Current Plan" : (
        <span className="flex items-center justify-center">
          {cta}
          {!isCurrentPlan && (
            <motion.span
              className="ml-1.5 inline-block"
              initial={{ x: 0 }}
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.span>
          )}
        </span>
      )}
    </motion.button>
  );
};
