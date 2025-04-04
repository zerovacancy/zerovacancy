import React, { useState, useEffect, useCallback, useRef } from 'react';
import { EditorContent, useEditor, ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import CodeBlock from '@tiptap/extension-code-block';
import { 
  Bold, 
  Italic, 
  Link as LinkIcon, 
  List, 
  ListOrdered, 
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Quote,
  Undo,
  Redo,
  X,
  Loader,
  Table as TableIcon,
  Code,
  ChevronDown,
  SquareSlash,
  Trash2,
  Upload as UploadIcon,
  Maximize,
  Minimize,
  Crop,
  MoveHorizontal,
  MoveVertical,
  ChevronsLeftRight
} from 'lucide-react';
import { BlogService } from '@/services/BlogService';

// Resizable Image Component
const ResizableImageComponent = ({ node, updateAttributes, selected, extension }) => {
  const [size, setSize] = useState('medium'); // small, medium, large, original
  const [showResizeUI, setShowResizeUI] = useState(false);
  const [width, setWidth] = useState(node.attrs.width || 'auto');
  const [height, setHeight] = useState(node.attrs.height || 'auto');
  const [alignment, setAlignment] = useState(node.attrs.alignment || 'center');
  
  useEffect(() => {
    if (selected) {
      setShowResizeUI(true);
    } else {
      setShowResizeUI(false);
    }
  }, [selected]);
  
  const applySize = (newSize) => {
    setSize(newSize);
    if (newSize === 'small') {
      updateAttributes({ width: '25%', height: 'auto' });
      setWidth('25%');
      setHeight('auto');
    } else if (newSize === 'medium') {
      updateAttributes({ width: '50%', height: 'auto' });
      setWidth('50%');
      setHeight('auto');
    } else if (newSize === 'large') {
      updateAttributes({ width: '75%', height: 'auto' });
      setWidth('75%');
      setHeight('auto');
    } else if (newSize === 'full') {
      updateAttributes({ width: '100%', height: 'auto' });
      setWidth('100%');
      setHeight('auto');
    } else {
      updateAttributes({ width: 'auto', height: 'auto' });
      setWidth('auto');
      setHeight('auto');
    }
  };
  
  const applyAlignment = (newAlignment) => {
    setAlignment(newAlignment);
    updateAttributes({ alignment: newAlignment });
  };
  
  const containerStyle = {
    display: 'inline-block',
    position: 'relative',
    margin: '0.5rem 0',
    width: width === 'auto' ? 'auto' : width,
    maxWidth: '100%'
  };
  
  if (alignment === 'left') {
    containerStyle.float = 'left';
    containerStyle.marginRight = '1rem';
  } else if (alignment === 'right') {
    containerStyle.float = 'right';
    containerStyle.marginLeft = '1rem';
  } else {
    containerStyle.display = 'block';
    containerStyle.marginLeft = 'auto';
    containerStyle.marginRight = 'auto';
  }
  
  return (
    <NodeViewWrapper>
      <div style={containerStyle} className="image-container">
        <img 
          src={node.attrs.src} 
          alt={node.attrs.alt || ''} 
          style={{ 
            width: '100%', 
            height: height === 'auto' ? 'auto' : height,
            display: 'block'
          }} 
        />
        
        {showResizeUI && (
          <div className="image-resize-controls" style={{
            position: 'absolute',
            top: '-40px',
            left: '0',
            right: '0',
            background: 'rgba(0, 0, 0, 0.75)',
            padding: '4px 8px',
            display: 'flex',
            justifyContent: 'center',
            borderRadius: '4px',
            gap: '8px',
            zIndex: 10
          }}>
            <button 
              type="button"
              onClick={() => applySize('small')}
              className={`p-1 rounded ${size === 'small' ? 'bg-brand-purple text-white' : 'text-white hover:bg-gray-700'}`}
              title="Small (25% width)"
            >
              <Minimize size={16} />
            </button>
            <button 
              type="button"
              onClick={() => applySize('medium')}
              className={`p-1 rounded ${size === 'medium' ? 'bg-brand-purple text-white' : 'text-white hover:bg-gray-700'}`}
              title="Medium (50% width)"
            >
              <ChevronsLeftRight size={16} />
            </button>
            <button 
              type="button"
              onClick={() => applySize('large')}
              className={`p-1 rounded ${size === 'large' ? 'bg-brand-purple text-white' : 'text-white hover:bg-gray-700'}`}
              title="Large (75% width)"
            >
              <MoveHorizontal size={16} />
            </button>
            <button 
              type="button"
              onClick={() => applySize('full')}
              className={`p-1 rounded ${size === 'full' ? 'bg-brand-purple text-white' : 'text-white hover:bg-gray-700'}`}
              title="Full width (100%)"
            >
              <Maximize size={16} />
            </button>
            
            <span className="border-r border-gray-500 mx-1 h-6"></span>
            
            <button 
              type="button"
              onClick={() => applyAlignment('left')}
              className={`p-1 rounded ${alignment === 'left' ? 'bg-brand-purple text-white' : 'text-white hover:bg-gray-700'}`}
              title="Align Left"
            >
              <AlignLeft size={16} />
            </button>
            <button 
              type="button"
              onClick={() => applyAlignment('center')}
              className={`p-1 rounded ${alignment === 'center' ? 'bg-brand-purple text-white' : 'text-white hover:bg-gray-700'}`}
              title="Align Center"
            >
              <AlignCenter size={16} />
            </button>
            <button 
              type="button"
              onClick={() => applyAlignment('right')}
              className={`p-1 rounded ${alignment === 'right' ? 'bg-brand-purple text-white' : 'text-white hover:bg-gray-700'}`}
              title="Align Right"
            >
              <AlignRight size={16} />
            </button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  postId?: string;
  onImageUpload?: (url: string) => void;
  editorId?: string; // For persistent editor state
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = 'Write your content here...',
  postId,
  onImageUpload,
  editorId = 'default-editor' // Default ID for state persistence
}) => {
  console.log('RichTextEditor loaded with enhanced version', { 
    valueType: typeof value, 
    valueLength: value?.length || 0,
    onChangeType: typeof onChange,
    placeholderProvided: !!placeholder,
    postIdProvided: !!postId,
    editorIdProvided: !!editorId
  });
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isImageMenuOpen, setIsImageMenuOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Table state and controls
  const [isTableMenuOpen, setIsTableMenuOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableColumns, setTableColumns] = useState(3);
  const [isTableOptionsMenuOpen, setIsTableOptionsMenuOpen] = useState(false);
  
  // Code block state
  const [isCodeBlockMenuOpen, setIsCodeBlockMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  
  // Available code languages
  const codeLanguages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'sql', label: 'SQL' },
    { value: 'json', label: 'JSON' },
    { value: 'markdown', label: 'Markdown' }
  ];
  
  // State key for persistence
  const getEditorStateKey = useCallback(() => {
    return `editor_state_${editorId}_${postId || 'new'}`;
  }, [editorId, postId]);
  
  // Functions for editor state persistence
  const saveEditorState = useCallback((editor: any) => {
    if (!editor) return;
    
    try {
      // Save cursor position and selection for a better UX
      const state = {
        html: editor.getHTML(),
        selection: editor.state.selection
      };
      
      localStorage.setItem(getEditorStateKey(), JSON.stringify(state));
    } catch (error) {
      console.error('Error saving editor state:', error);
    }
  }, [getEditorStateKey]);
  
  const loadEditorState = useCallback(() => {
    try {
      const savedState = localStorage.getItem(getEditorStateKey());
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (error) {
      console.error('Error loading editor state:', error);
    }
    return null;
  }, [getEditorStateKey]);
  
  // Ensure we have a valid string value to avoid errors
  const safeValue = typeof value === 'string' ? value : '';
  
  // Create editor instance first
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'paragraph-spacing',
          },
        },
        // Disable default code block to use custom one
        codeBlock: false,
      }),
      // Create an extended image extension with custom commands
      ImageExtension.extend({
        // Keep the base configuration
        addOptions() {
          return {
            inline: true,
            allowBase64: true,
            HTMLAttributes: {
              class: 'max-w-full rounded-md my-2',
            },
          };
        },
        
        // Add resizing attributes
        addAttributes() {
          return {
            // Original attributes
            src: {},
            alt: {
              default: null,
            },
            title: {
              default: null,
            },
            // Additional attributes for resizing
            width: {
              default: 'auto',
              renderHTML: attributes => {
                return {
                  width: attributes.width,
                  style: `width: ${attributes.width === 'auto' ? 'auto' : attributes.width};`,
                };
              },
            },
            height: {
              default: 'auto',
              renderHTML: attributes => {
                return {
                  height: attributes.height,
                  style: `height: ${attributes.height === 'auto' ? 'auto' : attributes.height};`,
                };
              },
            },
            alignment: {
              default: 'center',
              renderHTML: attributes => {
                const style = attributes.alignment === 'left' 
                  ? 'float: left; margin-right: 1rem; margin-bottom: 0.5rem;'
                  : attributes.alignment === 'right' 
                    ? 'float: right; margin-left: 1rem; margin-bottom: 0.5rem;'
                    : 'display: block; margin-left: auto; margin-right: auto;';
                
                return {
                  style,
                };
              },
            },
            // Add size class for easier styling
            size: {
              default: 'medium',
              renderHTML: attributes => {
                return {
                  class: `image-size-${attributes.size}`,
                };
              },
            },
          };
        },
        
        // Add a custom command to set image attributes
        addCommands() {
          return {
            setImageAttributes: (attributes) => ({ tr, commands, dispatch }) => {
              // Find the image node
              const { selection } = tr;
              
              // If we have a node selection, work with that
              if (selection && selection.$anchor) {
                try {
                  // Start with resolving the current position
                  const pos = selection.$anchor.pos;
                  const node = tr.doc.nodeAt(pos);
                  
                  // If this is an image node, update its attributes
                  if (node && node.type.name === 'image') {
                    if (dispatch) {
                      tr.setNodeMarkup(pos, undefined, {
                        ...node.attrs,
                        ...attributes,
                      });
                    }
                    return true;
                  }
                  
                  // Try to find the image node nearby
                  const resolvedPos = tr.doc.resolve(pos);
                  const currentNode = resolvedPos.node();
                  
                  // If we're inside a parent node
                  if (currentNode && currentNode.content) {
                    // Look for images in the content
                    currentNode.content.forEach((childNode, offset) => {
                      if (childNode.type.name === 'image') {
                        if (dispatch) {
                          const childPos = pos - resolvedPos.parentOffset + offset;
                          tr.setNodeMarkup(childPos, undefined, {
                            ...childNode.attrs,
                            ...attributes,
                          });
                        }
                        return true;
                      }
                    });
                  }
                } catch (error) {
                  console.error("Error in setImageAttributes command:", error);
                }
              }
              
              // Default to the image filter approach
              const imageFilter = (node) => node.type.name === 'image';
              
              // Helper to update an image node
              const updateImage = (pos, node) => {
                if (dispatch) {
                  tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    ...attributes,
                  });
                }
              };
              
              // Find all image nodes and update them
              let foundImage = false;
              tr.doc.descendants((node, pos) => {
                if (imageFilter(node)) {
                  foundImage = true;
                  updateImage(pos, node);
                }
              });
              
              return foundImage;
            },
          };
        },
      }).configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-purple underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'tableCell', 'tableHeader'],
      }),
      // Table extensions
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'min-w-full border-collapse my-4 table-auto',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b border-gray-300',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 text-gray-700 font-medium p-2 text-left border border-gray-300',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'p-2 border border-gray-300',
        },
      }),
      // Code block with syntax highlighting
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'rounded-md bg-gray-900 text-gray-100 p-3 my-4 font-mono text-sm overflow-x-auto',
        },
      }),
    ],
    content: safeValue,
    onUpdate: ({ editor }) => {
      // Make sure onChange is a function before calling it
      if (typeof onChange === 'function') {
        onChange(editor.getHTML());
      } else {
        console.error('RichTextEditor: onChange is not a function', onChange);
      }
      saveEditorState(editor);
      
      // Show table options menu when table is selected
      if (editor.isActive('table')) {
        if (!isTableOptionsMenuOpen && !isLinkMenuOpen && !isImageMenuOpen && !isCodeBlockMenuOpen && !isTableMenuOpen) {
          setIsTableOptionsMenuOpen(true);
        }
      } else {
        if (isTableOptionsMenuOpen) {
          setIsTableOptionsMenuOpen(false);
        }
      }
    },
    onSelectionUpdate: ({ editor }) => {
      // Update table options menu visibility when selection changes
      if (editor.isActive('table')) {
        if (!isTableOptionsMenuOpen && !isLinkMenuOpen && !isImageMenuOpen && !isCodeBlockMenuOpen && !isTableMenuOpen) {
          setIsTableOptionsMenuOpen(true);
        }
      } else {
        if (isTableOptionsMenuOpen) {
          setIsTableOptionsMenuOpen(false);
        }
      }
      
      // Update code block menu when a code block is selected
      if (editor.isActive('codeBlock')) {
        // Just update the selected language - don't necessarily show the menu
        const attributes = editor.getAttributes('codeBlock');
        if (attributes.language) {
          setSelectedLanguage(attributes.language);
        }
      }
    },
    onFocus: ({ editor }) => {
      // When focused, try to restore selection
      const savedState = loadEditorState();
      if (savedState && savedState.selection) {
        try {
          // Only restore selection if content matches
          if (savedState.html === editor.getHTML()) {
            editor.commands.setTextSelection(savedState.selection);
          }
        } catch (error) {
          console.error('Error restoring editor selection:', error);
        }
      }
    },
    onBlur: ({ editor }) => {
      saveEditorState(editor);
    },
  });
  
  // Define UI interaction functions after editor is created
  const openLinkMenu = useCallback(() => {
    if (!editor) return;
    
    try {
      // If there's already a link at the current position, get its URL
      const linkMark = editor.getAttributes('link');
      if (linkMark.href) {
        setLinkUrl(linkMark.href);
      }
      
      setIsLinkMenuOpen(true);
    } catch (error) {
      console.error('Error opening link menu:', error);
    }
  }, [editor]);
  
  const openImageMenu = useCallback(() => {
    setIsImageMenuOpen(true);
    setImageFile(null);
    setImageUrl('');
  }, []);
  
  // Function to check if the cursor is inside a table
  const isCursorInTable = useCallback(() => {
    if (!editor) return false;
    return editor.isActive('table');
  }, [editor]);
  
  // Toggle table options menu
  const toggleTableOptionsMenu = useCallback(() => {
    if (isCursorInTable()) {
      setIsTableOptionsMenuOpen(!isTableOptionsMenuOpen);
    } else {
      setIsTableOptionsMenuOpen(false);
    }
  }, [isTableOptionsMenuOpen, isCursorInTable]);
  
  // Setup keyboard shortcuts for the editor
  const setupEditorKeyboardShortcuts = useCallback((editor: any) => {
    if (!editor) return () => {};
    
    // Text formatting shortcuts
    const handleBold = () => editor.chain().focus().toggleBold().run();
    const handleItalic = () => editor.chain().focus().toggleItalic().run();
    const handleLink = () => openLinkMenu();
    
    // Heading shortcuts
    const handleH1 = () => editor.chain().focus().toggleHeading({ level: 1 }).run();
    const handleH2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run();
    const handleH3 = () => editor.chain().focus().toggleHeading({ level: 3 }).run();
    
    // List shortcuts
    const handleBulletList = () => editor.chain().focus().toggleBulletList().run();
    const handleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
    
    // Block shortcuts
    const handleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
    
    // Table shortcuts
    const handleTableMenu = () => {
      if (isCursorInTable()) {
        toggleTableOptionsMenu();
      } else {
        setIsTableMenuOpen(true);
      }
    };
    
    // Code block shortcut
    const handleCodeBlock = () => {
      setIsCodeBlockMenuOpen(true);
    };
    
    // Setup event listeners
    const keyboardShortcuts = (e: KeyboardEvent) => {
      // Skip shortcuts if any menus are open
      if (isLinkMenuOpen || isImageMenuOpen || isTableMenuOpen || isCodeBlockMenuOpen || isTableOptionsMenuOpen) return;
      
      // Don't handle shortcuts if the editor doesn't have focus
      if (!editor.isFocused) return;
      
      // Control/Command key combinations
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            handleBold();
            break;
          case 'i':
            e.preventDefault();
            handleItalic();
            break;
          case 'k':
            e.preventDefault();
            handleLink();
            break;
          case 't':
            e.preventDefault();
            handleTableMenu();
            break;
          case 'j':
            e.preventDefault();
            handleCodeBlock();
            break;
        }
        
        // Control/Command + Alt combinations for headings
        if (e.altKey) {
          switch (e.key) {
            case '1':
              e.preventDefault();
              handleH1();
              break;
            case '2':
              e.preventDefault();
              handleH2();
              break;
            case '3':
              e.preventDefault();
              handleH3();
              break;
          }
        }
        
        // Control/Command + Shift combinations
        if (e.shiftKey) {
          switch (e.key) {
            case '8': // Asterisk key with shift
              e.preventDefault();
              handleBulletList();
              break;
            case '9': // Opening parenthesis key with shift
              e.preventDefault();
              handleOrderedList();
              break;
            case 'b':
              e.preventDefault();
              handleBlockquote();
              break;
          }
        }
      }
    };
    
    // Add the event listener
    document.addEventListener('keydown', keyboardShortcuts);
    
    // Return cleanup function
    return () => {
      document.removeEventListener('keydown', keyboardShortcuts);
    };
  }, [
    isLinkMenuOpen, 
    isImageMenuOpen, 
    isTableMenuOpen,
    isCodeBlockMenuOpen,
    isTableOptionsMenuOpen,
    openLinkMenu,
    isCursorInTable,
    toggleTableOptionsMenu
  ]);
  
  // When external value changes, update editor content
  useEffect(() => {
    if (editor && typeof value === 'string' && value !== editor.getHTML()) {
      try {
        editor.commands.setContent(value);
      } catch (error) {
        console.error('Error setting editor content:', error);
      }
    }
  }, [editor, value]);
  
  // Setup keyboard shortcuts when editor is ready
  useEffect(() => {
    if (!editor) return;
    
    const cleanup = setupEditorKeyboardShortcuts(editor);
    return cleanup;
  }, [editor, setupEditorKeyboardShortcuts]);
  
  // Custom function to make double newlines act like paragraph breaks
  const handleEditorKeyDown = (e: React.KeyboardEvent) => {
    if (!editor) return false;
    
    if (e.key === 'Enter' && !e.shiftKey) {
      try {
        const { state } = editor;
        const { selection } = state;
        const { $from, empty } = selection;
        
        // If the cursor is at the end of a paragraph
        if (empty && $from.parent.type.name === 'paragraph') {
          // Check if current paragraph is empty
          if ($from.parent.textContent === '') {
            console.log('Creating extra paragraph for spacing');
            
            // Prevent default behavior and add a paragraph with spacing
            e.preventDefault();
            
            // Create a double paragraph break by adding a paragraph with non-breaking space
            editor.chain()
              .insertContent('<p class="paragraph-spacer">&nbsp;</p>')
              .focus()
              .run();
              
            return true;
          }
        }
      } catch (error) {
        console.error('Error handling key down:', error);
      }
    }
    return false;
  };
  
  // Insert link - simplified and safe implementation
  const setLink = useCallback(() => {
    if (!editor) {
      setIsLinkMenuOpen(false);
      return;
    }
    
    try {
      // Validate URL
      if (linkUrl) {
        // Add https if needed
        const url = linkUrl.trim();
        const validUrl = url.startsWith('http') ? url : `https://${url}`;
        
        editor.chain().focus().setLink({ href: validUrl }).run();
      } else {
        editor.chain().focus().unsetLink().run();
      }
    } catch (error) {
      console.error('Error setting link:', error);
    }
    
    setIsLinkMenuOpen(false);
    setLinkUrl('');
  }, [editor, linkUrl]);
  
  // Handle image upload - with enhanced error handling
  const handleImageUpload = useCallback(async () => {
    if (!editor) {
      console.error('Editor is not initialized');
      alert('Editor is not ready. Please try again.');
      return;
    }
    
    // Insert from URL
    if (imageUrl) {
      try {
        // Use insertContent instead of setImage for better compatibility
        editor.chain().focus().insertContent({
          type: 'image',
          attrs: { src: imageUrl }
        }).run();
        setImageUrl('');
        setIsImageMenuOpen(false);
        
        if (onImageUpload) {
          onImageUpload(imageUrl);
        }
      } catch (error) {
        console.error('Error inserting image from URL:', error);
        alert('Failed to insert image. Please try again.');
      }
      return;
    }
    
    // Upload file
    if (imageFile) {
      // Check if postId is missing
      if (!postId) {
        console.error('Missing postId for image upload');
        alert('Please save the post before adding images.');
        setIsUploading(false);
        setIsImageMenuOpen(false);
        return;
      }
      
      // Validate image size first
      if (imageFile.size > 2 * 1024 * 1024) { // 2MB max
        alert('Image is too large. Maximum size is 2MB.');
        setImageFile(null);
        return;
      }
      
      try {
        setIsUploading(true);
        
        const uploadedUrl = await BlogService.uploadImage(imageFile, postId, 'content');
        
        // Ensure we got a valid URL back
        if (!uploadedUrl || typeof uploadedUrl !== 'string') {
          throw new Error('Failed to get valid URL from upload service');
        }
        
        // Use insertContent instead of setImage for better compatibility
        editor.chain().focus().insertContent({
          type: 'image',
          attrs: { src: uploadedUrl }
        }).run();
        
        if (onImageUpload) {
          onImageUpload(uploadedUrl);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        
        // Display a more helpful error message based on the error
        if (error instanceof Error) {
          if (error.message.includes('too large')) {
            alert('Image is too large. Maximum size is 2MB.');
          } else if (error.message.includes('format') || error.message.includes('type')) {
            alert('Invalid image format. Please use JPG, PNG, or GIF.');
          } else {
            alert(`Failed to upload image: ${error.message}`);
          }
        } else {
          alert('Failed to upload image. Please try again.');
        }
      } finally {
        setIsUploading(false);
        setImageFile(null);
        setIsImageMenuOpen(false);
      }
    }
  }, [editor, imageFile, imageUrl, postId, onImageUpload]);
  
  // Handle image file selection
  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  }, []);
  
  // Enhanced image drag-and-drop with visual feedback
  const [isDraggingOverEditor, setIsDraggingOverEditor] = useState(false);
  
  // Handle drag enter in the editor
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if dragging a file
    if (e.dataTransfer.types.includes('Files')) {
      setIsDraggingOverEditor(true);
    }
  }, []);
  
  // Handle drag over in the editor
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Set the drop effect
    if (e.dataTransfer.types.includes('Files')) {
      e.dataTransfer.dropEffect = 'copy';
      setIsDraggingOverEditor(true);
    }
  }, []);
  
  // Handle drag leave in the editor
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only reset if we're leaving the editor (not just moving within it)
    // Check if the leave is from the editor itself or from a child element
    if (e.currentTarget === e.target) {
      setIsDraggingOverEditor(false);
    }
  }, []);
  
  // Enhanced image drop handler
  const handleImageDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Reset the drag state
    setIsDraggingOverEditor(false);
    
    try {
      if (!editor || !postId) {
        alert('Please save the post before adding images.');
        return;
      }
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        // Process all dropped image files
        Array.from(e.dataTransfer.files).forEach(async (file) => {
          // Check if it's an image
          if (file.type.startsWith('image/')) {
            // Size validation
            if (file.size > 2 * 1024 * 1024) { // 2MB max
              alert('One or more images are too large. Maximum size is 2MB.');
              return;
            }
            
            try {
              setIsUploading(true);
              
              // Upload the image directly
              const uploadedUrl = await BlogService.uploadImage(file, postId, 'content');
              
              // Ensure we got a valid URL back
              if (!uploadedUrl || typeof uploadedUrl !== 'string') {
                throw new Error('Failed to get valid URL from upload service');
              }
              
              // Insert the image at the current cursor position
              // Use insertContent instead of setImage for better compatibility
        editor.chain().focus().insertContent({
          type: 'image',
          attrs: { src: uploadedUrl }
        }).run();
              
              if (onImageUpload) {
                onImageUpload(uploadedUrl);
              }
            } catch (error) {
              console.error('Error uploading image:', error);
              
              // Display a more helpful error message based on the error
              if (error instanceof Error) {
                if (error.message.includes('too large')) {
                  alert('Image is too large. Maximum size is 2MB.');
                } else if (error.message.includes('format') || error.message.includes('type')) {
                  alert('Invalid image format. Please use JPG, PNG, or GIF.');
                } else {
                  alert(`Failed to upload image: ${error.message}`);
                }
              } else {
                alert('Failed to upload image. Please try again.');
              }
            } finally {
              setIsUploading(false);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error handling image drop:', error);
      alert('Error processing dropped image. Please try again.');
      setIsUploading(false);
    }
  }, [editor, postId, onImageUpload]);
  
  // Table functions
  const insertTable = useCallback(() => {
    if (!editor) return;
    
    editor.chain()
      .focus()
      .insertTable({ rows: tableRows, cols: tableColumns, withHeaderRow: true })
      .run();
    
    setIsTableMenuOpen(false);
  }, [editor, tableRows, tableColumns]);
  
  // Table manipulation functions
  const addColumnBefore = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().addColumnBefore().run();
    setIsTableOptionsMenuOpen(false);
  }, [editor]);
  
  const addColumnAfter = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().addColumnAfter().run();
    setIsTableOptionsMenuOpen(false);
  }, [editor]);
  
  const deleteColumn = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().deleteColumn().run();
    setIsTableOptionsMenuOpen(false);
  }, [editor]);
  
  const addRowBefore = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().addRowBefore().run();
    setIsTableOptionsMenuOpen(false);
  }, [editor]);
  
  const addRowAfter = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().addRowAfter().run();
    setIsTableOptionsMenuOpen(false);
  }, [editor]);
  
  const deleteRow = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().deleteRow().run();
    setIsTableOptionsMenuOpen(false);
  }, [editor]);
  
  const deleteTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().deleteTable().run();
    setIsTableOptionsMenuOpen(false);
  }, [editor]);
  
  const mergeOrSplitCells = useCallback(() => {
    if (!editor) return;
    
    // Check if cells are selected
    if (editor.can().mergeCells()) {
      editor.chain().focus().mergeCells().run();
    } else if (editor.can().splitCell()) {
      editor.chain().focus().splitCell().run();
    }
    
    setIsTableOptionsMenuOpen(false);
  }, [editor]);
  
  // Check for code block language and update state
  useEffect(() => {
    if (!editor) return;
    
    // Get the language attribute of a code block if one is selected
    if (editor.isActive('codeBlock')) {
      const attributes = editor.getAttributes('codeBlock');
      if (attributes.language) {
        setSelectedLanguage(attributes.language);
      }
    }
  }, [editor]);
  
  // Code block function
  const insertCodeBlock = useCallback(() => {
    if (!editor) return;
    
    editor.chain()
      .focus()
      .setCodeBlock({ language: selectedLanguage })
      .run();
    
    setIsCodeBlockMenuOpen(false);
  }, [editor, selectedLanguage]);
  
  // Image editing controls for resizing and aligning images
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Handler for image clicks to enable resizing
  const handleImageClick = useCallback((event) => {
    if (!editor) return;
    
    // Check if the clicked element is an image
    if (event.target.tagName === 'IMG') {
      // Store the clicked image element
      setSelectedImage(event.target);
      
      // Prevent other click handlers
      event.stopPropagation();
    } else {
      // If clicking outside an image, clear selection
      setSelectedImage(null);
    }
  }, [editor]);
  
  // Apply changes to the selected image
  const applyImageChanges = useCallback((options) => {
    if (!editor || !selectedImage) return;
    
    try {
      // Find the node that contains this image
      editor.commands.focus();
      
      // Create a temporary selection attribute
      const imageAttributes = { ...options };
      
      // Apply the style directly to the image element
      if (options.width) {
        selectedImage.style.width = options.width;
      }
      
      if (options.height) {
        selectedImage.style.height = options.height;
      }
      
      if (options.alignment) {
        // Reset all alignment styles
        selectedImage.style.float = '';
        selectedImage.style.marginLeft = '';
        selectedImage.style.marginRight = '';
        selectedImage.style.display = '';
        
        // Apply new alignment
        if (options.alignment === 'left') {
          selectedImage.style.float = 'left';
          selectedImage.style.marginRight = '1rem';
          selectedImage.style.marginBottom = '0.5rem';
        } else if (options.alignment === 'right') {
          selectedImage.style.float = 'right';
          selectedImage.style.marginLeft = '1rem';
          selectedImage.style.marginBottom = '0.5rem';
        } else { // center
          selectedImage.style.display = 'block';
          selectedImage.style.marginLeft = 'auto';
          selectedImage.style.marginRight = 'auto';
        }
      }
      
      // Also try to use the editor's commands if possible
      try {
        editor.chain().focus().setImageAttributes(imageAttributes).run();
      } catch (cmdError) {
        console.warn('Could not use editor commands for image attributes, using direct DOM manipulation instead');
      }
    } catch (error) {
      console.error('Error updating image attributes:', error);
    }
  }, [editor, selectedImage]);
  
  // Setup click handler for images
  useEffect(() => {
    if (!editor) return;
    
    // Add click handler to the editor
    const editorElement = document.querySelector('.ProseMirror');
    if (editorElement) {
      editorElement.addEventListener('click', handleImageClick);
    }
    
    // Document click handler to clear selection when clicking outside
    const handleDocumentClick = (e) => {
      if (editorElement && !editorElement.contains(e.target)) {
        setSelectedImage(null);
      }
    };
    
    document.addEventListener('click', handleDocumentClick);
    
    return () => {
      if (editorElement) {
        editorElement.removeEventListener('click', handleImageClick);
      }
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [editor, handleImageClick]);
  
  // If editor is not initialized, show a loading state
  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-md overflow-hidden w-full max-w-full">
        <div className="border-b border-gray-300 bg-gray-50 p-2">
          <div className="animate-pulse h-8 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="min-h-[300px] flex items-center justify-center bg-gray-50">
          <div className="text-gray-400">Loading editor...</div>
        </div>
      </div>
    );
  }
  
  // Main render when editor is ready
  return (
    <div className="border border-gray-300 rounded-md overflow-hidden w-full max-w-full">
      {/* Reorganized Toolbar - grouped by function */}
      <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-1 items-center">
        {/* Group 1: Text Formatting */}
        <div className="flex items-center bg-white rounded border border-gray-200 shadow-sm mr-2">
          <ToolbarButton 
            icon={<Bold size={16} />} 
            isActive={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold (Ctrl+B)"
            className="p-1.5 text-gray-700 hover:bg-gray-50 rounded-l"
          />
          <ToolbarButton 
            icon={<Italic size={16} />} 
            isActive={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic (Ctrl+I)"
            className="p-1.5 text-gray-700 hover:bg-gray-50 rounded-r"
          />
        </div>
        
        {/* Group 2: Headings */}
        <div className="flex items-center bg-white rounded border border-gray-200 shadow-sm mr-2">
          <ToolbarButton 
            icon={<Heading1 size={16} />} 
            isActive={editor.isActive('heading', { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            title="Heading 1 (Ctrl+Alt+1)"
            className="p-1.5 text-gray-700 hover:bg-gray-50 rounded-l"
          />
          <ToolbarButton 
            icon={<Heading2 size={16} />} 
            isActive={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            title="Heading 2 (Ctrl+Alt+2)"
            className="p-1.5 text-gray-700 hover:bg-gray-50"
          />
          <ToolbarButton 
            icon={<Heading3 size={16} />} 
            isActive={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            title="Heading 3 (Ctrl+Alt+3)"
            className="p-1.5 text-gray-700 hover:bg-gray-50 rounded-r"
          />
        </div>
        
        {/* Group 3: Lists */}
        <div className="flex items-center bg-white rounded border border-gray-200 shadow-sm mr-2">
          <ToolbarButton 
            icon={<List size={16} />} 
            isActive={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List (Ctrl+Shift+8)"
            className="p-1.5 text-gray-700 hover:bg-gray-50 rounded-l"
          />
          <ToolbarButton 
            icon={<ListOrdered size={16} />} 
            isActive={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Ordered List (Ctrl+Shift+9)"
            className="p-1.5 text-gray-700 hover:bg-gray-50 rounded-r"
          />
        </div>
        
        {/* Group 4: Block Elements */}
        <div className="flex items-center bg-white rounded border border-gray-200 shadow-sm mr-2">
          <ToolbarButton 
            icon={<Quote size={16} />} 
            isActive={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Quote (Ctrl+Shift+B)"
            className="p-1.5 text-gray-700 hover:bg-gray-50 rounded-l"
          />
          <ToolbarButton 
            icon={<Minus size={16} />} 
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Rule"
            className="p-1.5 text-gray-700 hover:bg-gray-50"
          />
          <ToolbarButton 
            icon={<TableIcon size={16} />} 
            isActive={editor.isActive('table')}
            onClick={() => {
              if (editor.isActive('table')) {
                setIsTableOptionsMenuOpen(true);
              } else {
                setIsTableMenuOpen(true);
              }
            }}
            title="Insert Table (Ctrl+T)"
            className="p-1.5 text-gray-700 hover:bg-gray-50"
          />
          <ToolbarButton 
            icon={<>
              <Code size={16} />
              {editor.isActive('codeBlock') && (
                <span className="ml-1 text-xs bg-gray-100 px-1 rounded">
                  {selectedLanguage}
                </span>
              )}
            </>} 
            isActive={editor.isActive('codeBlock')}
            onClick={() => setIsCodeBlockMenuOpen(true)}
            title={editor.isActive('codeBlock') 
              ? `Change language (${selectedLanguage})` 
              : "Insert Code Block (Ctrl+J)"}
            className="p-1.5 flex items-center text-gray-700 hover:bg-gray-50 rounded-r"
          />
        </div>
        
        {/* Group 5: Alignment */}
        <div className="flex items-center bg-white rounded border border-gray-200 shadow-sm mr-2">
          <ToolbarButton 
            icon={<AlignLeft size={16} />} 
            isActive={editor.isActive({ textAlign: 'left' })}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            title="Align Left"
            className="p-1.5 text-gray-700 hover:bg-gray-50 rounded-l"
          />
          <ToolbarButton 
            icon={<AlignCenter size={16} />} 
            isActive={editor.isActive({ textAlign: 'center' })}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            title="Align Center"
            className="p-1.5 text-gray-700 hover:bg-gray-50"
          />
          <ToolbarButton 
            icon={<AlignRight size={16} />} 
            isActive={editor.isActive({ textAlign: 'right' })}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            title="Align Right"
            className="p-1.5 text-gray-700 hover:bg-gray-50 rounded-r"
          />
        </div>
        
        {/* Group 6: Media */}
        <div className="flex items-center bg-white rounded border border-gray-200 shadow-sm mr-2">
          <ToolbarButton 
            icon={<LinkIcon size={16} />} 
            isActive={editor.isActive('link')}
            onClick={openLinkMenu}
            title="Add Link (Ctrl+K)"
            className="p-1.5 text-gray-700 hover:bg-gray-50 rounded-l"
          />
          {postId && (
            <ToolbarButton 
              icon={<ImageIcon size={16} />} 
              onClick={openImageMenu}
              title="Add Image"
              className="p-1.5 text-gray-700 hover:bg-gray-50 rounded-r"
            />
          )}
        </div>
        
        {/* Group 7: History (right aligned) */}
        <div className="ml-auto flex items-center bg-white rounded border border-gray-200 shadow-sm">
          <ToolbarButton 
            icon={<Undo size={16} />} 
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
            className="p-1.5 text-gray-700 hover:bg-gray-50 rounded-l"
          />
          <ToolbarButton 
            icon={<Redo size={16} />} 
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Shift+Z)"
            className="p-1.5 text-gray-700 hover:bg-gray-50 rounded-r"
          />
        </div>
      </div>
      
      {/* Link Menu */}
      {isLinkMenuOpen && (
        <div className="p-3 border-b border-gray-300 bg-gray-50 flex items-center gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-purple"
              onKeyDown={(e) => e.key === 'Enter' && setLink()}
              autoFocus
            />
          </div>
          <button
            onClick={setLink}
            className="px-3 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-purple-dark"
          >
            Apply
          </button>
          <button
            onClick={() => setIsLinkMenuOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>
      )}
      
      {/* Simplified Image Menu */}
      {isImageMenuOpen && (
        <div className="p-3 border-b border-gray-300 bg-gray-50 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Insert Image</h4>
            <button
              onClick={() => setIsImageMenuOpen(false)}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-brand-purple-light file:text-brand-purple hover:file:bg-brand-purple-light/80"
              />
            </div>
            <div className="flex items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Or Insert from URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-purple"
                />
              </div>
            </div>
            
            {/* Resizing help tip */}
            <div className="bg-blue-50 p-2 text-xs text-blue-700 rounded border border-blue-100 flex gap-2 items-start">
              <div className="mt-0.5 flex-shrink-0">
                <MoveHorizontal size={14} />
              </div>
              <div>
                <p className="font-medium">Pro Tip: Resize and position images</p>
                <p>After inserting an image, click it to reveal resize and alignment controls.</p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleImageUpload}
                disabled={isUploading || (!imageFile && !imageUrl)}
                className="px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-purple-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <span className="flex items-center">
                    <Loader size={16} className="animate-spin mr-2" />
                    Uploading...
                  </span>
                ) : 'Insert Image'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Table Menu */}
      {isTableMenuOpen && (
        <div className="p-3 border-b border-gray-300 bg-gray-50 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Insert Table</h4>
            <button
              onClick={() => setIsTableMenuOpen(false)}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rows
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tableRows}
                  onChange={(e) => setTableRows(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-purple"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Columns
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tableColumns}
                  onChange={(e) => setTableColumns(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-purple"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={insertTable}
                className="px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-purple-dark"
              >
                Insert Table
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Table Options Menu - only shown when table is selected */}
      {isTableOptionsMenuOpen && editor && editor.isActive('table') && (
        <div className="p-3 border-b border-gray-300 bg-gray-50 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Table Options</h4>
            <button
              onClick={() => setIsTableOptionsMenuOpen(false)}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={addColumnBefore}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50"
            >
              Add Column Before
            </button>
            <button
              onClick={addColumnAfter}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50"
            >
              Add Column After
            </button>
            <button
              onClick={deleteColumn}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50"
            >
              Delete Column
            </button>
            <button
              onClick={addRowBefore}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50"
            >
              Add Row Before
            </button>
            <button
              onClick={addRowAfter}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50"
            >
              Add Row After
            </button>
            <button
              onClick={deleteRow}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50"
            >
              Delete Row
            </button>
            <button
              onClick={mergeOrSplitCells}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50"
            >
              Merge/Split Cells
            </button>
            <button
              onClick={deleteTable}
              className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded bg-white hover:bg-red-50"
            >
              Delete Table
            </button>
          </div>
        </div>
      )}
      
      {/* Code Block Menu */}
      {isCodeBlockMenuOpen && (
        <div className="p-3 border-b border-gray-300 bg-gray-50 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">
              {editor.isActive('codeBlock') ? 'Change Code Language' : 'Insert Code Block'}
            </h4>
            <button
              onClick={() => setIsCodeBlockMenuOpen(false)}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-purple"
              >
                {codeLanguages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              {editor.isActive('codeBlock') && (
                <button
                  onClick={() => {
                    editor.chain().focus().setCodeBlock({ language: selectedLanguage }).run();
                    setIsCodeBlockMenuOpen(false);
                  }}
                  className="px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-purple-dark"
                >
                  Update Language
                </button>
              )}
              {!editor.isActive('codeBlock') && (
                <button
                  onClick={insertCodeBlock}
                  className="px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-purple-dark"
                >
                  Insert Code Block
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Editor Content */}
      <div className="relative">
        {isDraggingOverEditor && (
          <div className="absolute inset-0 bg-brand-purple-light/10 border-2 border-dashed border-brand-purple rounded-md z-10 flex items-center justify-center pointer-events-none">
            <div className="bg-white p-3 rounded-md shadow-md">
              <p className="text-brand-purple flex items-center font-medium">
                <UploadIcon size={18} className="mr-2" />
                Drop image to upload
              </p>
            </div>
          </div>
        )}
        {isUploading && (
          <div className="absolute top-4 right-4 bg-white p-2 rounded-md shadow-md z-20 flex items-center">
            <Loader size={16} className="animate-spin mr-2 text-brand-purple" />
            <span className="text-sm text-gray-700">Uploading image...</span>
          </div>
        )}
        
        {/* Image toolbar for editing selected images */}
        {selectedImage && (
          <div className="absolute z-50" style={{
            top: selectedImage.getBoundingClientRect().top - document.querySelector('.ProseMirror')?.getBoundingClientRect().top - 40 + 'px',
            left: selectedImage.getBoundingClientRect().left - document.querySelector('.ProseMirror')?.getBoundingClientRect().left + 'px',
            width: selectedImage.getBoundingClientRect().width + 'px'
          }}>
            <div className="bg-black bg-opacity-75 text-white px-2 py-1 rounded flex gap-2 items-center" style={{ justifyContent: 'center' }}>
              {/* Size controls */}
              <button 
                onClick={() => applyImageChanges({ width: '25%', height: 'auto' })}
                className="p-1 rounded hover:bg-gray-700" 
                title="Small (25% width)"
              >
                <Minimize size={16} />
              </button>
              <button 
                onClick={() => applyImageChanges({ width: '50%', height: 'auto' })}
                className="p-1 rounded hover:bg-gray-700" 
                title="Medium (50% width)"
              >
                <ChevronsLeftRight size={16} />
              </button>
              <button 
                onClick={() => applyImageChanges({ width: '75%', height: 'auto' })}
                className="p-1 rounded hover:bg-gray-700" 
                title="Large (75% width)"
              >
                <MoveHorizontal size={16} />
              </button>
              <button 
                onClick={() => applyImageChanges({ width: '100%', height: 'auto' })}
                className="p-1 rounded hover:bg-gray-700" 
                title="Full width (100%)"
              >
                <Maximize size={16} />
              </button>
              
              <span className="border-r border-gray-500 mx-1 h-6"></span>
              
              {/* Alignment controls */}
              <button 
                onClick={() => applyImageChanges({ alignment: 'left' })}
                className="p-1 rounded hover:bg-gray-700" 
                title="Align Left"
              >
                <AlignLeft size={16} />
              </button>
              <button 
                onClick={() => applyImageChanges({ alignment: 'center' })}
                className="p-1 rounded hover:bg-gray-700" 
                title="Align Center"
              >
                <AlignCenter size={16} />
              </button>
              <button 
                onClick={() => applyImageChanges({ alignment: 'right' })}
                className="p-1 rounded hover:bg-gray-700" 
                title="Align Right"
              >
                <AlignRight size={16} />
              </button>
            </div>
          </div>
        )}
        <EditorContent 
          editor={editor} 
          className={`prose prose-lg max-w-none w-full p-4 min-h-[300px] focus:outline-none editor-content ${editor?.isFocused ? 'editor-focused' : ''}`}
          style={{ maxWidth: "none" }}
          onKeyDown={editor ? handleEditorKeyDown : undefined}
          onDrop={editor ? handleImageDrop : undefined}
          onDragEnter={editor ? handleDragEnter : undefined}
          onDragOver={editor ? handleDragOver : undefined}
          onDragLeave={editor ? handleDragLeave : undefined}
        />
      </div>
      
      {/* Add style tag for consistent formatting with published blog post */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Ensure editor content matches the published blog post */
        .editor-content {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #374151;
          line-height: 1.6;
          width: 100%;
          max-width: 100%;
        }
        
        /* Resizable image handling */
        .editor-content img {
          cursor: pointer;
          transition: box-shadow 0.2s, width 0.2s, height 0.2s;
          margin: 1rem 0;
          max-width: 100%;
          height: auto;
        }
        
        .editor-content img:hover {
          box-shadow: 0 0 0 2px #7633DC;
        }
        
        /* Size presets */
        .editor-content img.image-size-small {
          width: 25%;
        }
        
        .editor-content img.image-size-medium {
          width: 50%;
        }
        
        .editor-content img.image-size-large {
          width: 75%;
        }
        
        .editor-content img.image-size-full {
          width: 100%;
        }
        
        /* Alignment styles */
        .editor-content img[style*="float: left"] {
          margin-right: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .editor-content img[style*="float: right"] {
          margin-left: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .editor-content p:has(img) {
          overflow: hidden; /* Clearfix for floated images */
        }
        
        /* Fix width issues in all prose elements */
        .prose {
          max-width: none;
          width: 100%;
        }
        
        .editor-content h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #111827;
        }
        
        .editor-content h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #111827;
        }
        
        .editor-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          color: #111827;
        }
        
        .editor-content p {
          margin-top: 0;
          margin-bottom: 1.5rem;
        }
        
        /* Add extra space between paragraphs in the editor */
        .editor-content p + p {
          margin-top: 1.5rem;
        }
        
        .editor-content ul, .editor-content ol {
          margin-top: 1rem;
          margin-bottom: 1rem;
          padding-left: 2rem;
        }
        
        .editor-content ul {
          list-style-type: disc;
        }
        
        .editor-content ol {
          list-style-type: decimal;
        }
        
        .editor-content a {
          color: #7633DC;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        
        .editor-content blockquote {
          border-left: 4px solid #E5E7EB;
          margin-left: 0;
          margin-right: 0;
          padding-left: 1rem;
          font-style: italic;
          color: #6B7280;
        }
        
        .editor-content img {
          border-radius: 0.375rem;
          max-width: 100%;
          height: auto;
          margin: 1.5rem auto;
          display: block;
        }
        
        .editor-content hr {
          border: 0;
          height: 1px;
          background-color: #E5E7EB;
          margin-top: 2rem;
          margin-bottom: 2rem;
        }
        
        /* Ensure visible position indicators for text alignment */
        .editor-content .is-editor-empty:first-of-type::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        
        .editor-content .text-align-center {
          text-align: center !important;
        }
        
        .editor-content .text-align-right {
          text-align: right !important;
        }
        
        .editor-content .text-align-left {
          text-align: left !important;
        }
        
        /* Make sure the cursor is visible with text alignment */
        .editor-content .ProseMirror {
          position: relative;
          outline: none;
          word-wrap: break-word;
          white-space: pre-wrap;
          white-space: break-spaces;
          -webkit-font-variant-ligatures: none;
          font-variant-ligatures: none;
          font-feature-settings: "liga" 0;
          width: 100%;
          max-width: 100%;
        }
        
        /* Add styling for paragraphs to ensure proper spacing */
        .editor-content .paragraph-spacing {
          margin-bottom: 1.5rem;
        }
        
        /* Support for newlines within paragraphs */
        .editor-content .ProseMirror p br {
          display: block;
          content: "";
          margin-top: 0.75rem;
        }
        
        /* Extra spacing for empty paragraphs (created by double Enter) */
        .editor-content .ProseMirror p:empty,
        .editor-content .ProseMirror p.paragraph-spacer {
          min-height: 1.5rem;
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        /* This makes sure Enter creates proper paragraph spacing */
        .editor-content .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        
        /* Image alignment classes */
        .editor-content img.float-left {
          float: left;
          margin-right: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .editor-content img.float-right {
          float: right;
          margin-left: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .editor-content img.mx-auto {
          margin-left: auto;
          margin-right: auto;
          display: block;
        }
        
        /* Table styles */
        .editor-content table {
          border-collapse: collapse;
          margin: 1.5rem 0;
          width: 100%;
          table-layout: auto;
          overflow-x: auto;
          display: block;
        }
        
        @media (min-width: 640px) {
          .editor-content table {
            display: table;
            width: 100%;
          }
        }
        
        .editor-content th {
          background-color: #f3f4f6;
          font-weight: 600;
          text-align: left;
          padding: 0.5rem;
          border: 1px solid #e5e7eb;
        }
        
        .editor-content td {
          padding: 0.5rem;
          border: 1px solid #e5e7eb;
          vertical-align: top;
        }
        
        .editor-content tr:nth-child(even) {
          background-color: #f9fafb;
        }
        
        /* Add resizable handles to table cells */
        .editor-content table .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: 0;
          width: 4px;
          background-color: #7633DC;
          cursor: col-resize;
          opacity: 0;
          transition: opacity 0.2s;
        }
        
        .editor-content table:hover .column-resize-handle {
          opacity: 0.3;
        }
        
        .editor-content table .column-resize-handle:hover,
        .editor-content table .column-resize-handle.dragging {
          opacity: 1;
          background-color: #7633DC;
        }
        
        /* Code block styles */
        .editor-content pre {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.375rem;
          overflow-x: auto;
          font-size: 0.875rem;
          line-height: 1.5;
          margin: 1.5rem 0;
        }
        
        .editor-content pre code {
          color: inherit;
          font-size: inherit;
          background: none;
          padding: 0;
          border: none;
          border-radius: 0;
        }
        
        .editor-content code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          background-color: #f3f4f6;
          color: #7633DC;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
        
        /* Ensure code blocks and tables are responsive */
        @media (max-width: 640px) {
          .editor-content pre,
          .editor-content table {
            width: 100%;
            overflow-x: auto;
          }
        }
        
        /* Ensure cursor is visible */
        .ProseMirror {
          caret-color: #000;
          cursor: text;
        }
        
        .ProseMirror:focus {
          outline: none;
          caret-color: #7633DC;
        }
        
        /* Add stronger cursor visibility */
        .ProseMirror .ProseMirror-cursor {
          border-left: 2px solid #7633DC;
          border-right: none;
          margin-left: -1px;
          pointer-events: none;
        }
        
        .ProseMirror .ProseMirror-gapcursor:after {
          border-top: 1px solid #7633DC;
          margin-top: -1px;
          animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
        }
        
        @keyframes ProseMirror-cursor-blink {
          to {
            visibility: hidden;
          }
        }
        
        /* Highlight the editor when focused */
        .editor-focused {
          background-color: #FCFCFF;
          box-shadow: inset 0 0 0 1px rgba(118, 51, 220, 0.1);
        }
      `}} />
    </div>
  );
};

interface ToolbarButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title?: string;
  className?: string;
  activeClassName?: string;
  shortcutKey?: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  onClick,
  isActive = false,
  disabled = false,
  title,
  className = 'p-1.5 text-gray-700 hover:bg-gray-100',
  activeClassName = 'bg-brand-purple-light text-brand-purple',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded ${className} ${isActive ? activeClassName : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {icon}
    </button>
  );
};

export default RichTextEditor;