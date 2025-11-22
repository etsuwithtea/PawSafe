import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LostPet, LostPetsState } from '../types/lostpet';

const initialState: LostPetsState = {
  lostPets: [],
  filteredLostPets: [],
  selectedLostPet: null,
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  filters: {
    status: 'all',
    species: 'all',
    searchQuery: '',
  },
};

const lostPetSlice = createSlice({
  name: 'lostPets',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setLostPets: (state, action: PayloadAction<{ lostPets: LostPet[]; total: number; totalPages: number; page: number }>) => {
      state.lostPets = action.payload.lostPets;
      state.filteredLostPets = action.payload.lostPets;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.page;
      state.error = null;
    },
    setSelectedLostPet: (state, action: PayloadAction<LostPet | null>) => {
      state.selectedLostPet = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<'all' | 'lost' | 'found'>) => {
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
    addLostPetToSaved: (state, action: PayloadAction<string>) => {
      if (state.selectedLostPet) {
        state.selectedLostPet.savedBy.push(action.payload);
      }
    },
    removeLostPetFromSaved: (state, action: PayloadAction<string>) => {
      if (state.selectedLostPet) {
        state.selectedLostPet.savedBy = state.selectedLostPet.savedBy.filter((id) => id !== action.payload);
      }
    },
  },
});

export const {
  setLoading,
  setLostPets,
  setSelectedLostPet,
  setError,
  setStatusFilter,
  setSpeciesFilter,
  setSearchQuery,
  setCurrentPage,
  addLostPetToSaved,
  removeLostPetFromSaved,
} = lostPetSlice.actions;

export default lostPetSlice.reducer;
