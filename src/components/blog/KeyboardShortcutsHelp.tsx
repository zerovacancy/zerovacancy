import React from 'react';
import { Keyboard, X, KeyRound } from 'lucide-react';
import { KeyboardShortcut, formatShortcut } from '@/utils/keyboard-shortcuts';

interface KeyboardShortcutsHelpProps {
  shortcuts: KeyboardShortcut[];
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  shortcuts,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;
  
  // Group shortcuts by category
  const categories = {
    'Text Formatting': shortcuts.filter(s => 
      ['bold', 'italic', 'link', 'align'].some(k => s.description.toLowerCase().includes(k))),
    'Navigation': shortcuts.filter(s => 
      ['preview', 'toggle', 'cancel'].some(k => s.description.toLowerCase().includes(k))),
    'Document': shortcuts.filter(s => 
      ['save', 'publish', 'draft'].some(k => s.description.toLowerCase().includes(k))),
    'General': shortcuts.filter(s => 
      !['bold', 'italic', 'link', 'align', 'preview', 'toggle', 'cancel', 'save', 'publish', 'draft'].some(k => 
        s.description.toLowerCase().includes(k)
      )
    )
  };
  
  // Check if Escape was pressed to close dialog
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        // Close when clicking outside
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h2 className="text-lg font-medium flex items-center">
            <Keyboard className="mr-2 h-5 w-5 text-brand-purple" />
            Keyboard Shortcuts
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="overflow-auto p-4 flex-1">
          {Object.entries(categories).map(([category, categoryShortcuts]) => (
            categoryShortcuts.length > 0 && (
              <div key={category} className="mb-6">
                <h3 className="text-sm font-semibold mb-3 text-gray-700 flex items-center">
                  <KeyRound size={16} className="mr-2 text-brand-purple" />
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border-b border-gray-100 hover:bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{shortcut.description}</span>
                      <kbd className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-mono font-medium border border-gray-200 shadow-sm">
                        {formatShortcut(shortcut)}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Press <kbd className="px-1.5 py-0.5 rounded bg-gray-200 text-xs font-mono border border-gray-300">Ctrl+K</kbd> at any time to show or hide this help dialog.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;
