import api from "./api";

export interface Vendor {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  role: "VENDOR";
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface VendorLoginData {
  email: string;
  password: string;
}

export interface VendorLoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    vendor: Vendor;
  };
}

export interface VendorProfile {
  _id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt?: string;
  updatedAt?: string;
}

export interface VendorProfileResponse {
  success: boolean;
  message: string;
  data: VendorProfile;
}

export interface VendorOrderProduct {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

export interface VendorOrderUser {
  _id: string;
  name: string;
  email: string;
}

export interface VendorOrderItem {
  product: VendorOrderProduct;
  vendor: {
    _id: string;
    businessName?: string;
    ownerName?: string;
  };
  quantity: number;
  price: number;
  subtotal: number;
}

export interface VendorOrder {
  _id: string;
  user: VendorOrderUser;
  items: VendorOrderItem[];
  totalAmount: number;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface VendorOrdersResponse {
  success: boolean;
  message: string;
  data: VendorOrder[];
}

export interface UpdateVendorOrderStatusResponse {
  success: boolean;
  message: string;
  data: VendorOrder;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("vendorToken");

  return {
    Authorization: `Bearer ${token}`
  };
};

export const loginVendor = async (
  data: VendorLoginData
) => {
  const response =
    await api.post<VendorLoginResponse>(
      "/vendors/login",
      data
    );

  return response.data;
};

export const getVendorProfile =
  async (): Promise<VendorProfile> => {
    const response =
      await api.get<VendorProfileResponse>(
        "/vendors/profile",
        {
          headers: getAuthHeaders()
        }
      );

    return response.data.data;
  };

export const getVendorOrders =
  async (): Promise<VendorOrder[]> => {
    const response =
      await api.get<VendorOrdersResponse>(
        "/vendors/orders",
        {
          headers: getAuthHeaders()
        }
      );

    return response.data.data;
  };

export const updateVendorOrderStatus =
  async (
    orderId: string,
    status:
      | "CONFIRMED"
      | "PROCESSING"
      | "SHIPPED"
      | "DELIVERED"
  ): Promise<VendorOrder> => {

    const response =
      await api.patch<UpdateVendorOrderStatusResponse>(
        `/vendors/orders/${orderId}/status`,
        {
          status
        },
        {
          headers: getAuthHeaders()
        }
      );

    return response.data.data;
  };

  export interface VendorDashboard {
  totalProducts: number;
  totalStock: number;
  totalOrders: number;

  orderStatus: {
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}

export interface VendorDashboardResponse {
  success: boolean;
  message: string;
  data: VendorDashboard;
}

export const getVendorDashboard =
  async (): Promise<VendorDashboard> => {

    const response =
      await api.get<VendorDashboardResponse>(
        "/vendors/dashboard",
        {
          headers: getAuthHeaders()
        }
      );

    return response.data.data;
  };