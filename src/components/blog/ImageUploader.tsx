import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { Upload, Crop as CropIcon, Check, X, ImageIcon } from 'lucide-react';
import { BlogService } from '@/services/BlogService';
import 'react-image-crop/dist/ReactCrop.css';

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
  const [isUploading, setIsUploading] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  
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
    setCompletedCrop(null);
  }, [aspectRatio]);
  
  // Get cropped image
  const getCroppedImage = useCallback(() => {
    if (!imgRef.current || !completedCrop) {
      console.error('Cannot crop: image reference or crop data is missing');
      return null;
    }
    
    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Cannot crop: failed to get canvas 2D context');
      return null;
    }
    
    // Ensure numeric dimensions (sometimes these can be percentages)
    const pixelWidth = Math.round(completedCrop.width);
    const pixelHeight = Math.round(completedCrop.height);
    const pixelX = Math.round(completedCrop.x);
    const pixelY = Math.round(completedCrop.y);
    
    if (pixelWidth <= 0 || pixelHeight <= 0) {
      console.error(`Invalid crop dimensions: ${pixelWidth}x${pixelHeight}`);
      return null;
    }
    
    // Set canvas dimensions to match the cropped area
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
    
    try {
      // Draw the cropped image onto the canvas
      ctx.drawImage(
        image,
        pixelX,
        pixelY,
        pixelWidth,
        pixelHeight,
        0,
        0,
        pixelWidth,
        pixelHeight
      );
      
      // Convert canvas to blob
      return new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              console.error('Failed to create blob from canvas');
            }
            resolve(blob);
          },
          'image/jpeg',
          0.95 // Quality
        );
      });
    } catch (error) {
      console.error('Error while cropping image:', error);
      return null;
    }
  }, [completedCrop]);
  
  // Apply crop and upload
  const applyCrop = async () => {
    try {
      if (!postId) {
        console.error('Missing postId - cannot upload image without post ID');
        alert('Cannot upload image: Post ID is missing. Save the post first to enable image uploads.');
        setIsCropping(false);
        return;
      }
      
      if (!uploadedImage) {
        console.error('Missing uploadedImage');
        alert('No image selected for upload.');
        setIsCropping(false);
        return;
      }
      
      const croppedBlob = await getCroppedImage();
      if (!croppedBlob) {
        throw new Error('Failed to crop image - no cropped blob generated');
      }
      
      // Create a File from the Blob
      const file = new File([croppedBlob], 'cropped-image.jpg', { type: 'image/jpeg' });
      
      setIsUploading(true);
      
      // Upload the cropped image
      const imageUrl = await BlogService.uploadImage(file, postId, type);
      
      if (!imageUrl) {
        throw new Error('Image upload failed - no URL returned');
      }
      
      setImage(imageUrl);
      onImageChange(imageUrl);
      setIsCropping(false);
      setUploadedImage(null);
    } catch (error) {
      console.error('Error processing image:', error);
      alert(`Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };
  
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
              onChange={c => setCrop(c)}
              onComplete={c => setCompletedCrop(c)}
              aspect={aspectRatio}
              minHeight={100}
            >
              <img
                ref={imgRef}
                src={uploadedImage || ''}
                alt="Crop preview"
                onLoad={onImageLoad}
                className="max-w-full"
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
                  Uploading...
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