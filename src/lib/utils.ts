/**
 * Core utility functions
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// CSS animation constants
export const pulseAnimation = "animate-pulse-subtle";

/**
 * Format price with currency symbol and proper decimal places
 */
export function formatPrice(
  price: number,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "BRL";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {}
) {
  const { currency = "USD", notation = "compact" } = options;
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Compare features for pricing plans
 */
export function compareFeatures(a: any, b: any) {
  return a;
}