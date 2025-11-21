export interface User {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role: string;
  status: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
