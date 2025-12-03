import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../store/authActions';
import type { RootState } from '../store/store';
import { clearError } from '../store/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(clearError());

    try {
      await (dispatch as any)(loginUser(formData.email, formData.password));
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {}
  };

  if (user) {
    navigate('/');
    return null;
  }

  return (
    <div style={{ backgroundColor: '#FFFDFA' }} className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="bg-white rounded-lg shadow-xl p-12 max-w-md w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3 text-black" style={{ fontFamily: 'Pacifico' }}>PawSafe</h1>
            <p className="text-gray-600" style={{ fontFamily: 'Poppins, Anuphan' }}>ป้อนข้อมูลประจำตัวของคุณเพื่อเข้าสู่บัญชี</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm font-semibold" style={{ fontFamily: 'Anuphan' }}>ข้อผิดพลาด</p>
              <p className="text-red-700 text-sm mt-1" style={{ fontFamily: 'Poppins, Anuphan' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2" style={{ fontFamily: 'Anuphan' }}>ที่อยู่อีเมล</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text- font-semibold" style={{ fontFamily: 'Anuphan' }}>รหัสผ่าน</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-black bg-transparent hover:underline text-sm font-semibold" style={{ fontFamily: 'Poppins, Anuphan' }}
                >
                  {showPassword ? 'ซ่อน' : 'แสดง'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-semibold py-2 px-4 rounded-lg transition duration-200 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: '#FFA600' }}
            >
              {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600" style={{ fontFamily: 'Poppins, Anuphan' }}>
              ยังไม่มีบัญชี?{' '}
              <Link to="/signup" className="font-semibold hover:underline" style={{ color: '#FFA600' }}>
                สมัครสมาชิกที่นี่
              </Link>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}

