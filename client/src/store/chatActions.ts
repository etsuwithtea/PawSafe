import axios from 'axios';
import type { AppDispatch, RootState } from './store';
import {
  addMessages,
  setLastPollingTime,
  setPolling,
  setError,
} from './chatSlice';

const API_URL = 'http://localhost:5000/api/chat';

// Send a message
export const sendMessage = (
  conversationId: string,
  senderId: string,
  senderName: string,
  text: string
) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.post(`${API_URL}`, {
      conversationId,
      senderId,
      senderName,
      text,
    });

    if (response.data.message) {
      dispatch(addMessages([response.data.message]));
    }

    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to send message';
    dispatch(setError(errorMessage));
    console.error('Error sending message:', error);
    throw error;
  }
};

// Poll for new messages (1 second interval)
export const pollMessages =
  (conversationId: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const state = getState();
      const lastPollingTime = state.chat.lastPollingTime;

      const params: any = { conversationId };
      if (lastPollingTime > 0) {
        params.since = lastPollingTime;
      }

      const response = await axios.get(`${API_URL}`, { params });

      if (response.data.messages && response.data.messages.length > 0) {
        dispatch(addMessages(response.data.messages));
      }

      // Update the last polling time
      dispatch(setLastPollingTime(response.data.timestamp));
      dispatch(setError(null));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Polling error';
      dispatch(setError(errorMessage));
      console.error('Error polling messages:', error);
    }
  };

// Start polling for messages with 1-second interval
export const startPolling =
  (conversationId: string) => (dispatch: AppDispatch) => {
    dispatch(setPolling(true));

    // Initial fetch
    dispatch(pollMessages(conversationId) as any);

    // Set up interval for polling every 1 second
    const intervalId = setInterval(() => {
      dispatch(pollMessages(conversationId) as any);
    }, 1000); // 1 second polling interval

    // Return a function to stop polling
    return () => {
      clearInterval(intervalId);
      dispatch(setPolling(false));
    };
  };
