import api from "./api";

export interface ProductCategory {
  _id: string;
  name: string;
}

export interface ProductVendor {
  _id: string;
  businessName?: string;
  ownerName?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  isActive: boolean;
  category?: ProductCategory;
  vendor?: ProductVendor;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductResponse {
  success: boolean;
  message: string;
  data: Product[];
}

export const getProducts = async (
  params?: Record<string, string>
): Promise<Product[]> => {
  const response = await api.get<ProductResponse>(
    "/products",
    {
      params
    }
  );

  return response.data.data;
};

export const getProductById = async (
  id: string
): Promise<Product> => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: Product;
  }>(
    `/products/${id}`
  );

  return response.data.data;
};