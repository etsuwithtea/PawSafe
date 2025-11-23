export interface Pet {
  _id: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed: string;
  age?: number;
  gender: 'male' | 'female' | 'unknown';
  status: 'available' | 'adopted';
  location: string;
  locationDetails: string;
  description: string;
  characteristics: string[];
  images: string[];
  contactUserId: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  adoptionCount: number;
  savedBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PetsState {
  pets: Pet[];
  filteredPets: Pet[];
  selectedPet: Pet | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  filters: {
    status: 'all' | 'available' | 'adopted';
    species: 'all' | 'dog' | 'cat' | 'other';
    searchQuery: string;
    province: string;
    district: string;
  };
}
