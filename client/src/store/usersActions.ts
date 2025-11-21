import axios from 'axios';
import type { AppDispatch } from './store';
import { setLoading, setUsers, addUser, updateUser, deleteUser, setError } from './usersSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchUsers = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`${API_URL}/users`);
    dispatch(setUsers(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch users';
    dispatch(setError(errorMessage));
  }
};

export const createUserAction = (
  username: string,
  email: string,
  password: string,
  phone?: string,
  address?: string,
  role?: string,
  status?: string
) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post(`${API_URL}/users`, {
      username,
      email,
      password,
      phone,
      address,
      role,
      status,
    });
    dispatch(addUser(response.data.user));
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to create user';
    dispatch(setError(errorMessage));
    throw error;
  }
};

export const updateUserAction = (
  id: string,
  username?: string,
  email?: string,
  phone?: string,
  address?: string,
  role?: string,
  status?: string
) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.put(`${API_URL}/users/${id}`, {
      username,
      email,
      phone,
      address,
      role,
      status,
    });
    dispatch(updateUser(response.data.user));
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to update user';
    dispatch(setError(errorMessage));
    throw error;
  }
};

export const deleteUserAction = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    await axios.delete(`${API_URL}/users/${id}`);
    dispatch(deleteUser(id));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to delete user';
    dispatch(setError(errorMessage));
    throw error;
  }
};
