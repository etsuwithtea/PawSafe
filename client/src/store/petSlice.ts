import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Pet, PetsState } from '../types/pet';

const initialState: PetsState = {
  pets: [],
  filteredPets: [],
  selectedPet: null,
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  filters: {
    status: 'all',
    species: 'all',
    searchQuery: '',
    province: '',
    district: '',
  },
};

const petSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setPets: (state, action: PayloadAction<{ pets: Pet[]; total: number; totalPages: number; page: number }>) => {
      state.pets = action.payload.pets;
      state.filteredPets = action.payload.pets;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.page;
      state.error = null;
    },
    setSelectedPet: (state, action: PayloadAction<Pet | null>) => {
      state.selectedPet = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<'all' | 'available' | 'pending' | 'adopted'>) => {
      state.filters.status = action.payload;
      state.currentPage = 1;
    },
    setSpeciesFilter: (state, action: PayloadAction<'all' | 'dog' | 'cat' | 'other'>) => {
      state.filters.species = action.payload;
      state.currentPage = 1;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setProvinceFilter: (state, action: PayloadAction<string>) => {
      state.filters.province = action.payload;
      state.currentPage = 1;
    },
    setDistrictFilter: (state, action: PayloadAction<string>) => {
      state.filters.district = action.payload;
      state.currentPage = 1;
    },
    addPetToSaved: (state, action: PayloadAction<string>) => {
      const pet = state.pets.find(p => p._id === action.payload);
      if (pet && state.selectedPet?._id === action.payload) {
        state.selectedPet.savedBy = state.selectedPet.savedBy || [];
        if (!state.selectedPet.savedBy.includes(action.payload)) {
          state.selectedPet.savedBy.push(action.payload);
        }
      }
    },
    removePetFromSaved: (state, action: PayloadAction<string>) => {
      const pet = state.pets.find(p => p._id === action.payload);
      if (pet && state.selectedPet?._id === action.payload) {
        state.selectedPet.savedBy = state.selectedPet.savedBy?.filter(id => id !== action.payload) || [];
      }
    },
  },
});

export const {
  setLoading,
  setPets,
  setSelectedPet,
  setError,
  setStatusFilter,
  setSpeciesFilter,
  setSearchQuery,
  setCurrentPage,
  setProvinceFilter,
  setDistrictFilter,
  addPetToSaved,
  removePetFromSaved,
} = petSlice.actions;

export default petSlice.reducer;
