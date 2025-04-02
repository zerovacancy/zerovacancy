export type KeyboardShortcut = {
  key: string;        // The key to press
  description: string; // Description of what the shortcut does
  ctrlKey?: boolean;  // Whether Ctrl key is required (Cmd on Mac)
  altKey?: boolean;   // Whether Alt key is required
  shiftKey?: boolean; // Whether Shift key is required
  metaKey?: boolean;  // Whether Meta key is required (Windows key or Cmd)
  action: () => void; // Function to execute when shortcut is triggered
};

export const isMac = () => {
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
};

export const formatShortcut = (shortcut: KeyboardShortcut): string => {
  const parts: string[] = [];
  
  // Platform-specific modifier keys
  if (shortcut.ctrlKey) {
    parts.push(isMac() ? '⌘' : 'Ctrl');
  }
  
  if (shortcut.altKey) {
    parts.push(isMac() ? '⌥' : 'Alt');
  }
  
  if (shortcut.shiftKey) {
    parts.push(isMac() ? '⇧' : 'Shift');
  }
  
  if (shortcut.metaKey && !isMac()) {
    parts.push('Win');
  }
  
  // Add the key
  let key = shortcut.key;
  
  // Make certain keys more readable
  if (key === ' ') {
    key = 'Space';
  } else if (key === 'ArrowUp') {
    key = '↑';
  } else if (key === 'ArrowDown') {
    key = '↓';
  } else if (key === 'ArrowLeft') {
    key = '←';
  } else if (key === 'ArrowRight') {
    key = '→';
  } else if (key.length === 1) {
    key = key.toUpperCase();
  }
  
  parts.push(key);
  
  return parts.join('+');
};

export const registerShortcuts = (shortcuts: KeyboardShortcut[]): (() => void) => {
  // Event handler for keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    // Don't trigger shortcuts when user is typing in an input or textarea
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement ||
      (e.target as HTMLElement)?.isContentEditable
    ) {
      // Unless it's Cmd+S/Ctrl+S or Esc which we allow globally
      const isGlobalShortcut = 
        (e.key === 's' && (e.ctrlKey || e.metaKey)) || 
        e.key === 'Escape';
      
      if (!isGlobalShortcut) {
        return;
      }
    }
    
    // Check each shortcut
    for (const shortcut of shortcuts) {
      if (
        e.key.toLowerCase() === shortcut.key.toLowerCase() &&
        !!e.ctrlKey === !!shortcut.ctrlKey &&
        !!e.altKey === !!shortcut.altKey &&
        !!e.shiftKey === !!shortcut.shiftKey &&
        !!e.metaKey === !!shortcut.metaKey
      ) {
        e.preventDefault();
        shortcut.action();
        break;
      }
    }
  };
  
  // Add event listener
  document.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
};

// Common editor shortcuts
export const commonEditorShortcuts = (actions: {
  save: () => void;
  publish: () => void;
  preview: () => void;
  cancel: () => void;
}): KeyboardShortcut[] => {
  return [
    {
      key: 's',
      ctrlKey: true,
      description: 'Save draft',
      action: actions.save
    },
    {
      key: 'p',
      ctrlKey: true,
      shiftKey: true,
      description: 'Publish/Schedule',
      action: actions.publish
    },
    {
      key: 'e',
      ctrlKey: true,
      description: 'Toggle preview',
      action: actions.preview
    },
    {
      key: 'Escape',
      description: 'Cancel current operation',
      action: actions.cancel
    }
  ];
};