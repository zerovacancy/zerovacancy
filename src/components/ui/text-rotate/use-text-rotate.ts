
import { useCallback, useEffect, useMemo, useState } from "react";
import { WordObject, UseTextRotateReturn } from "./types";
import { getStaggerDelay, splitIntoCharacters } from "./utils";

export function useTextRotate({
  texts = [],
  rotationInterval = 2000
}: {
  texts: string[];
  rotationInterval?: number;
}): UseTextRotateReturn {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [textsArray, setTextsArray] = useState<string[]>(texts);
  
  // Validate texts array
  const safeTexts = useMemo(() => {
    return Array.isArray(textsArray) && textsArray.length > 0 ? textsArray : [""];
  }, [textsArray]);

  // Memoize elements generation
  const elements = useMemo(() => {
    const currentText = safeTexts[currentTextIndex];
    if (!currentText) return [];
    
    const text = currentText.split(" ");
    return text.map((word, i) => ({
      characters: splitIntoCharacters(word),
      needsSpace: i !== text.length - 1,
    }));
  }, [safeTexts, currentTextIndex]);

  // Helper function to handle index changes and trigger callback
  const handleIndexChange = useCallback((newIndex: number) => {
    setCurrentTextIndex(newIndex);
  }, []);

  const next = useCallback(() => {
    const nextIndex = currentTextIndex === safeTexts.length - 1
      ? 0
      : currentTextIndex + 1;
    
    if (nextIndex !== currentTextIndex) {
      handleIndexChange(nextIndex);
    }
  }, [currentTextIndex, safeTexts.length, handleIndexChange]);

  const previous = useCallback(() => {
    const prevIndex = currentTextIndex === 0
      ? safeTexts.length - 1
      : currentTextIndex - 1;
    
    if (prevIndex !== currentTextIndex) {
      handleIndexChange(prevIndex);
    }
  }, [currentTextIndex, safeTexts.length, handleIndexChange]);

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

  // Auto-rotation effect
  useEffect(() => {
    const intervalId = setInterval(next, rotationInterval);
    return () => clearInterval(intervalId);
  }, [next, rotationInterval]);

  const calculateStaggerDelay = useCallback((wordIndex: number, charIndex: number, wordArray: WordObject[]) => {
    const previousCharsCount = wordArray
      .slice(0, wordIndex)
      .reduce((sum, word) => sum + word.characters.length, 0);
    
    const totalChars = wordArray.reduce(
      (sum, word) => sum + word.characters.length, 0
    );

    return getStaggerDelay(
      previousCharsCount + charIndex,
      totalChars,
      "first",
      0.05
    );
  }, []);

  const setTexts = useCallback((newTexts: string[]) => {
    setTextsArray(newTexts);
  }, []);

  return {
    currentTextIndex,
    elements,
    next,
    previous,
    jumpTo,
    reset,
    calculateStaggerDelay,
    active: currentTextIndex,
    setTexts
  };
}
