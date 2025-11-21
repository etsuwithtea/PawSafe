import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

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

const initialState: ChatState = {
  messages: [],
  currentConversationId: null,
  lastPollingTime: 0,
  isPolling: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentConversation: (state, action: PayloadAction<string>) => {
      state.currentConversationId = action.payload;
      state.messages = [];
      state.lastPollingTime = 0;
    },
    addMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      // Add new messages while avoiding duplicates
      const existingIds = new Set(state.messages.map((m) => m._id));
      const newMessages = action.payload.filter((m) => !existingIds.has(m._id));
      state.messages.push(...newMessages);
      state.messages.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setLastPollingTime: (state, action: PayloadAction<number>) => {
      state.lastPollingTime = action.payload;
    },
    setPolling: (state, action: PayloadAction<boolean>) => {
      state.isPolling = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentConversation,
  addMessages,
  clearMessages,
  setLastPollingTime,
  setPolling,
  setError,
} = chatSlice.actions;

export default chatSlice.reducer;
