export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  shortDescription: string;
  imageUrl: string;
  tags: string[];
  inStock: boolean;
  rating: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  icon: string;
}
