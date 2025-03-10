
import { cn } from "@/lib/utils";

interface PricingCardFooterProps {
  footerText?: string;
  title: string;
}

export const PricingCardFooter = ({
  footerText,
  title
}: PricingCardFooterProps) => {
  if (!footerText && title !== "Premium") {
    return null;
  }
  
  return (
    <>
      {/* Footer text with enhanced styling */}
      {footerText && (
        <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-inter">
          {footerText}
        </div>
      )}
      
      {/* Guarantee badge with improved design - Only for Premium plan */}
      {title === "Premium" && (
        <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center font-inter">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium text-emerald-600">7-day money-back guarantee</span>
        </div>
      )}
    </>
  );
};
