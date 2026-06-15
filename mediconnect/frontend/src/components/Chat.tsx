import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { getChatHistory, ChatMessage as ApiMessage } from '../api/chatApi';

interface ChatProps {
  receiverId: number;
  receiverName: string;
  receiverRole: string;
}

const Chat: React.FC<ChatProps> = ({ receiverId, receiverName, receiverRole }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const { sendMessage, messages, isConnected, connect, addMessage, clearMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem('access_token') || '';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Connect to WebSocket
  useEffect(() => {
    if (token && !isConnected) {
      connect(token);
    }
    return () => {
      clearMessages();
    };
  }, [token]);

  // Load chat history when receiver changes
  useEffect(() => {
    const loadHistory = async () => {
      setHistoryLoaded(false);
      clearMessages();
      try {
        const history = await getChatHistory(receiverId);
        history.forEach((msg: ApiMessage) => {
          addMessage({
            id: msg.id,
            sender_id: msg.sender_id,
            sender_name: msg.sender_id === parseInt(localStorage.getItem('user_id') || '0') ? 'You' : receiverName,
            sender_role: msg.sender_id === parseInt(localStorage.getItem('user_id') || '0') ? 'user' : receiverRole,
            message: msg.message,
            timestamp: msg.created_at,
          });
        });
        setHistoryLoaded(true);
      } catch (error) {
        console.error('Failed to load chat history:', error);
        setHistoryLoaded(true);
      }
    };
    
    if (receiverId) {
      loadHistory();
    }
  }, [receiverId, receiverName, receiverRole]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && isConnected) {
      sendMessage(receiverId, inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const currentUserId = parseInt(localStorage.getItem('user_id') || '0');

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <strong>{receiverName}</strong>
          <span style={{ fontSize: '12px', marginLeft: '10px', color: '#666' }}>
            ({receiverRole})
          </span>
        </div>
        <span style={isConnected ? styles.online : styles.offline}>
          {isConnected ? '● Online' : '● Offline'}
        </span>
      </div>
      
      <div style={styles.messagesContainer}>
        {!historyLoaded ? (
          <div style={styles.loading}>Loading messages...</div>
        ) : messages.length === 0 ? (
          <div style={styles.noMessages}>No messages yet. Start a conversation!</div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                ...styles.messageBubble,
                ...(msg.sender_name === 'You' || msg.sender_id === currentUserId ? styles.sentMessage : styles.receivedMessage),
              }}
            >
              <div style={styles.messageSender}>
                {msg.sender_name !== 'You' && msg.sender_id !== currentUserId && <strong>{msg.sender_name}</strong>}
              </div>
              <p style={styles.messageText}>{msg.message}</p>
              <div style={styles.messageFooter}>
                <small>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </small>
                {msg.status === 'sending' && <small style={styles.sending}> Sending...</small>}
                {msg.status === 'sent' && <small style={styles.sent}> ✓</small>}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={styles.input}
          disabled={!isConnected}
        />
        <button onClick={handleSendMessage} style={styles.button} disabled={!isConnected}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '500px',
    width: '100%',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  header: {
    padding: '15px',
    backgroundColor: '#4a90e2',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  online: {
    color: '#4caf50',
    fontSize: '12px',
  },
  offline: {
    color: '#f44336',
    fontSize: '12px',
  },
  messagesContainer: {
    flex: 1,
    padding: '15px',
    overflowY: 'auto' as const,
    backgroundColor: '#f5f5f5',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '8px 12px',
    margin: '5px 0',
    borderRadius: '12px',
    position: 'relative' as const,
  },
  sentMessage: {
    backgroundColor: '#4a90e2',
    color: 'white',
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  receivedMessage: {
    backgroundColor: 'white',
    color: '#333',
    border: '1px solid #e0e0e0',
  },
  messageSender: {
    fontSize: '12px',
    marginBottom: '4px',
  },
  messageText: {
    margin: 0,
    fontSize: '14px',
  },
  messageFooter: {
    fontSize: '10px',
    marginTop: '4px',
    textAlign: 'right' as const,
  },
  sending: {
    color: '#ff9800',
  },
  sent: {
    color: '#4caf50',
  },
  inputContainer: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #e0e0e0',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #e0e0e0',
    borderRadius: '20px',
    marginRight: '10px',
    fontSize: '14px',
    outline: 'none',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '20px',
    color: '#999',
  },
  noMessages: {
    textAlign: 'center' as const,
    padding: '20px',
    color: '#999',
  },
};

export default Chat;