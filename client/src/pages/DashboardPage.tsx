import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { logout } from '../store/authSlice';

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <p className="text-gray-600 mb-4">Please log in to access this page</p>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">PawSafe Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/chat')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              💬 Chat
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome, {user.username}!</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">User Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="text-gray-800 font-semibold">{user.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Username</p>
                  <p className="text-gray-800 font-semibold">{user.username}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Role</p>
                  <p className="text-gray-800 font-semibold capitalize">{user.role}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                    {user.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Info</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm">Phone</p>
                  <p className="text-gray-800 font-semibold">{user.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Address</p>
                  <p className="text-gray-800 font-semibold">{user.address || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">User ID</p>
                  <p className="text-gray-800 font-mono text-sm break-all">{user._id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
