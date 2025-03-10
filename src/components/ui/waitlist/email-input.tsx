
"use client";

import { useState, useRef, forwardRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckCircle, Mail } from "lucide-react";

interface EmailInputProps {
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({ email, setEmail, isLoading, inputRef }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isValid, setIsValid] = useState(false);

    // Validate email as user types
    useEffect(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValid(email.length > 0 && emailRegex.test(email));
    }, [email]);

    return (
      <div className={cn(
        "relative transition-all duration-300", 
        "w-full sm:w-[380px]",
        isFocused && "scale-[1.02] transform"
      )}>
        {/* Input field with mail icon */}
        <div className={cn(
          "absolute left-3 top-1/2 transform -translate-y-1/2",
          "text-transparent bg-clip-text",
          isFocused || isValid 
            ? "bg-gradient-to-r from-indigo-600 to-purple-600" 
            : "text-gray-400"
        )}
        aria-hidden="true">
          <Mail className="h-5 w-5" />
        </div>
        
        {/* Check mark for valid email */}
        {isValid && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 animate-fade-in" aria-hidden="true">
            <CheckCircle className="h-5 w-5" />
          </div>
        )}
        
        <Input 
          ref={inputRef} 
          type="email" 
          placeholder="Enter your email" 
          className={cn(
            "border transition-all duration-300",
            "focus:scale-100", // Prevent default scale to use our custom one
            "h-[50px] sm:h-[52px]",
            "bg-white", 
            isFocused ? "border-indigo-400 ring-2 ring-indigo-200" : "border-gray-100",
            "pl-10 pr-3 py-2 sm:pl-10 sm:pr-4 sm:py-2",
            "text-sm sm:text-base",
            "placeholder:text-gray-400", 
            "rounded-xl",
            "shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]",
            "sm:border-gray-200 sm:bg-white", 
            "sm:focus:ring-2 sm:focus:ring-primary/50 sm:focus:border-transparent", 
            "sm:rounded-xl",
            isFocused ? "sm:border-indigo-400 sm:ring-2 sm:ring-indigo-200 sm:shadow-[0_0_10px_rgba(99,102,241,0.2)]" : "",
            "sm:shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]",
            "sm:hover:border-indigo-300 sm:hover:shadow-[0_0_8px_rgba(99,102,241,0.15)]"
          )} 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label="Email address" 
          required 
          disabled={isLoading} 
        />
      </div>
    );
  }
);

EmailInput.displayName = "EmailInput";
