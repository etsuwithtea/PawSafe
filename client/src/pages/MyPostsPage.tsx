import { useEffect, useState } from 'react';
import { useAppSelector } from '../store/store';
import PetCard from '../components/PetCard';
import LostPetCard from '../components/LostPetCard';
import Toast, { useToast } from '../components/Toast';
import { Trash2 } from 'lucide-react';
import type { Pet } from '../types/pet';
import type { LostPet } from '../types/lostpet';

export default function MyPostsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [adoptionPosts, setAdoptionPosts] = useState<Pet[]>([]);
  const [lostPetPosts, setLostPetPosts] = useState<LostPet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'adoption' | 'lost'>('adoption');
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    const fetchAdoptionPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/pets?limit=1000`
        );
        const data = await response.json();
        
        if (user && data.data) {
          const userPosts = data.data.filter((pet: Pet) =>
            pet.contactUserId === user._id
          );
          setAdoptionPosts(userPosts);
        }
      } catch (error) {
        console.error('Error fetching adoption posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAdoptionPosts();
    }
  }, [user]);

  useEffect(() => {
    const fetchLostPetPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/lost-pets?limit=1000`
        );
        const data = await response.json();
        
        if (user && data.data) {
          const userPosts = data.data.filter((lostPet: LostPet) =>
            lostPet.contactUserId === user._id
          );
          setLostPetPosts(userPosts);
        }
      } catch (error) {
        console.error('Error fetching lost pet posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchLostPetPosts();
    }
  }, [user]);

  const handleDeletePost = async (petId: string, isLostPet: boolean) => {
    if (!window.confirm('คุณแน่ใจหรือว่าต้องการลบโพสต์นี้?')) {
      return;
    }

    try {
      const endpoint = isLostPet ? 'lost-pets' : 'pets';
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/${endpoint}/${petId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      if (isLostPet) {
        setLostPetPosts((prev) => prev.filter((post) => post._id !== petId));
      } else {
        setAdoptionPosts((prev) => prev.filter((post) => post._id !== petId));
      }

      showToast('ลบโพสต์สำเร็จ!', 'success');
    } catch (error) {
      console.error('Error deleting post:', error);
      showToast('เกิดข้อผิดพลาดในการลบโพสต์', 'error');
    }
  };

  const handleStatusChange = async (petId: string, newStatus: string, isLostPet: boolean) => {
    try {
      const endpoint = isLostPet ? 'lost-pets' : 'pets';
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/${endpoint}/${petId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      if (
        (newStatus === 'adopted' && !isLostPet) ||
        (newStatus === 'found' && isLostPet)
      ) {
        const confirmDelete = window.confirm('สัตว์ได้บ้านแล้ว/เจอแล้ว ต้องการลบโพสต์นี้หรือไม่?');
        if (confirmDelete) {
          handleDeletePost(petId, isLostPet);
        } else {
          if (isLostPet) {
            setLostPetPosts((prev) =>
              prev.map((post) =>
                post._id === petId ? { ...post, status: newStatus as any } : post
              )
            );
          } else {
            setAdoptionPosts((prev) =>
              prev.map((post) =>
                post._id === petId ? { ...post, status: newStatus as any } : post
              )
            );
          }
        }
      }

      showToast('อัปเดตสถานะสำเร็จ!', 'success');
    } catch (error) {
      console.error('Error updating post:', error);
      showToast('เกิดข้อผิดพลาดในการอัปเดต', 'error');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">กรุณาเข้าสู่ระบบเพื่อดูโพสต์ของคุณ</p>
        </div>
      </div>
    );
  }

  const totalPosts = adoptionPosts.length + lostPetPosts.length;

  return (
    <div className="w-full bg-gray-50 py-8 mb-10" style={{ fontFamily: 'Poppins, Anuphan' }}>
      <Toast toasts={toasts} onRemove={removeToast} />
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-2"
            style={{ fontFamily: 'Anuphan', color: '#FFA600' }}
          >
            โพสต์ของฉัน
          </h1>
          <p className="text-gray-600">
            {totalPosts} โพสต์ของคุณ
          </p>
        </div>

        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setActiveTab('adoption')}
            className={`px-8 py-3 rounded-md text-sm cursor-pointer font-bold transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 ${
              activeTab === 'adoption'
                ? 'text-white bg-black'
                : 'text-black bg-gray-200 hover:bg-gray-300'
            }`}
            style={{ fontFamily: 'Poppins, Anuphan' }}
          >
            ตามหาบ้าน ({adoptionPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('lost')}
            className={`px-8 py-3 rounded-md text-sm cursor-pointer font-bold transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 ${
              activeTab === 'lost'
                ? 'text-white bg-black'
                : 'text-black bg-gray-200 hover:bg-gray-300'
            }`}
            style={{ fontFamily: 'Poppins, Anuphan' }}
          >
            ตามหาสัตว์หาย ({lostPetPosts.length})
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : (
          <>
            {activeTab === 'adoption' && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">ตามหาบ้าน</h2>
                {adoptionPosts.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg">
                    <p className="text-gray-600">ยังไม่มีโพสต์ตามหาบ้าน</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adoptionPosts.map((pet) => (
                      <div key={pet._id}>
                        <PetCard pet={pet} />
                        <div className="mt-3 space-y-2">
                          <select
                            value={pet.status}
                            onChange={(e) => handleStatusChange(pet._id, e.target.value, false)}
                            className="w-full px-3 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors"
                          >
                            <option value="available">กำลังหาบ้าน</option>
                            <option value="pending">รออนุมัติ</option>
                            <option value="adopted">สัตว์ได้บ้านแล้ว</option>
                          </select>
                          <button
                            onClick={() => handleDeletePost(pet._id, false)}
                            className="w-full px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                          >
                            <Trash2 size={16} />
                            ลบโพสต์
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'lost' && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">ตามหาสัตว์หาย</h2>
                {lostPetPosts.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg">
                    <p className="text-gray-600">ยังไม่มีโพสต์ตามหาสัตว์หาย</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lostPetPosts.map((lostPet) => (
                      <div key={lostPet._id}>
                        <LostPetCard lostPet={lostPet} />
                        <div className="mt-3 space-y-2">
                          <select
                            value={lostPet.status}
                            onChange={(e) => handleStatusChange(lostPet._id, e.target.value, true)}
                            className="w-full px-3 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors"
                          >
                            <option value="lost">สัตว์หาย</option>
                            <option value="found">เจอสัตว์แล้ว</option>
                          </select>
                          <button
                            onClick={() => handleDeletePost(lostPet._id, true)}
                            className="w-full px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                          >
                            <Trash2 size={16} />
                            ลบโพสต์
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
