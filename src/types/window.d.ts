// Extend the global Window interface to include our custom properties
interface Window {
  // Environment variables for runtime access
  env?: {
    VITE_SUPABASE_URL?: string;
    VITE_SUPABASE_ANON_KEY?: string;
    [key: string]: string | undefined;
  };
  
  // Runtime environment variables (simpler approach)
  RUNTIME_ENV?: {
    VITE_SUPABASE_URL?: string;
    VITE_SUPABASE_ANON_KEY?: string;
    [key: string]: string | undefined;
  };

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