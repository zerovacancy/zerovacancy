
import { ReactNode } from "react";

export interface TextRotateProps {
  texts: string[];
  rotationInterval?: number;
  initial?: any;
  animate?: any;
  exit?: any;
  animatePresenceMode?: "sync" | "wait" | "popLayout";
  animatePresenceInitial?: boolean;
  staggerChildren?: number;
  staggerDirection?: number;
  delayChildren?: number;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | number | "random";
  transition?: any;
  loop?: boolean;
  auto?: boolean;
  splitBy?: "words" | "characters" | "lines" | string;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
  letterLevelClassName?: string;
}

export interface TextRotateRef {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
}

export interface WordObject {
  characters: string[];
  needsSpace: boolean;
}

// Interface for the useTextRotate hook return value
export interface UseTextRotateReturn {
  currentTextIndex: number;
  elements: string[] | WordObject[];
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
  calculateStaggerDelay: (wordIndex: number, charIndex: number, wordArray: WordObject[]) => number;
  active: number;
  setTexts: (texts: string[]) => void;
}
