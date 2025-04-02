import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, ImageIcon, Loader } from 'lucide-react';

interface ImageUploaderProps {
  initialImage?: string;
  postId?: string;
  onImageChange: (url: string) => void;
  aspectRatio?: number;
  type?: 'cover' | 'content';
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  initialImage,
  postId,
  onImageChange,
  type = 'cover',
}) => {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Process the selected file
  const processFile = useCallback((file: File) => {
    // Check file size
    if (file.size > 3 * 1024 * 1024) { // 3MB max
      alert('Image is too large. Maximum size is 3MB.');
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed.');
      return;
    }
    
    setIsUploading(true);
    
    // Read the file as a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        const dataUrl = event.target.result;
        
        // Create a new image to get dimensions
        const img = new Image();
        img.onload = () => {
          console.log(`Image loaded: ${img.width}x${img.height}`);
          
          // Set the image directly
          setImage(dataUrl);
          onImageChange(dataUrl);
          setIsUploading(false);
        };
        
        img.onerror = () => {
          console.error('Failed to load image');
          alert('Failed to process image. Please try another one.');
          setIsUploading(false);
        };
        
        img.src = dataUrl;
      }
    };
    
    reader.onerror = () => {
      console.error('Error reading file');
      alert('Error reading file. Please try again.');
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  }, [onImageChange]);
  
  // Handle file selection from input
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
      e.target.value = ''; // Reset for selecting the same file again
    }
  }, [processFile]);
  
  // Drag and drop event handlers
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);
  
  // Trigger file input click
  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);
  
  // Remove current image
  const removeImage = useCallback(() => {
    setImage(null);
    onImageChange('');
  }, [onImageChange]);
  
  return (
    <div className="space-y-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div>
        {image ? (
          <div className="relative group">
            <img
              src={image}
              alt="Featured"
              className="w-full h-40 object-cover rounded-md border border-gray-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="p-1.5 bg-white rounded-md text-gray-800 hover:bg-brand-purple hover:text-white"
                  title="Replace image"
                >
                  <Upload size={18} />
                </button>
                <button
                  type="button"
                  onClick={removeImage}
                  className="p-1.5 bg-white rounded-md text-red-600 hover:bg-red-600 hover:text-white"
                  title="Remove image"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {!postId ? (
              <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 bg-gray-50 p-4">
                <ImageIcon size={24} className="mb-2 text-amber-500" />
                <span className="text-sm font-medium text-center">Save the post first to enable image uploads</span>
                <span className="text-xs mt-1 text-center max-w-xs">Click "Save Draft" above to create the post, then you'll be able to add images</span>
              </div>
            ) : (
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full h-40 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-gray-500 transition-colors
                  ${isDragging 
                    ? 'border-brand-purple bg-brand-purple-light/10 text-brand-purple' 
                    : 'border-gray-300 hover:border-brand-purple hover:text-brand-purple'
                  } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isUploading ? (
                  <>
                    <Loader size={24} className="mb-2 animate-spin" />
                    <span className="text-sm font-medium">Processing...</span>
                  </>
                ) : (
                  <>
                    <Upload size={24} className="mb-2" />
                    <span className="text-sm font-medium">
                      {isDragging ? 'Drop image here' : 'Drag & drop or click to upload'}
                    </span>
                    <span className="text-xs mt-1">JPG, PNG, or GIF (max 3MB)</span>
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      disabled={isUploading}
                      className="mt-2 px-4 py-1.5 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                    >
                      Select File
                    </button>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Instructions */}
      {image && (
        <p className="text-xs text-gray-500 mt-2">
          Tip: Images work best with a 16:9 aspect ratio for cover images.
        </p>
      )}
    </div>
  );
};

export default ImageUploader;