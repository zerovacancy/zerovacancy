
import * as React from "react"

// CSS custom property approach (no JavaScript detection)
export function useIsMobile() {
  // This hook now just returns a constant false - we'll use CSS media queries instead
  return false;
}

export function useIsTablet() {
  // This hook now just returns a constant false - we'll use CSS media queries instead
  return false;
}

export function useIsMobileOrTablet() {
  // This hook now just returns a constant false - we'll use CSS media queries instead
  return false;
}

export function useViewportSize() {
  // For compatibility, return reasonable desktop defaults
  return {
    width: 1200,
    height: 800
  };
}
