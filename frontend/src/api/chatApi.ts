import api from './axios';

export interface ChatUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const getChatUsers = async (): Promise<ChatUser[]> => {
  const response = await api.get('/chat/users');
  return response.data;
};
