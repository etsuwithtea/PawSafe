export interface LostPet {
  _id: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  age?: number;
  gender: 'male' | 'female' | 'unknown';
  status: 'lost' | 'found';
  location: string;
  lostDate: string;
  description: string;
  characteristics: string[];
  images: string[];
  contactUserId: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  savedBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LostPetsState {
  lostPets: LostPet[];
  filteredLostPets: LostPet[];
  selectedLostPet: LostPet | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  filters: {
    status: 'all' | 'lost' | 'found';
    species: 'all' | 'dog' | 'cat' | 'other';
    searchQuery: string;
  };
}
