// Extend the global Window interface to include our custom properties
interface Window {
  celebrateSuccess?: (isMobile?: boolean) => void;
  
  // Web Vitals testing property
  __WEB_VITALS_TEST__?: boolean;
  
  // Google Analytics
  gtag?: (...args: any[]) => void;
}