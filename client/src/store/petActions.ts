import axios from 'axios';
import type { AppDispatch } from './store';
import {
  setLoading,
  setPets,
  setSelectedPet,
  setError,
  addPetToSaved,
  removePetFromSaved,
} from './petSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchPets = (
  status: string = 'all',
  species: string = 'all',
  search: string = '',
  page: number = 1,
  province: string = '',
  district: string = '',
  limit: number = 12
) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const params = new URLSearchParams();
    if (status !== 'all') params.append('status', status);
    if (species !== 'all') params.append('species', species);
    if (search.trim()) params.append('search', search);
    if (province.trim()) params.append('province', province);
    if (district.trim()) params.append('district', district);
    params.append('page', String(page));
    params.append('limit', String(limit));

    const response = await axios.get(`${API_URL}/pets?${params.toString()}`);

    dispatch(
      setPets({
        pets: response.data.data,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
        page: response.data.pagination.page,
      })
    );
    dispatch(setError(''));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch pets';
    dispatch(setError(errorMessage));
    console.error('Fetch pets error:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchPetById = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`${API_URL}/pets/${id}`);
    dispatch(setSelectedPet(response.data.data));
    dispatch(setError(''));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch pet';
    dispatch(setError(errorMessage));
    console.error('Fetch pet error:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const createPet = (petData: any) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post(`${API_URL}/pets`, petData);
    dispatch(setError(''));
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to create pet';
    dispatch(setError(errorMessage));
    console.error('Create pet error:', error);
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const updatePet = (id: string, petData: any) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.put(`${API_URL}/pets/${id}`, petData);
    dispatch(setSelectedPet(response.data.data));
    dispatch(setError(''));
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to update pet';
    dispatch(setError(errorMessage));
    console.error('Update pet error:', error);
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const deletePet = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    await axios.delete(`${API_URL}/pets/${id}`);
    dispatch(setSelectedPet(null));
    dispatch(setError(''));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to delete pet';
    dispatch(setError(errorMessage));
    console.error('Delete pet error:', error);
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const savePet = (petId: string, userId: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.post(`${API_URL}/pets/${petId}/save`, { userId });
    dispatch(setSelectedPet(response.data.data));
    dispatch(addPetToSaved(userId));
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to save pet';
    dispatch(setError(errorMessage));
    console.error('Save pet error:', error);
    throw error;
  }
};

export const unsavePet = (petId: string, userId: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.post(`${API_URL}/pets/${petId}/unsave`, { userId });
    dispatch(setSelectedPet(response.data.data));
    dispatch(removePetFromSaved(userId));
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to unsave pet';
    dispatch(setError(errorMessage));
    console.error('Unsave pet error:', error);
    throw error;
  }
};
