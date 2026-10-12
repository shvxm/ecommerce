import api from "./api";

// ==============================
// ADMIN DASHBOARD
// ==============================

export interface AdminDashboard {
  users: {
    total: number;
  };

  vendors: {
    total: number;
    approved: number;
    pending: number;
  };

  products: {
    total: number;
    active: number;
  };

  inventory: {
    totalStock: number;
  };

  orders: {
    total: number;
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}

interface DashboardResponse {
  success: boolean;
  message: string;
  data: AdminDashboard;
}


// ==============================
// ADMIN USER TYPES
// ==============================

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;

  role: "USER" | "ADMIN";

  isActive: boolean;

  createdAt?: string;
  updatedAt?: string;
}

interface UsersResponse {
  success: boolean;
  message: string;
  data: AdminUser[];
}

interface UserResponse {
  success: boolean;
  message: string;
  data: AdminUser;
}


// ==============================
// AUTH HEADERS
// ==============================

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});


// ==============================
// DASHBOARD API
// ==============================

export const getAdminDashboard =
  async (): Promise<AdminDashboard> => {

    const response =
      await api.get<DashboardResponse>(
        "/admin/dashboard",
        {
          headers: getAuthHeaders(),
        }
      );

    return response.data.data;
  };


// ==============================
// GET ALL USERS
// ==============================

export const getAdminUsers =
  async (): Promise<AdminUser[]> => {

    const response =
      await api.get<UsersResponse>(
        "/admin/users",
        {
          headers: getAuthHeaders(),
        }
      );

    return response.data.data;
  };


// ==============================
// GET USER BY ID
// ==============================

export const getAdminUserById =
  async (userId: string): Promise<AdminUser> => {

    const response =
      await api.get<UserResponse>(
        `/admin/users/${userId}`,
        {
          headers: getAuthHeaders(),
        }
      );

    return response.data.data;
  };


// ==============================
// UPDATE USER STATUS
// ==============================

export const updateAdminUserStatus =
  async (
    userId: string,
    isActive: boolean
  ): Promise<AdminUser> => {

    const response =
      await api.patch<UserResponse>(
        `/admin/users/${userId}/status`,
        {
          isActive,
        },
        {
          headers: getAuthHeaders(),
        }
      );

    return response.data.data;
  };

  // ==============================
// ADMIN VENDOR TYPES
// ==============================

export interface AdminVendor {
  _id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt?: string;
  updatedAt?: string;
}

interface VendorsResponse {
  success: boolean;
  message: string;
  data: AdminVendor[];
}

interface VendorResponse {
  success: boolean;
  message: string;
  data: AdminVendor;
}


// ==============================
// GET PENDING VENDORS
// ==============================

export const getPendingVendors =
  async (): Promise<AdminVendor[]> => {

    const response =
      await api.get<VendorsResponse>(
        "/admin/vendors/pending",
        {
          headers: getAuthHeaders(),
        }
      );

    return response.data.data;
  };


// ==============================
// APPROVE VENDOR
// ==============================

export const approveVendor =
  async (
    vendorId: string
  ): Promise<AdminVendor> => {

    const response =
      await api.patch<VendorResponse>(
        `/admin/vendors/${vendorId}/approve`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );

    return response.data.data;
  };


// ==============================
// REJECT VENDOR
// ==============================

export const rejectVendor =
  async (
    vendorId: string
  ): Promise<AdminVendor> => {

    const response =
      await api.patch<VendorResponse>(
        `/admin/vendors/${vendorId}/reject`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );

    return response.data.data;
  };

  // ========================================
// ADMIN PRODUCTS
// ========================================

export interface AdminProductCategory {
  _id: string;
  name: string;
}

export interface AdminProductVendor {
  _id: string;
  businessName?: string;
  ownerName?: string;
  email?: string;
}

export interface AdminProduct {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  isActive: boolean;
  category?: AdminProductCategory;
  vendor?: AdminProductVendor;
  createdAt?: string;
  updatedAt?: string;
}

interface AdminProductsResponse {
  success: boolean;
  message: string;
  data: AdminProduct[];
}

interface AdminProductResponse {
  success: boolean;
  message: string;
  data: AdminProduct;
}


// GET ALL PRODUCTS

export const getAdminProducts = async (): Promise<AdminProduct[]> => {

  const response =
    await api.get<AdminProductsResponse>(
      "/products/admin",
      {
        headers: getAuthHeaders()
      }
    );

  return response.data.data;
};


// UPDATE PRODUCT

export const updateAdminProduct = async (
  productId: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    category?: string;
    image?: string;
  }
): Promise<AdminProduct> => {

  const response =
    await api.patch<AdminProductResponse>(
      `/products/admin/${productId}`,
      data,
      {
        headers: getAuthHeaders()
      }
    );

  return response.data.data;
};


// DELETE PRODUCT

export const deleteAdminProduct = async (
  productId: string
): Promise<AdminProduct> => {

  const response =
    await api.delete<AdminProductResponse>(
      `/products/admin/${productId}`,
      {
        headers: getAuthHeaders()
      }
    );

  return response.data.data;
};


