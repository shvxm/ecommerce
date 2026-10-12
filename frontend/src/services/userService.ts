import api from "./api";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
  addresses: Address[];
}

export interface Address {
  _id: string;
  type: "HOME" | "WORK" | "OTHER";
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface AddressInput {
  type: "HOME" | "WORK" | "OTHER";
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

interface ProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

interface AddressesResponse {
  success: boolean;
  message: string;
  data: Address[];
}

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get<ProfileResponse>(
    "/users/profile",
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.data;
};

export const updateProfile = async (
  data: {
    name: string;
    phone: string;
  }
): Promise<UserProfile> => {
  const response = await api.patch<ProfileResponse>(
    "/users/profile",
    data,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.data;
};

export const getAddresses = async (): Promise<Address[]> => {
  const response = await api.get<AddressesResponse>(
    "/users/addresses",
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.data;
};

export const addAddress = async (
  data: AddressInput
): Promise<Address[]> => {
  const response = await api.post<AddressesResponse>(
    "/users/addresses",
    data,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.data;
};

export const updateAddress = async (
  addressId: string,
  data: Partial<AddressInput>
): Promise<Address[]> => {
  const response = await api.patch<AddressesResponse>(
    `/users/addresses/${addressId}`,
    data,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.data;
};

export const deleteAddress = async (
  addressId: string
): Promise<Address[]> => {
  const response = await api.delete<AddressesResponse>(
    `/users/addresses/${addressId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.data;
};

export const setDefaultAddress = async (
  addressId: string
): Promise<Address[]> => {
  const response = await api.patch<AddressesResponse>(
    `/users/addresses/${addressId}/default`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.data;
};