
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTextRotate } from "./use-text-rotate";
import { TextRotateProps } from "./types";
import { splitText } from "./utils";

export const TextRotate: React.FC<TextRotateProps> = ({
  texts = [],
  elementLevelClassName = "",
  letterLevelClassName = "",
  splitLevelClassName = "",
  mainClassName = "",
  transition,
  rotationInterval = 3000,
  initial = { y: "100%", opacity: 0 },
  animate = { y: 0, opacity: 1 },
  exit = { y: "-100%", opacity: 0 },
  staggerChildren = 0.04,
  staggerDirection = 1,
  delayChildren = 0,
  staggerFrom = "first",
  staggerDuration = 0.05,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { active, setTexts } = useTextRotate({ texts, rotationInterval });
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [fallbackActive, setFallbackActive] = useState(0);

  // Fix for NaN animation value issues - ensure fixed initial/exit values
  const safeInitial = {
    ...initial,
    y: typeof initial.y === 'string' && initial.y.includes('NaN') ? '100%' : initial.y
  };
  
  const safeExit = {
    ...exit,
    y: typeof exit.y === 'string' && exit.y.includes('NaN') ? '-100%' : exit.y
  };

  useEffect(() => {
    setTexts(texts);
  }, [texts, setTexts]);

  // Measure container dimensions once text changes
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerWidth(width);
      setContainerHeight(height);
    }
  }, [active, texts]);

  // Fallback if active is outside array bounds
  useEffect(() => {
    if (active >= 0 && active < texts.length) {
      setFallbackActive(active);
    } else {
      // Safety fallback
      console.warn(`TextRotate: active index ${active} out of bounds [0-${texts.length-1}]`);
      setFallbackActive(0);
    }
  }, [active, texts]);

  // Use the safe active index
  const safeActive = fallbackActive;
  
  // Make sure we have valid text to display
  if (!texts.length) return null;
  if (safeActive >= texts.length) return null;

  const currentText = texts[safeActive];
  const splitTextArray = currentText ? splitText(currentText) : [];

  return (
    <div ref={containerRef} className={mainClassName} style={{ position: "relative", overflow: "hidden" }}>
      <AnimatePresence>
        <motion.div
          key={safeActive}
          className={splitLevelClassName}
          initial={safeInitial}
          animate={animate}
          exit={safeExit}
          transition={{
            ...transition,
            staggerChildren,
            staggerDirection,
            delayChildren,
          }}
          style={{ 
            position: "absolute", 
            left: "50%", 
            transform: "translateX(-50%)",
            width: "100%",
            display: "flex",
            justifyContent: "center"
          }}
        >
          {/* Use containerWidth to determine wrapping */}
          <div className={elementLevelClassName} style={{ width: "100%", textAlign: "center" }}>
            {currentText}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
