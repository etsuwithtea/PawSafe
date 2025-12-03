import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { logout } from '../store/authSlice';
import { MessageCircle, Bookmark, Bell, X } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import type { Notification } from '../components/NotificationModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showNotificationHistory, setShowNotificationHistory] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { unreadCount, clearUnreadCount, notificationHistory } = useNotification();

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileOpen(false);
    navigate('/');
  };

  const handleNotificationClick = () => {
    setShowNotificationHistory(true);
    clearUnreadCount();
  };

  const handleSelectNotification = (conversationId: string) => {
    navigate('/chat', { state: { conversationId } });
    setShowNotificationHistory(false);
  };

  return (
    <nav className="shadow-sm relative z-20" style={{ backgroundColor: '#FFFDFA' }}>
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center pr-2 md:pr-4 hover:scale-110 transition-transform duration-300">
          <span 
            className="text-xl md:text-3xl font-bold text-black"
            style={{ fontFamily: 'Pacifico' }}
          >PawSafe</span>
        </Link>
        
        <div className="hidden lg:flex gap-24 items-center flex-1 justify-center relative" style={{ fontFamily: 'Poppins, Anuphan' }}>
          <style>{`
            .nav-container {
              position: relative;
              display: flex;
              gap: 1.5rem;
              align-items: center;
              flex: 1;
              justify-content: center;
            }
            .nav-link {
              position: relative;
              padding: 0.5rem 1rem;
              border-radius: 0.5rem;
              transition: all 0.3s ease;
            }
            .nav-link::after {
              content: '';
              position: absolute;
              inset: 0;
              background-color: rgb(254, 216, 180);
              border-radius: 0.5rem;
              opacity: 0;
              transition: opacity 0.3s ease;
              z-index: -1;
            }
            .nav-link:hover::after {
              opacity: 1;
            }
          `}</style>
          <div className="nav-container">
            <Link 
              to="/adoption" 
              className="nav-link text-gray-700 hover:text-gray-800 hover:font-bold hover:scale-105 cursor-pointer"
            >
              ตามหาบ้าน
            </Link>
            <Link 
              to="/lost-pets" 
              className="nav-link text-gray-700 hover:text-gray-800 hover:font-bold hover:scale-105 cursor-pointer"
            >
              ตามหาสัตว์หาย
            </Link>
            <Link 
              to="/about" 
              className="nav-link text-gray-700 hover:text-gray-800 hover:font-bold hover:scale-105 cursor-pointer"
            >
              เกี่ยวกับเรา
            </Link>
          </div>
        </div>

        <button 
          className="lg:hidden flex flex-col gap-1 mr-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`w-6 h-0.5 bg-white transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-opacity ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        <div className="hidden lg:flex gap-2 md:gap-6 items-center pr-2 md:pr-4 ">
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

              <button 
                onClick={handleNotificationClick}
                className="p-2 rounded-full transition-all duration-200 hover:scale-110 relative bg-transparent border-0 focus:outline-none cursor-pointer"
              >
                <Bell className="w-6 h-6 text-gray-700 hover:text-black" strokeWidth={1.5} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification History Modal */}
              {showNotificationHistory && (
                <>
                  {/* Overlay */}
                  <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setShowNotificationHistory(false)}
                  />

                  {/* Modal */}
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                      {/* Header */}
                      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                        <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Anuphan' }}>
                          ข้อความ
                        </h2>
                        <button
                          onClick={() => setShowNotificationHistory(false)}
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      {/* Notifications List */}
                      <div className="flex-1 overflow-y-auto">
                        {notificationHistory.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full py-12">
                            <MessageCircle size={48} className="text-gray-300 mb-3" />
                            <p className="text-gray-500" style={{ fontFamily: 'Anuphan' }}>
                              ไม่มีข้อความ
                            </p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {notificationHistory.map((notif: Notification) => (
                              <div
                                key={notif.id}
                                onClick={() => handleSelectNotification(notif.conversationId)}
                                className="p-4 hover:bg-blue-50 transition-colors cursor-pointer border-l-4 border-transparent hover:border-l-blue-500"
                              >
                                <div className="flex items-start gap-4">
                                  {/* Avatar */}
                                  {notif.senderAvatar ? (
                                    <img
                                      src={notif.senderAvatar}
                                      alt={notif.senderName}
                                      className="w-14 h-14 rounded-full object-cover shrink-0"
                                    />
                                  ) : (
                                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                      <MessageCircle size={24} className="text-blue-600" />
                                    </div>
                                  )}

                                  {/* Content */}
                                  <div className="flex-1 min-w-0">
                                    <h3
                                      className="font-semibold text-gray-900 text-sm truncate"
                                      style={{ fontFamily: 'Anuphan, Poppins' }}
                                    >
                                      {notif.senderName}
                                    </h3>
                                    
                                    <p
                                      className="text-sm text-gray-600 line-clamp-2 mt-1"
                                      style={{ fontFamily: 'Poppins, Anuphan' }}
                                    >
                                      {notif.message}
                                    </p>

                                    <p className="text-xs text-gray-500 mt-2">
                                      {new Date(notif.timestamp).toLocaleString('th-TH', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-200" style={{ backgroundColor: '#FFFDFA', fontFamily: 'Poppins, Anuphan' }}>
          <div className="px-4 py-3 space-y-3">
            <Link 
              to="/adoption" 
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 hover:text-black hover:font-bold transition-all duration-200 py-2"
            >
              ตามหาบ้าน
            </Link>
            <Link 
              to="/lost-pets" 
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 hover:text-black hover:font-bold transition-all duration-200 py-2"
            >
              ตามหาสัตว์หาย
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 hover:text-black hover:font-bold transition-all duration-200 py-2"
            >
              เกี่ยวกับเรา
            </Link>

            {user ? (
              <>
                <hr className="my-2" />
                <Link 
                  to="/chat" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-gray-700 hover:text-black hover:font-bold transition-all duration-200 py-2"
                >
                  <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
                  แชท
                </Link>
                <Link 
                  to="/favorites" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-gray-700 hover:text-black hover:font-bold transition-all duration-200 py-2"
                >
                  <Bookmark className="w-5 h-5" strokeWidth={1.5} />
                  สมุดบันทึก
                </Link>
                {/* Notification button removed on mobile to simplify navbar */}
                <Link 
                  to="/profile" 
                  onClick={() => setIsOpen(false)}
                  className="block text-gray-700 hover:text-black hover:font-bold transition-all duration-200 py-2"
                >
                  โปรไฟล์ของฉัน
                </Link>
                <Link 
                  to="/my-posts" 
                  onClick={() => setIsOpen(false)}
                  className="block text-gray-700 hover:text-black hover:font-bold transition-all duration-200 py-2"
                >
                  โพสต์ของฉัน
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-white bg-black hover:bg-gray-800 transition-all duration-200 py-2 px-4 rounded-md"
                >
                  ล้อกเอาท์
                </button>
              </>
            ) : (
              <>
                <hr className="my-2" />
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)}
                  className="block text-center px-3 py-2 border border-gray-700 rounded-md text-black bg-white hover:bg-black hover:text-white hover:border-black transition-all duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setIsOpen(false)}
                  className="block text-center px-3 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-all duration-200"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
