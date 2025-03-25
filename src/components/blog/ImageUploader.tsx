import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { Upload, Crop as CropIcon, Check, X, ImageIcon } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

// Simplified version without using Blob/File objects for storage
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
  aspectRatio = 16 / 9, // Default 16:9 aspect ratio for blog covers
  type = 'cover',
}) => {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        setIsCropping(true);
      };
      
      reader.readAsDataURL(file);
      e.target.value = ''; // Reset for selecting the same file again
    }
  };
  
  // Initialize crop when image loads
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    
    // Center crop with the desired aspect ratio
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspectRatio,
        width,
        height
      ),
      width,
      height
    );
    
    setCrop(crop);
  }, [aspectRatio]);
  
  // Apply crop - using a simpler approach with canvas directly in the component
  const applyCrop = useCallback(() => {
    if (!imgRef.current || !completedCrop) {
      alert('Please select a crop area first');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Create a hidden canvas for the cropping operation
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Get image dimensions
      const image = imgRef.current;
      const imageWidth = image.naturalWidth;
      const imageHeight = image.naturalHeight;
      
      // Calculate crop dimensions based on percentages
      const cropX = (completedCrop.x / 100) * imageWidth;
      const cropY = (completedCrop.y / 100) * imageHeight;
      const cropWidth = (completedCrop.width / 100) * imageWidth;
      const cropHeight = (completedCrop.height / 100) * imageHeight;
      
      // Set canvas size to the cropped area
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      
      // Fill with white background to avoid transparency issues with JPEG
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the cropped portion
      ctx.drawImage(
        image, 
        cropX, 
        cropY, 
        cropWidth, 
        cropHeight, 
        0, 
        0, 
        cropWidth, 
        cropHeight
      );
      
      // Get the data URL (base64 encoded image)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      
      // Set the result image
      setImage(dataUrl);
      onImageChange(dataUrl);
      
      // Reset UI state
      setIsCropping(false);
      setUploadedImage(null);
      
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Failed to crop image: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsUploading(false);
    }
  }, [completedCrop, onImageChange]);
  
  // Cancel cropping
  const cancelCrop = () => {
    setIsCropping(false);
    setUploadedImage(null);
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
      
      {isCropping ? (
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-md">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              minHeight={100}
            >
              <img
                ref={imgRef}
                src={uploadedImage || ''}
                alt="Crop preview"
                onLoad={onImageLoad}
                className="max-w-full"
                crossOrigin="anonymous"
              />
            </ReactCrop>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={cancelCrop}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
            >
              <X size={16} className="mr-1 inline" />
              Cancel
            </button>
            <button
              type="button"
              onClick={applyCrop}
              disabled={isUploading || !completedCrop}
              className="px-3 py-1.5 bg-brand-purple text-white rounded-md hover:bg-brand-purple-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Check size={16} className="mr-1" />
                  Apply Crop
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
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
                    <CropIcon size={18} />
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
                  className="w-full h-40 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:border-brand-purple hover:text-brand-purple transition-colors"
                >
                  <Upload size={24} className="mb-2" />
                  <span className="text-sm font-medium">Click to upload image</span>
                  <span className="text-xs mt-1">JPG, PNG, or GIF</span>
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;