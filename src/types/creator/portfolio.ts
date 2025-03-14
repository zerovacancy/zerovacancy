/**
 * Creator Portfolio Types
 */

import { Creator, NotableClient } from './index';

// Portfolio item
export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  videoUrl?: string;
  client?: NotableClient;
  date: string;
  tags?: string[];
}

// Full portfolio
export interface CreatorPortfolio {
  creatorId: string;
  items: PortfolioItem[];
  notableClients: NotableClient[];
}

// Portfolio component props
export interface PortfolioGalleryProps {
  portfolio: PortfolioItem[];
  className?: string;
}

// Portfolio preview props
export interface PortfolioPreviewProps {
  items: PortfolioItem[];
  className?: string;
  maxItems?: number;
}

// Gallery item props
export interface GalleryItemProps {
  item: PortfolioItem;
  className?: string;
  onClick?: () => void;
}