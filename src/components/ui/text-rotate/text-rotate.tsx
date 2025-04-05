
import React, { forwardRef, useImperativeHandle } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TextRotateProps, TextRotateRef, WordObject } from "./types";
import { useTextRotate } from "./use-text-rotate";
import { useIsMobile } from "@/hooks/use-mobile";

const TextRotate = forwardRef<TextRotateRef, TextRotateProps>(
  (
    {
      texts,
      transition = { type: "spring", damping: 25, stiffness: 300 },
      initial = { y: "100%", opacity: 0 },
      animate = { y: 0, opacity: 1 },
      exit = { y: "-100%", opacity: 0 },
      animatePresenceMode = "wait",
      animatePresenceInitial = false,
      rotationInterval = 2000,
      staggerDuration = 0,
      staggerFrom = "first",
      loop = true,
      auto = true,
      splitBy = "characters",
      onNext,
      mainClassName,
      splitLevelClassName,
      elementLevelClassName,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    
    // Simplified mobile transitions to prevent animation bugs
    const adaptedTransition = isMobile ? 
      { 
        type: "tween", 
        duration: 0.35, // Shorter duration
        ease: "easeInOut" // Smoother easing
      } : transition;
    
    // Simpler but still visible transitions for mobile
    const adaptedInitial = isMobile ? { opacity: 0, y: 10 } : initial;
    const adaptedAnimate = isMobile ? { opacity: 1, y: 0 } : animate;
    const adaptedExit = isMobile ? { opacity: 0, y: -10 } : exit;

    const {
      currentTextIndex,
      elements,
      next,
      previous,
      jumpTo,
      reset,
      calculateStaggerDelay
    } = useTextRotate(
      texts || [""], // Provide default empty array to prevent undefined
      isMobile ? "words" : splitBy, // Use word-level animation on mobile
      loop,
      auto,
      rotationInterval,
      staggerFrom,
      isMobile ? 0 : staggerDuration, // No stagger on mobile
      onNext
    );

    // Always create the ref functions
    useImperativeHandle(ref, () => ({
      next,
      previous,
      jumpTo,
      reset,
    }), [next, previous, jumpTo, reset]);

    // Early return if no texts provided
    if (!texts?.length) {
      return null;
    }

    return (
      <motion.span
        className={cn(
          "flex flex-wrap whitespace-pre-wrap", 
          "transform-gpu will-change-transform", // Enhanced GPU acceleration
          "translate-z-0 backface-visibility-hidden", // Force GPU rendering
          mainClassName
        )}
        {...props}
        layout={isMobile ? false : "position"} // Disable layout animations on mobile
        transition={adaptedTransition}
      >
        <span className="sr-only">{texts[currentTextIndex]}</span>

        <AnimatePresence
          mode={animatePresenceMode}
          initial={animatePresenceInitial}
        >
          <motion.div
            key={currentTextIndex}
            className={cn(
              "flex flex-wrap",
              "transform-gpu will-change-transform", // Enhanced GPU acceleration
              "translate-z-0 backface-visibility-hidden", // Force GPU rendering 
              splitBy === "lines" && "flex-col w-full"
            )}
            layout={isMobile ? false : "position"} // Disable layout animations on mobile
            aria-hidden="true"
          >
            {/* Simplified mobile rendering for stability */}
            {isMobile ? (
              <motion.span
                initial={adaptedInitial}
                animate={adaptedAnimate}
                exit={adaptedExit}
                transition={adaptedTransition}
                className={cn(
                  "inline-block",
                  "transform-gpu will-change-transform", 
                  "translate-z-0 backface-visibility-hidden",
                  elementLevelClassName
                )}
                style={{ 
                  display: 'block',
                  position: 'relative'
                }}
              >
                {texts[currentTextIndex]}
              </motion.span>
            ) : (
              // Desktop animation with character-by-character staggering
              (splitBy === "characters"
                ? (elements as WordObject[])
                : (elements as string[]).map((el, i) => ({
                    characters: [el],
                    needsSpace: i !== elements.length - 1,
                  }))
              ).map((wordObj, wordIndex, array) => (
                <span
                  key={wordIndex}
                  className={cn("inline-flex overflow-visible", splitLevelClassName)}
                >
                  {wordObj.characters.map((char, charIndex) => (
                    <motion.span
                      initial={initial}
                      animate={animate}
                      exit={exit}
                      key={charIndex}
                      transition={{
                        ...transition,
                        delay: calculateStaggerDelay(wordIndex, charIndex, array),
                      }}
                      className={cn(
                        "inline-block overflow-visible", 
                        "gpu-accelerated will-change-transform", 
                        "translate-z-0 backface-visibility-hidden",
                        elementLevelClassName
                      )}
                    >
                      {char}
                    </motion.span>
                  ))}
                  {wordObj.needsSpace && (
                    <span className="whitespace-pre"> </span>
                  )}
                </span>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </motion.span>
    );
  }
);

TextRotate.displayName = "TextRotate";

export { TextRotate };
