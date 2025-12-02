import { useEffect, useState } from 'react';
import { useAppSelector } from '../store/store';
import PetCard from '../components/PetCard';
import LostPetCard from '../components/LostPetCard';
import Toast, { useToast } from '../components/Toast';
import { Heart } from 'lucide-react';
import type { Pet } from '../types/pet';
import type { LostPet } from '../types/lostpet';

export default function FavoritesPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { toasts, showToast, removeToast } = useToast();
  const [activeTab, setActiveTab] = useState<'adoption' | 'lost'>('adoption');
  const [adoptionFavorites, setAdoptionFavorites] = useState<Pet[]>([]);
  const [lostPetFavorites, setLostPetFavorites] = useState<LostPet[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAdoptionFavorites = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/pets?limit=1000`
        );
        const data = await response.json();
        
        if (user && data.data) {
          const userFavorites = data.data.filter((pet: Pet) =>
            pet.savedBy.includes(user._id)
          );
          setAdoptionFavorites(userFavorites);
        }
      } catch (error) {
        console.error('Error fetching adoption favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAdoptionFavorites();
    }
  }, [user]);

  useEffect(() => {
    const fetchLostPetFavorites = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/lost-pets?limit=1000`
        );
        const data = await response.json();
        
        if (user && data.data) {
          const userFavorites = data.data.filter((lostPet: LostPet) =>
            lostPet.savedBy.includes(user._id)
          );
          setLostPetFavorites(userFavorites);
        }
      } catch (error) {
        console.error('Error fetching lost pet favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchLostPetFavorites();
    }
  }, [user]);

  const totalFavorites = adoptionFavorites.length + lostPetFavorites.length;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">กรุณาเข้าสู่ระบบเพื่อดูสมุดบันทึก</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" style={{ fontFamily: 'Poppins, Anuphan' }}>
      <Toast toasts={toasts} onRemove={removeToast} />
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2" style={{ color: '#FFA600' }}>สมุดบันทึก</h1>
          <p className="text-gray-600">
            {totalFavorites} สัตว์ในสมุดบันทึก
          </p>
        </div>

        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setActiveTab('adoption')}
            className="px-8 py-3 text-white bg-black rounded-md hover:bg-gray-800 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 text-sm cursor-pointer font-bold"
            style={{ fontFamily: 'Poppins, Anuphan' }}
          >
            ตามหาบ้าน ({adoptionFavorites.length})
          </button>
          <button
            onClick={() => setActiveTab('lost')}
            className="px-8 py-3 text-white bg-black rounded-md hover:bg-gray-800 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 text-sm cursor-pointer font-bold"
            style={{ fontFamily: 'Poppins, Anuphan' }}
          >
            ตามหาสัตว์หาย ({lostPetFavorites.length})
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : activeTab === 'adoption' ? (
          <>
            {adoptionFavorites.length === 0 ? (
              <div className="text-center py-16">
                <Heart size={64} className="mx-auto text-gray-300 mb-4" strokeWidth={1} />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">ยังไม่มีการบันทึก</h2>
                <p className="text-gray-600 mb-6">บันทึกสัตว์บ้านจากหน้าตามหาบ้าน</p>
                <a
                  href="/adoption"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-yellow-400 hover:text-black transition-colors duration-200 text-base"
                  style={{ fontFamily: 'Poppins, Anuphan' }}
                >
                  ไปหาบ้านสำหรับสัตว์บ้าน
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adoptionFavorites.map((pet) => (
                  <PetCard key={pet._id} pet={pet} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {lostPetFavorites.length === 0 ? (
              <div className="text-center py-16">
                <Heart size={64} className="mx-auto text-gray-300 mb-4" strokeWidth={1} />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">ยังไม่มีการบันทึก</h2>
                <p className="text-gray-600 mb-6">บันทึกสัตว์หายจากหน้าตามหาสัตว์หาย</p>
                <a
                  href="/lost-pets"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-yellow-400 hover:text-black transition-colors duration-200 text-base"
                  style={{ fontFamily: 'Poppins, Anuphan' }}
                >
                  ไปหาสัตว์หาย
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lostPetFavorites.map((lostPet) => (
                  <LostPetCard key={lostPet._id} lostPet={lostPet} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
