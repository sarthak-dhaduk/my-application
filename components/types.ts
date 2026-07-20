export interface Product {
  id: string;
  name: string;
  description: string;
  unitPrice: number;
  packSize: number; // Wholesale items are sold in packs
  moq: number; // Minimum Order Quantity in packs
  stock: number;
  rating: number;
  icon: string;
  category: string;
  subCategory: string;
  tags: string[];
  image?: any;       // Local asset reference (e.g. require(...))
  images?: any[];    // Local gallery assets reference array
  badge?: 'best-seller' | 'offer' | 'new-collection' | null;
  offerPercentage?: number;
}

export interface Category {
  id: string;
  name: string;
  label: string;
  icon: string;
  itemCount: number;
  bannerBg: string;
  heroBg: any;
}

export interface Cart {
  [productId: string]: number;
}

export type TabType = 'home' | 'catalog' | 'cart' | 'contact' | 'profile';
