// Extend the global Window interface to include our custom properties
interface Window {
  celebrateSuccess?: (isMobile?: boolean) => void;
}