import React, { useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"
import { Confetti } from "@/components/ui/confetti"
import confetti from "canvas-confetti"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

// Define a global celebration function for consistent confetti across the app
if (typeof window !== 'undefined' && !window.hasOwnProperty('celebrateSuccess')) {
  window.celebrateSuccess = (isMobile = false) => {
    console.log("Global celebrateSuccess called");
    const options = {
      particleCount: isMobile ? 80 : 150,
      spread: isMobile ? 60 : 100,
      origin: { y: 0.25 },
      startVelocity: 30,
      gravity: 0.8,
      decay: 0.94,
      ticks: 200,
      colors: ['#8B5CF6', '#6366F1', '#3B82F6', '#10B981'],
      zIndex: 9999,
      disableForReducedMotion: false
    };
    
    try {
      // Fire multiple bursts
      const fireConfetti = () => confetti(options);
      fireConfetti();
      setTimeout(fireConfetti, 300);
      setTimeout(fireConfetti, 600);
    } catch (error) {
      console.error("Error firing global confetti:", error);
    }
  };
}

interface SuccessConfirmationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email?: string
  alreadySubscribed?: boolean
}

export function SuccessConfirmation({
  open,
  onOpenChange,
  email,
  alreadySubscribed = false,
}: SuccessConfirmationProps) {
  const isMobile = useIsMobile()

  // Auto-close dialog after delay and fire confetti
  useEffect(() => {
    if (open) {
      console.log("Success confirmation opened")
      
      // Use the global celebrateSuccess function for consistent confetti effect
      if (typeof window !== 'undefined' && window.celebrateSuccess) {
        // Small delay to ensure dialog is visible
        setTimeout(() => {
          console.log("Calling global celebrateSuccess");
          window.celebrateSuccess(isMobile);
        }, 100);
      } else {
        // Fallback direct confetti implementation
        console.log("Using fallback confetti implementation");
        const fireConfetti = () => {
          try {
            confetti({
              particleCount: isMobile ? 80 : 150,
              spread: isMobile ? 60 : 100,
              origin: { y: 0.25 },
              startVelocity: 30,
              gravity: 0.8,
              decay: 0.94,
              ticks: 200,
              colors: ['#8B5CF6', '#6366F1', '#3B82F6', '#10B981'],
              zIndex: 9999,
              disableForReducedMotion: false
            });
          } catch (error) {
            console.error("Error firing fallback confetti:", error);
          }
        };
        
        // Fire multiple bursts with slight delays
        setTimeout(fireConfetti, 100);
        const confetti1 = setTimeout(fireConfetti, 400);
        const confetti2 = setTimeout(fireConfetti, 700);
        
        // Clear timeouts on cleanup
        return () => {
          clearTimeout(confetti1);
          clearTimeout(confetti2);
        };
      }
      
      // Auto-close after 4 seconds to ensure users see the confirmation
      const closeTimer = setTimeout(() => {
        onOpenChange(false);
      }, 4000);
      
      return () => {
        clearTimeout(closeTimer);
      }
    }
  }, [open, onOpenChange, isMobile])

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
                {alreadySubscribed ? "Already Subscribed" : "Success!"}
              </h3>
              <p className="text-gray-600">
                {alreadySubscribed
                  ? email 
                    ? `${email} is already on our waitlist.` 
                    : "You're already on our waitlist!"
                  : email 
                    ? `We've added ${email} to our waitlist.` 
                    : "You've successfully joined our waitlist."
                }
              </p>
              <p className="text-sm text-gray-500 mt-2">
                We'll notify you as soon as we launch.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}