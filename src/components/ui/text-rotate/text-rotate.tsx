
import React, { forwardRef, useImperativeHandle } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TextRotateProps, TextRotateRef, WordObject } from "./types";
import { useTextRotate } from "./use-text-rotate";

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
      splitBy,
      loop,
      auto,
      rotationInterval,
      staggerFrom,
      staggerDuration,
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
        transition={transition}
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
            {(splitBy === "characters"
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
                      "gpu-accelerated will-change-transform", // Enhanced GPU acceleration
                      "translate-z-0 backface-visibility-hidden", // Force GPU rendering with additional optimizations
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
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.span>
    );
  }
);

TextRotate.displayName = "TextRotate";

export { TextRotate };