// ACTIVATE / DEACTIVATE PRODUCT

export const updateAdminProductStatus = async (
  productId: string,
  isActive: boolean
): Promise<AdminProduct> => {

  const response =
    await api.patch<AdminProductResponse>(
      `/products/admin/${productId}/status`,
      {
        isActive
      },
      {
        headers: getAuthHeaders()
      }
    );

  return response.data.data;
};

// ==================== ADMIN CATEGORIES ====================

export interface AdminCategory {
  _id: string;
  name: string;
  description?: string;
  parentCategory?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AdminCategoriesResponse {
  success: boolean;
  message: string;
  data: AdminCategory[];
}

interface AdminCategoryResponse {
  success: boolean;
  message: string;
  data: AdminCategory;
}

export const getAdminCategories = async (): Promise<AdminCategory[]> => {
  const response = await api.get<AdminCategoriesResponse>(
    "/categories"
  );

  return response.data.data;
};

export const createAdminCategory = async (
  data: {
    name: string;
    description?: string;
  }
): Promise<AdminCategory> => {
  const response = await api.post<AdminCategoryResponse>(
    "/categories",
    data,
    {
      headers: getAuthHeaders()
    }
  );

  return response.data.data;
};

export const updateAdminCategory = async (
  categoryId: string,
  data: {
    name?: string;
    description?: string;
    isActive?: boolean;
  }
): Promise<AdminCategory> => {
  const response = await api.patch<AdminCategoryResponse>(
    `/categories/${categoryId}`,
    data,
    {
      headers: getAuthHeaders()
    }
  );

  return response.data.data;
};

export const deleteAdminCategory = async (
  categoryId: string
): Promise<AdminCategory> => {
  const response = await api.delete<AdminCategoryResponse>(
    `/categories/${categoryId}`,
    {
      headers: getAuthHeaders()
    }
  );

  return response.data.data;
};

// ==================== ADMIN INVENTORY ====================

export interface AdminInventoryItem {
  id: string;
  name: string;
  stock: number;
  category?: {
    _id: string;
    name: string;
  };
  vendor?: {
    _id: string;
    businessName?: string;
    ownerName?: string;
  };
  isActive: boolean;
}

interface AdminInventoryResponse {
  success: boolean;
  message: string;
  data: AdminInventoryItem[];
}

interface AdminInventoryUpdateResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    stock: number;
    vendor?: {
      _id: string;
      businessName?: string;
      ownerName?: string;
    };
  };
}

export const getAdminInventory = async (): Promise<
  AdminInventoryItem[]
> => {
  const response = await api.get<AdminInventoryResponse>(
    "/admin/inventory",
    {
      headers: getAuthHeaders()
    }
  );

  return response.data.data;
};

export const getLowStockProducts = async (
  threshold: number = 10
): Promise<AdminInventoryItem[]> => {
  const response = await api.get<AdminInventoryResponse>(
    `/admin/inventory/low-stock?threshold=${threshold}`,
    {
      headers: getAuthHeaders()
    }
  );

  return response.data.data;
};

export const updateAdminInventory = async (
  productId: string,
  stock: number
) => {
  const response = await api.patch<AdminInventoryUpdateResponse>(
    `/admin/inventory/${productId}`,
    { stock },
    {
      headers: getAuthHeaders()
    }
  );

  return response.data.data;
};

// ==================== ADMIN ORDERS ====================

export interface AdminOrderProduct {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

export interface AdminOrderVendor {
  _id: string;
  businessName?: string;
  ownerName?: string;
}

export interface AdminOrderItem {
  product: AdminOrderProduct;
  vendor: AdminOrderVendor;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface AdminOrderUser {
  _id: string;
  name: string;
  email: string;
}

export interface AdminOrder {
  _id: string;
  user: AdminOrderUser;
  items: AdminOrderItem[];
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

interface AdminOrdersResponse {
  success: boolean;
  message: string;
  data: AdminOrder[];
}

interface AdminOrderResponse {
  success: boolean;
  message: string;
  data: AdminOrder;
}

export const getAdminOrders = async (): Promise<AdminOrder[]> => {
  const response = await api.get<AdminOrdersResponse>(
    "/admin/orders",
    {
      headers: getAuthHeaders()
    }
  );

  return response.data.data;
};

export const getAdminOrderById = async (
  orderId: string
): Promise<AdminOrder> => {
  const response = await api.get<AdminOrderResponse>(
    `/admin/orders/${orderId}`,
    {
      headers: getAuthHeaders()
    }
  );

  return response.data.data;
};

export const updateAdminOrderStatus = async (
  orderId: string,
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
): Promise<AdminOrder> => {
  const response = await api.patch<AdminOrderResponse>(
    `/admin/orders/${orderId}/status`,
    { status },
    {
      headers: getAuthHeaders()
    }
  );

  return response.data.data;
};