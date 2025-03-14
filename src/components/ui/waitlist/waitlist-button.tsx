
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
import { optimizeMobileViewport } from "@/utils/mobile-optimization";

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
  
  // Apply mobile optimizations for better input handling
  useEffect(() => {
    if (isMobile) {
      optimizeMobileViewport();
    }
  }, [isMobile]);

  // Focus the input field when component mounts if showEmailInputDirectly is true
  // or when the email input is revealed after clicking the button
  useEffect(() => {
    if (open && inputRef.current) {
      // Create a function to ensure keyboard shows up
      const focusAndShowKeyboard = () => {
        if (!inputRef.current) return;
        
        try {
          // Ensure input is ready for text entry
          inputRef.current.readOnly = false;
          
          // Focus the input to make keyboard appear
          inputRef.current.focus();
          
          // Force blur and refocus to reset any stuck states
          inputRef.current.blur();
          inputRef.current.focus();
          
          // Simulate clicks and touches to force keyboard on iOS
          inputRef.current.click();
          
          if (isMobile) {
            // Special handling for iOS Safari
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
              // Create a touch event to help iOS show keyboard
              try {
                const touchEvent = new TouchEvent('touchstart', {
                  bubbles: true,
                  cancelable: true
                });
                inputRef.current.dispatchEvent(touchEvent);
              } catch (e) {
                console.log("Touch event simulation failed", e);
                // Fallback to click
                inputRef.current.click();
              }
            }
          }
        } catch (err) {
          console.error("Error focusing input:", err);
        }
      };
      
      // Call immediately and with delays to ensure it works
      focusAndShowKeyboard();
      
      // Try with increasing delays to catch any rendering or timing issues
      setTimeout(focusAndShowKeyboard, 100);
      setTimeout(focusAndShowKeyboard, 300);
      setTimeout(focusAndShowKeyboard, 500);
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
              e.preventDefault();
              e.stopPropagation();
              
              // Set open state
              setOpen(true);
              
              // Ensure focus after state update
              setTimeout(() => {
                if (inputRef.current) {
                  inputRef.current.focus();
                  inputRef.current.click();
                }
              }, 50);
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
                
                // Ensure focus after state update
                setTimeout(() => {
                  if (inputRef.current) {
                    inputRef.current.focus();
                    inputRef.current.click();
                  }
                }, 50);
              }}
            >
              {buttonText}
            </Button>
          )}
        </div>
      ) : (
        <form 
          ref={formRef} 
          onSubmit={handleSubmit} 
          className="w-full"
          onClick={(e) => {
            // Ensure clicking anywhere in the form focuses the input
            if (inputRef.current && isMobile) {
              e.stopPropagation();
              inputRef.current.focus();
              inputRef.current.click();
            }
          }}
        >
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
