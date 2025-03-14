
import React, { useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"
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
      
      // Auto-close after 5 seconds
      const closeTimer = setTimeout(() => {
        onOpenChange(false);
      }, 5000);
      
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
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn(
            "sm:max-w-[425px] rounded-2xl p-0 gap-0 text-center",
            "border-0 shadow-[0_0_20px_rgba(139,92,246,0.3)]",
            "bg-gradient-to-b from-white to-indigo-50/50",
            "z-[1000]" // Ensure dialog is visible but below confetti
          )}
        >
          <div className="p-6 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div
                className={cn(
                  "w-16 h-16 rounded-full bg-green-100 flex items-center justify-center",
                  "animate-in zoom-in-50 duration-300"
                )}
              >
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div
                className={cn(
                  "absolute inset-0 rounded-full",
                  "bg-gradient-to-r from-green-400 to-green-500 opacity-20",
                  "blur-xl"
                )}
              />
            </div>

            <div 
              className={cn(
                "space-y-2 animate-in fade-in-50 duration-300 delay-150", 
                "max-w-[320px] mx-auto"
              )}
            >
              <h3 
                className={cn(
                  "text-xl font-semibold text-gray-900",
                  "bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
                )}
              >
                {getSuccessTitle()}
              </h3>
              <p className="text-gray-600">
                {getSuccessMessage()}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {getNotificationMessage()}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
