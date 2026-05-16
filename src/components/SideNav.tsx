import React from 'react';
import { theme } from '../styles/theme';

const navItems = [
  { label: 'Dashboard', key: 'dashboard' },
  { label: 'Diseases', key: 'diseases' },
  { label: 'Hospitals', key: 'hospitals' },
  { label: 'Doctors', key: 'doctors' },
  { label: 'Appointments', key: 'appointments' },
  { label: 'Profile', key: 'profile' },
];

interface SideNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SideNav = ({ activeTab, setActiveTab }: SideNavProps) => {
  return (
    <aside style={{ width: '210px', minHeight: '100vh', backgroundColor: theme.colors.sidebarBg, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <h2 style={{ color: 'white', margin: 0, fontSize: '17px', fontWeight: '600' }}>MediConnect</h2>
        <p style={{ color: theme.colors.sidebarText, margin: '4px 0 0', fontSize: '11px', opacity: 0.6 }}>Medical Portal</p>
      </div>
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        {navItems.map(item => {
          const isActive = activeTab === item.key;
          return (
            <div
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              style={{
                padding: '9px 12px', borderRadius: '6px', cursor: 'pointer', marginBottom: '2px',
                fontSize: '13px', color: isActive ? 'white' : theme.colors.sidebarText,
                backgroundColor: isActive ? theme.colors.sidebarActive : 'transparent',
                fontWeight: isActive ? '500' : '400',
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
