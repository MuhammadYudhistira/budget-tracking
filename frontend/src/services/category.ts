import api from '@/api';
import getTokenHeader from '@/utils/getTokenHeader';
import { handleApiError } from '@/utils/handleApiError';

export const fetchAllCategories = async () => {
  try {
    const response = await api.get('/category', {
      headers: getTokenHeader(),
    });

    return response?.data;
  } catch (error) {
    handleApiError(error, 'failed to fetch categories');
  }
};

export const fetchAllCategoriesById = async (id: number) => {
  try {
    const response = await api.get(`category/${id}`, {
      headers: getTokenHeader(),
    });

    return response?.data;
  } catch (error) {
    handleApiError(error, 'failed to fetch categories by id');
  }
};

export const createCategory = async (data: {
  name: string;
  description?: string;
}) => {
  try {
    const response = await api.post(`category`, data, {
      headers: getTokenHeader(),
    });

    return response?.data;
  } catch (error) {
    handleApiError(error, 'failed to create category');
  }
};

export const updateCategory = async (
  id: number,
  data: {
    name: string;
    description?: string;
  }
) => {
  try {
    const response = await api.put(`category/${id}`, data, {
      headers: getTokenHeader(),
    });

    return response?.data;
  } catch (error) {
    handleApiError(error, 'failed to update categories by id');
  }
};

export const deleteCategory = async (id: number) => {
  try {
    const response = await api.delete(`category/${id}`, {
      headers: getTokenHeader(),
    });

    return response?.data;
  } catch (error) {
    handleApiError(error, 'failed to delete categories by id');
  }
};
