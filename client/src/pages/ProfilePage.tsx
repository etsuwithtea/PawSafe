import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import type { RootState } from '../store/store';
import { setUser } from '../store/authSlice';

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [avatarRefresh, setAvatarRefresh] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      const stored = localStorage.getItem('auth_user');
      if (stored) {
        try {
          const userData = JSON.parse(stored);
          dispatch(setUser(userData));
        } catch (error) {
          console.error('Error loading user data:', error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          console.log('Fetching user data for ID:', user._id);
          const response = await fetch(`/api/users/${user._id}`);
          console.log('Fetch response status:', response.status);
          if (response.ok) {
            const userData = await response.json();
            console.log('Fetched user data:', userData);
            dispatch(setUser(userData));
            if (userData.avatar) {
              const url = userData.avatar.startsWith('http') 
                ? userData.avatar 
                : `http://localhost:5000${userData.avatar}`;
              setAvatarUrl(url);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const apiUrl = `/api/users/${user._id}/avatar`;
      console.log('Uploading to:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const text = await response.text();
      console.log('Response text:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error(`Server returned invalid response: ${text}`);
      }

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      dispatch(setUser(data.user));
      setUploadError(null);
      if (data.user.avatar) {
        const url = data.user.avatar.startsWith('http') 
          ? data.user.avatar 
          : `http://localhost:5000${data.user.avatar}`;
        setAvatarUrl(url);
      }
      setAvatarRefresh(prev => prev + 1);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFDFA' }} className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-10 max-w-2xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
            <div className="flex flex-col md:col-span-2">
              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Anuphan' }}>
                  {user.username}
                </h1>
                <p className="text-gray-600 text-sm" style={{ fontFamily: 'Poppins, Anuphan' }}>
                  {user.email}
                </p>
              </div>

              {(user.phone || user.address) && (
                <div className="mb-8 space-y-4">
                  {user.phone && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Anuphan' }}>เบอร์โทร</p>
                      <p className="text-gray-800 font-semibold" style={{ fontFamily: 'Poppins, Anuphan' }}>{user.phone}</p>
                    </div>
                  )}
                  {user.address && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Anuphan' }}>ที่อยู่</p>
                      <p className="text-gray-800 font-semibold" style={{ fontFamily: 'Poppins, Anuphan' }}>{user.address}</p>
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={() => navigate('/profile/edit')}
                className="w-full px-6 py-3 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 font-semibold mb-4"
                style={{ backgroundColor: '#FFA600', fontFamily: 'Poppins, Anuphan' }}
              >
                แก้ไขข้อมูล
              </button>
            </div>

            <div className="flex flex-col items-center md:col-span-3">
              <div
                className="w-40 h-40 rounded-full bg-gray-300 overflow-hidden cursor-pointer mb-6 shadow-md"
                onClick={handleAvatarClick}
                style={{ aspectRatio: '1' }}
              >
                <img
                  key={`avatar-${avatarRefresh}-${avatarUrl}`}
                  src={avatarUrl || user.avatar || ''}
                  alt={user.username}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>

              <button
                onClick={handleAvatarClick}
                className="px-8 py-2 text-white rounded-md transition-all duration-200 hover:scale-105 active:scale-95 font-semibold text-sm border border-gray-700"
                style={{ backgroundColor: 'black', fontFamily: 'Poppins, Anuphan' }}
              >
                {isUploading ? 'กำลังอัพโหลด...' : 'เปลี่ยนรูป'}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {uploadError && (
                <div className="mt-3 text-sm text-red-600 text-center">{uploadError}</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
