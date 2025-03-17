
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

/**
 * Format URL for canonical links
 */
export function formatCanonicalURL(path: string): string {
  const baseURL = 'https://www.zerovacancy.ai';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseURL}${normalizedPath}`;
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
 * Calculate page scroll percentage
 * @returns number between 0-100 representing scroll percentage
 */
export function getScrollPercentage(): number {
  if (typeof window === 'undefined') return 0;
  
  const scrollTop = window.scrollY;
  const docHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  ) - window.innerHeight;
  
  return Math.min(Math.max((scrollTop / docHeight) * 100, 0), 100);
}

/**
 * Detect if device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Calculate user engagement score based on time spent and interactions
 * @param timeSpentMs Time spent on page in milliseconds
 * @param interactions Number of interactions (clicks, scrolls, etc.)
 * @returns number between 0-100 representing engagement score
 */
export function calculateEngagementScore(timeSpentMs: number, interactions: number): number {
  // Time factor: 30 seconds = ~50% score
  const timeFactor = Math.min(timeSpentMs / 60000, 1) * 50;
  
  // Interaction factor: 5 interactions = ~50% score
  const interactionFactor = Math.min(interactions / 5, 1) * 50;
  
  return Math.min(timeFactor + interactionFactor, 100);
}

/**
 * Compare features for pricing plans
 */
export function compareFeatures(a: any, b: any) {
  return a;
}
