import axios from 'axios';
import type { AppDispatch } from './store';
import {
  setLoading,
  setLostPets,
  setSelectedLostPet,
  setError,
  addLostPetToSaved,
  removeLostPetFromSaved,
} from './lostPetSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchLostPets = (
  status: string = 'all',
  species: string = 'all',
  search: string = '',
  page: number = 1,
  limit: number = 12
) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const params = new URLSearchParams();
    if (status !== 'all') params.append('status', status);
    if (species !== 'all') params.append('species', species);
    if (search.trim()) params.append('search', search);
    params.append('page', String(page));
    params.append('limit', String(limit));

    const response = await axios.get(`${API_URL}/lost-pets?${params.toString()}`);

    dispatch(
      setLostPets({
        lostPets: response.data.data,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
        page: response.data.pagination.page,
      })
    );
    dispatch(setError(''));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch lost pets';
    dispatch(setError(errorMessage));
    console.error('Fetch lost pets error:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchLostPetById = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`${API_URL}/lost-pets/${id}`);
    dispatch(setSelectedLostPet(response.data.data));
    dispatch(setError(''));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch lost pet';
    dispatch(setError(errorMessage));
    console.error('Fetch lost pet error:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const createLostPet = (lostPetData: any) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post(`${API_URL}/lost-pets`, lostPetData);
    dispatch(setError(''));
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to create lost pet';
    dispatch(setError(errorMessage));
    console.error('Create lost pet error:', error);
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateLostPet = (id: string, lostPetData: any) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.put(`${API_URL}/lost-pets/${id}`, lostPetData);
    dispatch(setSelectedLostPet(response.data.data));
    dispatch(setError(''));
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to update lost pet';
    dispatch(setError(errorMessage));
    console.error('Update lost pet error:', error);
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteLostPet = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    await axios.delete(`${API_URL}/lost-pets/${id}`);
    dispatch(setSelectedLostPet(null));
    dispatch(setError(''));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to delete lost pet';
    dispatch(setError(errorMessage));
    console.error('Delete lost pet error:', error);
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const saveLostPet = (lostPetId: string, userId: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.post(`${API_URL}/lost-pets/${lostPetId}/save`, { userId });
    dispatch(setSelectedLostPet(response.data.data));
    dispatch(addLostPetToSaved(userId));
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to save lost pet';
    dispatch(setError(errorMessage));
    console.error('Save lost pet error:', error);
    throw error;
  }
};

export const unsaveLostPet = (lostPetId: string, userId: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.post(`${API_URL}/lost-pets/${lostPetId}/unsave`, { userId });
    dispatch(setSelectedLostPet(response.data.data));
    dispatch(removeLostPetFromSaved(userId));
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to unsave lost pet';
    dispatch(setError(errorMessage));
    console.error('Unsave lost pet error:', error);
    throw error;
  }
};
