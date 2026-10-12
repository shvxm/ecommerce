import api from "./api";

export interface Category {
  _id: string;
  name: string;
  description?: string;
  parentCategory?: string | null;
  isActive: boolean;
}

interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<CategoryResponse>(
    "/categories"
  );

  return response.data.data;
};