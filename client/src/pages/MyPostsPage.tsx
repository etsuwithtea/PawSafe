import { useEffect, useState } from 'react';
import { useAppSelector } from '../store/store';
import PetCard from '../components/PetCard';
import LostPetCard from '../components/LostPetCard';
import Toast, { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import { Trash2, Edit2 } from 'lucide-react';
import type { Pet } from '../types/pet';
import type { LostPet } from '../types/lostpet';

export default function MyPostsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [adoptionPosts, setAdoptionPosts] = useState<Pet[]>([]);
  const [lostPetPosts, setLostPetPosts] = useState<LostPet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'adoption' | 'lost'>('adoption');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Pet | LostPet>>({});
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
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
    setConfirmModal({
      isOpen: true,
      title: 'ยืนยันการลบโพสต์',
      message: 'คุณแน่ใจหรือว่าต้องการลบโพสต์นี้? การลบไม่สามารถเลิกได้',
      onConfirm: async () => {
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
          setConfirmModal({ ...confirmModal, isOpen: false });
        } catch (error) {
          console.error('Error deleting post:', error);
          showToast('เกิดข้อผิดพลาดในการลบโพสต์', 'error');
          setConfirmModal({ ...confirmModal, isOpen: false });
        }
      },
    });
  };

  const handleStatusChange = async (petId: string, newStatus: string, isLostPet: boolean) => {
    // Check if this is a final status change (adopted/returned)
    if (
      (newStatus === 'adopted' && !isLostPet) ||
      (newStatus === 'returned' && isLostPet)
    ) {
      setConfirmModal({
        isOpen: true,
        title: 'สัตว์ได้บ้านแล้ว?',
        message: 'เมื่อทำเครื่องหมายว่าสัตว์ได้บ้านแล้ว คุณต้องการให้โพสต์นี้อยู่หรือลบออก?',
        onConfirm: async () => {
          await updateStatus(petId, newStatus, isLostPet, false);
          setConfirmModal({ ...confirmModal, isOpen: false });
        },
      });
    } else {
      updateStatus(petId, newStatus, isLostPet, false);
    }
  };

  const updateStatus = async (petId: string, newStatus: string, isLostPet: boolean, deleteAfter: boolean) => {
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

      if (deleteAfter) {
        setTimeout(() => handleDeletePost(petId, isLostPet), 500);
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
    <div className="w-full bg-gray-50 py-8" style={{ marginBottom: `${(40 + Math.ceil(totalPosts / 3) * 60)}px`, fontFamily: 'Poppins, Anuphan' }}>
      <Toast toasts={toasts} onRemove={removeToast} variant="dark" />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        isDangerous={confirmModal.title === 'ยืนยันการลบโพสต์'}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {adoptionPosts.map((pet) => (
                      <div key={pet._id} className="relative mb-6">
                        <div className="absolute top-0 right-0 flex gap-2 z-20 rounded-bl-lg p-2">
                          <select
                            value={pet.status}
                            onChange={(e) => handleStatusChange(pet._id, e.target.value, false)}
                            className="flex-1 px-3 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg"
                          >
                            <option value="available">กำลังหาบ้าน</option>
                            <option value="adopted">ได้บ้านแล้ว</option>
                          </select>
                          <button
                            onClick={() => {
                              setEditingId(pet._id);
                              setEditFormData(pet);
                            }}
                            className="px-2 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors flex items-center justify-center shadow-lg"
                            title="แก้ไขโพสต์"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeletePost(pet._id, false)}
                            className="px-2 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center justify-center shadow-lg"
                            title="ลบโพสต์"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="h-full">
                          <PetCard pet={pet} />
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {lostPetPosts.map((lostPet) => (
                      <div key={lostPet._id} className="relative mb-6">
                        <div className="absolute top-0 right-0 flex gap-2 z-20 rounded-bl-lg p-2">
                          <select
                            value={lostPet.status}
                            onChange={(e) => handleStatusChange(lostPet._id, e.target.value, true)}
                            className="flex-1 px-3 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg"
                          >
                            <option value="lost">ยังหาไม่เจอ</option>
                            <option value="returned">กลับบ้านแล้ว</option>
                          </select>
                          <button
                            onClick={() => {
                              setEditingId(lostPet._id);
                              setEditFormData(lostPet);
                            }}
                            className="px-2 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors flex items-center justify-center shadow-lg"
                            title="แก้ไขโพสต์"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeletePost(lostPet._id, true)}
                            className="px-2 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center justify-center shadow-lg"
                            title="ลบโพสต์"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="h-full">
                          <LostPetCard lostPet={lostPet} />
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

      {editingId && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto shadow-2xl drop-shadow-lg">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Anuphan', color: '#FFA600' }}>
              แก้ไขโพสต์
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">ชื่อ</label>
                <input
                  type="text"
                  value={(editFormData as any)?.name || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">รายละเอียด</label>
                <textarea
                  value={(editFormData as any)?.description || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">สถานที่</label>
                <input
                  type="text"
                  value={(editFormData as any)?.location || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">รายละเอียดที่อยู่</label>
                <input
                  type="text"
                  value={(editFormData as any)?.locationDetails || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, locationDetails: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="เช่น เลขที่บ้าน ซอย ฯลฯ"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">รูปภาพ</label>
                <div className="space-y-2">
                  {(editFormData as any)?.images && (editFormData as any).images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {(editFormData as any).images.map((img: string, idx: number) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`preview-${idx}`} className="w-full h-24 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => {
                              setEditFormData({
                                ...editFormData,
                                images: (editFormData as any).images.filter((_: string, i: number) => i !== idx)
                              });
                            }}
                            className="absolute top-1 right-1 bg-black text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length === 0) return;

                      const formData = new FormData();
                      files.forEach(file => formData.append('images', file));

                      try {
                        const isLostPet = 'lostDate' in editFormData;
                        const endpoint = isLostPet ? 'lost-pets' : 'pets';
                        const response = await fetch(
                          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/${endpoint}/upload-images`,
                          {
                            method: 'POST',
                            body: formData,
                          }
                        );

                        if (!response.ok) throw new Error('Upload failed');
                        const data = await response.json();
                        
                        setEditFormData({
                          ...editFormData,
                          images: [...((editFormData as any)?.images || []), ...data.images]
                        });
                        showToast('อัพโหลดรูปสำเร็จ!', 'success');
                      } catch (error) {
                        console.error('Error uploading images:', error);
                        showToast('เกิดข้อผิดพลาดในการอัพโหลด', 'error');
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    try {
                      const isLostPet = 'lostDate' in editFormData;
                      const endpoint = isLostPet ? 'lost-pets' : 'pets';
                      const response = await fetch(
                        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/${endpoint}/${editingId}`,
                        {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(editFormData),
                        }
                      );

                      if (!response.ok) {
                        throw new Error('Failed to update post');
                      }

                      if (isLostPet) {
                        setLostPetPosts((prev) =>
                          prev.map((post) =>
                            post._id === editingId ? { ...post, ...editFormData } as LostPet : post
                          )
                        );
                      } else {
                        setAdoptionPosts((prev) =>
                          prev.map((post) =>
                            post._id === editingId ? { ...post, ...editFormData } as Pet : post
                          )
                        );
                      }

                      setEditingId(null);
                      setEditFormData({});
                      showToast('อัปเดตโพสต์สำเร็จ!', 'success');
                    } catch (error) {
                      console.error('Error updating post:', error);
                      showToast('เกิดข้อผิดพลาดในการอัปเดต', 'error');
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors"
                >
                  บันทึก
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditFormData({});
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-black rounded-lg font-bold hover:bg-gray-400 transition-colors"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
