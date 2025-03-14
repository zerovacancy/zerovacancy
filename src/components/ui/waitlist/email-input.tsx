
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
  noShadow?: boolean;
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({ email, setEmail, isLoading, disabled, inputRef, className, noShadow = false }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const isMobile = useIsMobile();
    const internalRef = useRef<HTMLInputElement>(null);

    // Validate email as user types
    useEffect(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValid(email.length > 0 && emailRegex.test(email));
    }, [email]);
    
    // Make sure we can capture clicks/taps on mobile
    useEffect(() => {
      // Add a small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        if (isMobile && internalRef.current) {
          // Enable direct focusing on the input element
          const inputElement = internalRef.current;
          inputElement.setAttribute("inputmode", "email");
          inputElement.setAttribute("autocorrect", "off");
          inputElement.setAttribute("spellcheck", "false");
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }, [isMobile]);

    return (
      <div className={cn(
        "relative transition-all duration-300", 
        isMobile ? "w-full" : noShadow ? "w-full" : "w-[380px]",
        isFocused && !noShadow && "scale-[1.02] transform",
        className
      )}>
        {/* Input field with mail icon */}
        <div className={cn(
          "absolute left-4 top-1/2 transform -translate-y-1/2 z-10",
          "text-transparent bg-clip-text",
          isFocused || isValid 
            ? "bg-gradient-to-r from-indigo-600 to-purple-600" 
            : "text-gray-400"
        )}>
          <Mail className="h-5 w-5" />
        </div>
        
        {/* Check mark for valid email */}
        {isValid && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 animate-fade-in z-10">
            <CheckCircle className="h-5 w-5" />
          </div>
        )}
        
        <Input 
          ref={(node) => {
            // Set both refs
            if (inputRef && node) inputRef.current = node;
            if (ref) {
              if (typeof ref === 'function') ref(node);
              else ref.current = node;
            }
            internalRef.current = node;
          }}
          type="email" 
          placeholder="Enter your email" 
          inputMode="email"
          autoComplete="email"
          className={cn(
            "transition-all duration-300",
            "focus-visible:outline-none",
            "focus:scale-100", // Prevent default scale to use our custom one
            noShadow && "focus:ring-0 focus:ring-offset-0 focus:border-0 rounded-l-xl rounded-r-none",
            !noShadow && "border",
            isMobile 
              ? [
                  "h-[50px]",
                  "bg-white", 
                  isFocused && !noShadow ? "border-indigo-400 ring-2 ring-indigo-200" : "border-gray-100",
                  "pl-12 pr-3 py-3",
                  "text-base",
                  "placeholder:text-gray-400", 
                  "rounded-xl",
                  !noShadow && "shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]"
                ] 
              : [
                  "h-[52px]",
                  "bg-white", 
                  !noShadow && "border-gray-200",
                  !noShadow && "focus:ring-2 focus:ring-primary/50 focus:border-transparent", 
                  "pl-12 pr-4 py-3", 
                  "text-base placeholder:text-gray-400", 
                  !noShadow && "rounded-xl",
                  !noShadow && isFocused ? "border-indigo-400 ring-2 ring-indigo-200 shadow-[0_0_10px_rgba(99,102,241,0.2)]" : "",
                  !noShadow && "shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]",
                  !noShadow && "hover:border-indigo-300 hover:shadow-[0_0_8px_rgba(99,102,241,0.15)]"
                ]
          )} 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onClick={(e) => {
            // Ensure focus is properly set on click/tap
            e.currentTarget.focus();
            setIsFocused(true);
            
            // For iOS, we need to force the keyboard to appear
            if (isMobile) {
              // This creates a temporary non-selectable range
              const input = e.currentTarget;
              input.selectionStart = input.selectionEnd = input.value.length;
              
              // Use this special workaround for iOS focus issues
              const event = new Event('focus', { bubbles: true });
              input.dispatchEvent(event);
            }
          }}
          // Add readOnly false to make sure keyboard shows on iOS
          readOnly={false}
          aria-label="Email address" 
          required 
          disabled={isLoading || disabled}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          enterKeyHint="go"
          // Add autocomplete settings that help iOS/Safari
          x-inputmode="email"
        />
      </div>
    );
  }
);

EmailInput.displayName = "EmailInput";
