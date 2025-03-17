import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { WordObject } from "./types";
import { getStaggerDelay, splitIntoCharacters } from "./utils";
import { useIsMobile } from "@/hooks/use-mobile";

export function useTextRotate(
  texts: string[],
  splitBy: "words" | "characters" | "lines" | string = "characters",
  loop: boolean = true,
  auto: boolean = true,
  rotationInterval: number = 2000,
  staggerFrom: "first" | "last" | "center" | number | "random" = "first",
  staggerDuration: number = 0,
  onNext?: (index: number) => void
) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobile = useIsMobile();
  
  // Validate texts array
  const safeTexts = useMemo(() => {
    return Array.isArray(texts) && texts.length > 0 ? texts : [""];
  }, [texts]);

  // Memoize elements generation with optimizations for mobile
  const elements = useMemo(() => {
    const currentText = safeTexts[currentTextIndex];
    
    // For mobile, use a simpler splitting strategy to reduce animation complexity
    if (isMobile) {
      // Just return the whole word as a single element for mobile to reduce animation load
      return splitBy === "characters" ? 
        [{ characters: [currentText], needsSpace: false }] : 
        [currentText];
    }
    
    // Desktop behavior remains the same with more complex animations
    if (splitBy === "characters") {
      const text = currentText.split(" ");
      return text.map((word, i) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== text.length - 1,
      }));
    }
    return splitBy === "words"
      ? currentText.split(" ")
      : splitBy === "lines"
        ? currentText.split("\n")
        : currentText.split(splitBy);
  }, [safeTexts, currentTextIndex, splitBy, isMobile]);

  // Helper function to handle index changes and trigger callback
  const handleIndexChange = useCallback((newIndex: number) => {
    setCurrentTextIndex(newIndex);
    onNext?.(newIndex);
  }, [onNext]);

  const next = useCallback(() => {
    const nextIndex = currentTextIndex === safeTexts.length - 1
      ? (loop ? 0 : currentTextIndex)
      : currentTextIndex + 1;
    
    if (nextIndex !== currentTextIndex) {
      handleIndexChange(nextIndex);
    }
  }, [currentTextIndex, safeTexts.length, loop, handleIndexChange]);

  const previous = useCallback(() => {
    const prevIndex = currentTextIndex === 0
      ? (loop ? safeTexts.length - 1 : currentTextIndex)
      : currentTextIndex - 1;
    
    if (prevIndex !== currentTextIndex) {
      handleIndexChange(prevIndex);
    }
  }, [currentTextIndex, safeTexts.length, loop, handleIndexChange]);

  const jumpTo = useCallback((index: number) => {
    const validIndex = Math.max(0, Math.min(index, safeTexts.length - 1));
    if (validIndex !== currentTextIndex) {
      handleIndexChange(validIndex);
    }
  }, [safeTexts.length, currentTextIndex, handleIndexChange]);

  const reset = useCallback(() => {
    if (currentTextIndex !== 0) {
      handleIndexChange(0);
    }
  }, [currentTextIndex, handleIndexChange]);

  // Auto-rotation effect with optimized debouncing for mobile
  useEffect(() => {
    if (!auto) return;
    
    // Clear any existing timers and animation frames
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    
    // Use a longer delay for mobile for better performance and readability
    const delay = isMobile ? rotationInterval + 800 : rotationInterval;
    
    // Use a simple timeout for consistent timing
    timeoutRef.current = setTimeout(() => {
      // For mobile, avoid RAF to reduce potential jank
      if (isMobile) {
        next();
      } else {
        // On desktop, use double RAF for smooth vsync alignment
        animationFrameRef.current = requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            next();
          });
        });
      }
    }, delay);
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [next, rotationInterval, auto, isMobile]);

  const calculateStaggerDelay = useCallback((wordIndex: number, charIndex: number, wordArray: WordObject[]) => {
    // Skip stagger calculation for mobile completely
    if (isMobile || staggerDuration === 0) return 0;
    
    const previousCharsCount = wordArray
      .slice(0, wordIndex)
      .reduce((sum, word) => sum + word.characters.length, 0);
    
    const totalChars = wordArray.reduce(
      (sum, word) => sum + word.characters.length, 0
    );

    return getStaggerDelay(
      previousCharsCount + charIndex,
      totalChars,
      staggerFrom,
      staggerDuration
    );
  }, [staggerFrom, staggerDuration, isMobile]);

  return {
    currentTextIndex,
    elements,
    next,
    previous,
    jumpTo,
    reset,
    calculateStaggerDelay
  };
}
