import { useState, useEffect, useRef, useCallback } from 'react';
import { BlogService } from '@/services/BlogService';

interface AutosaveOptions {
  id?: string;
  title?: string;
  content?: string;
  excerpt?: string;
  isPublished?: boolean;
  onSaved?: (timestamp: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for handling blog post saves
 * Only performs autosave when browser tab closes or navigates away
 */
export function useBlogAutosave({
  id,
  title,
  content,
  excerpt,
  isPublished = false,
  onSaved,
  onError
}: AutosaveOptions) {
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [lastAutosaved, setLastAutosaved] = useState<string | null>(null);
  const [lastLocalBackup, setLastLocalBackup] = useState<string | null>(null);
  const [hasLocalBackup, setHasLocalBackup] = useState(false);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [recoveryData, setRecoveryData] = useState<any>(null);
  
  // Refs to store data
  const currentDataRef = useRef({ id, title, content, excerpt, isPublished });
  const hasShownRecoveryDialogRef = useRef(false);
  
  // Update the refs whenever the content changes
  useEffect(() => {
    currentDataRef.current = { id, title, content, excerpt, isPublished };
  }, [id, title, content, excerpt, isPublished]);

  // Function to save to localStorage with improved error handling
  const saveToLocalStorage = useCallback(() => {
    if (!title && !content && !excerpt) return;
    
    try {
      const now = new Date().toISOString();
      const draftKey = `blog_draft_${id || 'new'}`;
      
      const draftData = {
        title,
        content,
        excerpt,
        lastSaved: now
      };
      
      localStorage.setItem(draftKey, JSON.stringify(draftData));
      setLastLocalBackup(now);
      setHasLocalBackup(true);
    } catch (error) {
      console.error('Error saving local backup:', error);
      // Don't surface this error to the user as it's just the local backup
    }
  }, [id, title, content, excerpt]);

  // Server save function with better error handling
  const handleSave = useCallback(async () => {
    // Don't save published posts or when there's no ID
    if (isPublished || !id) return false;
    
    // Don't save if there's no content
    if (!title && !content && !excerpt) return false;
    
    // Use a ref to track saving state to avoid dependency on isAutosaving state
    const isSavingRef = useRef(false);
    
    // Skip if already saving
    if (isSavingRef.current || isAutosaving) return false;
    
    // Set our refs and state
    isSavingRef.current = true;
    setIsAutosaving(true);
    
    try {
      // Create minimal data for save
      const saveData = {
        title,
        content,
        excerpt
      };
      
      // Save the post with retry logic
      let retries = 2;
      let success = false;
      let lastError;
      
      while (retries >= 0 && !success) {
        try {
          success = await BlogService.autosaveDraft(id, saveData);
          if (success) break;
        } catch (error) {
          lastError = error;
          retries--;
          // Wait a bit before retrying
          if (retries >= 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      if (success) {
        // Update last saved time
        const now = new Date().toISOString();
        setLastAutosaved(now);
        
        if (onSaved) {
          onSaved(now);
        }
        
        return true;
      }
      
      // If we got here, all retries failed
      if (lastError && onError) {
        onError(lastError instanceof Error ? lastError : new Error('Save failed after retries'));
      }
      
      return false;
    } catch (error) {
      console.error('Save failed with unexpected error:', error);
      
      if (onError) {
        onError(error instanceof Error ? error : new Error('Unexpected error during save'));
      }
      
      return false;
    } finally {
      isSavingRef.current = false;
      setIsAutosaving(false);
    }
  }, [id, title, content, excerpt, isPublished, onSaved, onError]);

  // Manual trigger for save
  const triggerSave = useCallback(async (force = false) => {
    // Save to localStorage first
    saveToLocalStorage();
    
    // Then save to server
    return await handleSave();
  }, [handleSave, saveToLocalStorage]);

  // Clear local backup
  const clearLocalBackup = useCallback(() => {
    const draftKey = `blog_draft_${id || 'new'}`;
    localStorage.removeItem(draftKey);
    setHasLocalBackup(false);
    setShowRecoveryDialog(false);
    setRecoveryData(null);
    // Reset our reference
    hasShownRecoveryDialogRef.current = false;
  }, [id]);

  // Setup effect - check for local backups on load
  useEffect(() => {
    // Skip the effect if it's a new post being created (no ID)
    if (!id) {
      return;
    }
    
    // Only check for local backups if we haven't already shown the dialog
    if (hasShownRecoveryDialogRef.current || showRecoveryDialog) {
      return;
    }
    
    // Initial setup - check for local backups
    const draftKey = `blog_draft_${id}`;
    try {
      const localDraft = localStorage.getItem(draftKey);
      
      if (localDraft) {
        const draftData = JSON.parse(localDraft);
        const draftDate = new Date(draftData.lastSaved);
        const lastSavedDate = lastAutosaved ? new Date(lastAutosaved) : null;
        
        // We only need to set hasLocalBackup once
        if (!hasLocalBackup) {
          setHasLocalBackup(true);
        }
        
        // If local draft is newer than server version by at least 30 seconds
        // and has content, offer recovery
        const timeDifference = lastSavedDate ? 
          draftDate.getTime() - lastSavedDate.getTime() : 
          Number.MAX_SAFE_INTEGER;
          
        const hasContent = draftData.title || draftData.content || draftData.excerpt;
        const isNewer = timeDifference > 30000;
        
        if (isNewer && hasContent && !hasShownRecoveryDialogRef.current) {
          // Mark that we've shown the dialog to prevent infinite loops
          hasShownRecoveryDialogRef.current = true;
          
          // Update state in a single render cycle if possible
          setRecoveryData(draftData);
          setShowRecoveryDialog(true);
        }
      }
    } catch (e) {
      console.error('Error checking local backup:', e);
    }
  }, [id, lastAutosaved]);

  // Set up beforeunload event handler to save when navigating away
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      const { id, title, content, excerpt, isPublished } = currentDataRef.current;
      
      // Only try to save if we have content and an ID
      if (id && (title || content || excerpt) && !isPublished) {
        // First save to localStorage (this is synchronous and will work)
        try {
          const now = new Date().toISOString();
          const draftKey = `blog_draft_${id}`;
          
          const draftData = {
            title,
            content,
            excerpt,
            lastSaved: now
          };
          
          localStorage.setItem(draftKey, JSON.stringify(draftData));
        } catch (error) {
          console.error('Error saving local backup before unload:', error);
        }
        
        // For the server save, we need to show the confirmation dialog
        // to give time for the async save to complete
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        
        // Try to save to server - this might not complete if user decides to leave
        try {
          const saveData = { title, content, excerpt };
          await BlogService.autosaveDraft(id, saveData);
        } catch (error) {
          console.error('Error saving to server before unload:', error);
        }
        
        return e.returnValue;
      }
    };
    
    // Add the beforeunload event listener
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []); // Empty dependency array means this only runs on mount/unmount

  return {
    isAutosaving,
    lastAutosaved,
    lastLocalBackup,
    hasLocalBackup,
    showRecoveryDialog,
    recoveryData,
    triggerSave,
    clearLocalBackup,
    setShowRecoveryDialog,
    handleContentChange: () => {} // Stub function to maintain API compatibility
  };
}
