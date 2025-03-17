
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
    
    // Adapt transitions for mobile
    const adaptedTransition = isMobile ? 
      { 
        type: "tween", 
        duration: 0.4,
        ease: "easeOut" 
      } : transition;
    
    // Simplify initial/animate/exit for mobile
    const adaptedInitial = isMobile ? { y: 30, opacity: 0 } : initial;
    const adaptedAnimate = isMobile ? { y: 0, opacity: 1 } : animate;
    const adaptedExit = isMobile ? { y: -30, opacity: 0 } : exit;

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
          "gpu-accelerated will-change-transform", // Enhanced GPU acceleration
          "translate-z-0", // Force GPU rendering
          mainClassName
        )}
        {...props}
        layout="position"
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
              "gpu-accelerated will-change-transform", // Enhanced GPU acceleration
              "translate-z-0", // Force GPU rendering 
              splitBy === "lines" && "flex-col w-full"
            )}
            layout="position"
            aria-hidden="true"
          >
            {/* Handle mobile differently - render as a single animated unit */}
            {isMobile ? (
              <motion.span
                initial={adaptedInitial}
                animate={adaptedAnimate}
                exit={adaptedExit}
                transition={adaptedTransition}
                className={cn(
                  "inline-block overflow-visible",
                  "gpu-accelerated will-change-transform", 
                  "translate-z-0 backface-visibility-hidden",
                  elementLevelClassName
                )}
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
