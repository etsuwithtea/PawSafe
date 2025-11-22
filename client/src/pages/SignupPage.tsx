import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signupUser } from '../store/authActions';
import type { RootState } from '../store/store';
import { clearError } from '../store/authSlice';

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });

  const [validationError, setValidationError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(clearError());
    setValidationError('');

    if (formData.password !== formData.confirmPassword) {
      setValidationError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    if (!formData.username.trim()) {
      setValidationError('กรุณากรอกชื่อผู้ใช้');
      return;
    }

    try {
      await (dispatch as any)(
        signupUser(
          formData.username,
          formData.email,
          formData.password,
          formData.phone,
          formData.address
        )
      );
      navigate('/');
    } catch (err) {
    }
  };

  if (user) {
    return (
      <div style={{ backgroundColor: '#FFFDFA' }} className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Anuphan', color: '#FFA600' }}>ยินดีต้อนรับ!</h1>
              <p className="text-gray-600" style={{ fontFamily: 'Poppins, Anuphan' }}>บัญชีของคุณสร้างสำเร็จแล้ว</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-semibold" style={{ fontFamily: 'Anuphan' }}>สมัครสมาชิกสำเร็จ</p>
              <p className="text-green-700 text-sm mt-1" style={{ fontFamily: 'Poppins, Anuphan' }}>ยินดีต้อนรับ {user.username}!</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="bg-gray-50 p-3 rounded-sm">
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Poppins, Anuphan' }}>อีเมล</p>
                <p className="text-gray-800 font-semibold" style={{ fontFamily: 'Anuphan' }}>{user.email}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-sm">
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Poppins, Anuphan' }}>ชื่อผู้ใช้</p>
                <p className="text-gray-800 font-semibold" style={{ fontFamily: 'Anuphan' }}>{user.username}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-sm">
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Poppins, Anuphan' }}>บทบาท</p>
                <p className="text-gray-800 font-semibold capitalize" style={{ fontFamily: 'Anuphan' }}>{user.role}</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full text-white font-semibold py-2 px-4 rounded-lg transition duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
              style={{ backgroundColor: '#FFA600' }}
            >
              ไปที่หน้าแรก
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFFDFA' }} className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="bg-white rounded-lg shadow-xl p-12 max-w-md w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3 text-black" style={{ fontFamily: 'Pacifico' }}>PawSafe</h1>
            <p className="text-gray-600" style={{ fontFamily: 'Poppins, Anuphan' }}>สร้างบัญชีเพื่อเริ่มต้น</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm font-semibold" style={{ fontFamily: 'Anuphan' }}>ข้อผิดพลาด</p>
              <p className="text-red-700 text-sm mt-1" style={{ fontFamily: 'Poppins, Anuphan' }}>{error}</p>
            </div>
          )}

          {validationError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm font-semibold" style={{ fontFamily: 'Anuphan' }}>ข้อผิดพลาด</p>
              <p className="text-red-700 text-sm mt-1" style={{ fontFamily: 'Poppins, Anuphan' }}>{validationError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: 'Anuphan' }}>ชื่อผู้ใช้</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="เลือกชื่อผู้ใช้ของคุณ"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: 'Anuphan' }}>ที่อยู่อีเมล</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: 'Anuphan' }}>รหัสผ่าน</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: 'Anuphan' }}>ยืนยันรหัสผ่าน</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: 'Anuphan' }}>เบอร์โทร (ไม่บังคับ)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="เบอร์โทรของคุณ"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: 'Anuphan' }}>ที่อยู่ (ไม่บังคับ)</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="ที่อยู่ของคุณ"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-semibold py-2 px-4 rounded-lg transition duration-200 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: '#FFA600' }}
            >
              {isLoading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600" style={{ fontFamily: 'Poppins, Anuphan' }}>
              มีบัญชีแล้ว?{' '}
              <Link to="/login" className="font-semibold hover:underline" style={{ color: '#FFA600' }}>
                เข้าสู่ระบบที่นี่
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

