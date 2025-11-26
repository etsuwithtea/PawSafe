import { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { useAppSelector } from '../store/store';
import type { Pet } from '../types/pet';
import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  _id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

interface ChatModalProps {
  pet: Pet;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatModal({ pet, isOpen, onClose }: ChatModalProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!isOpen || !user) return;

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socketUrl = apiUrl.replace('/api', '');

    if (!socketRef.current) {
      socketRef.current = io(socketUrl, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected in ChatModal:', socketRef.current?.id);
        if (user) {
          socketRef.current?.emit('user_join', user._id);
        }
      });

      socketRef.current.on('receive_message', (message: ChatMessage) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socketRef.current.on('typing_indicator', (data: { senderName?: string; isTyping: boolean }) => {
        if (data.isTyping && data.senderName) {
          setTypingUser(data.senderName);
          setIsTyping(true);
        } else {
          setIsTyping(false);
          setTypingUser('');
        }
      });
    }

    return () => {
      // Don't disconnect on unmount - keep connection alive
    };
  }, [isOpen, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && user) {
      fetchMessages();
      const conversationId = `${user._id}-${pet.contactUserId}`;
      if (socketRef.current) {
        socketRef.current.emit('join_conversation', conversationId);
      }
    }

    return () => {
      if (isOpen && user && socketRef.current) {
        const conversationId = `${user._id}-${pet.contactUserId}`;
        socketRef.current.emit('leave_conversation', conversationId);
      }
    };
  }, [isOpen, pet._id, user]);

  const fetchMessages = async () => {
    try {
      const conversationId = `${user?._id}-${pet.contactUserId}`;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chat?conversationId=${conversationId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !user) return;

    // Stop typing indicator
    if (socketRef.current) {
      const conversationId = `${user._id}-${pet.contactUserId}`;
      socketRef.current.emit('user_stop_typing', conversationId);
    }

    try {
      const conversationId = `${user._id}-${pet.contactUserId}`;

      // Send message via Socket.IO
      if (socketRef.current) {
        socketRef.current.emit('send_message', {
          conversationId,
          senderId: user._id,
          senderName: user.username,
          text: messageInput,
        });
      }

      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTyping = () => {
    if (!socketRef.current || !user) return;

    const conversationId = `${user._id}-${pet.contactUserId}`;
    socketRef.current.emit('user_typing', {
      conversationId,
      senderName: user.username,
    });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current) {
        socketRef.current.emit('user_stop_typing', conversationId);
      }
    }, 3000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-20 z-40 flex items-end justify-end p-4 pointer-events-auto">
      <div className="bg-white rounded-2xl w-full md:w-[500px] h-[75vh] md:h-[600px] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3">
            {pet.images && pet.images.length > 0 ? (
              <img
                src={pet.images[0]}
                alt={pet.contactName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">
                  {pet.contactName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-bold text-gray-900 text-sm" style={{ fontFamily: 'Poppins, Anuphan' }}>
                {pet.contactName}
              </h3>
              <p className="text-xs text-gray-500">ออนไลน์</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-white hover:text-black" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p style={{ fontFamily: 'Poppins, Anuphan' }}>เริ่มการสนทนา</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${
                  message.senderId === user?._id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.senderId === user?._id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300 text-gray-900'
                  }`}
                  style={{ fontFamily: 'Poppins, Anuphan' }}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString('th-TH', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-300 px-3 py-2 rounded-2xl">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <p className="text-xs text-gray-500">{typingUser} กำลังพิมพ์...</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-200 flex gap-2 shrink-0">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => {
              setMessageInput(e.target.value);
              handleTyping();
            }}
            onKeyPress={handleKeyDown}
            placeholder="พิมพ์ข้อความ..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ fontFamily: 'Poppins, Anuphan' }}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !messageInput.trim()}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
