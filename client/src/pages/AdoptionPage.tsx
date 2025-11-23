import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  fetchPets,
} from '../store/petActions';
import {
  setSearchQuery,
  setCurrentPage,
  setSpeciesFilter,
} from '../store/petSlice';
import PetCard from '../components/PetCard';

export default function AdoptionPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { pets, isLoading, filters, currentPage, totalPages } = useAppSelector(
    (state) => state.pets
  );
  const [searchInput, setSearchInput] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [uniqueProvinces, setUniqueProvinces] = useState<string[]>([]);
  const [uniqueDistricts, setUniqueDistricts] = useState<string[]>([]);
  const [speciesCounts, setSpeciesCounts] = useState<Record<string, number>>({});
  const [provinceCounts, setProvinceCounts] = useState<Record<string, number>>({});
  const [districtCounts, setDistrictCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        fetchPets(filters.status, filters.species, filters.searchQuery, currentPage) as any
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.status, filters.species, filters.searchQuery, currentPage, dispatch]);

  const handleSearch = () => {
    dispatch(setSearchQuery(searchInput));
  };

  useEffect(() => {
    const fetchPetsForLocations = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/pets?limit=1000`
        );
        const data = await response.json();
        
        const provinces = new Set<string>();
        const districts = new Set<string>();
        const pSpeciesCounts: Record<string, number> = { dog: 0, cat: 0, other: 0 };
        const pProvinceCounts: Record<string, number> = {};
        const pDistrictCounts: Record<string, number> = {};
        
        data.data.forEach((pet: any) => {
          if (pet.species) {
            pSpeciesCounts[pet.species] = (pSpeciesCounts[pet.species] || 0) + 1;
          }
          
          if (pet.location) {
            const [district, province] = pet.location.split(', ');
            if (province) {
              provinces.add(province);
              pProvinceCounts[province] = (pProvinceCounts[province] || 0) + 1;
            }
            if (district) {
              districts.add(district);
              pDistrictCounts[district] = (pDistrictCounts[district] || 0) + 1;
            }
          }
        });
        
        setUniqueProvinces(Array.from(provinces).sort());
        setUniqueDistricts(Array.from(districts).sort());
        setSpeciesCounts(pSpeciesCounts);
        setProvinceCounts(pProvinceCounts);
        setDistrictCounts(pDistrictCounts);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchPetsForLocations();
  }, []);

  return (
    <div style={{ backgroundColor: '#FFFDFA' }} className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ fontFamily: 'Anuphan', color: '#FFA600' }}
          >
            ตามหาบ้าน
          </h1>
        </div>

        {user && (
          <div className="text-center mb-8">
            <Link
              to="/add-pet?type=adoption"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors duration-200 text-base"
              style={{ fontFamily: 'Poppins, Anuphan' }}
            >
              <span>+</span> โพสต์ตามหาบ้าน
            </Link>
          </div>
        )}

        <div className="mb-8 flex flex-col lg:flex-row gap-4 items-center justify-start">
          <div className="w-full lg:flex-1">
            <input
              type="text"
              placeholder="ค้นหาสัตว์เลี้ยง..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              style={{ fontFamily: 'Poppins, Anuphan' }}
            />
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-700" style={{ fontFamily: 'Poppins, Anuphan' }}>
                จังหวัด :
              </span>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="px-4 py-2 rounded-full font-bold text-sm bg-black text-white border-none focus:outline-none"
                style={{ fontFamily: 'Poppins, Anuphan' }}
              >
                <option value="">เลือกจังหวัด</option>
                {uniqueProvinces.map((province) => (
                  <option key={province} value={province}>
                    {province} ({provinceCounts[province] || 0})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-700" style={{ fontFamily: 'Poppins, Anuphan' }}>
                อำเภอ :
              </span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-4 py-2 rounded-full font-bold text-sm bg-black text-white border-none focus:outline-none"
                style={{ fontFamily: 'Poppins, Anuphan' }}
              >
                <option value="">เลือกอำเภอ</option>
                {uniqueDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district} ({districtCounts[district] || 0})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-700" style={{ fontFamily: 'Poppins, Anuphan' }}>
                ประเภท :
              </span>
              <select
                value={filters.species}
                onChange={(e) => dispatch(setSpeciesFilter(e.target.value as any))}
                className="px-4 py-2 rounded-full font-bold text-sm bg-black text-white border-none focus:outline-none"
                style={{ fontFamily: 'Poppins, Anuphan' }}
              >
                <option value="all">ทั้งหมด ({speciesCounts.dog + speciesCounts.cat + speciesCounts.other})</option>
                <option value="dog">สุนัข ({speciesCounts.dog || 0})</option>
                <option value="cat">แมว ({speciesCounts.cat || 0})</option>
                <option value="other">อื่นๆ ({speciesCounts.other || 0})</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            <p className="mt-4 text-gray-600" style={{ fontFamily: 'Poppins, Anuphan' }}>
              กำลังโหลด...
            </p>
          </div>
        )}

        {!isLoading && pets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg" style={{ fontFamily: 'Poppins, Anuphan' }}>
              ไม่พบสัตว์เลี้ยงที่ตรงกับการค้นหา
            </p>
          </div>
        )}

        {!isLoading && pets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {pets.map((pet) => (
              <PetCard key={pet._id} pet={pet} />
            ))}
          </div>
        )}

        {!isLoading && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => dispatch(setCurrentPage(currentPage - 1))}
              disabled={currentPage === 1}
              className="px-6 py-2 bg-orange-400 text-black font-bold rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Poppins, Anuphan' }}
            >
              ◀
            </button>

            <div className="flex items-center gap-2">
              <span className="text-lg font-bold" style={{ fontFamily: 'Anuphan' }}>
                {currentPage}
              </span>
              <span className="text-gray-600">/</span>
              <span className="text-lg font-bold" style={{ fontFamily: 'Anuphan' }}>
                {totalPages}
              </span>
            </div>

            <button
              onClick={() => dispatch(setCurrentPage(currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-6 py-2 bg-orange-400 text-black font-bold rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Poppins, Anuphan' }}
            >
              ▶
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
