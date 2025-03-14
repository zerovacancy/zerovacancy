
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
}

export function ButtonColorful({
    className,
    label = "Explore Components",
    ...props
}: ButtonColorfulProps) {
    return (
        <Button
            className={cn(
                "relative h-10 overflow-hidden rounded-lg",
                "bg-white text-zinc-800 border border-zinc-200/50",
                "transition-all duration-300",
                "hover:bg-white hover:border-purple-200 hover:translate-y-[-1px]",
                "group",
                className
            )}
            {...props}
        >
            {/* Gradient background effect */}
            <div
                className={cn(
                    "absolute inset-0",
                    "bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-violet-500/10",
                    "opacity-0 group-hover:opacity-100",
                    "transition-opacity duration-500"
                )}
            />

            {/* Content */}
            <div className="relative flex items-center justify-center gap-2">
                <span className="text-sm font-medium tracking-wide text-zinc-800">{label}</span>
                <ArrowUpRight 
                    className={cn(
                        "w-3.5 h-3.5 transition-transform duration-300 text-zinc-800",
                        "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    )} 
                />
            </div>
        </Button>
    );
}
