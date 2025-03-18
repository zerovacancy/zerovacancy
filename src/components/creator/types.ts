
/**
 * Creator Types
 */

export interface Creator {
  name: string;
  services: string[];
  price: number;
  rating: number;
  reviews: number;
  location: string;
  image: string;
  workExamples: string[];
  availabilityStatus?: 'available-now' | 'available-tomorrow' | 'premium-only';
}

export interface CreatorCardProps {
  creator: Creator;
  onImageLoad: (imageSrc: string) => void;
  loadedImages: Set<string>;
  imageRef: (node: HTMLImageElement | null) => void;
  onPreviewClick?: (imageSrc: string) => void;
  className?: string;
  style?: React.CSSProperties;
}
