import React, { useState, useRef, useCallback } from 'react';
import { Upload as UploadIcon, X, ImageIcon, Loader, Maximize2, Crop, Check, RotateCcw } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import ReactCrop, { Crop as CropType, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
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
  aspectRatio = 16/9,
  type = 'cover',
}) => {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    
    // Make the crop an initial centered square covering ~80% of the image
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 80,
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
  
  // Apply the current crop to the image
  const applyCurrentCrop = useCallback(() => {
    if (!completedCrop || !imgRef.current || !canvasRef.current || !originalImage) return;
    
    const image = imgRef.current;
    const canvas = canvasRef.current;
    const crop = completedCrop;
    
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to crop dimensions
    canvas.width = crop.width;
    canvas.height = crop.height;
    
    // Draw the cropped image onto the canvas
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
    
    // Convert canvas to data URL
    const croppedImage = canvas.toDataURL('image/jpeg', 0.92);
    setImage(croppedImage);
    onImageChange(croppedImage);
    setShowCrop(false);
  }, [completedCrop, originalImage, onImageChange]);
  
  // Cancel crop operation
  const cancelCrop = useCallback(() => {
    if (originalImage) {
      setImage(originalImage);
      onImageChange(originalImage);
    }
    setShowCrop(false);
  }, [originalImage, onImageChange]);
  
  // Process the selected file
  const processFile = useCallback((file: File) => {
    // Check file size
    if (file.size > 2 * 1024 * 1024) { // 2MB max
      alert('Image is too large. Maximum size is 2MB.');
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
          
          // Set the image and original image (for crop cancellation)
          setOriginalImage(dataUrl);
          setImage(dataUrl);
          onImageChange(dataUrl);
          setIsUploading(false);
          
          // Show crop interface if aspectRatio is provided
          if (aspectRatio) {
            setShowCrop(true);
          }
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
  }, [onImageChange, aspectRatio]);
  
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
      
      {/* Hidden canvas for image processing */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />
      
      <div>
        {showCrop && image ? (
          <div className="space-y-4">
            <div className="relative border border-gray-300 rounded-md p-2 bg-gray-50">
              <h4 className="text-sm font-medium mb-2 text-gray-700 flex items-center">
                <Crop size={16} className="inline mr-2 text-brand-purple" />
                Crop Image
              </h4>
              
              <div className="crop-container">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspectRatio}
                  className="max-h-[400px] mx-auto"
                >
                  <img 
                    ref={imgRef}
                    alt="Crop"
                    src={image}
                    onLoad={onImageLoad}
                    className="max-w-full max-h-[400px]"
                  />
                </ReactCrop>
              </div>
              
              <div className="flex justify-between mt-3">
                <div className="text-xs text-gray-500">
                  Adjust the selection to crop your image. 
                  <br />
                  We recommend a {aspectRatio === 16/9 ? "16:9" : aspectRatio} aspect ratio.
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={cancelCrop}
                    className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded-md text-sm hover:bg-gray-100"
                  >
                    <RotateCcw size={14} className="inline mr-1" />
                    Cancel
                  </button>
                  
                  <button
                    type="button"
                    onClick={applyCurrentCrop}
                    className="px-3 py-1.5 bg-brand-purple text-white rounded-md text-sm hover:bg-brand-purple-dark"
                  >
                    <Check size={14} className="inline mr-1" />
                    Apply Crop
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : image ? (
          <div className="relative group cursor-pointer">
            <OptimizedImage
              src={image}
              alt="Featured"
              className="w-full h-40 rounded-md border border-gray-300"
              objectFit="cover"
              useSrcSet={true}
              withWebp={true}
              onClick={triggerFileInput}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="p-1.5 bg-white rounded-md text-gray-800 hover:bg-brand-purple hover:text-white cursor-pointer"
                  title="Replace image"
                >
                  <UploadIcon size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowCrop(true)}
                  className="p-1.5 bg-white rounded-md text-brand-purple hover:bg-brand-purple hover:text-white cursor-pointer"
                  title="Crop image"
                >
                  <Crop size={18} />
                </button>
                <button
                  type="button"
                  onClick={removeImage}
                  className="p-1.5 bg-white rounded-md text-red-600 hover:bg-red-600 hover:text-white cursor-pointer"
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
                onClick={!isUploading ? triggerFileInput : undefined}
                className={`w-full h-40 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-gray-500 transition-colors
                  ${isDragging 
                    ? 'border-brand-purple bg-brand-purple-light/10 text-brand-purple' 
                    : 'border-gray-300 hover:border-brand-purple hover:text-brand-purple'
                  } ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {isUploading ? (
                  <>
                    <Loader size={24} className="mb-2 animate-spin" />
                    <span className="text-sm font-medium">Processing...</span>
                  </>
                ) : (
                  <>
                    <UploadIcon size={24} className="mb-2" />
                    <span className="text-sm font-medium">
                      {isDragging ? 'Drop image here' : 'Drag & drop or click to upload'}
                    </span>
                    <span className="text-xs mt-1">JPG, PNG, or GIF (max 2MB)</span>
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      disabled={isUploading}
                      className="mt-2 px-4 py-1.5 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 cursor-pointer"
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
      {image && !showCrop && (
        <div className="mt-2 space-y-1">
          <p className="text-xs text-gray-500">
            <strong>Image Preview:</strong> The image above shows exactly how it will appear in the published blog.
          </p>
          <p className="text-xs text-gray-500">
            Tip: Images work best with a 16:9 aspect ratio for cover images. Recommended size: 1200×675px.
            <button 
              onClick={() => setShowCrop(true)}
              className="ml-1 text-brand-purple hover:text-brand-purple-dark underline"
            >
              Crop image
            </button>
          </p>
          <div className="bg-blue-50 p-2 rounded text-xs text-blue-700">
            <strong>New:</strong> We've improved image handling! Your featured image will now maintain consistent quality across all devices.
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;