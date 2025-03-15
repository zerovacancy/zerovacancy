
"use client";

import { useState, useRef, forwardRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckCircle, Mail } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface EmailInputProps {
  email: string;
  setEmail: (email: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
  className?: string;
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({ email, setEmail, isLoading, disabled, inputRef, className }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const isMobile = useIsMobile();
    const internalRef = useRef<HTMLInputElement>(null);
    
    // Validate email as user types
    useEffect(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValid(email.length > 0 && emailRegex.test(email));
    }, [email]);
    
    // Improve mobile input experience
    useEffect(() => {
      if (isMobile && internalRef.current) {
        // Configure input for better mobile experience
        const inputElement = internalRef.current;
        
        // Set mobile-friendly input attributes
        inputElement.setAttribute("inputmode", "email");
        inputElement.setAttribute("autocorrect", "off");
        inputElement.setAttribute("spellcheck", "false");
        inputElement.setAttribute("autocomplete", "email");
        inputElement.setAttribute("autocapitalize", "off");
        
        // Special handling to ensure keyboard appears on iOS
        setTimeout(() => {
          if (internalRef.current) {
            internalRef.current.focus();
            
            // Force input to be active and selectable
            internalRef.current.readOnly = false;
            
            // Special handling for iOS
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
              // Create and dispatch events that help trigger the keyboard
              try {
                // Simulate touch and click events
                internalRef.current.click();
                internalRef.current.dispatchEvent(new MouseEvent('mousedown'));
                internalRef.current.dispatchEvent(new MouseEvent('mouseup'));
                internalRef.current.dispatchEvent(new MouseEvent('click'));
                
                // Try to focus again after a delay
                setTimeout(() => {
                  if (internalRef.current) {
                    internalRef.current.focus();
                    internalRef.current.click();
                  }
                }, 300);
                
                // One more attempt with longer delay
                setTimeout(() => {
                  if (internalRef.current) {
                    internalRef.current.focus();
                    internalRef.current.click();
                    
                    // Dispatch blur and focus to reset any stuck states
                    internalRef.current.dispatchEvent(new FocusEvent('blur'));
                    internalRef.current.dispatchEvent(new FocusEvent('focus'));
                  }
                }, 600);
              } catch (err) {
                console.error("Error forcing focus on iOS:", err);
              }
            }
          }
        }, 100);
      }
    }, [isMobile]);

    // Special useEffect to force keyboard on initial render
    useEffect(() => {
      // Handle the initial keyboard display
      if (isMobile) {
        // Force element to be ready for input immediately
        const showKeyboard = () => {
          if (internalRef.current) {
            // Make sure the input is fully interactive
            internalRef.current.readOnly = false;
            internalRef.current.focus();
            // Set selection range to help trigger keyboard
            if (internalRef.current.value) {
              internalRef.current.setSelectionRange(0, internalRef.current.value.length);
            }
          }
        };
        
        // Try multiple times with increasing delays
        showKeyboard();
        setTimeout(showKeyboard, 250);
        setTimeout(showKeyboard, 500);
      }
    }, [isMobile]);

    return (
      <div className={cn(
        "relative h-full w-full",
        className
      )}>
        {/* No icon */}
        
        {/* Check mark for valid email */}
        {isValid && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 animate-fade-in duration-200 z-10">
            <CheckCircle className="h-5 w-5" />
          </div>
        )}
        
        <Input 
          ref={(node) => {
            // Handle refs safely
            if (node) {
              // Set internal ref
              internalRef.current = node;
              
              // Handle forwarded ref
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                // Use this pattern to avoid TypeScript errors with read-only refs
                (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
              }
              
              // Handle passed inputRef (if any)
              if (inputRef) {
                (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
              }
            }
          }}
          type="email" 
          placeholder="Enter your email" 
          inputMode="email"
          autoComplete="email"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          className={cn(
            "h-full w-full",
            "px-3",
            "border-none outline-none focus:ring-0",
            "text-sm sm:text-base font-inter",
            "placeholder:text-gray-400 placeholder:font-inter",
            "bg-white transition-all duration-200",
            "rounded-none"
          )} 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          // Handle all forms of interaction to ensure keyboard appears
          onClick={(e) => {
            e.stopPropagation();
            const input = e.currentTarget;
            input.focus();
            input.readOnly = false;
            setIsFocused(true);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            const input = e.currentTarget;
            input.focus();
            input.readOnly = false;
            setIsFocused(true);
          }}
          readOnly={false}
          aria-label="Email address" 
          required 
          disabled={isLoading || disabled}
          enterKeyHint="go"
        />
      </div>
    );
  }
);

EmailInput.displayName = "EmailInput";
