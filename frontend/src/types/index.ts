export interface Category {
  _id: string;
  name: string;
}

export interface Vendor {
  _id: string;
  businessName: string;
  ownerName: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
  vendor: Vendor;
  image: string;
  isActive: boolean;
  createdAt?: string;
}