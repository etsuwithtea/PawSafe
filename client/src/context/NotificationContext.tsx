import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { useAppSelector } from '../store/store';
import { useNavigate } from 'react-router-dom';
import NotificationModal, { type Notification } from '../components/NotificationModal';
import NotificationHistoryModal from '../components/NotificationHistoryModal';

interface NotificationContextType {
  notification: Notification | null;
  unreadCount: number;
  notificationHistory: Notification[];
  setNotification: (notification: Notification | null) => void;
  dismissNotification: () => void;
  clearUnreadCount: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAppSelector((state) => state.auth);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [notificationHistory, setNotificationHistory] = useState<Notification[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastCheckedTime, setLastCheckedTime] = useState<number>(Date.now());
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const pollMessages = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chat/conversations`
        );

        if (!response.ok) return;

        const data = await response.json();
        let newMessagesCount = 0;

        for (const convId of data.conversations) {
          if (!convId.includes(user._id)) continue;

          const messagesResponse = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chat?conversationId=${convId}`
          );

          if (!messagesResponse.ok) continue;

          const messagesData = await messagesResponse.json();
          const messages = messagesData.messages || [];

          for (const msg of messages) {
            const msgTime = new Date(msg.timestamp).getTime();

            if (msg.senderId !== user._id && msgTime > lastCheckedTime) {
              newMessagesCount++;

              try {
                const userResponse = await fetch(
                  `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users/${msg.senderId}`
                );

                let senderAvatar = '';
                if (userResponse.ok) {
                  const userData = await userResponse.json();
                  const senderData = userData.user || userData;
                  senderAvatar = senderData?.avatar || '';
                }

                const newNotif: Notification = {
                  id: msg._id,
                  senderName: msg.senderName,
                  senderAvatar,
                  message: msg.text,
                  conversationId: convId,
                  timestamp: msg.timestamp,
                  type: 'chat',
                };

                setNotification(newNotif);
                setNotificationHistory((prev) => [newNotif, ...prev]);
              } catch (error) {
                console.error('Error fetching sender info:', error);
                const newNotif: Notification = {
                  id: msg._id,
                  senderName: msg.senderName,
                  message: msg.text,
                  conversationId: convId,
                  timestamp: msg.timestamp,
                  type: 'chat',
                };
                setNotification(newNotif);
                setNotificationHistory((prev) => [newNotif, ...prev]);
              }

              setLastCheckedTime(Date.now());
              break;
            }
          }
        }

        if (newMessagesCount > 0) {
          setUnreadCount((prev) => prev + newMessagesCount);
        }
      } catch (error) {
        console.error('Error polling messages:', error);
      }
    };

    const interval = setInterval(pollMessages, 3000);

    return () => clearInterval(interval);
  }, [user, lastCheckedTime]);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const handleClearUnreadCount = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const contextValue: NotificationContextType = {
    notification,
    unreadCount,
    notificationHistory,
    setNotification,
    dismissNotification,
    clearUnreadCount: handleClearUnreadCount,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationModal
        notification={notification}
        onClose={dismissNotification}
        onOpenHistory={() => setShowHistory(true)}
      />
      <NotificationHistoryModal
        isOpen={showHistory}
        notifications={notificationHistory}
        onClose={() => setShowHistory(false)}
        onSelectNotification={(conversationId) => {
          navigate('/chat', { state: { conversationId } });
        }}
      />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
