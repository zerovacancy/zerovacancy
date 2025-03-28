import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { CheckCircle, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import confetti from 'canvas-confetti';

export const MobileHeroCTA: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showInlineSuccess, setShowInlineSuccess] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Validate email as user types
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(email.length > 0 && emailRegex.test(email));
  }, [email]);

  // Focus input after showing form
  useEffect(() => {
    if (showForm && inputRef.current) {
      // Add small delay to ensure element is mounted and renderable
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showForm]);

  // Handle initial button click
  const handleButtonClick = () => {
    setShowForm(true);
  };

  // Handle form submission - using same flow as desktop
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Include metadata for tracking
      const metadata = {
        source: 'mobile_hero',
        referrer: document.referrer,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      };
      
      // Submit to waitlist API
      const { data, error } = await supabase.functions.invoke('submit-waitlist-email', {
        body: { 
          email, 
          source: 'mobile_hero', 
          marketingConsent: true,
          metadata
        }
      });
      
      if (error) {
        console.error('Error submitting email:', error);
        toast.error('Failed to join waitlist. Please try again.');
        return;
      }
      
      // Store the email for the confirmation dialog
      setSubmittedEmail(email);
      
      // Check if already subscribed
      setAlreadySubscribed(data?.status === 'already_subscribed');
      
      // Clear form
      setEmail('');
      setShowForm(false);
      
      // On mobile, we'll use an inline success message
      setShowInlineSuccess(true);
      
      // Fire confetti immediately
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.3 }
        });
      } catch (err) {
        console.error('Confetti failed:', err);
      }
      
      // Set state to true for conditional rendering
      setShowConfetti(true);
      
    } catch (error) {
      console.error('Error submitting email:', error);
      toast.error('Failed to join waitlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fire confetti when showing success message
  useEffect(() => {
    if (showInlineSuccess) {
      setTimeout(() => {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.3 }
          });
        } catch (err) {
          console.error('Confetti failed:', err);
        }
      }, 100);
    }
  }, [showInlineSuccess]);

  // Render success state after submission
  if (showInlineSuccess) {
    return (
      <div 
        className="w-full max-w-[250px] py-5 px-4 font-medium rounded-[14px] text-white relative flex flex-col items-center justify-center animate-fade-in"
        style={{
          background: 'linear-gradient(180deg, #8A42F5 0%, #7837DB 100%)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.07), 0 4px 8px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.05), 0 16px 32px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)',
          transform: 'translateZ(0)', // Hardware acceleration
          margin: '0 auto',
          position: 'relative'
        }}
      >
        <div 
          className="h-14 w-14 bg-purple-50/20 rounded-full flex items-center justify-center mb-2"
          style={{
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          <CheckCircle className="h-7 w-7 text-white" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">
          {alreadySubscribed ? 'Already Subscribed' : 'Success!'}
        </h3>
        <p className="text-white/90 text-center text-sm max-w-[24rem] mb-1">
          {alreadySubscribed 
            ? `${submittedEmail} is already on our waitlist.`
            : `We've added ${submittedEmail} to our waitlist.`
          }
        </p>
        <p className="text-white/80 text-xs">
          We'll notify you as soon as we launch.
        </p>
      </div>
    );
  }

  // Render initial button if form isn't shown
  if (!showForm) {
    return (
      <button
        onClick={handleButtonClick}
        className={cn(
          "w-full mx-auto font-medium rounded-[12px] text-white relative flex items-center justify-center",
          "h-12 min-h-[48px] px-4 py-2 rounded-full", // Increased height and full rounded corners
          "text-sm",
          "max-w-[250px]" // Constrain width to ensure centering
        )}
        style={{
          background: 'linear-gradient(180deg, #8A42F5 0%, #7837DB 100%)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.07), 0 4px 8px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.05), 0 16px 32px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)',
          fontWeight: 600,
          paddingLeft: '52px',
          letterSpacing: '0.02em',
          transform: 'translateZ(0)', // Hardware acceleration
          margin: '0 auto',
          position: 'relative'
        }}
      >
        {/* Icon container */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 ml-4 flex items-center justify-center"
          style={{
            width: '32px',
            height: '32px',
            background: '#8A42F5', // Match the purple button color
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '10px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
            <path d="M20 12v4H6a2 2 0 0 0-2 2c0 1.1.9 2 2 2h12v-4"></path>
          </svg>
        </div>
        RESERVE EARLY ACCESS
      </button>
    );
  }

  // Form state after button is clicked
  return (
    <form 
      onSubmit={handleSubmit}
      className="w-full max-w-[250px] mx-auto relative animate-fade-in"
      style={{
        transform: 'translateZ(0)', // Hardware acceleration
        margin: '0 auto',
        position: 'relative',
        zIndex: 30
      }}
    >
      <div className={cn(
        "flex flex-col w-full",
        "shadow-lg" // Add shadow to the entire form container
      )}>
        <div className="relative">
          {/* Email input */}
          <input
            ref={inputRef}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={cn(
              "w-full rounded-t-[10px] rounded-b-none text-gray-800 border border-purple-200/70 border-b-0 focus:outline-none focus:ring-2 focus:ring-purple-400/40",
              "h-12 px-3 text-base font-medium" // Improved height and font styling
            )}
            style={{
              backgroundColor: 'white',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgba(138, 66, 245, 0.2)'
            }}
            disabled={isLoading}
            required
          />
          
          {/* Check mark for valid email */}
          {isValid && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 z-10">
              <CheckCircle className="h-5 w-5" />
            </div>
          )}
        </div>
        
        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full bg-gradient-to-b from-purple-600 to-purple-700 text-white font-semibold rounded-t-none rounded-b-[10px] flex items-center justify-center transition-all duration-200",
            "h-12 text-sm" // Matching height with input
          )}
          style={{
            background: 'linear-gradient(180deg, #8A42F5 0%, #7837DB 100%)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.07), 0 4px 8px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)',
            letterSpacing: '0.02em'
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              <span>Joining...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5 mr-2" />
              <span>JOIN WAITLIST</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};