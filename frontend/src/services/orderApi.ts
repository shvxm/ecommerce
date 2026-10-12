import api from "./api";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export type PaymentMethod =
  | "COD"
  | "RAZORPAY";

export interface OrderProduct {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

export interface OrderVendor {
  _id: string;
  businessName?: string;
  ownerName?: string;
}

export interface OrderItem {
  product: OrderProduct;
  vendor: OrderVendor;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  _id: string;

  user: string;

  items: OrderItem[];

  totalAmount: number;

  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

  shippingAddress: ShippingAddress;

  paymentMethod: PaymentMethod;

  paymentStatus:
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED";

  paymentId?: string | null;

  createdAt: string;

  updatedAt: string;
}

const getAuthHeaders = () => ({
  Authorization:
    `Bearer ${localStorage.getItem("token")}`,
});

export const createOrder = async (
  shippingAddress: ShippingAddress,
  paymentMethod: PaymentMethod,
  paymentId?: string
): Promise<Order> => {
  const response =
    await api.post(
      "/orders",
      {
        shippingAddress,
        paymentMethod,
        paymentId,
      },
      {
        headers: getAuthHeaders(),
      }
    );

  return response.data.data;
};

export const getMyOrders =
  async (): Promise<Order[]> => {
    const response =
      await api.get(
        "/orders",
        {
          headers: getAuthHeaders(),
        }
      );

    return response.data.data;
  };

export const getOrderById =
  async (
    orderId: string
  ): Promise<Order> => {
    const response =
      await api.get(
        `/orders/${orderId}`,
        {
          headers: getAuthHeaders(),
        }
      );

    return response.data.data;
  };

export const cancelOrder =
  async (
    orderId: string
  ): Promise<Order> => {
    const response =
      await api.patch(
        `/orders/${orderId}/cancel`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );

    return response.data.data;
  };