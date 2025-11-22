import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, AuthState } from '../types/auth';

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

const loadUserFromStorage = (): User | null => {
  try {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading user from storage:', error);
    return null;
  }
};

const initialStateWithStorage: AuthState = {
  user: loadUserFromStorage(),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialStateWithStorage,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
      localStorage.setItem('auth_user', JSON.stringify(action.payload));
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.isLoading = false;
      localStorage.removeItem('auth_user');
    },
  },
});

export const { setLoading, setUser, setError, clearError, logout } = authSlice.actions;
export default authSlice.reducer;