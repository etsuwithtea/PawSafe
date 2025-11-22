import { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';

export interface Notification {
  id: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  conversationId: string;
  timestamp: string;
  type: 'chat' | 'system';
}

interface NotificationModalProps {
  notification: Notification | null;
  onClose: () => void;
  onReply?: (conversationId: string) => void;
}

export default function NotificationModal({
  notification,
  onClose,
  onReply,
}: NotificationModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-white rounded-xl shadow-2xl border border-yellow-200 overflow-hidden max-w-sm w-full">
        <div className="h-1 bg-linear-to-r from-yellow-400 to-yellow-500"></div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1">
              {notification.senderAvatar ? (
                <img
                  src={notification.senderAvatar}
                  alt={notification.senderName}
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                  <MessageCircle size={24} className="text-yellow-600" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3
                  className="font-bold text-gray-900 text-sm truncate"
                  style={{ fontFamily: 'Poppins, Anuphan' }}
                >
                  {notification.senderName}
                </h3>
                <p className="text-xs text-gray-500">ส่งข้อความถึงคุณ</p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          <div
            className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200"
            style={{ fontFamily: 'Poppins, Anuphan' }}
          >
            <p className="text-sm text-gray-800 line-clamp-3">{notification.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(notification.timestamp).toLocaleTimeString('th-TH', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <button
            onClick={() => {
              if (onReply) {
                onReply(notification.conversationId);
              }
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="w-full px-4 py-2 bg-linear-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 active:scale-95 text-sm"
            style={{ fontFamily: 'Poppins, Anuphan' }}
          >
            ตอบกลับ
          </button>
        </div>
      </div>
    </div>
  );
}
