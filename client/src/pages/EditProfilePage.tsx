import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store/store';
import { setUser } from '../store/authSlice';

export default function EditProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSaving(true);

    try {
      if (!formData.username.trim()) {
        throw new Error('กรุณากรอกชื่อผู้ใช้');
      }
      if (!formData.email.trim()) {
        throw new Error('กรุณากรอกอีเมล');
      }

      const response = await fetch(`/api/users/${user?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'ไม่สามารถบันทึกข้อมูล');
      }

      const data = await response.json();
      
      dispatch(setUser(data.user || data));
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div style={{ backgroundColor: '#FFFDFA' }} className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFFDFA' }} className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-8 w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Anuphan', color: '#FFA600' }}>
              แก้ไขข้อมูล
            </h1>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 font-semibold" style={{ fontFamily: 'Anuphan' }}>ข้อผิดพลาด</p>
                <p className="text-red-700 text-sm mt-1" style={{ fontFamily: 'Poppins, Anuphan' }}>{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-semibold" style={{ fontFamily: 'Anuphan' }}>สำเร็จ</p>
                <p className="text-green-700 text-sm mt-1" style={{ fontFamily: 'Poppins, Anuphan' }}>บันทึกข้อมูลสำเร็จแล้ว กำลังกลับไป...</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: 'Anuphan' }}>
                  ชื่อผู้ใช้
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="ชื่อผู้ใช้"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  style={{ fontFamily: 'Poppins, Anuphan' }}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: 'Anuphan' }}>
                  อีเมล
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  style={{ fontFamily: 'Poppins, Anuphan' }}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: 'Anuphan' }}>
                  เบอร์โทร (ไม่บังคับ)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="เบอร์โทรของคุณ"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  style={{ fontFamily: 'Poppins, Anuphan' }}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: 'Anuphan' }}>
                  ที่อยู่ (ไม่บังคับ)
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="ที่อยู่ของคุณ"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  style={{ fontFamily: 'Poppins, Anuphan' }}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50"
                  style={{ backgroundColor: '#FFA600' }}
                >
                  {isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="flex-1 bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
