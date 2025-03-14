
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
        
        // Force focus on the input (with delay to ensure rendering is complete)
        setTimeout(() => {
          if (internalRef.current) {
            try {
              internalRef.current.focus();
              
              // iOS requires interaction to show keyboard
              const simulateTouch = () => {
                if (internalRef.current) {
                  internalRef.current.click();
                  internalRef.current.focus();
                }
              };
              
              // Try multiple times with increasing delays
              simulateTouch();
              setTimeout(simulateTouch, 200);
              setTimeout(simulateTouch, 500);
            } catch (err) {
              console.error("Error focusing input:", err);
            }
          }
        }, 100);
      }
    }, [isMobile]);

    return (
      <div className={cn(
        "relative transition-all duration-300", 
        isMobile ? "w-full" : "w-[380px]",
        isFocused && "scale-[1.02] transform",
        className
      )}>
        {/* Input field with mail icon */}
        <div className={cn(
          "absolute left-3 top-1/2 transform -translate-y-1/2",
          "text-transparent bg-clip-text",
          isFocused || isValid 
            ? "bg-gradient-to-r from-indigo-600 to-purple-600" 
            : "text-gray-400"
        )}>
          <Mail className="h-5 w-5" />
        </div>
        
        {/* Check mark for valid email */}
        {isValid && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 animate-fade-in">
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
          className={cn(
            "border transition-all duration-300",
            "focus:scale-100", // Prevent default scale to use our custom one
            isMobile 
              ? [
                  "h-[50px]",
                  "bg-white", 
                  isFocused ? "border-indigo-400 ring-2 ring-indigo-200" : "border-gray-100",
                  "pl-10 pr-3 py-2",
                  "text-base",
                  "placeholder:text-gray-400", 
                  "rounded-xl",
                  "shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]"
                ] 
              : [
                  "h-[52px]",
                  "border-gray-200 bg-white", 
                  "focus:ring-2 focus:ring-primary/50 focus:border-transparent", 
                  "pl-10 pr-4 py-2", 
                  "text-base placeholder:text-gray-400", 
                  "rounded-xl",
                  isFocused ? "border-indigo-400 ring-2 ring-indigo-200 shadow-[0_0_10px_rgba(99,102,241,0.2)]" : "",
                  "shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]",
                  "hover:border-indigo-300 hover:shadow-[0_0_8px_rgba(99,102,241,0.15)]"
                ]
          )} 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onClick={(e) => {
            // When clicked, ensure focus and show keyboard
            e.currentTarget.focus();
            setIsFocused(true);
          }}
          readOnly={false}
          aria-label="Email address" 
          required 
          disabled={isLoading || disabled}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          enterKeyHint="go"
        />
      </div>
    );
  }
);

EmailInput.displayName = "EmailInput";
