import { useState } from 'react';
import { MapPin, User, Clock, Bookmark } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { saveLostPet, unsaveLostPet } from '../store/lostPetActions';
import ChatModal from './ChatModal';
import type { LostPet } from '../types/lostpet';

interface LostPetCardProps {
  lostPet: LostPet;
}

export default function LostPetCard({ lostPet }: LostPetCardProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(lostPet.savedBy.includes(user?._id || ''));
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSave = async () => {
    if (!user) {
      alert('Please login to save lost pets');
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        await dispatch(unsaveLostPet(lostPet._id, user._id) as any);
        setIsSaved(false);
      } else {
        await dispatch(saveLostPet(lostPet._id, user._id) as any);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error saving lost pet:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleContact = () => {
    setIsChatOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full" style={{ fontFamily: 'Poppins, Anuphan' }}>
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden shrink-0">
        {lostPet.images && lostPet.images.length > 0 ? (
          <img
            src={lostPet.images[0]}
            alt={lostPet.name}
            className="w-full h-full object-cover"
          />
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
            <span>เพิ่งเพิ่มเมื่อเร็ว ๆ</span>
          </div>
          <span className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-medium">
            {lostPet.species === 'dog' ? 'สุนัข' : lostPet.species === 'cat' ? 'แมว' : 'อื่นๆ'}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          {lostPet.name}
        </h3>

        <div className="flex items-center gap-3 text-xs text-gray-700 mb-2">
          <span className="flex items-center gap-1">
            <MapPin size={16} className="text-gray-700" />
            <span>{lostPet.location}</span>
          </span>
          <span className="flex items-center gap-1">
            <User size={16} className="text-gray-700" />
            <span>{lostPet.contactName}</span>
          </span>
        </div>

        <p className="text-xs font-bold text-gray-700 mb-2">รายละเอียด</p>

        <p className="text-xs text-gray-600 line-clamp-3 mb-4 leading-relaxed grow">
          {lostPet.description}
        </p>

        <div className="flex gap-2 mt-auto">
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
        </div>
      </div>

      {lostPet.images && lostPet.images.length > 1 && (
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <div className="flex gap-2 overflow-x-auto">
            {lostPet.images.map((image, idx) => (
              <img
                key={idx}
                src={image}
                alt={`${idx + 1}`}
                className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity shrink-0"
              />
            ))}
          </div>
        </div>
      )}

      <ChatModal pet={lostPet as any} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
