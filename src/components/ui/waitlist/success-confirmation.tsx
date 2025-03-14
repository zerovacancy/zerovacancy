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
    
    // Clear any existing canvases to prevent rendering issues
    const oldCanvases = document.querySelectorAll('canvas.confetti-canvas');
    oldCanvases.forEach(canvas => {
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    });
    
    // Create a canvas element specifically for confetti
    const canvas = document.createElement('canvas');
    canvas.className = 'confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '9999';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);
    
    // Create confetti instance with our canvas
    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true
    });
    
    // Base options
    const baseOptions = {
      particleCount: isMobile ? 80 : 150,
      spread: isMobile ? 60 : 100,
      startVelocity: 30,
      gravity: 0.8, 
      decay: 0.95,
      ticks: 500, // Longer animation duration
      origin: { y: 0.25 },
      colors: ['#8B5CF6', '#6366F1', '#3B82F6', '#10B981', '#EC4899', '#F43F5E'],
      shapes: ['circle', 'square'],
      scalar: isMobile ? 0.7 : 1,
    };
    
    try {
      // Create a more complex multi-step animation
      const fireConfetti = () => {
        // Center burst
        myConfetti({
          ...baseOptions,
          angle: 90,
          origin: { y: 0.25, x: 0.5 }
        });
        
        // Wait 150ms then fire from left side
        setTimeout(() => {
          myConfetti({
            ...baseOptions,
            angle: 60,
            particleCount: isMobile ? 40 : 80,
            origin: { y: 0.2, x: 0.15 }
          });
        }, 150);
        
        // Wait 250ms then fire from right side
        setTimeout(() => {
          myConfetti({
            ...baseOptions,
            angle: 120,
            particleCount: isMobile ? 40 : 80,
            origin: { y: 0.2, x: 0.85 }
          });
        }, 250);
        
        // Final burst after 400ms
        setTimeout(() => {
          myConfetti({
            ...baseOptions,
            startVelocity: 25,
            origin: { y: 0.45, x: 0.5 }
          });
        }, 400);
      };
      
      // Fire initial burst
      fireConfetti();
      
      // Remove canvas after animation completes
      setTimeout(() => {
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }, 6000); // Wait 6 seconds before removing 
      
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
      
      // Keep track of timeouts to clear on cleanup
      const timeouts: NodeJS.Timeout[] = [];
      
      // Use the global celebrateSuccess function for consistent confetti effect
      if (typeof window !== 'undefined' && window.celebrateSuccess) {
        // Small delay to ensure dialog is visible
        const confettiTimeout = setTimeout(() => {
          console.log("Calling global celebrateSuccess");
          window.celebrateSuccess(isMobile);
        }, 100);
        timeouts.push(confettiTimeout);
      } else {
        // Fallback direct confetti implementation if the global function isn't available
        console.log("Using fallback confetti implementation");
        
        // Create a dedicated canvas for this confetti instance
        const canvas = document.createElement('canvas');
        canvas.className = 'confetti-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.zIndex = '9999';
        canvas.style.pointerEvents = 'none';
        document.body.appendChild(canvas);
        
        const myConfetti = confetti.create(canvas, {
          resize: true,
          useWorker: true
        });
        
        // Base options
        const baseOptions = {
          particleCount: isMobile ? 80 : 150,
          spread: isMobile ? 60 : 100,
          startVelocity: 30,
          gravity: 0.8, 
          decay: 0.95,
          ticks: 500,
          origin: { y: 0.25 },
          colors: ['#8B5CF6', '#6366F1', '#3B82F6', '#10B981', '#EC4899', '#F43F5E'],
          shapes: ['circle', 'square'],
        };
        
        // Main confetti function
        const fireConfetti = () => {
          try {
            // Center burst
            myConfetti({
              ...baseOptions,
              angle: 90,
              origin: { y: 0.25, x: 0.5 }
            });
            
            // Left and right bursts with delay
            const leftTimeout = setTimeout(() => {
              myConfetti({
                ...baseOptions,
                angle: 60,
                particleCount: isMobile ? 40 : 80,
                origin: { y: 0.2, x: 0.15 }
              });
            }, 150);
            timeouts.push(leftTimeout);
            
            const rightTimeout = setTimeout(() => {
              myConfetti({
                ...baseOptions,
                angle: 120,
                particleCount: isMobile ? 40 : 80,
                origin: { y: 0.2, x: 0.85 }
              });
            }, 250);
            timeouts.push(rightTimeout);
          } catch (error) {
            console.error("Error firing fallback confetti:", error);
          }
        };
        
        // Initial delay before firing
        const initialTimeout = setTimeout(fireConfetti, 100);
        timeouts.push(initialTimeout);
        
        // Cleanup canvas when dialog closes
        const canvasTimeout = setTimeout(() => {
          if (canvas && canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        }, 6000);
        timeouts.push(canvasTimeout);
      }
      
      // Auto-close after 5 seconds to ensure users see the confirmation AND confetti animation
      const closeTimer = setTimeout(() => {
        onOpenChange(false);
      }, 5000);
      timeouts.push(closeTimer);
      
      // Cleanup all timeouts
      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout));
      };
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