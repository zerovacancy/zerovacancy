import * as React from "react"

import { cn } from "@/lib/utils"

const VisuallyHidden = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "absolute h-px w-px p-0 overflow-hidden whitespace-nowrap border-0", 
        "clip-0 clip-path-inset-50%",
        className
      )}
      {...props}
    />
  )
}

export { VisuallyHidden }