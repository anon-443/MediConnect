import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import { theme } from '../styles/theme';

const quickLinks = [
  { title: 'Disease Directory', desc: '108 diseases across 15 categories with symptoms, causes, treatments and prevention.', path: '/diseases', action: 'Browse diseases' },
  { title: 'Hospital Finder', desc: 'Find hospitals across Pakistan on a real map. Filter by city, type and specialty.', path: '/hospitals', action: 'Find hospitals' },
  { title: 'Doctors', desc: 'Browse 12 verified doctors. Filter by specialty and availability. Book or chat.', path: '/doctors', action: 'Browse doctors' },
  { title: 'Appointments', desc: 'Book, view and manage your doctor appointments all in one place.', path: '/appointments', action: 'Manage appointments' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'dashboard') navigate(`/${tab}`);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: theme.font,
      backgroundColor: theme.colors.background
    }}>

      <SideNav activeTab={activeTab} setActiveTab={handleTabChange} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        <TopNav />

        <main style={{ flex: 1, padding: '28px 32px' }}>

          <div style={{ marginBottom: '24px' }}>
            <h2 style={{
              color: theme.colors.text,
              margin: '0 0 4px',
              fontSize: '19px',
              fontWeight: '600'
            }}>
              Dashboard
            </h2>

            <p style={{
              color: theme.colors.textSecondary,
              fontSize: '13px',
              margin: 0
            }}>
              Welcome back, {user?.name || user?.email}
            </p>
          </div>

          <div style={{
            display: 'flex',
            gap: '14px',
            marginBottom: '28px',
            flexWrap: 'wrap'
          }}>
            <StatCard title="Diseases" value={108} subtitle="In directory" />
            <StatCard title="Hospitals" value={24} subtitle="Across Pakistan" />
            <StatCard title="Doctors" value={12} subtitle="Verified specialists" />
            <StatCard title="Account" value="Active" subtitle={user?.role || ''} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
            {quickLinks.map(link => (
              <div
                key={link.path}
                onClick={() => navigate(link.path)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: theme.borderRadius,
                  border: `1px solid ${theme.colors.border}`,
                  boxShadow: theme.colors.cardShadow,
                  padding: '22px',
                  cursor: 'pointer'
                }}
              >
                <h3 style={{
                  color: theme.colors.primaryDark,
                  margin: '0 0 8px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {link.title}
                </h3>

                <p style={{
                  color: theme.colors.textSecondary,
                  fontSize: '13px',
                  margin: '0 0 14px',
                  lineHeight: '1.6'
                }}>
                  {link.desc}
                </p>

                <span style={{
                  fontSize: '13px',
                  color: theme.colors.primary,
                  fontWeight: '500'
                }}>
                  {link.action} →
                </span>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;