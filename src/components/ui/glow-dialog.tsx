import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { Loader2, X, Mail, Building, Camera, CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SuccessConfirmation } from "@/components/ui/waitlist/success-confirmation";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

// Component has been removed - using custom animation instead

interface GlowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlowDialog({
  open,
  onOpenChange
}: GlowDialogProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const isMobileView = typeof window !== 'undefined' && window.innerWidth < 768;
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(email.length > 0 && emailRegex.test(email));
  }, [email]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    
    try {
      const metadata = {
        referrer: document.referrer,
        url: window.location.href,
        userAgent: navigator.userAgent,
        dialog: "glow_popup",
        timestamp: new Date().toISOString(),
      };
      
      const { data, error } = await supabase.functions.invoke('submit-waitlist-email', {
        body: { 
          email, 
          source: "glow_dialog", 
          marketingConsent: true,
          metadata,
          userType: isCreator ? 'creator' : 'property_owner'
        }
      });
      
      if (error) {
        console.error("Error submitting email:", error);
        toast.error("Failed to join the waitlist. Please try again later.");
        return;
      }
      
      const emailToStore = email;
      
      setEmail("");
      
      onOpenChange(false);
      
      requestAnimationFrame(() => {
        setTimeout(() => {
          setSubmittedEmail(emailToStore);
          setAlreadySubscribed(data?.status === 'already_subscribed');
          
          console.log("Showing success dialog after glow dialog closed");
          setShowSuccess(true);
        }, 400);
      });
    } catch (error) {
      console.error("Error submitting email:", error);
      toast.error("Failed to join the waitlist. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [email, onOpenChange, isCreator]);

  const dialogContentClassName = isMobileView 
    ? "max-w-[95vw] md:max-w-3xl overflow-hidden border-none bg-transparent" 
    : "sm:max-w-2xl md:max-w-3xl overflow-hidden border-none bg-transparent";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={dialogContentClassName}>
          <DialogTitle className="sr-only">Join Waitlist - Enter Your Email</DialogTitle>
          <div className="absolute top-4 right-4 z-50">
            <button 
              onClick={() => onOpenChange(false)}
              className="text-white hover:text-white transition-colors duration-200 rounded-full p-2.5 hover:bg-white/20 bg-black/30 shadow-md"
              aria-label="Close dialog"
              style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <style jsx>{`
            .svg-crisp {
              shape-rendering: geometricPrecision;
              text-rendering: geometricPrecision;
              image-rendering: optimizeQuality;
            }
            
            .animate-count {
              animation: countUp 2s ease-out forwards;
              position: relative;
            }
            
            @keyframes countUp {
              0% { opacity: 0; transform: translateY(8px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            
            input::placeholder {
              color: white !important;
              opacity: 0.9 !important;
            }
            
            .mobile-placeholder::placeholder {
              color: white !important;
              opacity: 0.9 !important;
            }
            
            @media screen and (max-width: 768px) {
              .mobile-placeholder::placeholder {
                color: white !important;
                opacity: 0.9 !important;
              }
            }
          `}</style>
          <motion.div 
            className="relative rounded-lg overflow-hidden bg-gradient-to-r from-[#5425B3] via-[#6933E8] to-[#3151D3] p-7 sm:p-9 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }}
            exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:18px_18px] opacity-25"></div>
            
            {/* Simple background glow effect */}
            <div className="absolute top-[-50%] left-[-50%] h-[200%] w-[200%]" style={{ animation: "spin 10s linear infinite" }}>
              <div className="absolute top-0 left-0 right-0 bottom-0 m-auto w-[45%] h-[45%] rounded-full bg-white blur-[80px] opacity-10"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-4 mb-5">
                <Camera className="h-6 w-6 text-white opacity-80 animate-float-subtle" />
                <Building className="h-6 w-6 text-white opacity-80 animate-float-subtle animation-delay-200" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 md:mb-4 leading-tight text-white font-space">
                RESERVE YOUR SPOT
              </h2>
              <p className="text-center text-white text-opacity-90 mb-6 max-w-xl mx-auto text-sm sm:text-base font-inter leading-relaxed">
                Join our curated network of property visionaries and transform your spaces.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 justify-center max-w-md mx-auto">
                <div className="relative">
                  <label htmlFor="email-input" className="sr-only">Email Address</label>
                  {/* Simple, standard input with minimal styling */}
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 h-12 text-black border border-gray-300 rounded-md"
                    style={{
                      backgroundColor: "white",
                      opacity: 1
                    }}
                    required
                  />
                  {isEmailValid && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-400 animate-fade-in">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="svg-crisp"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Single prominent CTA */}
                <button 
                  type="submit"
                  className={cn(
                    "w-full h-[52px] md:h-[56px] rounded-lg mt-2",
                    "bg-white text-[#5425B3]",
                    "border border-white/90",
                    "transition-all duration-200 ease-in-out",
                    "shadow-md hover:shadow-lg hover:brightness-105",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "flex items-center justify-center gap-2",
                    "px-4 py-3 md:py-4 min-h-[52px]",
                    "font-semibold font-jakarta text-base"
                  )}
                  disabled={isLoading}
                  onClick={() => setIsCreator(false)}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-purple-700 svg-crisp" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Joining Waitlist...</span>
                    </>
                  ) : (
                    <>
                      <span>JOIN WAITLIST</span>
                      <svg
                        className="w-5 h-5 svg-crisp"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </>
                  )}
                </button>
                
                {/* Social proof section matching hero section but adapted for background */}
                <div className="flex flex-col items-center justify-center mt-6 mb-1">
                  <div className="flex flex-wrap justify-center gap-1 mb-2">
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-medium">MJ</div>
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-medium">TS</div>
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-medium">LW</div>
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-medium">KH</div>
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-medium">+</div>
                  </div>
                  <p className="text-white text-xs">
                    <span className="font-semibold inline-block relative">
                      <span className="animate-count">2,165+</span>
                    </span>
                    {" "}property owners and creators joined
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
      
      <SuccessConfirmation 
        open={showSuccess}
        onOpenChange={setShowSuccess}
        email={submittedEmail}
        alreadySubscribed={alreadySubscribed}
        isCreator={isCreator}
      />
    </>
  );
}
