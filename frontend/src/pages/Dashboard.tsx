import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import { theme } from '../styles/theme';
import api from '../api/axios';

const columns = [
  { key: 'name', label: 'Disease Name' },
  { key: 'category', label: 'Category' },
  { key: 'description', label: 'Description' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [diseases, setDiseases] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get('/diseases/', { params: { search, limit: 12 } });
        setDiseases(res.data.data);
        setTotal(res.data.total);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.replace(/[<>{}]/g, ''));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: theme.font, backgroundColor: theme.colors.background }}>
      <SideNav />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopNav />
        <main style={{ flex: 1, padding: '28px 32px' }}>

          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: theme.colors.text, margin: '0 0 4px', fontSize: '19px', fontWeight: '600' }}>Dashboard</h2>
            <p style={{ color: theme.colors.textSecondary, fontSize: '13px', margin: 0 }}>
              Welcome back, {user?.name || user?.email}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '14px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <StatCard title="Total Diseases" value={total} subtitle="In directory" />
            <StatCard title="Your Role" value={user?.role || ''} subtitle="Access level" />
            <StatCard title="Account" value="Active" subtitle="Current status" />
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: theme.borderRadius,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.colors.cardShadow,
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 20px',
              borderBottom: `1px solid ${theme.colors.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: theme.colors.text }}>Disease Directory</h3>
              <input
                type="text"
                placeholder="Search diseases..."
                value={search}
                onChange={handleSearch}
                maxLength={50}
                style={{
                  padding: '7px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${theme.colors.primaryBorder}`,
                  fontSize: '13px',
                  outline: 'none',
                  width: '200px',
                  fontFamily: theme.font,
                  color: theme.colors.text,
                }}
              />
            </div>
            <DataTable columns={columns} data={diseases} loading={loading} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
