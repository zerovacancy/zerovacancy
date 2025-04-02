import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Hook to prevent navigation when there are unsaved changes
 * @param hasUnsavedChanges Whether there are unsaved changes
 * @param warningMessage Message to show in the confirmation dialog
 */
export function usePreventNavigation(
  hasUnsavedChanges: boolean, 
  warningMessage: string = 'You have unsaved changes. Are you sure you want to leave?'
) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Handle browser back/forward/refresh/close events
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        // Standard way to show a confirmation dialog
        e.preventDefault();
        e.returnValue = warningMessage;
        return warningMessage;
      }
    };
    
    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, warningMessage]);
  
  // Custom navigation handler that checks for unsaved changes
  const navigateSafely = useCallback(
    (to: string) => {
      if (hasUnsavedChanges && !window.confirm(warningMessage)) {
        return false;
      }
      navigate(to);
      return true;
    },
    [navigate, hasUnsavedChanges, warningMessage]
  );
  
  return { navigateSafely };
}
