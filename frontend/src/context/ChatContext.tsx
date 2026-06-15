import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

interface ChatMessage {
  id?: number;
  sender_id: number;
  sender_name: string;
  sender_role: string;
  message: string;
  timestamp: string;
  status?: string;
}

interface ChatContextType {
  sendMessage: (receiverId: number, message: string) => void;
  messages: ChatMessage[];
  isConnected: boolean;
  connect: (token: string) => void;
  disconnect: () => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = (token: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = `ws://127.0.0.1:8000/chat/ws/chat/${token}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status === 'sent') {
        setMessages(prev => prev.map(msg => 
          msg.message === data.message_id ? { ...msg, status: 'sent' } : msg
        ));
      } else if (data.sender_id) {
        setMessages(prev => [...prev, data]);
      }
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    wsRef.current = ws;
  };

  const sendMessage = (receiverId: number, message: string) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify({
        receiver_id: receiverId,
        message: message
      }));
    }
  };

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  };

  return (
    <ChatContext.Provider value={{ sendMessage, messages, isConnected, connect, disconnect, addMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};
