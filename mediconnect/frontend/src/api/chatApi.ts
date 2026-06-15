import api from './axios';

export interface ChatUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface ChatMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const getChatUsers = async (): Promise<ChatUser[]> => {
  const response = await api.get('/chat/users');
  return response.data;
};

export const getChatHistory = async (otherUserId: number): Promise<ChatMessage[]> => {
  const response = await api.get(`/chat/messages/${otherUserId}`);
  return response.data;
};

export const markMessageAsRead = async (messageId: number): Promise<void> => {
  await api.put(`/chat/messages/${messageId}/read`);
};