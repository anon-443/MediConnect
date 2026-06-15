import React, { useState, useEffect } from 'react';
import Chat from '../components/Chat';
import { getChatUsers, ChatUser } from '../api/chatApi';

const ChatPage: React.FC = () => {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const currentUserRole = localStorage.getItem('user_role') || '';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await getChatUsers();
        setUsers(userList);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    
    fetchUsers();
  }, []);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
      <div style={styles.sidebar}>
        <h3 style={styles.sidebarTitle}>
          {currentUserRole === 'patient' ? 'Doctors' : currentUserRole === 'doctor' ? 'Patients' : 'Users'}
        </h3>
        {users.length === 0 ? (
          <p style={styles.noUsers}>No users available</p>
        ) : (
          users.map(user => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              style={{
                ...styles.userItem,
                ...(selectedUser?.id === user.id ? styles.userItemActive : {}),
              }}
            >
              <div style={styles.userAvatar}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div style={styles.userInfo}>
                <div style={styles.userName}>{user.name}</div>
                <div style={styles.userRole}>{user.role}</div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div style={styles.chatArea}>
        {selectedUser ? (
          <Chat
            receiverId={selectedUser.id}
            receiverName={selectedUser.name}
            receiverRole={selectedUser.role}
          />
        ) : (
          <div style={styles.noChat}>
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '280px',
    borderRight: '1px solid #e0e0e0',
    backgroundColor: '#fff',
    overflowY: 'auto' as const,
  },
  sidebarTitle: {
    padding: '20px',
    margin: 0,
    borderBottom: '1px solid #e0e0e0',
    fontSize: '18px',
  },
  userItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 20px',
    cursor: 'pointer',
    transition: 'backgroundColor 0.2s',
    borderBottom: '1px solid #f0f0f0',
  },
  userItemActive: {
    backgroundColor: '#e3f2fd',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#4a90e2',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    marginRight: '15px',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  userRole: {
    fontSize: '12px',
    color: '#666',
  },
  noUsers: {
    padding: '20px',
    textAlign: 'center' as const,
    color: '#999',
  },
  chatArea: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#f9f9f9',
  },
  noChat: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#999',
  },
};

export default ChatPage;