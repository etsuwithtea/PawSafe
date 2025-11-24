import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, User, Clock, Bookmark, ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { savePet, unsavePet } from '../store/petActions';
import ChatModal from '../components/ChatModal';
import type { Pet } from '../types/pet';

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'เพิ่งเพิ่มเมื่อสักครู่';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} นาทีที่แล้ว`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} ชั่วโมงที่แล้ว`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} วันที่แล้ว`;
  return `${Math.floor(seconds / 604800)} สัปดาห์ที่แล้ว`;
};

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const pets = useAppSelector((state) => state.pets.pets);
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const foundPet = pets.find((p: Pet) => p._id === id);
    if (foundPet) {
      setPet(foundPet);
      setIsSaved(foundPet.savedBy.includes(user?._id || ''));
      setLoading(false);
    } else {
      // If not found in store, fetch from API
      const fetchPet = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/pets/${id}`);
          if (!response.ok) {
            throw new Error('Pet not found');
          }
          const data = await response.json();
          setPet(data.data);
          setIsSaved(data.data.savedBy.includes(user?._id || ''));
        } catch (error) {
          console.error('Error fetching pet:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchPet();
    }
  }, [id, pets, user]);

  const handleSave = async () => {
    if (!user || !pet) return;

    setIsSaving(true);
    try {
      if (isSaved) {
        await dispatch(unsavePet(pet._id, user._id) as any);
        setIsSaved(false);
      } else {
        await dispatch(savePet(pet._id, user._id) as any);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error saving pet:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleContact = () => {
    setIsChatOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">กำลังโหลด...</div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ fontFamily: 'Poppins, Anuphan' }}>
        <div className="text-xl text-gray-600 mb-4">ไม่พบข้อมูลสัตว์นี้</div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
          ย้อนกลับ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" style={{ fontFamily: 'Poppins, Anuphan' }}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg bg-white text-gray-800 hover:bg-gray-100 transition-colors shadow-md"
        >
          <ArrowLeft size={20} />
          ย้อนกลับ
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Main Image */}
            <div className="lg:col-span-2">
              <div className="w-full bg-gray-200 rounded-lg overflow-hidden mb-4">
                {pet.images && pet.images.length > 0 ? (
                  <img
                    src={pet.images[selectedImageIndex]}
                    alt={pet.name}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center bg-gray-300">
                    <span className="text-gray-500">ยังไม่มีรูปภาพ</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {pet.images && pet.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {pet.images.map((image, idx) => (
                    <img
                      key={idx}
                      src={image}
                      alt={`${idx + 1}`}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-20 h-20 object-cover rounded cursor-pointer transition-all shrink-0 ${
                        selectedImageIndex === idx
                          ? 'ring-2 ring-black opacity-100'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="lg:col-span-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-medium">
                  {pet.species === 'dog' ? 'สุนัข' : pet.species === 'cat' ? 'แมว' : 'อื่นๆ'}
                </span>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="p-2 rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-50"
                  style={{
                    backgroundColor: isSaved ? '#000000' : 'transparent',
                  }}
                >
                  <Bookmark
                    size={28}
                    className="transition-colors"
                    fill={isSaved ? 'white' : 'none'}
                    stroke={isSaved ? 'white' : 'currentColor'}
                  />
                </button>
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-2">{pet.name}</h1>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                <Clock size={16} />
                <span>{formatTimeAgo(pet.createdAt)}</span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-gray-700 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-600">สถานที่</p>
                    <p className="text-sm text-gray-800">
                      {pet.location}
                      {pet.locationDetails && <span className="text-gray-600"> - {pet.locationDetails}</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User size={20} className="text-gray-700 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-600">ชื่อผู้ติดต่อ</p>
                    <p className="text-sm text-gray-800">{pet.contactName}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContact}
                className="w-full px-4 py-3 font-bold rounded-lg transition-colors duration-200 text-sm"
                style={{ backgroundColor: '#FFA600', color: '#1f2937' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#000000';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFA600';
                  e.currentTarget.style.color = '#1f2937';
                }}
              >
                ติดต่อเจ้าของ
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="px-6 pb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">รายละเอียด</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{pet.description}</p>
          </div>
        </div>
      </div>

      <ChatModal
        pet={pet}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}
