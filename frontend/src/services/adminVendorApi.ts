import api from "./api";


// ========================================
// ADMIN VENDOR TYPE
// ========================================

export interface AdminVendor {
  _id: string;

  businessName: string;

  ownerName: string;

  email: string;

  phone: string;

  status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED";

  isActive: boolean;

  createdAt?: string;

  updatedAt?: string;
}


// ========================================
// GET ALL VENDORS RESPONSE
// ========================================

interface VendorsResponse {
  success: boolean;

  message: string;

  data: AdminVendor[];
}


// ========================================
// SINGLE VENDOR RESPONSE
// ========================================

interface VendorResponse {
  success: boolean;

  message: string;

  data: AdminVendor;
}


// ========================================
// GET AUTH TOKEN
// ========================================

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};


// ========================================
// GET ALL VENDORS
// ========================================

export const getAllVendors = async (): Promise<
  AdminVendor[]
> => {
  const response =
    await api.get<VendorsResponse>(
      "/admin/vendors",
      {
        headers: getAuthHeaders(),
      }
    );

  return response.data.data;
};


// ========================================
// GET SINGLE VENDOR
// ========================================

export const getVendorById = async (
  vendorId: string
): Promise<AdminVendor> => {
  const response =
    await api.get<VendorResponse>(
      `/admin/vendors/${vendorId}`,
      {
        headers: getAuthHeaders(),
      }
    );

  return response.data.data;
};


// ========================================
// UPDATE VENDOR ACTIVE STATUS
// ========================================

export const updateVendorStatus = async (
  vendorId: string,
  isActive: boolean
): Promise<AdminVendor> => {
  const response =
    await api.patch<VendorResponse>(
      `/admin/vendors/${vendorId}/status`,
      {
        isActive,
      },
      {
        headers: getAuthHeaders(),
      }
    );

  return response.data.data;
};


export const approveVendor = async (
  vendorId: string
): Promise<AdminVendor> => {
  const response = await api.patch<VendorResponse>(
    `/admin/vendors/${vendorId}/approve`,
    {},
    { headers: getAuthHeaders() }
  );

  return response.data.data;
};
