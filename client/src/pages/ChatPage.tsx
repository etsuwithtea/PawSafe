import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import {
  setCurrentConversation,
  clearMessages,
} from '../store/chatSlice';
import { sendMessage, startPolling } from '../store/chatActions';

export default function ChatPage() {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const chat = useSelector((state: RootState) => state.chat);
  const [messageText, setMessageText] = useState('');
  const [conversationId, setConversationIdInput] = useState('general');
  const [isConversationSet, setIsConversationSet] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingStopRef = useRef<(() => void) | null>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  // Handle starting a new conversation
  const handleStartConversation = () => {
    if (!conversationId.trim()) {
      alert('Please enter a conversation ID');
      return;
    }

    dispatch(setCurrentConversation(conversationId));
    dispatch(clearMessages() as any);

    // Stop previous polling if any
    if (pollingStopRef.current) {
      pollingStopRef.current();
    }

    // Start polling for the new conversation
    const stopPolling = dispatch(
      startPolling(conversationId) as any
    ) as () => void;
    pollingStopRef.current = stopPolling;
    setIsConversationSet(true);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !auth.user) {
      return;
    }

    try {
      await dispatch(
        sendMessage(
          chat.currentConversationId || conversationId,
          auth.user._id || 'anonymous',
          auth.user.username || 'Anonymous',
          messageText
        ) as any
      );
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingStopRef.current) {
        pollingStopRef.current();
      }
    };
  }, []);

  // Handle Enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!auth.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Please log in to use chat.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-xs">
        <h1 className="text-2xl font-bold text-gray-800">Chat</h1>
        <p className="text-sm text-gray-600 mt-1">
          User: <span className="font-semibold">{auth.user.username}</span>
        </p>
      </div>

      {/* Conversation Setup */}
      {!isConversationSet && (
        <div className="bg-blue-50 border-b-2 border-blue-200 p-4">
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={conversationId}
              onChange={(e) => setConversationIdInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleStartConversation();
              }}
              placeholder="Enter conversation ID..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
            <button
              onClick={handleStartConversation}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Join
            </button>
          </div>
          {chat.currentConversationId && (
            <p className="text-sm text-green-700 mt-2">
              ✓ Joined conversation: <strong>{chat.currentConversationId}</strong>
            </p>
          )}
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-center">
              {chat.currentConversationId
                ? 'No messages yet. Start the conversation!'
                : 'Join a conversation to start chatting.'}
            </p>
          </div>
        ) : (
          chat.messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${
                message.senderId === auth.user?._id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === auth.user?._id
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-300 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="text-sm font-semibold">
                  {message.senderName}
                </p>
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.senderId === auth.user?._id
                      ? 'text-blue-100'
                      : 'text-gray-600'
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error message */}
      {chat.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 m-4 rounded-sm">
          {chat.error}
        </div>
      )}

      {/* Input Area */}
      {isConversationSet && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message... (Shift+Enter for new line)"
              rows={2}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none text-gray-900 placeholder-gray-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            🔄 Polling every 1 second | Conversation: {chat.currentConversationId}
          </p>
        </div>
      )}
    </div>
  );
}
