import React, { useState, useEffect, useRef } from 'react';

interface ChatProps {
  receiverId: number;
  receiverName: string;
  receiverRole: string;
}

const Chat: React.FC<ChatProps> = ({ receiverId, receiverName, receiverRole }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages(prev => [...prev, {
        message: inputMessage,
        timestamp: new Date().toISOString(),
        isMine: true
      }]);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '500px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      backgroundColor: '#fff',
    }}>
      <div style={{
        padding: '15px',
        backgroundColor: '#4a90e2',
        color: 'white',
        borderRadius: '8px 8px 0 0',
      }}>
        <strong>Chat with {receiverName}</strong>
        <span style={{ fontSize: '12px', marginLeft: '10px' }}>({receiverRole})</span>
      </div>
      
      <div style={{
        flex: 1,
        padding: '15px',
        overflowY: 'auto',
        backgroundColor: '#f5f5f5',
      }}>
        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999' }}>No messages yet. Start a conversation!</p>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} style={{
              maxWidth: '70%',
              padding: '8px 12px',
              margin: '5px 0',
              borderRadius: '12px',
              backgroundColor: msg.isMine ? '#4a90e2' : 'white',
              color: msg.isMine ? 'white' : '#333',
              alignSelf: msg.isMine ? 'flex-end' : 'flex-start',
              marginLeft: msg.isMine ? 'auto' : '0',
            }}>
              <p style={{ margin: 0 }}>{msg.message}</p>
              <small style={{ fontSize: '10px', opacity: 0.7 }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </small>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div style={{
        display: 'flex',
        padding: '10px',
        borderTop: '1px solid #e0e0e0',
      }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #e0e0e0',
            borderRadius: '20px',
            marginRight: '10px',
            outline: 'none',
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
