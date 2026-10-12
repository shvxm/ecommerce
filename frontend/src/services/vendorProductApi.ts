import api from "./api";


// ========================================
// TYPES
// ========================================

export interface VendorProductCategory {
  _id: string;
  name: string;
}


export interface VendorProduct {
  _id: string;

  name: string;

  description: string;

  price: number;

  stock: number;

  image?: string;

  isActive: boolean;

  category?: VendorProductCategory;

  createdAt?: string;

  updatedAt?: string;
}


export interface CreateProductData {
  name: string;

  description: string;

  price: number;

  stock: number;

  category: string;

  image?: string;
}


export interface UpdateProductData {
  name?: string;

  description?: string;

  price?: number;

  stock?: number;

  category?: string;

  image?: string;

  isActive?: boolean;
}


interface ProductsResponse {
  success: boolean;

  message: string;

  data: VendorProduct[];
}


interface ProductResponse {
  success: boolean;

  message: string;

  data: VendorProduct;
}


// ========================================
// AUTH HEADER
// ========================================

const getAuthHeaders = () => {

  const token =
    localStorage.getItem("vendorToken");

  return {
    Authorization: `Bearer ${token}`
  };

};


// ========================================
// GET VENDOR PRODUCTS
// ========================================

export const getVendorProducts =
  async (): Promise<VendorProduct[]> => {

    const response =
      await api.get<ProductsResponse>(
        "/products/vendor",
        {
          headers: getAuthHeaders()
        }
      );

    return response.data.data;

  };


// ========================================
// CREATE PRODUCT
// ========================================

export const createVendorProduct =
  async (
    data: CreateProductData
  ): Promise<VendorProduct> => {

    const response =
      await api.post<ProductResponse>(
        "/products",
        data,
        {
          headers: getAuthHeaders()
        }
      );

    return response.data.data;

  };


// ========================================
// UPDATE PRODUCT
// ========================================

export const updateVendorProduct =
  async (
    productId: string,
    data: UpdateProductData
  ): Promise<VendorProduct> => {

    const response =
      await api.patch<ProductResponse>(
        `/products/${productId}`,
        data,
        {
          headers: getAuthHeaders()
        }
      );

    return response.data.data;

  };


// ========================================
// DELETE PRODUCT
// ========================================

export const deleteVendorProduct =
  async (
    productId: string
  ): Promise<VendorProduct> => {

    const response =
      await api.delete<ProductResponse>(
        `/products/${productId}`,
        {
          headers: getAuthHeaders()
        }
      );

    return response.data.data;

  };