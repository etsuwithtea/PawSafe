import axios from 'axios';
import type { AppDispatch } from './store';
import { setLoading, setUser, setError } from './authSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const loginUser = (email: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    dispatch(setUser(response.data.user));
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    dispatch(setError(errorMessage));
    throw error;
  }
};

export const signupUser = (
  username: string,
  email: string,
  password: string,
  phone?: string,
  address?: string
) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      username,
      email,
      password,
      phone,
      address,
    });

    dispatch(setUser(response.data.user));
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Signup failed';
    dispatch(setError(errorMessage));
    throw error;
  }
};
