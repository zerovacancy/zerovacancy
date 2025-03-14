import React, { useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"
import { Confetti } from "@/components/ui/confetti"
import confetti from "canvas-confetti"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface SuccessConfirmationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email?: string
}

export function SuccessConfirmation({
  open,
  onOpenChange,
  email,
}: SuccessConfirmationProps) {
  const isMobile = useIsMobile()

  // Auto-close dialog after delay and fire confetti
  useEffect(() => {
    if (open) {
      console.log("Success confirmation opened")
      
      // Fire confetti immediately with direct call (more reliable)
      const fireConfetti = () => {
        const options = {
          particleCount: isMobile ? 80 : 150,
          spread: isMobile ? 60 : 100,
          origin: { y: 0.25 },
          startVelocity: 30,
          gravity: 0.8,
          decay: 0.94,
          ticks: 200,
          zIndex: 9999,
          colors: ['#8B5CF6', '#6366F1', '#3B82F6', '#10B981']
        }
        
        try {
          confetti(options)
        } catch (error) {
          console.error("Error firing direct confetti:", error)
        }
      }
      
      // Fire multiple rounds of confetti for a better effect
      fireConfetti()
      const confetti1 = setTimeout(() => fireConfetti(), 300)
      const confetti2 = setTimeout(() => fireConfetti(), 600)
      
      // Auto-close after 4 seconds to ensure users see the confirmation
      const closeTimer = setTimeout(() => {
        onOpenChange(false)
      }, 4000)
      
      return () => {
        clearTimeout(closeTimer)
        clearTimeout(confetti1)
        clearTimeout(confetti2)
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
                Success!
              </h3>
              <p className="text-gray-600">
                {email 
                  ? `We've added ${email} to our waitlist.` 
                  : "You've successfully joined our waitlist."}
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