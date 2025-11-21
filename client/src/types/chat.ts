export interface ChatMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ChatState {
  messages: ChatMessage[];
  currentConversationId: string | null;
  lastPollingTime: number;
  isPolling: boolean;
  error: string | null;
}
