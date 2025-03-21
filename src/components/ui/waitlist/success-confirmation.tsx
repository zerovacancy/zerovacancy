
import React, { useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CheckCircle, X } from "lucide-react"
import { Confetti } from "@/components/ui/confetti"
import confetti from "canvas-confetti"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

// Define a simplified global celebration function that's more reliable
if (typeof window !== 'undefined' && !window.hasOwnProperty('celebrateSuccess')) {
  window.celebrateSuccess = (isMobile = false) => {
    console.log("Global celebrateSuccess called");
    
    // Simplify animation to reduce jitter by using built-in defaults
    const mainOptions = {
      particleCount: isMobile ? 50 : 100,
      spread: isMobile ? 55 : 70,
      origin: { y: 0.3 },
      disableForReducedMotion: false,
      zIndex: 10000,
      colors: ['#8B5CF6', '#6366F1', '#3B82F6', '#10B981'],
      scalar: 1 // Keep particles the same size for better performance
    };
    
    try {
      // Fire a single, more reliable confetti burst
      confetti({
        ...mainOptions,
        angle: 90,
        startVelocity: 35,
        gravity: 1, // Standard gravity for more natural fall
        drift: 0, // No sideways drift to reduce jitter
        ticks: 300, // Reduced ticks for better performance
        shapes: ['square'], // Only use square shapes for better performance
      });
      
      // Fire a second burst with a delay
      setTimeout(() => {
        confetti({
          ...mainOptions,
          particleCount: isMobile ? 30 : 60,
          angle: 120,
          origin: { x: 0.1, y: 0.5 },
          startVelocity: 25,
          gravity: 1, 
          ticks: 200,
        });
      }, 250);
      
      // Fire a third burst from the other side
      setTimeout(() => {
        confetti({
          ...mainOptions,
          particleCount: isMobile ? 30 : 60, 
          angle: 60,
          origin: { x: 0.9, y: 0.5 },
          startVelocity: 25,
          gravity: 1,
          ticks: 200,
        });
      }, 400);
    } catch (error) {
      console.error("Error firing global confetti:", error);
      
      // If the global method fails, try a direct approach
      try {
        // Extremely simple fallback
        confetti();
      } catch (fallbackError) {
        console.error("Even fallback confetti failed:", fallbackError);
      }
    }
  };
}

interface SuccessConfirmationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email?: string
  alreadySubscribed?: boolean
  isCreator?: boolean
}

export function SuccessConfirmation({
  open,
  onOpenChange,
  email,
  alreadySubscribed = false,
  isCreator = false
}: SuccessConfirmationProps) {
  const isMobile = useIsMobile()
  
  // Force open state to be maintained on mobile
  React.useEffect(() => {
    if (open && isMobile) {
      // Set a series of timers to ensure the dialog stays open
      const timers = [
        setTimeout(() => onOpenChange(true), 200),
        setTimeout(() => onOpenChange(true), 500),
        setTimeout(() => onOpenChange(true), 1000),
        setTimeout(() => onOpenChange(true), 2000)
      ];
      
      return () => timers.forEach(timer => clearTimeout(timer));
    }
  }, [open, isMobile, onOpenChange]);

  // Auto-close dialog after delay and fire confetti
  useEffect(() => {
    if (open) {
      console.log("Success confirmation opened");
      
      // Single timeout for confetti with small delay to ensure dialog is rendered
      const confettiTimeout = setTimeout(() => {
        if (typeof window !== 'undefined' && window.celebrateSuccess) {
          try {
            // Use global function which has been simplified for better performance
            window.celebrateSuccess(isMobile);
          } catch (error) {
            console.error("Error with celebrateSuccess:", error);
            
            // Ultra simple fallback if everything else fails
            try {
              confetti();
            } catch (e) {
              console.error("Final fallback confetti also failed");
            }
          }
        } else {
          // Direct fallback if global function not available
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.3 }
          });
        }
      }, 150);
      
      // For mobile: longer display time and no auto-close to ensure visibility
      const closeTimer = setTimeout(() => {
        // Only auto-close on desktop - keep open on mobile to ensure user sees it
        if (!isMobile) {
          onOpenChange(false);
        }
      }, 8000);
      
      // Clean up timeouts
      return () => {
        clearTimeout(confettiTimeout);
        clearTimeout(closeTimer);
      };
    }
  }, [open, onOpenChange, isMobile])

  const getSuccessTitle = () => {
    if (alreadySubscribed) {
      return "Already Subscribed";
    }
    
    return isCreator ? "Joined Creator Waitlist!" : "Success!";
  };
  
  const getSuccessMessage = () => {
    if (alreadySubscribed) {
      return email 
        ? `${email} is already on our waitlist.` 
        : "You're already on our waitlist!";
    }
    
    if (isCreator) {
      return email 
        ? `We've added ${email} to our creator waitlist.` 
        : "You've successfully joined our creator waitlist.";
    }
    
    return email 
      ? `We've added ${email} to our waitlist.` 
      : "You've successfully joined our waitlist.";
  };
  
  const getNotificationMessage = () => {
    return isCreator
      ? "We'll notify you as soon as we open creator applications."
      : "We'll notify you as soon as we launch.";
  };

  return (
    <>
      {/* Remove the Confetti component since we're using direct calls */}
      <Dialog 
        open={open} 
        onOpenChange={onOpenChange}
      >
        <DialogContent
          className={cn(
            "sm:max-w-[425px] rounded-2xl p-0 gap-0 text-center",
            "border-0 shadow-[0_0_20px_rgba(139,92,246,0.3)]",
            "bg-gradient-to-b from-white to-indigo-50/50",
            "z-[10000]" // Ensure dialog is visible above confetti (z-index 9999)
          )}
        >
          {/* Custom Close Button for better mobile interaction */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenChange(false);
            }}
            className="absolute top-2 right-2 z-[1000] text-purple-700 hover:text-purple-900 transition-colors duration-200 rounded-full p-1.5 hover:bg-purple-100/60 bg-white/90 shadow-sm active:bg-purple-100 active:scale-95"
            aria-label="Close dialog"
            style={{ 
              minHeight: '44px', 
              minWidth: '44px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              touchAction: 'manipulation',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'rgba(0,0,0,0)'
            }}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <div className="p-6 flex flex-col items-center justify-center space-y-4">
            <div className="h-24 w-24 bg-purple-50 rounded-full flex items-center justify-center mb-2">
              <CheckCircle className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-purple-900 font-space">
              {getSuccessTitle()}
            </h3>
            <p className="text-gray-600 max-w-[24rem]">
              {getSuccessMessage()}
            </p>
            <p className="text-gray-500 text-sm">
              {getNotificationMessage()}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
