import React, { forwardRef, useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { TextRotateProps, TextRotateRef } from "./types";

/**
 * CSS-only implementation of TextRotate component
 * Provides the same functionality without Framer Motion dependency
 */
const TextRotateCss = forwardRef<TextRotateRef, TextRotateProps>(
  (
    {
      texts = [],
      rotationInterval = 3500,
      auto = true,
      loop = true,
      onNext,
      mainClassName,
      elementLevelClassName,
      ...props
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isChanging, setIsChanging] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    
    // Memoized functions with useCallback to prevent recreating on each render
    const next = useCallback(() => {
      if (!texts || texts.length <= 1) return;
      
      setIsChanging(true);
      
      // Small delay to allow exit animation to complete
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const nextIndex = prev + 1 >= texts.length ? 0 : prev + 1;
          if (onNext) onNext(nextIndex);
          return nextIndex;
        });
        
        // Reset the changing state after animation completes
        setTimeout(() => {
          setIsChanging(false);
        }, 300);
      }, 300);
    }, [texts, onNext]);

    const previous = useCallback(() => {
      if (!texts || texts.length <= 1) return;
      
      setIsChanging(true);
      
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const nextIndex = prev - 1 < 0 ? texts.length - 1 : prev - 1;
          if (onNext) onNext(nextIndex);
          return nextIndex;
        });
        
        setTimeout(() => {
          setIsChanging(false);
        }, 300);
      }, 300);
    }, [texts, onNext]);

    const jumpTo = useCallback((index: number) => {
      if (!texts || index < 0 || index >= texts.length) return;
      
      setIsChanging(true);
      
      setTimeout(() => {
        setCurrentIndex(index);
        if (onNext) onNext(index);
        
        setTimeout(() => {
          setIsChanging(false);
        }, 300);
      }, 300);
    }, [texts, onNext]);

    const reset = useCallback(() => {
      setIsChanging(true);
      
      setTimeout(() => {
        setCurrentIndex(0);
        if (onNext) onNext(0);
        
        setTimeout(() => {
          setIsChanging(false);
        }, 300);
      }, 300);
    }, [onNext]);

    // Expose methods via ref
    React.useImperativeHandle(ref, () => ({
      next,
      previous,
      jumpTo,
      reset,
    }), [next, previous, jumpTo, reset]);

    // Auto-rotation effect with memoized functions
    useEffect(() => {
      if (!auto || !texts || texts.length <= 1) return;
      
      intervalRef.current = setInterval(next, rotationInterval);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }, [auto, texts, rotationInterval, next]);

    // For safety and simplicity on mobile, provide a fallback
    const textsArray = texts || [];
    
    // Guard against invalid arrays or empty texts
    if (!textsArray.length) {
      return <div className={mainClassName} {...props}>No content</div>;
    }
    
    // Make sure currentIndex is valid
    const safeIndex = Math.min(Math.max(0, currentIndex), textsArray.length - 1);
    const currentText = textsArray[safeIndex];

    return (
      <div className={cn("relative w-full h-full flex items-center justify-center", mainClassName)} {...props}>
        {/* Screen reader text */}
        <span className="sr-only">{currentText}</span>
        
        {/* Visible animated text with improved transition */}
        <div 
          className={cn(
            "relative w-full h-full overflow-hidden flex items-center justify-center",
            "transition-all duration-300 ease-in-out",
            isChanging ? "opacity-0" : "opacity-100"
          )}
          aria-hidden="true"
        >
          <div 
            className={cn(
              "transition-transform duration-300 ease-in-out",
              isChanging ? "translate-y-[-20px]" : "translate-y-0",
              elementLevelClassName
            )}
          >
            {currentText}
          </div>
        </div>
      </div>
    );
  }
);

TextRotateCss.displayName = "TextRotateCss";

export { TextRotateCss };