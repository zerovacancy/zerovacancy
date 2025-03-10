
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative group overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500/30",
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "before:absolute before:inset-0 before:z-0 before:h-[100%] before:w-[20%]",
          "before:animate-shimmer-slide before:bg-gradient-to-r",
          "before:from-transparent before:via-white/10 before:to-transparent",
        ],
        primary: [
          "bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white",
          "hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700",
          "shadow-[0_4px_12px_rgba(79,70,229,0.2)]",
          "hover:shadow-[0_6px_20px_rgba(79,70,229,0.3)]",
          "before:absolute before:inset-0 before:z-0 before:h-[100%] before:w-[20%]",
          "before:animate-shimmer-slide before:bg-gradient-to-r",
          "before:from-transparent before:via-white/20 before:to-transparent",
        ],
        secondary: [
          "bg-white text-gray-900 border-2 border-gray-200",
          "hover:bg-gray-50 hover:border-gray-300",
          "shadow-sm hover:shadow",
          "before:absolute before:inset-0 before:z-0 before:h-[100%] before:w-[20%]",
          "before:animate-shimmer-slide before:bg-gradient-to-r",
          "before:from-transparent before:via-gray-100 before:to-transparent",
        ],
        tertiary: [
          "bg-gray-50/50 text-gray-700 border border-gray-200",
          "hover:bg-gray-100/70 hover:text-gray-900",
          "before:absolute before:inset-0 before:z-0 before:h-[100%] before:w-[20%]",
          "before:animate-shimmer-slide before:bg-gradient-to-r",
          "before:from-transparent before:via-gray-200/30 before:to-transparent",
        ],
        destructive: [
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          "before:absolute before:inset-0 before:z-0 before:h-[100%] before:w-[20%]",
          "before:animate-shimmer-slide before:bg-gradient-to-r",
          "before:from-transparent before:via-white/10 before:to-transparent",
        ],
        outline: [
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          "before:absolute before:inset-0 before:z-0 before:h-[100%] before:w-[20%]",
          "before:animate-shimmer-slide before:bg-gradient-to-r",
          "before:from-transparent before:via-black/5 before:to-transparent",
        ],
        ghost: [
          "hover:bg-accent hover:text-accent-foreground",
          "before:absolute before:inset-0 before:z-0 before:h-[100%] before:w-[20%]",
          "before:animate-shimmer-slide before:bg-gradient-to-r",
          "before:from-transparent before:via-black/5 before:to-transparent",
        ],
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={{ '--speed': '1.5s', ...style } as React.CSSProperties}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
