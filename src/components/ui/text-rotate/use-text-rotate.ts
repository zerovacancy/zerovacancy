
import { useCallback, useEffect, useMemo, useState } from "react";
import { WordObject } from "./types";
import { getStaggerDelay, splitIntoCharacters } from "./utils";

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
  
  // Validate texts array
  const safeTexts = useMemo(() => {
    return Array.isArray(texts) && texts.length > 0 ? texts : [""];
  }, [texts]);

  // Memoize elements generation
  const elements = useMemo(() => {
    const currentText = safeTexts[currentTextIndex];
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
  }, [safeTexts, currentTextIndex, splitBy]);

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
    
    // Check if we're potentially on a mobile device by window width
    const isMobileView = typeof window !== 'undefined' && window.innerWidth < 768;
    
    // Use a more efficient approach for mobile
    const intervalId = setTimeout(() => {
      // Use requestAnimationFrame for smoother animations, especially on mobile
      if (isMobileView) {
        requestAnimationFrame(() => {
          next();
        });
      } else {
        next();
      }
    }, rotationInterval);
    
    return () => clearTimeout(intervalId);
  }, [next, rotationInterval, auto]);

  const calculateStaggerDelay = useCallback((wordIndex: number, charIndex: number, wordArray: WordObject[]) => {
    // Skip stagger calculation if staggerDuration is 0
    if (staggerDuration === 0) return 0;
    
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
  }, [staggerFrom, staggerDuration]);

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
