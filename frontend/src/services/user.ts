import api from '@/api';
import { handleApiError } from '@/utils/handleApiError';
import getTokenHeader from '@/utils/getTokenHeader';

export const fetchAllUser = async () => {
  try {
    const res = await api.get('/users', {
      headers: getTokenHeader(),
    });
    return res.data;
  } catch (error) {
    handleApiError(error, 'User fetch failed');
  }
};

export const fetchUserById = async (id: number) => {
  try {
    const res = await api.get(`/users/${id}`, {
      headers: getTokenHeader(),
    });
    return res.data;
  } catch (error) {
    handleApiError(error, 'User fetch failed');
  }
};

export const createUser = async (data: Record<string, unknown>) => {
  try {
    const res = await api.post('/users', data, {
      headers: getTokenHeader(),
    });
    return res.data;
  } catch (error) {
    handleApiError(error, 'User fetch failed');
  }
};

export const updateUser = async (id: number, data: Record<string, unknown>) => {
  try {
    const res = await api.put(`/users/${id}`, data, {
      headers: getTokenHeader(),
    });
    return res.data;
  } catch (error) {
    handleApiError(error, 'User fetch failed');
  }
};

export const deleteUser = async (id: number) => {
  try {
    const res = await api.delete(`/users/${id}`, {
      headers: getTokenHeader(),
    });
    return res.data;
  } catch (error) {
    handleApiError(error, 'User fetch failed');
  }
};
