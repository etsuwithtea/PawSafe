import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { Send, Search } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

interface Conversation {
  conversationId: string;
  lastMessage: ChatMessage;
  unreadCount: number;
  otherUserName?: string;
  otherUserId: string;
  otherUserAvatar?: string;
}

export default function ChatPage() {
  const auth = useSelector((state: RootState) => state.auth);
  const [messageText, setMessageText] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socketUrl = apiUrl.replace('/api', '');
    
    socketRef.current = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current?.id);
      if (auth.user) {
        socketRef.current?.emit('user_join', auth.user._id);
      }
    });

    socketRef.current.on('receive_message', (message: ChatMessage) => {
      console.log('Message received:', message);
      setMessages((prevMessages) => {
        // Avoid duplicates
        const exists = prevMessages.some(m => m._id === message._id);
        if (exists) return prevMessages;
        return [...prevMessages, message];
      });
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

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [auth.user]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      if (!auth.user) return;

      setIsLoadingConversations(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chat/conversations`
        );

        if (!response.ok) throw new Error('Failed to fetch conversations');

        const data = await response.json();

        const userConversations: Conversation[] = [];

        for (const convId of data.conversations) {
          if (convId.includes(auth.user?._id || '')) {
            const otherUserId = convId.split('-')[0] === auth.user?._id ? convId.split('-')[1] : convId.split('-')[0];

            try {
              const userResponse = await fetch(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users/${otherUserId}`
              );
              let otherUserName = otherUserId;
              let otherUserAvatar = '';

              if (userResponse.ok) {
                const userData = await userResponse.json();
                const user = userData.user || userData;
                otherUserName = user?.username || otherUserId;
                otherUserAvatar = user?.avatar || '';
              }

              userConversations.push({
                conversationId: convId,
                lastMessage: null as any,
                unreadCount: 0,
                otherUserName,
                otherUserId,
                otherUserAvatar,
              });
            } catch (error) {
              console.error('Error fetching user:', otherUserId, error);
              userConversations.push({
                conversationId: convId,
                lastMessage: null as any,
                unreadCount: 0,
                otherUserName: otherUserId,
                otherUserId,
              });
            }
          }
        }

        setConversations(userConversations);

        if (userConversations.length > 0 && !selectedConversation) {
          setSelectedConversation(userConversations[0].conversationId);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsLoadingConversations(false);
      }
    };

    fetchConversations();
  }, [auth.user]);

  // Fetch messages and join conversation room
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;

      setIsLoadingMessages(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chat?conversationId=${selectedConversation}`
        );

        if (!response.ok) throw new Error('Failed to fetch messages');

        const data = await response.json();
        setMessages(data.messages || []);

        // Join the conversation room via Socket.IO
        if (socketRef.current) {
          socketRef.current.emit('join_conversation', selectedConversation);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();

    return () => {
      // Leave the conversation room when switching
      if (selectedConversation && socketRef.current) {
        socketRef.current.emit('leave_conversation', selectedConversation);
      }
    };
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !auth.user || !selectedConversation) {
      return;
    }

    // Stop typing indicator
    if (socketRef.current) {
      socketRef.current.emit('user_stop_typing', selectedConversation);
    }

    const messageContent = messageText.trim();
    setMessageText('');

    try {
      // Send message via Socket.IO with callback
      if (socketRef.current) {
        socketRef.current.emit('send_message', 
          {
            conversationId: selectedConversation,
            senderId: auth.user._id,
            senderName: auth.user.username,
            text: messageContent,
          },
          (response: { success: boolean; message?: ChatMessage }) => {
            if (response.success && response.message) {
              console.log('Message sent successfully:', response.message);
              // Message will be received via receive_message event
            } else {
              console.error('Failed to send message');
              setMessageText(messageContent); // Restore message on error
            }
          }
        );
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessageText(messageContent); // Restore message on error
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = () => {
    if (!socketRef.current || !selectedConversation || !auth.user) return;

    socketRef.current.emit('user_typing', {
      conversationId: selectedConversation,
      senderName: auth.user.username,
    });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current) {
        socketRef.current.emit('user_stop_typing', selectedConversation);
      }
    }, 3000);
  };

  const filteredConversations = conversations.filter(conv =>
    (conv.otherUserName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!auth.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Please log in to use chat.</p>
      </div>
    );
  }

  const selectedConvData = conversations.find(c => c.conversationId === selectedConversation);

  return (
    <div className="flex h-screen bg-white">
      <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Anuphan' }}>
            แชท
          </h1>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาการสนทนา..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-0 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              style={{ fontFamily: 'Poppins, Anuphan' }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoadingConversations ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-gray-500">กำลังโหลด...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-gray-500 text-center px-4">
                {searchQuery ? 'ไม่พบการสนทนา' : 'ยังไม่มีการแชท'}
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.conversationId}
                onClick={() => setSelectedConversation(conv.conversationId)}
                className={`px-2 py-3 mx-2 rounded-lg cursor-pointer transition-all flex items-center gap-3 ${
                  selectedConversation === conv.conversationId
                    ? 'bg-blue-100'
                    : 'hover:bg-gray-100'
                }`}
                style={{ fontFamily: 'Poppins, Anuphan' }}
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.otherUserAvatar || 'https://via.placeholder.com/50?text=User'}
                    alt={conv.otherUserName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {conv.otherUserName}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {conv.lastMessage?.text || 'ไม่มีข้อความ'}
                  </p>
                </div>

                {conv.unreadCount > 0 && (
                  <div className="shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <p className="text-xs text-white font-bold">{conv.unreadCount}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="hidden md:flex flex-1 flex-col bg-white">
        {selectedConvData ? (
          <>
            <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={selectedConvData.otherUserAvatar || 'https://via.placeholder.com/40?text=User'}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-sm font-bold text-gray-900" style={{ fontFamily: 'Anuphan' }}>
                    {selectedConvData.otherUserName || 'ผู้ติดต่อ'}
                  </h2>
                  <p className="text-xs text-gray-500">ออนไลน์</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-gray-500">กำลังโหลด...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <img
                    src={selectedConvData.otherUserAvatar || 'https://via.placeholder.com/80?text=User'}
                    alt="User"
                    className="w-16 h-16 rounded-full object-cover mb-4"
                  />
                  <p className="text-sm font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Anuphan' }}>
                    {selectedConvData.otherUserName || 'ผู้ติดต่อ'}
                  </p>
                  <p className="text-xs text-gray-500">เริ่มการสนทนา</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwn = message.senderId === auth.user?._id;
                  return (
                    <div
                      key={message._id}
                      className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-2xl ${
                          isOwn
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-300 text-gray-900'
                        }`}
                        style={{ fontFamily: 'Poppins, Anuphan' }}
                      >
                        <p className="text-sm wrap-break-word">{message.text}</p>
                      </div>
                      <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                        {new Date(message.timestamp).toLocaleTimeString('th-TH', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  );
                })
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

            <div className="h-20 px-6 py-4 bg-white border-t border-gray-200 flex items-center gap-3 shrink-0">
              <input
                type="text"
                value={messageText}
                onChange={(e) => {
                  setMessageText(e.target.value);
                  handleTyping();
                }}
                onKeyPress={handleKeyDown}
                placeholder="Aa"
                className="flex-1 px-4 py-2 bg-gray-100 text-sm rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                style={{ fontFamily: 'Poppins, Anuphan' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="text-gray-400" size={40} />
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Anuphan' }}>
                เลือกการแชทเพื่อเริ่มข้อความ
              </p>
              <p className="text-sm text-gray-500">
                เลือกจากรายการแชทด้านซ้าย
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedConversation && (
        <div className="md:hidden absolute inset-0 bg-white flex flex-col z-50">
          {selectedConvData && (
            <>
              <div className="h-16 px-4 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="text-blue-500 font-semibold text-sm"
                  >
                    ← กลับ
                  </button>
                </div>
                <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Anuphan' }}>
                  {selectedConvData.otherUserName || 'ผู้ติดต่อ'}
                </h2>
                <div className="w-8" />
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map((message) => {
                  const isOwn = message.senderId === auth.user?._id;
                  return (
                    <div
                      key={message._id}
                      className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-2xl ${
                          isOwn
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-300 text-gray-900'
                        }`}
                        style={{ fontFamily: 'Poppins, Anuphan' }}
                      >
                        <p className="text-sm wrap-break-word">{message.text}</p>
                      </div>
                    </div>
                  );
                })}

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

              <div className="h-16 px-4 py-3 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={handleKeyDown}
                  placeholder="Aa"
                  className="flex-1 px-4 py-2 bg-gray-100 text-sm rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'Poppins, Anuphan' }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="p-2 rounded-full bg-blue-500 text-white disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
