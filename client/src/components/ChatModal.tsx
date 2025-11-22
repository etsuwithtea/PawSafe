import { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { useAppSelector } from '../store/store';
import type { Pet } from '../types/pet';

interface ChatModalProps {
  pet: Pet;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatModal({ pet, isOpen, onClose }: ChatModalProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [messages, setMessages] = useState<Array<{ id: string; senderId: string; senderName: string; text: string; timestamp: string }>>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen, pet._id]);

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
      
      const formattedMessages = data.messages.map((msg: any) => ({
        id: msg._id,
        senderId: msg.senderId,
        senderName: msg.senderName,
        text: msg.text,
        timestamp: msg.timestamp,
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !user) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: user._id,
      senderName: user.username,
      text: messageInput,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');
    setIsLoading(true);

    try {
      const conversationId = `${user._id}-${pet.contactUserId}`;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conversationId,
            senderId: user._id,
            senderName: user.username,
            text: messageInput,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

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
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-transparent space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p style={{ fontFamily: 'Poppins, Anuphan' }}>เริ่มการสนทนา</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === user?._id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.senderId === user?._id
                      ? 'bg-yellow-400 text-gray-900'
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
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-200 flex gap-2 shrink-0">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="พิมพ์ข้อความ..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
            style={{ fontFamily: 'Poppins, Anuphan' }}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !messageInput.trim()}
            className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
