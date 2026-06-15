import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../styles/theme';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Diseases', path: '/dashboard' },
  { label: 'Hospitals', path: '/dashboard' },
  { label: 'Doctors', path: '/dashboard' },
  { label: 'Appointments', path: '/dashboard' },
  { label: 'Chat', path: '/chat' },
  { label: 'Profile', path: '/dashboard' },
];

const SideNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (item) => {
    if (item.label === 'Chat') {
      return location.pathname === '/chat';
    }
    return location.pathname === item.path && item.label === 'Dashboard';
  };

  return (
    <aside style={{
      width: '210px',
      minHeight: '100vh',
      backgroundColor: theme.colors.sidebarBg,
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <h2 style={{ color: 'white', margin: 0, fontSize: '17px', fontWeight: '600', letterSpacing: '-0.3px' }}>MediConnect</h2>
        <p style={{ color: theme.colors.sidebarText, margin: '4px 0 0', fontSize: '11px', opacity: 0.6 }}>Medical Portal</p>
      </div>

      <nav style={{ padding: '12px 10px', flex: 1 }}>
        {navItems.map(item => {
          const active = isActive(item);
          return (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                padding: '9px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                marginBottom: '2px',
                fontSize: '13px',
                color: active ? 'white' : theme.colors.sidebarText,
                backgroundColor: active ? theme.colors.sidebarActive : 'transparent',
                fontWeight: active ? '500' : '400',
              }}
            >
              {item.label}
            </div>
          );
        })}
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <p style={{ color: theme.colors.sidebarText, fontSize: '11px', opacity: 0.5, margin: 0 }}>v1.0.0</p>
      </div>
    </aside>
  );
};

export default SideNav;
