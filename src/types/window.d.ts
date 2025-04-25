// Extend the global Window interface to include our custom properties
interface Window {
  celebrateSuccess?: (isMobile?: boolean) => void;
  
  // Web Vitals testing property
  __WEB_VITALS_TEST__?: boolean;
  
  // CSS Containment
  __containmentObserver?: MutationObserver;
  containmentUpdateTimer?: number;
  
  // RequestIdleCallback API
  requestIdleCallback(callback: () => void, options?: { timeout: number }): number;
  cancelIdleCallback(handle: number): void;
  
  // Google Analytics
  gtag?: (...args: unknown[]) => void;
}