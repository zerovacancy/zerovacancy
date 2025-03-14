/**
 * Creator Profile Types
 */

// Import core types
import { Creator } from './index';

// Extended profile information
export interface CreatorProfile extends Creator {
  bio: string;
  specialties: string[];
  experience: number; // Years
  education?: string[];
  certifications?: string[];
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

// Profile component props
export interface CreatorProfileProps {
  creator: CreatorProfile;
  className?: string;
}

// Creator info section props
export interface CreatorInfoProps {
  creator: Creator;
  className?: string;
  showRating?: boolean;
}

// Creator card props
export interface CreatorCardProps {
  creator: Creator;
  className?: string;
  onClick?: () => void;
  featured?: boolean;
}