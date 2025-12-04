import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, Clock, Bookmark, Info } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { savePet, unsavePet } from '../store/petActions';
import { useToast } from './Toast';
import ChatModal from './ChatModal';
import AuthPromptModal from './AuthPromptModal';
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

interface PetCardProps {
  pet: Pet;
  onShowToast?: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function PetCard({ pet, onShowToast }: PetCardProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { showToast: localShowToast } = useToast();
  const showToast = onShowToast || localShowToast;
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(pet.savedBy.includes(user?._id || ''));
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSave = async () => {
    if (!user) {
      showToast('กรุณาล็อกอินเพื่อ save สัตว์ที่ต้องการ', 'error');
      return;
    }

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
    if (!user) {
      // show modal with Login / Signup actions
      setShowAuthPrompt(true);
      return;
    }
    setIsChatOpen(true);
  };

  const handleViewDetail = () => {
    navigate(`/adoption/${pet._id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full" style={{ fontFamily: 'Poppins, Anuphan' }}>
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden shrink-0">
        {pet.images && pet.images.length > 0 ? (
          <>
            <img
              src={pet.images[currentImageIndex]}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
            {pet.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? pet.images.length - 1 : prev - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-1 rounded-full transition-all"
                >
                  ◀
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev === pet.images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-1 rounded-full transition-all"
                >
                  ▶
                </button>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
                  {currentImageIndex + 1}/{pet.images.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span className="text-gray-500 text-center text-sm">ยังไม่มีรูปภาพ</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col grow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Clock size={14} className="text-gray-600" />
            <span>{formatTimeAgo(pet.createdAt)}</span>
          </div>
          <span className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-medium">
            {pet.species === 'dog' ? 'สุนัข' : pet.species === 'cat' ? 'แมว' : 'อื่นๆ'}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          {pet.name}
        </h3>

        <div className="flex items-center gap-3 text-xs text-gray-700 mb-2">
          <span className="flex items-center gap-1">
            <MapPin size={16} className="text-gray-700" />
            <span>{pet.location} {pet.locationDetails && `- ${pet.locationDetails}`}</span>
          </span>
          <span className="flex items-center gap-1">
            <User size={16} className="text-gray-700" />
            <span>{pet.contactName}</span>
          </span>
        </div>

        <p className="text-xs font-bold text-gray-700 mb-2">รายละเอียด</p>

        <p className="text-xs text-gray-600 line-clamp-3 mb-4 leading-relaxed grow">
          {pet.description}
        </p>

        <div className="flex gap-2 mt-auto">
          <button 
            onClick={handleViewDetail}
            title="ดูรายละเอียด"
            className="p-2 rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-50 shrink-0 bg-white hover:bg-black"
          >
            <Info 
              size={24}
              className="text-black hover:text-white transition-colors"
            />
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="p-2 rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-50 shrink-0"
            style={{
              backgroundColor: isSaved ? '#000000' : 'transparent',
            }}
          >
            <Bookmark 
              size={24}
              className="transition-colors"
              fill={isSaved ? "white" : "none"}
              stroke={isSaved ? "white" : "currentColor"}
            />
          </button>
          {user?._id !== pet.contactUserId && (
            <button 
              onClick={handleContact}
              className="flex-1 px-4 py-2 font-bold rounded-lg transition-colors duration-200 text-sm flex items-center justify-center gap-2"
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
              ติดต่อ
            </button>
          )}
        </div>
      </div>

      {pet.images && pet.images.length > 1 && (
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <div className="flex gap-2 overflow-x-auto">
            {pet.images.map((image, idx) => (
              <img
                key={idx}
                src={image}
                alt={`${idx + 1}`}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-16 h-16 object-cover rounded cursor-pointer transition-all shrink-0 ${
                  currentImageIndex === idx ? 'ring-2 ring-black opacity-100' : 'hover:opacity-80 opacity-70'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <ChatModal pet={pet} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <AuthPromptModal isOpen={showAuthPrompt} onClose={() => setShowAuthPrompt(false)} />
    </div>
  );
}
