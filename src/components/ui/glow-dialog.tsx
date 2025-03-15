import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { Squares } from "@/components/ui/squares";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Loader2, X, Mail, Building, Camera, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SuccessConfirmation } from "@/components/ui/waitlist/success-confirmation";
import confetti from "canvas-confetti";
import { cn, pulseAnimation } from "@/lib/utils";

const MovingBorder = ({
  children,
  duration = 2000,
  rx = "30%",
  ry = "30%",
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: any;
}) => {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue<number>(0);
  useAnimationFrame(time => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set(time * pxPerMillisecond % length);
    }
  });
  const x = useTransform(progress, val => pathRef.current?.getPointAtLength(val)?.x ?? 0);
  const y = useTransform(progress, val => pathRef.current?.getPointAtLength(val)?.y ?? 0);
  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;
  return <>
      <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="absolute h-full w-full" width="100%" height="100%" {...otherProps}>
        <rect fill="none" width="100%" height="100%" rx={rx} ry={ry} ref={pathRef} />
      </svg>
      <motion.div style={{
      position: "absolute",
      top: 0,
      left: 0,
      display: "inline-block",
      transform
    }}>
        {children}
      </motion.div>
    </>;
};

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
          <div className="absolute top-3 right-3 z-50">
            <button 
              onClick={() => onOpenChange(false)}
              className="text-white/70 hover:text-white transition-colors duration-200 rounded-full p-1.5 hover:bg-white/10"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <motion.div 
            className="relative rounded-lg overflow-hidden bg-gradient-to-br from-purple-900/90 via-purple-800/90 to-blue-800/90 p-6 sm:p-8 md:p-10 shadow-xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }}
            exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(#7e69ab30_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-blue-600/20 animate-shine bg-shine-size"></div>
              <div className="absolute inset-0 opacity-30">
                <Squares
                  direction="diagonal"
                  speed={0.5}
                  borderColor="#9b87f530"
                  squareSize={32}
                  hoverFillColor="#9b87f510"
                />
              </div>
            </div>
            <MovingBorder rx="12px" ry="12px" duration={3000}>
              <div className="h-28 w-28 sm:h-36 sm:w-36 opacity-[0.6] bg-[radial-gradient(var(--purple-500)_40%,transparent_60%)]" />
            </MovingBorder>
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-4 mb-5">
                <Camera className="h-6 w-6 text-purple-300 opacity-80 animate-float-subtle" />
                <Building className="h-6 w-6 text-sky-300 opacity-80 animate-float-subtle animation-delay-200" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 md:mb-4 leading-tight bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent animate-shimmer-slide">
                JOIN WAITLIST
              </h2>
              <p className="text-center text-gray-100 mb-8 max-w-xl mx-auto text-sm sm:text-base md:text-lg font-light leading-relaxed">
                Be among the first to connect with our curated network of property visionaries and transform your spaces.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 justify-center max-w-md mx-auto">
                <div className="relative">
                  <div className={cn(
                    "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400",
                    isEmailFocused && "text-purple-400 transition-colors duration-200"
                  )}>
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    ref={emailInputRef}
                    type="email"
                    inputMode="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    placeholder="Enter your email"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck="false"
                    enterKeyHint="go"
                    required
                    disabled={isLoading}
                    className={cn(
                      "w-full pl-10 py-3 rounded-md",
                      "bg-white/10 backdrop-blur-sm",
                      "text-white placeholder:text-gray-400",
                      "border border-white/20",
                      "transition-all duration-200 ease-in-out",
                      "focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50",
                      "disabled:opacity-50",
                      isEmailFocused && "border-purple-400/70 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                    )}
                    aria-label="Email address"
                  />
                  {isEmailValid && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 animate-fade-in">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-1">
                  <HoverBorderGradient 
                    type="submit"
                    className={cn(
                      "bg-gradient-to-r from-purple-600 to-blue-600 text-white",
                      "hover:from-purple-700 hover:to-blue-700",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "flex-1 py-3 transition-all duration-300 transform hover:translate-y-[-2px]",
                      "shadow-md hover:shadow-lg",
                      "font-medium"
                    )}
                    duration={1.5}
                    disabled={isLoading}
                    onClick={() => setIsCreator(false)}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      'JOIN AS PROPERTY OWNER'
                    )}
                  </HoverBorderGradient>
                  <HoverBorderGradient 
                    type="button"
                    className={cn(
                      "!bg-white !text-purple-600 !border-2 !border-purple-500",
                      "hover:!bg-purple-50",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "flex-1 py-3 transition-all duration-300 transform hover:translate-y-[-2px]",
                      "shadow-md hover:shadow-lg",
                      "font-medium"
                    )}
                    duration={1.5}
                    disabled={isLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsCreator(true);
                      handleSubmit(e);
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      'JOIN AS CREATOR'
                    )}
                  </HoverBorderGradient>
                </div>
                <div className="flex justify-center mt-3 mb-2">
                  <div className="text-xs text-gray-400 text-center backdrop-blur-sm px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    Secure & verified ✓ Your information is safe with us
                  </div>
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
