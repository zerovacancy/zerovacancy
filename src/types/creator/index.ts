/**
 * Creator Types
 * 
 * These types define the creator entities and related components
 */

// Basic creator entity type
export interface Creator {
  id: string;
  name: string;
  location: string;
  services: string[];
  priceRange: string;
  rating: number;
  description: string;
  image: string;
  availability?: AvailabilityStatus;
}

// Type for availability status
export type AvailabilityStatus = 'available' | 'limited' | 'booked';

// Client references type
export interface NotableClient {
  id: string;
  name: string;
  logo?: string;
}

// Re-export more specific creator types
export * from './profile';
export * from './portfolio';
export * from './availability';