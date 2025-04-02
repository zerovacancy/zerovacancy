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
 * Hook for automatic saving of blog posts with local backup
 * Enhanced with change detection and better error handling
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
  
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const localBackupTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Server autosave interval - 20 seconds (reduced from 30 seconds)
  const autoSaveInterval = 20 * 1000;
  
  // Local backup interval - 10 seconds (reduced from 15 seconds)
  const localBackupInterval = 10 * 1000;
  
  // Debounce time for content-triggered saves - 3 seconds
  const contentSaveDebounceTime = 3 * 1000;
  
  // Track content changes
  const contentChangeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [contentChanged, setContentChanged] = useState(false);

  // Function to save to localStorage with improved error handling
  const saveToLocalStorage = useCallback(() => {
    if (!title && !content && !excerpt) return;
    
    try {
      const now = new Date().toISOString();
      const draftKey = `blog_draft_${id || 'new'}`;
      
      // Check for existing data to compare
      const existingDataStr = localStorage.getItem(draftKey);
      let hasSignificantChanges = true;
      
      if (existingDataStr) {
        try {
          const existingData = JSON.parse(existingDataStr);
          
          // Only consider it a significant change if content length differs by more than 10 chars
          // or if title/excerpt have changed
          const contentDiff = !existingData.content || !content || 
            Math.abs(existingData.content.length - content.length) > 10;
          const titleChanged = existingData.title !== title;
          const excerptChanged = existingData.excerpt !== excerpt;
          
          hasSignificantChanges = contentDiff || titleChanged || excerptChanged;
        } catch (e) {
          // If we can't parse existing data, assume changes are significant
          console.warn('Could not parse existing draft data, assuming changes are significant');
        }
      }
      
      // Only update localStorage if there are significant changes
      if (hasSignificantChanges) {
        const draftData = {
          title,
          content,
          excerpt,
          lastSaved: now
        };
        
        localStorage.setItem(draftKey, JSON.stringify(draftData));
        setLastLocalBackup(now);
        setHasLocalBackup(true);
      }
    } catch (error) {
      console.error('Error saving local backup:', error);
      // Don't surface this error to the user as it's just the local backup
    }
  }, [id, title, content, excerpt]);

  // Enhanced server autosave function with better error handling
  const handleAutosave = useCallback(async () => {
    // Don't autosave published posts or when there's no ID
    if (isPublished || !id) return false;
    
    // Don't autosave if there's no content
    if (!title && !content && !excerpt) return false;
    
    // Skip if already autosaving
    if (isAutosaving) return false;
    
    setIsAutosaving(true);
    
    try {
      // Reset content changed flag first to avoid race conditions
      setContentChanged(false);
      
      // Create minimal data for autosave
      const autosaveData = {
        title,
        content,
        excerpt
      };
      
      // Autosave the post with retry logic
      let retries = 2;
      let success = false;
      let lastError;
      
      while (retries >= 0 && !success) {
        try {
          success = await BlogService.autosaveDraft(id, autosaveData);
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
        // Update last autosaved time
        const now = new Date().toISOString();
        setLastAutosaved(now);
        
        if (onSaved) {
          onSaved(now);
        }
        
        return true;
      }
      
      // If we got here, all retries failed
      if (lastError && onError) {
        onError(lastError instanceof Error ? lastError : new Error('Autosave failed after retries'));
      }
      
      return false;
    } catch (error) {
      console.error('Autosave failed with unexpected error:', error);
      
      if (onError) {
        onError(error instanceof Error ? error : new Error('Unexpected error during autosave'));
      }
      
      return false;
    } finally {
      setIsAutosaving(false);
    }
  }, [id, title, content, excerpt, isPublished, isAutosaving, onSaved, onError]);

  // Function to handle content changes and trigger debounced saves
  const handleContentChange = useCallback(() => {
    setContentChanged(true);
    
    // Clear any existing debounce timer
    if (contentChangeTimerRef.current) {
      clearTimeout(contentChangeTimerRef.current);
    }
    
    // Set new debounce timer to trigger save after short delay
    contentChangeTimerRef.current = setTimeout(() => {
      if (!isAutosaving) {
        handleAutosave();
      }
    }, contentSaveDebounceTime);
  }, [handleAutosave, isAutosaving, contentSaveDebounceTime]);

  // Start autosave timer with enhanced scheduling
  const startAutosaveTimer = useCallback(() => {
    // Clear any existing timer
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }
    
    // Set new timer for server autosave
    autosaveTimerRef.current = setTimeout(() => {
      // Only trigger autosave if content has changed or if it's been a long time
      // since the last save (to ensure periodic saves even without changes)
      if (contentChanged || !lastAutosaved || 
          (new Date().getTime() - new Date(lastAutosaved).getTime() > autoSaveInterval * 3)) {
        handleAutosave().finally(() => {
          // Restart timer after completion (success or failure)
          startAutosaveTimer();
        });
      } else {
        // Just restart the timer if no changes to save
        startAutosaveTimer();
      }
    }, autoSaveInterval);
  }, [handleAutosave, autoSaveInterval, contentChanged, lastAutosaved]);

  // Start local backup timer with enhanced logic
  const startLocalBackupTimer = useCallback(() => {
    // Clear any existing timer
    if (localBackupTimerRef.current) {
      clearTimeout(localBackupTimerRef.current);
    }
    
    // Set new timer for local backup
    localBackupTimerRef.current = setTimeout(() => {
      // Always save to localStorage on the interval
      saveToLocalStorage();
      
      // Restart timer
      startLocalBackupTimer();
    }, localBackupInterval);
  }, [saveToLocalStorage, localBackupInterval]);

  // Check for local backup on mount with improved recovery logic
  useEffect(() => {
    const checkLocalBackup = () => {
      const draftKey = `blog_draft_${id || 'new'}`;
      const localDraft = localStorage.getItem(draftKey);
      
      if (localDraft) {
        try {
          const draftData = JSON.parse(localDraft);
          const draftDate = new Date(draftData.lastSaved);
          const lastSavedDate = lastAutosaved ? new Date(lastAutosaved) : null;
          
          setHasLocalBackup(true);
          
          // If local draft is newer than server version by at least 30 seconds
          // and has content, offer recovery
          const timeDifference = lastSavedDate ? 
            draftDate.getTime() - lastSavedDate.getTime() : 
            Number.MAX_SAFE_INTEGER;
            
          if (timeDifference > 30000 && 
              (draftData.title || draftData.content || draftData.excerpt)) {
            setShowRecoveryDialog(true);
            setRecoveryData(draftData);
          }
        } catch (e) {
          console.error('Error parsing local draft:', e);
        }
      }
    };
    
    if (id || !title) {
      // Only check for recovery if we have an id or empty title (new post)
      checkLocalBackup();
    }
    
    // Listen for content changes in props to trigger the contentChanged flag
    // This is called in a useEffect to avoid too many re-renders
    if (title || content || excerpt) {
      handleContentChange();
    }
    
    // Start timers
    startAutosaveTimer();
    startLocalBackupTimer();
    
    // Clean up on unmount
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
      
      if (localBackupTimerRef.current) {
        clearTimeout(localBackupTimerRef.current);
      }
      
      if (contentChangeTimerRef.current) {
        clearTimeout(contentChangeTimerRef.current);
      }
      
      // Final save attempt before unmounting
      saveToLocalStorage();
    };
  }, [
    id, 
    startAutosaveTimer, 
    startLocalBackupTimer, 
    lastAutosaved, 
    title, 
    content, 
    excerpt, 
    handleContentChange,
    saveToLocalStorage
  ]);

  // Enhanced manual trigger for autosave with forced flag
  const triggerAutosave = useCallback(async (force = false) => {
    // Always save to localStorage
    saveToLocalStorage();
    
    // For forced saves, set contentChanged to true to ensure server save
    if (force) {
      setContentChanged(true);
    }
    
    return await handleAutosave();
  }, [handleAutosave, saveToLocalStorage]);

  // Clear local backup with improved confirmation
  const clearLocalBackup = useCallback(() => {
    const draftKey = `blog_draft_${id || 'new'}`;
    localStorage.removeItem(draftKey);
    setHasLocalBackup(false);
    setShowRecoveryDialog(false);
    setRecoveryData(null);
  }, [id]);

  return {
    isAutosaving,
    lastAutosaved,
    lastLocalBackup,
    hasLocalBackup,
    showRecoveryDialog,
    recoveryData,
    triggerAutosave,
    clearLocalBackup,
    setShowRecoveryDialog,
    handleContentChange  // Export this so it can be called on editor changes
  };
}
