import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, MessageCircle, Clock, ChevronRight } from 'lucide-react';

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
  onOpenHistory?: () => void;
}

const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const msgTime = new Date(timestamp);
  const diffMs = now.getTime() - msgTime.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'เพิ่งมา';
  if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
  if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
  if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
  
  return msgTime.toLocaleString('th-TH', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function NotificationModal({
  notification,
  onClose,
  onOpenHistory,
}: NotificationModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      if (!isHovered) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }, 6000);
        return () => clearTimeout(timer);
      }
    }
  }, [notification, onClose, isHovered]);

  if (!notification) return null;
  const formattedTime = formatTimeAgo(notification.timestamp);

  const container = (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{ zIndex: 999999 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden max-w-sm w-96">
        {/* Header with close button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">ข้อความใหม่</p>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Sender info */}
          <div className="flex items-start gap-3 mb-3">
            {notification.senderAvatar ? (
              <img
                src={notification.senderAvatar}
                alt={notification.senderName}
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <MessageCircle size={20} className="text-blue-600" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-gray-900 text-sm"
                style={{ fontFamily: 'Anuphan, Poppins' }}
              >
                {notification.senderName}
              </h3>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                <Clock size={12} />
                <span>{formattedTime}</span>
              </div>
            </div>
          </div>

          {/* Message preview */}
          <div
            className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-100"
            style={{ fontFamily: 'Poppins, Anuphan' }}
          >
            <p className="text-sm text-gray-800 line-clamp-3">{notification.message}</p>
          </div>

          {/* Action button */}
          <button
            onClick={() => {
              if (onOpenHistory) {
                onOpenHistory();
              }
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="w-full px-3 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 active:scale-95 text-sm flex items-center justify-center gap-2"
            style={{ fontFamily: 'Poppins, Anuphan' }}
          >
            ดูข้อความทั้งหมด
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return container;
  return createPortal(container, document.body);

  
}
