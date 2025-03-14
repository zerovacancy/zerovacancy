
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { EmailInput } from "./email-input";
import { SocialProof } from "./social-proof";
import { SuccessConfirmation } from "./success-confirmation";
import { supabase } from "@/integrations/supabase/client";

export function WaitlistButton({
  source = "unknown",
  className,
  children,
  buttonText = "JOIN WAITLIST",
  showEmailInputDirectly = false
}: {
  source?: string;
  className?: string;
  children?: React.ReactNode;
  buttonText?: string;
  showEmailInputDirectly?: boolean;
}) {
  const [open, setOpen] = useState(showEmailInputDirectly);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  // Focus the input field when component mounts if showEmailInputDirectly is true
  useEffect(() => {
    if (showEmailInputDirectly && inputRef.current) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          console.log("Auto-focusing email input on initial render");
          
          // Extra help for mobile devices
          if (isMobile) {
            inputRef.current.click();
            setTimeout(() => {
              if (inputRef.current) inputRef.current.focus();
            }, 100);
          }
        }
      }, 500);
    }
  }, [showEmailInputDirectly, isMobile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    
    try {
      // Collect metadata
      const metadata = {
        referrer: document.referrer,
        url: window.location.href,
        userAgent: navigator.userAgent,
        source,
        timestamp: new Date().toISOString(),
      };
      
      // Call our Supabase Edge Function
      const { error, data } = await supabase.functions.invoke('submit-waitlist-email', {
        body: { 
          email, 
          source, 
          marketingConsent: true,
          metadata
        }
      });
      
      if (error) {
        console.error("Error submitting email:", error);
        toast.error("Failed to join the waitlist. Please try again later.");
        return;
      }
      
      // Handle already subscribed message
      if (data?.status === 'already_subscribed') {
        // Instead of a toast, show confirmation dialog with special message
        setSubmittedEmail(email);
        setAlreadySubscribed(true);
        setShowSuccess(true);
        setOpen(false);
      } else {
        // Store the email for the success confirmation
        setSubmittedEmail(email);
        setAlreadySubscribed(false);
        
        // Show success confirmation with confetti
        console.log("Showing success confirmation with email:", email);
        setShowSuccess(true);
        
        // Close the input form
        setOpen(false);
      }
      
      setEmail("");
    } catch (error) {
      console.error("Error submitting email:", error);
      toast.error("Failed to join the waitlist. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {!open ? (
        <div className="w-full">
          {children || (
            <Button 
              className={cn(
                "w-full py-6 text-base font-medium font-jakarta",
                "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                isMobile ? "text-sm" : "text-base"
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Set open state
                setOpen(true);
                
                // Use a longer delay for mobile devices
                const focusDelay = isMobile ? 300 : 150;
                
                // Schedule focus after animation completes
                setTimeout(() => {
                  if (inputRef.current) {
                    try {
                      // Try to focus and also make sure keyboard appears on mobile
                      inputRef.current.focus();
                      
                      // On iOS, we may need to tap the field to get keyboard to show
                      if (isMobile) {
                        inputRef.current.click();
                        
                        // iOS may need this extra nudge
                        setTimeout(() => {
                          if (inputRef.current) inputRef.current.focus();
                        }, 100);
                      }
                    } catch (error) {
                      console.error("Error focusing input:", error);
                    }
                  }
                }, focusDelay);
              }}
            >
              {buttonText}
            </Button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <EmailInput
              setEmail={setEmail}
              email={email}
              isLoading={loading}
              disabled={loading}
              className="flex-grow"
              inputRef={inputRef}
            />
            <Button 
              type="submit" 
              disabled={loading} 
              className={cn(
                "h-12 font-medium text-white whitespace-normal",
                "bg-gradient-to-r from-indigo-600 to-purple-600",
                "hover:from-indigo-700 hover:to-purple-700",
                "transition-all duration-200 ease-in-out",
                isMobile ? "min-h-[48px]" : "min-w-[170px] px-4"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="text-sm">Joining...</span>
                </>
              ) : (
                <span className="text-sm">{buttonText}</span>
              )}
            </Button>
          </div>
          {/* Social proof is now moved to the main component */}
        </form>
      )}
      
      {/* Success Confirmation with Confetti Effect */}
      <SuccessConfirmation 
        open={showSuccess} 
        onOpenChange={setShowSuccess}
        email={submittedEmail}
        alreadySubscribed={alreadySubscribed}
      />
    </div>
  );
};
