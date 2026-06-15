import React, { useState, useEffect } from 'react';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import { theme } from '../styles/theme';
import { getChatUsers, ChatUser } from '../api/chatApi';

const ChatPage: React.FC = () => {
  const [users, setUsers] = useState<ChatUser[]>([]);
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
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: theme.font, backgroundColor: theme.colors.background }}>
      <SideNav />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopNav />
        <main style={{ flex: 1, padding: '28px 32px' }}>
          <h2 style={{ color: theme.colors.text, marginBottom: '20px' }}>Chat</h2>
          <div style={{ backgroundColor: 'white', borderRadius: theme.borderRadius, padding: '20px' }}>
            <h3>Chat Coming Soon</h3>
            <p>You can chat with: {users.map(u => u.name).join(', ') || 'No users found'}</p>
            <p>Your role: {currentUserRole}</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
