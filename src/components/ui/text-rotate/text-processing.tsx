
// Helper function to split text into characters with support for unicode and emojis
export const splitIntoCharacters = (text: string): string[] => {
  // Fallback for browsers that don't support Intl.Segmenter
  return Array.from(text);
};

export const processTextByType = (
  text: string, 
  splitBy: "words" | "characters" | "lines" | string
): string[] | { characters: string[], needsSpace: boolean }[] => {
  if (splitBy === "characters") {
    const words = text.split(" ");
    return words.map((word, i) => ({
      characters: splitIntoCharacters(word),
      needsSpace: i !== words.length - 1,
    }));
  }
  
  return splitBy === "words"
    ? text.split(" ")
    : splitBy === "lines"
      ? text.split("\n")
      : text.split(splitBy);
};

// Calculate stagger delay based on different strategies
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

export const calculateStaggerDelay = (
  wordIndex: number, 
  charIndex: number, 
  wordArray: { characters: string[], needsSpace: boolean }[],
  staggerFrom: "first" | "last" | "center" | number | "random",
  staggerDuration: number
) => {
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
};
