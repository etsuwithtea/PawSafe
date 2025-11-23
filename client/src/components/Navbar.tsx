import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { logout } from '../store/authSlice';
import { MessageCircle, Bookmark, Bell } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { unreadCount, clearUnreadCount } = useNotification();

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileOpen(false);
    navigate('/');
  };

  const handleNotificationClick = () => {
    clearUnreadCount();
    navigate('/chat');
  };

  return (
    <nav className="shadow-sm relative z-10" style={{ backgroundColor: '#FFFDFA' }}>
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center pr-2 md:pr-4 hover:scale-110 transition-transform duration-300">
          <span 
            className="text-xl md:text-3xl font-bold text-black"
            style={{ fontFamily: 'Pacifico' }}
          >PawSafe</span>
        </Link>
        
        <div className="hidden md:flex gap-24 items-center flex-1 justify-center" style={{ fontFamily: 'Poppins, Anuphan' }}>
          <Link to="/adoption" className="text-gray-700 hover:text-black hover:font-bold hover:scale-110 transition-all duration-200 cursor-pointer">ตามหาบ้าน</Link>
          <Link to="/lost-pets" className="text-gray-700 hover:text-black hover:font-bold hover:scale-110 transition-all duration-200 cursor-pointer">ตามหาสัตว์หาย</Link>
          <Link to="/about" className="text-gray-700 hover:text-black hover:font-bold hover:scale-110 transition-all duration-200 cursor-pointer">เกี่ยวกับเรา</Link>
        </div>

        <button 
          className="md:hidden flex flex-col gap-1 mr-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`w-6 h-0.5 bg-white transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-opacity ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        <div className="hidden sm:flex gap-2 md:gap-6 items-center pr-2 md:pr-4 ">
          {user ? (
            <>
              <Link 
                to="/chat" 
                className="p-2 rounded-full transition-all duration-200 hover:scale-110"
              >
                <MessageCircle className="w-6 h-6 text-gray-700 hover:text-black" strokeWidth={1.5} />
              </Link>

              <Link 
                to="/favorites" 
                className="p-2 rounded-full transition-all duration-200 hover:scale-110"
              >
                <Bookmark className="w-6 h-6 text-gray-700 hover:text-black" strokeWidth={1.5} />
              </Link>

              <Link 
                to="/chat" 
                onClick={handleNotificationClick}
                className="p-2 rounded-full transition-all duration-200 hover:scale-110 relative"
              >
                <Bell className="w-6 h-6 text-gray-700 hover:text-black" strokeWidth={1.5} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-0 rounded-full transition-all duration-200 hover:scale-110  bg-transparent border-0 focus:outline-none flex items-center justify-center"
                >
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 border rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200" style={{ fontFamily: 'Poppins, Anuphan', backgroundColor: '#FFFDFA' }}>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:text-black hover:font-bold hover:scale-110 transition-all duration-200 border-b border-gray-200" 
                    >
                      โปรไฟล์ของฉัน
                    </Link>
                    <Link
                      to="/my-posts"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:text-black hover:font-bold hover:scale-110 transition-all duration-200 border-b border-gray-200" 
                    >
                      โพสต์ของฉัน
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-white hover:text-white hover:font-bold hover:scale-110 transition-all duration-200"
                    >
                      ล้อกเอาท์
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="px-3 md:px-6 py-2 border border-gray-700 rounded-md text-black bg-white hover:bg-black hover:text-white hover:border-black hover:scale-105 active:scale-95 transition-all duration-200 text-sm md:text-base"
              >Login</Link>
              <Link 
                to="/signup" 
                className="px-3 md:px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all duration-200 text-sm md:text-base"
              >Sign up</Link>
            </>
          )}
        </div>
      </div>
 
    </nav>
  );
}
