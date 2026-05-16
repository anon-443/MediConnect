import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import { theme } from '../styles/theme';

const doctors = [
  { id: 1, name: 'Dr. Ahmed Raza', specialty: 'Cardiologist', hospital: 'Punjab Institute of Cardiology, Lahore', experience: 14, available: true, gender: 'Male', qualification: 'MBBS, FCPS (Cardiology)', languages: ['Urdu', 'English'], fee: 2000 },
  { id: 2, name: 'Dr. Sara Malik', specialty: 'Neurologist', hospital: 'Shifa International Hospital, Islamabad', experience: 10, available: true, gender: 'Female', qualification: 'MBBS, FCPS (Neurology)', languages: ['Urdu', 'English'], fee: 2500 },
  { id: 3, name: 'Dr. Bilal Khan', specialty: 'Orthopedic Surgeon', hospital: 'Services Hospital, Lahore', experience: 12, available: false, gender: 'Male', qualification: 'MBBS, MS (Orthopedics)', languages: ['Urdu', 'Punjabi', 'English'], fee: 1800 },
  { id: 4, name: 'Dr. Ayesha Tariq', specialty: 'Gynecologist', hospital: 'Aga Khan University Hospital, Karachi', experience: 9, available: true, gender: 'Female', qualification: 'MBBS, FCPS (Gynecology)', languages: ['Urdu', 'English', 'Sindhi'], fee: 3000 },
  { id: 5, name: 'Dr. Usman Farooq', specialty: 'Dermatologist', hospital: 'Mayo Hospital, Lahore', experience: 7, available: true, gender: 'Male', qualification: 'MBBS, DDVL', languages: ['Urdu', 'English'], fee: 1500 },
  { id: 6, name: 'Dr. Nadia Hussain', specialty: 'Pediatrician', hospital: "Children's Hospital, Lahore", experience: 11, available: true, gender: 'Female', qualification: 'MBBS, FCPS (Pediatrics)', languages: ['Urdu', 'English'], fee: 1500 },
  { id: 7, name: 'Dr. Kamran Iqbal', specialty: 'Oncologist', hospital: 'Shaukat Khanum Memorial Hospital, Lahore', experience: 16, available: false, gender: 'Male', qualification: 'MBBS, FCPS (Oncology)', languages: ['Urdu', 'English'], fee: 4000 },
  { id: 8, name: 'Dr. Hina Baig', specialty: 'Psychiatrist', hospital: 'PIMS Hospital, Islamabad', experience: 8, available: true, gender: 'Female', qualification: 'MBBS, FCPS (Psychiatry)', languages: ['Urdu', 'English'], fee: 2000 },
  { id: 9, name: 'Dr. Tariq Mehmood', specialty: 'Diabetologist', hospital: 'Nishtar Hospital, Multan', experience: 13, available: true, gender: 'Male', qualification: 'MBBS, MRCP (UK)', languages: ['Urdu', 'English', 'Punjabi'], fee: 2000 },
  { id: 10, name: 'Dr. Sadia Noor', specialty: 'Ophthalmologist', hospital: 'Liaquat National Hospital, Karachi', experience: 6, available: true, gender: 'Female', qualification: 'MBBS, FCPS (Ophthalmology)', languages: ['Urdu', 'English', 'Sindhi'], fee: 1800 },
  { id: 11, name: 'Dr. Faisal Aziz', specialty: 'Pulmonologist', hospital: 'Hayatabad Medical Complex, Peshawar', experience: 10, available: false, gender: 'Male', qualification: 'MBBS, FCPS (Pulmonology)', languages: ['Urdu', 'Pashto', 'English'], fee: 2200 },
  { id: 12, name: 'Dr. Rabia Sheikh', specialty: 'Gastroenterologist', hospital: 'Doctors Hospital, Lahore', experience: 9, available: true, gender: 'Female', qualification: 'MBBS, FCPS (Gastroenterology)', languages: ['Urdu', 'English'], fee: 2500 },
];

const specialties = ['All', 'Cardiologist', 'Neurologist', 'Orthopedic Surgeon', 'Gynecologist', 'Dermatologist', 'Pediatrician', 'Oncologist', 'Psychiatrist', 'Diabetologist', 'Ophthalmologist', 'Pulmonologist', 'Gastroenterologist'];

const DoctorsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [availableOnly, setAvailableOnly] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.replace(/[<>{}]/g, ''));
  };

  const filtered = doctors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase()) ||
      d.hospital.toLowerCase().includes(search.toLowerCase());
    const matchSpecialty = selectedSpecialty === 'All' || d.specialty === selectedSpecialty;
    const matchAvailable = !availableOnly || d.available;
    return matchSearch && matchSpecialty && matchAvailable;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: theme.font, backgroundColor: theme.colors.background }}>
      <SideNav activeTab="doctors" setActiveTab={(tab) => {
        if (tab === 'dashboard') navigate('/dashboard');
        if (tab === 'diseases') navigate('/diseases');
        if (tab === 'hospitals') navigate('/hospitals');
        if (tab === 'appointments') navigate('/appointments');
        if (tab === 'profile') navigate('/profile');
      }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopNav />
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>

          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ color: theme.colors.text, margin: '0 0 4px', fontSize: '19px', fontWeight: '600' }}>Doctors</h2>
            <p style={{ color: theme.colors.textSecondary, fontSize: '13px', margin: 0 }}>Browse and consult verified doctors</p>
          </div>

          {/* Search & Filter */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by name, specialty or hospital..."
              value={search}
              onChange={handleSearch}
              maxLength={60}
              style={{ padding: '9px 14px', border: `1px solid ${theme.colors.primaryBorder}`, borderRadius: '8px', fontSize: '13px', outline: 'none', flex: 1, minWidth: '220px', backgroundColor: 'white', fontFamily: theme.font, color: theme.colors.text }}
            />
            <select
              value={selectedSpecialty}
              onChange={e => setSelectedSpecialty(e.target.value)}
              style={{ padding: '9px 14px', border: `1px solid ${theme.colors.primaryBorder}`, borderRadius: '8px', fontSize: '13px', outline: 'none', backgroundColor: 'white', fontFamily: theme.font, cursor: 'pointer', color: theme.colors.text }}
            >
              {specialties.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: theme.colors.text, cursor: 'pointer' }}>
              <input type="checkbox" checked={availableOnly} onChange={e => setAvailableOnly(e.target.checked)} />
              Available only
            </label>
          </div>

          <p style={{ fontSize: '13px', color: theme.colors.textSecondary, marginBottom: '16px' }}>
            Showing <strong>{filtered.length}</strong> doctors
          </p>

          {/* Doctor Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
            {filtered.map(doc => (
              <div key={doc.id} style={{ backgroundColor: 'white', borderRadius: theme.borderRadius, border: `1px solid ${theme.colors.border}`, boxShadow: theme.colors.cardShadow, padding: '20px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: theme.colors.primaryLight, color: theme.colors.primaryDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', flexShrink: 0 }}>
                      {doc.name.split(' ')[1]?.[0] || 'D'}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: theme.colors.text }}>{doc.name}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: theme.colors.primaryDark, fontWeight: '500' }}>{doc.specialty}</p>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '12px',
                    backgroundColor: doc.available ? '#dcfce7' : '#fee2e2',
                    color: doc.available ? '#15803d' : '#dc2626',
                  }}>
                    {doc.available ? 'Available' : 'Busy'}
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: theme.colors.textSecondary, margin: '0 0 6px', lineHeight: '1.5' }}>{doc.hospital}</p>
                <p style={{ fontSize: '12px', color: theme.colors.textSecondary, margin: '0 0 10px' }}>{doc.qualification} · {doc.experience} years exp.</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: `1px solid ${theme.colors.border}` }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: theme.colors.primaryDark }}>Rs. {doc.fee.toLocaleString()} / visit</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => navigate(`/chat/${doc.id}`)}
                      style={{ padding: '6px 12px', backgroundColor: theme.colors.primaryLight, color: theme.colors.primaryDark, border: `1px solid ${theme.colors.primaryBorder}`, borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', fontFamily: theme.font }}
                    >
                      Chat
                    </button>
                    <button
                      onClick={() => navigate('/appointments', { state: { doctor: doc.name, specialty: doc.specialty } })}
                      disabled={!doc.available}
                      style={{ padding: '6px 12px', backgroundColor: doc.available ? theme.colors.primary : '#d1d5db', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: doc.available ? 'pointer' : 'not-allowed', fontFamily: theme.font }}
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
};

export default DoctorsPage;
