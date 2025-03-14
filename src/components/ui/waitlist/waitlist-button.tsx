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
  const formRef = useRef<HTMLFormElement>(null);

  // Focus the input field when component mounts if showEmailInputDirectly is true
  // or when the email input is revealed after clicking the button
  useEffect(() => {
    if (open && inputRef.current) {
      const focusInput = () => {
        if (inputRef.current) {
          console.log("Attempting to focus email input");
          // Focus with a slight delay to ensure DOM is ready
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
              
              // For iOS, simulate a tap event to trigger keyboard
              if (isMobile) {
                try {
                  // Create and dispatch a touch event to help trigger keyboard on iOS
                  const touchEvent = new TouchEvent('touchstart', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                  });
                  inputRef.current.dispatchEvent(touchEvent);
                  
                  // Also click the element
                  inputRef.current.click();
                } catch (e) {
                  console.log("Touch event simulation failed, falling back", e);
                  // Fallback to click if TouchEvent is not supported
                  inputRef.current.click();
                }
              }
            }
          }, isMobile ? 300 : 100);
        }
      };
      
      focusInput();
      
      // Try multiple times with increasing delays on mobile
      if (isMobile) {
        setTimeout(focusInput, 500);
        setTimeout(focusInput, 1000);
      }
    }
  }, [open, isMobile]);

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
          {children ? React.cloneElement(children as React.ReactElement, {
            onClick: (e: React.MouseEvent) => {
              console.log("Button clicked - setting open state");
              e.preventDefault();
              e.stopPropagation();
              
              // Set open state
              setOpen(true);
            }
          }) : (
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
              }}
            >
              {buttonText}
            </Button>
          )}
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="w-full">
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
                "h-12 font-medium text-white",
                "bg-gradient-to-r from-indigo-600 to-purple-600",
                "hover:from-indigo-700 hover:to-purple-700",
                "transition-all duration-200 ease-in-out",
                isMobile 
                  ? "min-h-[48px] text-sm whitespace-normal" 
                  : "min-w-[220px] px-4 whitespace-nowrap"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>{isMobile ? "Joining..." : "Processing..."}</span>
                </>
              ) : (
                <span>{buttonText}</span>
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
