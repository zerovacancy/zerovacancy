
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
    
    // Simplified input experience to avoid jittering
    useEffect(() => {
      if (isMobile && internalRef.current) {
        // Configure input for better mobile experience without causing jittering
        const inputElement = internalRef.current;
        
        // Set mobile-friendly input attributes
        inputElement.setAttribute("inputmode", "email");
        inputElement.setAttribute("autocorrect", "off");
        inputElement.setAttribute("spellcheck", "false");
        inputElement.setAttribute("autocomplete", "email");
        inputElement.setAttribute("autocapitalize", "off");
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
            "rounded-none",
            "z-[10010]" // Ensure input is top layer
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
