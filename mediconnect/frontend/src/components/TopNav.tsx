import React from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';

const TopNav = () => {
  const { user, logout } = useAuth();

  return (
    <header style={{
      height: '54px',
      backgroundColor: 'white',
      borderBottom: `1px solid ${theme.colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 28px',
      gap: '14px',
    }}>
      <span style={{ fontSize: '13px', color: theme.colors.textSecondary }}>
        {user?.name || user?.email}
      </span>
      <span style={{
        fontSize: '11px',
        backgroundColor: theme.colors.primaryLight,
        color: theme.colors.primaryDark,
        padding: '3px 9px',
        borderRadius: '12px',
        fontWeight: '500',
        textTransform: 'capitalize',
      }}>
        {user?.role}
      </span>
      <button
        onClick={logout}
        style={{
          padding: '6px 14px',
          backgroundColor: 'transparent',
          border: `1px solid ${theme.colors.primaryBorder}`,
          borderRadius: '6px',
          color: theme.colors.primaryDark,
          fontSize: '13px',
          cursor: 'pointer',
          fontWeight: '500',
          fontFamily: theme.font,
        }}
      >
        Logout
      </button>
    </header>
  );
};

export default TopNav;
