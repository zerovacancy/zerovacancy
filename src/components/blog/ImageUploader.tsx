import React, { useState, useRef } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
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
            
            // Set the image directly (no cropping)
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
      e.target.value = ''; // Reset for selecting the same file again
    }
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  // Remove current image
  const removeImage = () => {
    setImage(null);
    onImageChange('');
  };
  
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
                >
                  <Upload size={18} />
                </button>
                <button
                  type="button"
                  onClick={removeImage}
                  className="p-1.5 bg-white rounded-md text-red-600 hover:bg-red-600 hover:text-white"
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
              <button
                type="button"
                onClick={triggerFileInput}
                disabled={isUploading}
                className="w-full h-40 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:border-brand-purple hover:text-brand-purple transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-gray-400 border-t-brand-purple rounded-full animate-spin mb-2"></div>
                    <span className="text-sm font-medium">Processing...</span>
                  </>
                ) : (
                  <>
                    <Upload size={24} className="mb-2" />
                    <span className="text-sm font-medium">Click to upload image</span>
                    <span className="text-xs mt-1">JPG, PNG, or GIF (max 3MB)</span>
                  </>
                )}
              </button>
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