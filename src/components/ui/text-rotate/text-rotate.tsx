
import React, { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TextRotateProps, TextRotateRef, WordObject } from "./types";
import { useTextRotation } from "./use-text-rotation";
import { processTextByType } from "./text-processing";
import { AnimatedWord } from "./animated-word";

const TextRotate = forwardRef<TextRotateRef, TextRotateProps>(
  (
    {
      texts,
      transition = { type: "spring", damping: 25, stiffness: 300 },
      initial = { y: "100%", opacity: 0 },
      animate = { y: 0, opacity: 1 },
      exit = { y: "-120%", opacity: 0 },
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
      next, 
      previous, 
      jumpTo, 
      reset 
    } = useTextRotation({
      texts,
      loop,
      auto,
      rotationInterval,
      onNext
    });

    // Process the current text based on split type
    const elements = useMemo(() => {
      const currentText = texts[currentTextIndex];
      return processTextByType(currentText, splitBy);
    }, [texts, currentTextIndex, splitBy]);

    // Expose all navigation functions via ref
    useImperativeHandle(ref, () => ({
      next,
      previous,
      jumpTo,
      reset,
    }), [next, previous, jumpTo, reset]);

    // Set up the rotation interval
    useEffect(() => {
      if (!auto) return;
      const intervalId = setInterval(next, rotationInterval);
      return () => clearInterval(intervalId);
    }, [next, rotationInterval, auto]);

    return (
      <motion.span
        className={cn("flex flex-wrap whitespace-pre-wrap", mainClassName)}
        {...props}
        layout
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
              splitBy === "lines" && "flex-col w-full"
            )}
            layout
            aria-hidden="true"
          >
            {(splitBy === "characters"
              ? (elements as WordObject[])
              : (elements as string[]).map((el, i) => ({
                  characters: [el],
                  needsSpace: i !== elements.length - 1,
                }))
            ).map((wordObj, wordIndex, array) => (
              <AnimatedWord
                key={wordIndex}
                wordObj={wordObj}
                wordIndex={wordIndex}
                wordArray={array}
                initial={initial}
                animate={animate}
                exit={exit}
                transition={transition}
                staggerFrom={staggerFrom}
                staggerDuration={staggerDuration}
                splitLevelClassName={splitLevelClassName}
                elementLevelClassName={elementLevelClassName}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.span>
    );
  }
);

TextRotate.displayName = "TextRotate";

export { TextRotate };
