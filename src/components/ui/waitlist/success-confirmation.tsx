import React, { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"
import { Confetti } from "@/components/ui/confetti"
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
  const [confettiActive, setConfettiActive] = useState(false)
  const isMobile = useIsMobile()

  // Fire confetti when dialog opens
  useEffect(() => {
    if (open) {
      setConfettiActive(true)
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        onOpenChange(false)
      }, 3000)
      return () => clearTimeout(timer)
    } else {
      setConfettiActive(false)
    }
  }, [open, onOpenChange])

  return (
    <>
      {confettiActive && (
        <Confetti
          options={{
            particleCount: isMobile ? 80 : 100,
            spread: isMobile ? 50 : 70,
            origin: { y: 0.25 },
            colors: ['#8B5CF6', '#6366F1', '#3B82F6', '#10B981'],
          }}
        />
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn(
            "sm:max-w-[425px] rounded-2xl p-0 gap-0 text-center",
            "border-0 shadow-[0_0_20px_rgba(139,92,246,0.3)]",
            "bg-gradient-to-b from-white to-indigo-50/50"
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