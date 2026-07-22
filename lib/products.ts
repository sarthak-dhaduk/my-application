export interface ProductSpecification {
  paragraph: string;
  points: string[];
}

export interface NewProduct {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  badges: string[];
  rootImage: any;
  images: any[];
  category: string;
  brand: string;
  rating: number;
  tag: 'Best Seller' | 'New Stock';
  offer?: number;
  price: number;
  specification: ProductSpecification;
}
