import React, { useState, useEffect, useCallback, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
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
  Loader
} from 'lucide-react';
import { BlogService } from '@/services/BlogService';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  postId?: string;
  onImageUpload?: (url: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = 'Write your content here...',
  postId,
  onImageUpload
}) => {
  console.log('RichTextEditor loaded with simplified version');
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isImageMenuOpen, setIsImageMenuOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Create editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'paragraph-spacing',
          },
        },
      }),
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full rounded-md my-2',
        },
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
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });
  
  // When external value changes, update editor content
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      try {
        editor.commands.setContent(value);
      } catch (error) {
        console.error('Error setting editor content:', error);
      }
    }
  }, [editor, value]);
  
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
  
  // Handle image upload - simplified implementation
  const handleImageUpload = useCallback(async () => {
    if (!editor) {
      console.error('Editor is not initialized');
      alert('Editor is not ready. Please try again.');
      return;
    }
    
    // Insert from URL
    if (imageUrl) {
      try {
        editor.chain().focus().setImage({ src: imageUrl }).run();
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
      
      try {
        setIsUploading(true);
        
        // Add logging to debug
        console.log('Uploading image to postId:', postId);
        
        const uploadedUrl = await BlogService.uploadImage(imageFile, postId, 'content');
        
        // Ensure we got a valid URL back
        if (!uploadedUrl || typeof uploadedUrl !== 'string') {
          throw new Error('Failed to get valid URL from upload service');
        }
        
        editor.chain().focus().setImage({ src: uploadedUrl }).run();
        
        if (onImageUpload) {
          onImageUpload(uploadedUrl);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
      } finally {
        setIsUploading(false);
        setImageFile(null);
        setIsImageMenuOpen(false);
      }
    }
  }, [editor, imageFile, imageUrl, postId, onImageUpload]);
  
  // Open link menu - with safety checks
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
  
  // Open image menu - simple implementation
  const openImageMenu = useCallback(() => {
    setIsImageMenuOpen(true);
    setImageFile(null);
    setImageUrl('');
  }, []);
  
  // Handle image file selection
  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  }, []);
  
  // Simplify image drag-and-drop 
  const handleImageDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    try {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        
        // Check if it's an image
        if (file.type.startsWith('image/')) {
          setImageFile(file);
          setIsImageMenuOpen(true);
        }
      }
    } catch (error) {
      console.error('Error handling image drop:', error);
    }
  }, []);
  
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
      {/* Editor Toolbar */}
      <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-1 items-center">
        <ToolbarButton 
          icon={<Bold size={16} />} 
          isActive={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        />
        <ToolbarButton 
          icon={<Italic size={16} />} 
          isActive={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton 
          icon={<Heading1 size={16} />} 
          isActive={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Heading 1"
        />
        <ToolbarButton 
          icon={<Heading2 size={16} />} 
          isActive={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
        />
        <ToolbarButton 
          icon={<Heading3 size={16} />} 
          isActive={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Heading 3"
        />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton 
          icon={<List size={16} />} 
          isActive={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        />
        <ToolbarButton 
          icon={<ListOrdered size={16} />} 
          isActive={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Ordered List"
        />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton 
          icon={<Quote size={16} />} 
          isActive={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
        />
        <ToolbarButton 
          icon={<Minus size={16} />} 
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton 
          icon={<AlignLeft size={16} />} 
          isActive={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title="Align Left"
        />
        <ToolbarButton 
          icon={<AlignCenter size={16} />} 
          isActive={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title="Align Center"
        />
        <ToolbarButton 
          icon={<AlignRight size={16} />} 
          isActive={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title="Align Right"
        />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton 
          icon={<LinkIcon size={16} />} 
          isActive={editor.isActive('link')}
          onClick={openLinkMenu}
          title="Add Link"
        />
        {postId && (
          <ToolbarButton 
            icon={<ImageIcon size={16} />} 
            onClick={openImageMenu}
            title="Add Image"
          />
        )}
        <div className="ml-auto flex gap-1">
          <ToolbarButton 
            icon={<Undo size={16} />} 
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          />
          <ToolbarButton 
            icon={<Redo size={16} />} 
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
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
      
      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="prose prose-lg max-w-none w-full p-4 min-h-[300px] focus:outline-none editor-content"
        style={{ maxWidth: "none" }}
        onKeyDown={handleEditorKeyDown}
        onDrop={handleImageDrop}
      />
      
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