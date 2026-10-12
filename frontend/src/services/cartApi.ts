import api from "./api";

export interface CartProduct {
  _id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  isActive: boolean;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

export interface Cart {
  id?: string;
  user: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

interface CartResponse {
  success: boolean;
  message: string;
  data: Cart;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`
  };
};

export const getCart = async (): Promise<Cart> => {
  const response = await api.get<CartResponse>(
    "/cart",
    {
      headers: getAuthHeaders()
    }
  );

  return response.data.data;
};

export const addToCart = async (
  productId: string,
  quantity: number
): Promise<Cart> => {
  const response = await api.post<CartResponse>(
    "/cart",
    {
      productId,
      quantity
    },
    {
      headers: getAuthHeaders()
    }
  );

  return response.data.data;
};

export const updateCartItem = async (
  productId: string,
  quantity: number
): Promise<Cart> => {
  const response = await api.patch<CartResponse>(
    `/cart/${productId}`,
    {
      quantity
    },
    {
      headers: getAuthHeaders()
    }
  );

  return response.data.data;
};

export const removeFromCart = async (
  productId: string
): Promise<Cart> => {
  const response = await api.delete<CartResponse>(
    `/cart/${productId}`,
    {
      headers: getAuthHeaders()
    }
  );

  return response.data.data;
};

export const clearCart = async (): Promise<Cart> => {
  const response = await api.delete<CartResponse>(
    "/cart",
    {
      headers: getAuthHeaders()
    }
  );

  return response.data.data;
};