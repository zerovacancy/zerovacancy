
/**
 * Function to split text into characters with support for unicode and emojis
 */
export const splitIntoCharacters = (text: string): string[] => {
  // Fallback for browsers that don't support Intl.Segmenter
  return Array.from(text);
};

/**
 * Function to split text into words or characters based on the splitBy parameter
 */
export const splitText = (text: string, splitBy: "words" | "characters" | "lines" | string = "characters"): string[] => {
  if (splitBy === "characters") {
    return splitIntoCharacters(text);
  } else if (splitBy === "words") {
    return text.split(/\s+/).filter(Boolean);
  } else if (splitBy === "lines") {
    return text.split(/\n/).filter(Boolean);
  } else {
    // Custom split pattern
    return text.split(splitBy).filter(Boolean);
  }
};

/**
 * Calculate stagger delay based on the stagger strategy
 */
export const getStaggerDelay = (
  index: number, 
  totalChars: number, 
  staggerFrom: "first" | "last" | "center" | number | "random",
  staggerDuration: number
): number => {
  if (staggerFrom === "first") return index * staggerDuration;
  if (staggerFrom === "last") return (totalChars - 1 - index) * staggerDuration;
  if (staggerFrom === "center") {
    const center = Math.floor(totalChars / 2);
    return Math.abs(center - index) * staggerDuration;
  }
  if (staggerFrom === "random") {
    const randomIndex = Math.floor(Math.random() * totalChars);
    return Math.abs(randomIndex - index) * staggerDuration;
  }
  return Math.abs((staggerFrom as number) - index) * staggerDuration;
};
