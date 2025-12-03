import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, MessageCircle, Clock } from 'lucide-react';

export interface NotificationItem {
  id: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  conversationId: string;
  timestamp: string;
  type: 'chat' | 'system';
}

interface NotificationHistoryModalProps {
  isOpen: boolean;
  notifications: NotificationItem[];
  onClose: () => void;
  onSelectNotification: (conversationId: string, senderName: string) => void;
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

export default function NotificationHistoryModal({
  isOpen,
  notifications,
  onClose,
  onSelectNotification,
}: NotificationHistoryModalProps) {
  if (!isOpen) return null;

  // Group notifications by sender
  const groupedNotifications = notifications.reduce((acc, notif) => {
    const existing = acc.find(group => group.senderId === notif.conversationId);
    if (existing) {
      existing.notifications.push(notif);
    } else {
      acc.push({
        senderId: notif.conversationId,
        senderName: notif.senderName,
        senderAvatar: notif.senderAvatar,
        notifications: [notif],
      });
    }
    return acc;
  }, [] as Array<{
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    notifications: NotificationItem[];
  }>);

  const container = (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        style={{ zIndex: 9999998 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999999 }}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Anuphan' }}>
              ข้อความ
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {groupedNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <MessageCircle size={48} className="text-gray-300 mb-3" />
                <p className="text-gray-500" style={{ fontFamily: 'Anuphan' }}>
                  ไม่มีข้อความ
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {groupedNotifications.map((group) => {
                  const latestNotif = group.notifications[group.notifications.length - 1];
                  return (
                    <div
                      key={group.senderId}
                      onClick={() => {
                        onSelectNotification(group.senderId, group.senderName);
                        onClose();
                      }}
                      className="p-4 hover:bg-blue-50 transition-colors cursor-pointer border-l-4 border-transparent hover:border-l-blue-500"
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        {group.senderAvatar ? (
                          <img
                            src={group.senderAvatar}
                            alt={group.senderName}
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
                            {group.senderName}
                          </h3>
                          
                          <p
                            className="text-sm text-gray-600 line-clamp-2 mt-1"
                            style={{ fontFamily: 'Poppins, Anuphan' }}
                          >
                            {latestNotif.message}
                          </p>

                          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                            <Clock size={12} />
                            <span>{formatTimeAgo(latestNotif.timestamp)}</span>
                          </div>
                        </div>

                        {/* Badge count */}
                        {group.notifications.length > 1 && (
                          <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                              {group.notifications.length > 9 ? '9+' : group.notifications.length}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  if (typeof document === 'undefined') return container;
  return createPortal(container, document.body);
}
