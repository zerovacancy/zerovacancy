
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add animation utilities
export const pulseAnimation = "animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]";

// Add price formatting utility
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Add feature comparison helpers
export function compareFeatures(
  featureKey: string, 
  planLevels: { [key: string]: boolean | string | number }
): { [key: string]: boolean | string | number } {
  return planLevels;
}
