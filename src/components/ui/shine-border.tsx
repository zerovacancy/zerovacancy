
"use client"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

type TColorProp = string | string[]

interface ShineBorderProps {
  borderRadius?: number
  borderWidth?: number
  duration?: number
  color?: TColorProp
  className?: string
  children: React.ReactNode
}

/**
 * @name Shine Border
 * @description It is an animated background border effect component with easy to use and configurable props.
 * @param borderRadius defines the radius of the border.
 * @param borderWidth defines the width of the border.
 * @param duration defines the animation duration to be applied on the shining border
 * @param color a string or string array to define border color.
 * @param className defines the class name to be applied to the component
 * @param children contains react node elements.
 */
export function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  color = "#000000",
  className,
  children,
}: ShineBorderProps) {
  const isMobile = useIsMobile();
  
  // Optimize animation parameters for mobile
  const optimizedDuration = isMobile ? duration * 1.5 : duration;
  const optimizedBorderWidth = isMobile ? Math.max(0.5, borderWidth * 0.8) : borderWidth;
  const optimizedBorderRadius = isMobile ? Math.max(6, borderRadius * 0.9) : borderRadius;
  
  return (
    <div
      style={
        {
          "--border-radius": `${optimizedBorderRadius}px`,
        } as React.CSSProperties
      }
      className={cn(
        "min-h-[60px] w-fit min-w-[300px] place-items-center rounded-[--border-radius] p-0 bg-transparent",
        isMobile && "min-w-full",
        className,
      )}
    >
      <div
        style={
          {
            "--border-width": `${optimizedBorderWidth}px`,
            "--border-radius": `${optimizedBorderRadius}px`,
            "--duration": `${optimizedDuration}s`,
            "--mask-linear-gradient": `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
            "--background-radial-gradient": `radial-gradient(transparent,transparent, ${color instanceof Array ? color.join(",") : color},transparent,transparent)`,
          } as React.CSSProperties
        }
        className={`before:bg-shine-size before:absolute before:inset-0 before:aspect-square before:size-full before:rounded-[--border-radius] before:p-[--border-width] before:will-change-[background-position] before:content-[""] before:![-webkit-mask-composite:xor] before:![mask-composite:exclude] before:[background-image:--background-radial-gradient] before:[background-size:300%_300%] before:[mask:--mask-linear-gradient] motion-safe:before:animate-shine relative`}
      >
        {children}
      </div>
    </div>
  )
}
