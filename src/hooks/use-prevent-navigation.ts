import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Hook to prevent navigation when there are unsaved changes
 * @param hasUnsavedChanges Whether there are unsaved changes
 * @param warningMessage Message to show in the confirmation dialog
 * @param onBeforeNavigate Optional callback to run before navigation (can be used to save)
 */
export function usePreventNavigation(
  hasUnsavedChanges: boolean, 
  warningMessage: string = 'You have unsaved changes. Are you sure you want to leave?',
  onBeforeNavigate?: () => Promise<boolean> | boolean
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
        
        // Note: We can't await an async function in beforeunload
        // The beforeunload event in the useBlogAutosave hook handles saving
        
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
  
  // Custom navigation handler that checks for unsaved changes and runs onBeforeNavigate if provided
  const navigateSafely = useCallback(
    async (to: string) => {
      if (hasUnsavedChanges) {
        const shouldSave = window.confirm('You have unsaved changes. Would you like to save before leaving?');
        
        if (shouldSave && onBeforeNavigate) {
          // Run the save function
          try {
            const saveResult = await onBeforeNavigate();
            if (!saveResult) {
              // Save failed, ask if they want to continue anyway
              if (!window.confirm('Failed to save changes. Continue without saving?')) {
                return false;
              }
            }
          } catch (error) {
            console.error('Error during save:', error);
            // Save threw an error, ask if they want to continue anyway
            if (!window.confirm('Error saving changes. Continue without saving?')) {
              return false;
            }
          }
        } else if (!shouldSave) {
          // They chose not to save, confirm they want to leave
          if (!window.confirm('Continue without saving?')) {
            return false;
          }
        }
      }
      
      navigate(to);
      return true;
    },
    [navigate, hasUnsavedChanges, warningMessage, onBeforeNavigate]
  );
  
  return { navigateSafely };
}
