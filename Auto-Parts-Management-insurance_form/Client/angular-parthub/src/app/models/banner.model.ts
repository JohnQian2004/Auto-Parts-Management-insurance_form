/**
 * Banner Product Model
 * Represents a product displayed within a banner
 */
export interface BannerProduct {
  id?: number;
  name: string;
  imageUrl: string;
  altText?: string;
  displayOrder: number;
}

/**
 * Banner Model
 * Represents an advertising banner displayed on various pages
 * 
 * NOTE: This interface supports two banner types:
 * 1. Legacy banners (title + content) - used by existing banner management
 * 2. New product banners (companyName + products) - used by home/register sidebars
 */
export class Banner {
  id?: any = 0;
  
  // Legacy properties (for existing banner component)
  title?: string = "";
  content?: string;
  userId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  active?: any = 0;

  // New properties (for product banners)
  companyName?: string;
  tagline?: string;
  url?: string;
  promotionalText?: string;
  additionalText?: string;
  buttonText?: string;
  buttonColor?: string; // CSS color or class name
  headerBackground?: string; // CSS gradient or color
  headerStyle?: string; // Additional inline styles
  position?: 'left' | 'right';
  domain?: 'partslinks' | 'baycounter' | 'shared';
  page?: 'home' | 'home2' | 'register' | 'all';
  displayOrder?: number;
  products?: BannerProduct[];
}