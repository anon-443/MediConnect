import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuth } from '../context/AuthContext';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import { theme } from '../styles/theme';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const hospitals = [
  { id: 1, name: 'Services Hospital Lahore', city: 'Lahore', type: 'Government', address: 'Jail Road, Lahore', phone: '042-99203300', emergency: true, beds: 1500, lat: 31.5497, lng: 74.3436, specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'General Surgery', 'Pediatrics'] },
  { id: 2, name: 'Shaukat Khanum Memorial Cancer Hospital', city: 'Lahore', type: 'Private', address: 'Johar Town, Lahore', phone: '042-35941200', emergency: true, beds: 195, lat: 31.4697, lng: 74.2728, specialties: ['Oncology', 'Radiology', 'Chemotherapy', 'Radiotherapy', 'Surgery'] },
  { id: 3, name: 'Mayo Hospital Lahore', city: 'Lahore', type: 'Government', address: 'Nila Gumbad, Lahore', phone: '042-99211100', emergency: true, beds: 2000, lat: 31.5620, lng: 74.3130, specialties: ['General Medicine', 'Pediatrics', 'Gynecology', 'Surgery', 'ENT'] },
  { id: 4, name: 'Jinnah Hospital Lahore', city: 'Lahore', type: 'Government', address: 'Jail Road, Lahore', phone: '042-99231400', emergency: true, beds: 1750, lat: 31.5260, lng: 74.3292, specialties: ['Trauma', 'Burns', 'Surgery', 'Emergency Medicine'] },
  { id: 5, name: 'Punjab Institute of Cardiology', city: 'Lahore', type: 'Government', address: 'Jail Road, Lahore', phone: '042-99203051', emergency: true, beds: 350, lat: 31.5350, lng: 74.3280, specialties: ['Cardiology', 'Cardiac Surgery', 'Interventional Cardiology', 'Electrophysiology'] },
  { id: 6, name: 'PKLI & Research Centre', city: 'Lahore', type: 'Government', address: 'Sheikhupura Road, Lahore', phone: '042-111-117-554', emergency: true, beds: 400, lat: 31.5890, lng: 74.2600, specialties: ['Kidney Transplant', 'Liver Transplant', 'Nephrology', 'Hepatology'] },
  { id: 7, name: 'Doctors Hospital Lahore', city: 'Lahore', type: 'Private', address: '152-G, Canal Bank Road, Lahore', phone: '042-35761288', emergency: true, beds: 300, lat: 31.4850, lng: 74.3500, specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Gynecology'] },
  { id: 8, name: 'Aga Khan University Hospital', city: 'Karachi', type: 'Private', address: 'Stadium Road, Karachi', phone: '021-34930051', emergency: true, beds: 700, lat: 24.9008, lng: 67.0848, specialties: ['Cardiology', 'Oncology', 'Neurology', 'Gynecology', 'Urology'] },
  { id: 9, name: 'Dr. Ruth KM Pfau Civil Hospital', city: 'Karachi', type: 'Government', address: 'Karachi City, Karachi', phone: '021-99215740', emergency: true, beds: 1800, lat: 24.8607, lng: 67.0011, specialties: ['General Medicine', 'Surgery', 'Pediatrics', 'Gynecology', 'Emergency'] },
  { id: 10, name: 'Liaquat National Hospital', city: 'Karachi', type: 'Private', address: 'National Stadium Road, Karachi', phone: '021-34412000', emergency: true, beds: 750, lat: 24.8964, lng: 67.0803, specialties: ['Cardiology', 'Orthopedics', 'Urology', 'Neurology', 'Oncology'] },
  { id: 11, name: 'Jinnah Postgraduate Medical Centre', city: 'Karachi', type: 'Government', address: 'Rafiqui Shaheed Road, Karachi', phone: '021-99201300', emergency: true, beds: 1500, lat: 24.8750, lng: 67.0200, specialties: ['Emergency', 'Nephrology', 'Neurology', 'Psychiatry', 'Orthopedics'] },
  { id: 12, name: 'PIMS Hospital Islamabad', city: 'Islamabad', type: 'Government', address: 'G-8, Islamabad', phone: '051-9261170', emergency: true, beds: 1100, lat: 33.6844, lng: 73.0479, specialties: ['Cardiology', 'Neurology', 'Nephrology', 'Oncology', 'Gynecology'] },
  { id: 13, name: 'Shifa International Hospital', city: 'Islamabad', type: 'Private', address: 'Pitras Bukhari Road, H-8/4, Islamabad', phone: '051-8464646', emergency: true, beds: 550, lat: 33.7215, lng: 73.0433, specialties: ['Liver Transplant', 'Cardiology', 'Oncology', 'Neurology', 'Orthopedics'] },
  { id: 14, name: 'Polyclinic Hospital Islamabad', city: 'Islamabad', type: 'Government', address: 'G-6, Islamabad', phone: '051-9218300', emergency: true, beds: 700, lat: 33.7200, lng: 73.0600, specialties: ['General Medicine', 'Surgery', 'Gynecology', 'Pediatrics', 'ENT'] },
  { id: 15, name: 'Holy Family Hospital Rawalpindi', city: 'Rawalpindi', type: 'Government', address: 'Satellite Town, Rawalpindi', phone: '051-9290300', emergency: true, beds: 900, lat: 33.5651, lng: 73.0169, specialties: ['General Medicine', 'Gynecology', 'Surgery', 'Pediatrics', 'Orthopedics'] },
  { id: 16, name: 'Benazir Bhutto Hospital', city: 'Rawalpindi', type: 'Government', address: 'Murree Road, Rawalpindi', phone: '051-9290400', emergency: true, beds: 750, lat: 33.6007, lng: 73.0679, specialties: ['General Medicine', 'Gynecology', 'Pediatrics', 'Surgery', 'Cardiology'] },
  { id: 17, name: 'Hayatabad Medical Complex', city: 'Peshawar', type: 'Government', address: 'Hayatabad Phase 5, Peshawar', phone: '091-9217480', emergency: true, beds: 800, lat: 34.0151, lng: 71.4315, specialties: ['Trauma', 'Burns', 'Neurology', 'Cardiology', 'Oncology'] },
  { id: 18, name: 'Lady Reading Hospital', city: 'Peshawar', type: 'Government', address: 'Peshawar City, Peshawar', phone: '091-9211267', emergency: true, beds: 1600, lat: 34.0058, lng: 71.5249, specialties: ['General Medicine', 'Pediatrics', 'Surgery', 'Gynecology', 'Neurology'] },
  { id: 19, name: 'Allied Hospital Faisalabad', city: 'Faisalabad', type: 'Government', address: 'Jail Road, Faisalabad', phone: '041-9200500', emergency: true, beds: 1200, lat: 31.4180, lng: 73.0790, specialties: ['General Medicine', 'Surgery', 'Pediatrics', 'Gynecology', 'Orthopedics'] },
  { id: 20, name: 'Nishtar Hospital Multan', city: 'Multan', type: 'Government', address: 'Nishtar Road, Multan', phone: '061-9200015', emergency: true, beds: 1800, lat: 30.1575, lng: 71.5249, specialties: ['Cardiology', 'Nephrology', 'Oncology', 'General Medicine', 'Surgery'] },
  { id: 21, name: 'Bolan Medical Complex Hospital', city: 'Quetta', type: 'Government', address: 'Brewery Road, Quetta', phone: '081-9201016', emergency: true, beds: 1000, lat: 30.1798, lng: 66.9750, specialties: ['General Medicine', 'Surgery', 'Gynecology', 'Pediatrics', 'Orthopedics'] },
  { id: 22, name: 'Liaquat University Hospital', city: 'Hyderabad', type: 'Government', address: 'Jamshoro Road, Hyderabad', phone: '022-9200303', emergency: true, beds: 1200, lat: 25.3960, lng: 68.3578, specialties: ['General Medicine', 'Surgery', 'Gynecology', 'Pediatrics', 'Cardiology'] },
  { id: 23, name: 'Ayub Teaching Hospital', city: 'Abbottabad', type: 'Government', address: 'Mansehra Road, Abbottabad', phone: '0992-9310560', emergency: true, beds: 950, lat: 34.1463, lng: 73.2117, specialties: ['General Medicine', 'Surgery', 'Cardiology', 'Orthopedics', 'Gynecology'] },
  { id: 24, name: 'DHQ Teaching Hospital Gujranwala', city: 'Gujranwala', type: 'Government', address: 'GT Road, Gujranwala', phone: '055-9200400', emergency: true, beds: 900, lat: 32.1877, lng: 74.1945, specialties: ['General Medicine', 'Surgery', 'Pediatrics', 'Gynecology', 'Cardiology'] },
];

const cities = ['All', 'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Faisalabad', 'Multan', 'Quetta', 'Hyderabad', 'Abbottabad', 'Gujranwala'];

const cityCoords: { [key: string]: [number, number] } = {
  'All': [30.3753, 69.3451],
  'Lahore': [31.5497, 74.3436],
  'Karachi': [24.8607, 67.0011],
  'Islamabad': [33.6844, 73.0479],
  'Rawalpindi': [33.5651, 73.0169],
  'Peshawar': [34.0058, 71.5249],
  'Faisalabad': [31.4180, 73.0790],
  'Multan': [30.1575, 71.5249],
  'Quetta': [30.1798, 66.9750],
  'Hyderabad': [25.3960, 68.3578],
  'Abbottabad': [34.1463, 73.2117],
  'Gujranwala': [32.1877, 74.1945],
};

const HospitalPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedHospital, setSelectedHospital] = useState<any>(null);

  const filtered = hospitals.filter(h => {
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchCity = selectedCity === 'All' || h.city === selectedCity;
    const matchType = selectedType === 'All' || h.type === selectedType;
    return matchSearch && matchCity && matchType;
  });

  const mapCenter: [number, number] = cityCoords[selectedCity] || [30.3753, 69.3451];
  const mapZoom = selectedCity === 'All' ? 5 : 12;

  const typeColor: any = {
    'Government': { bg: '#dbeafe', color: '#1d4ed8' },
    'Private': { bg: theme.colors.primaryLight, color: theme.colors.primaryDark },
    'Military': { bg: '#fef3c7', color: '#d97706' },
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: theme.font, backgroundColor: theme.colors.background }}>
      <SideNav activeTab="hospitals" setActiveTab={(tab) => {
        if (tab === 'dashboard') navigate('/dashboard');
        if (tab === 'diseases') navigate('/diseases');
        if (tab === 'profile') navigate('/profile');
      }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopNav />
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>

          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ color: theme.colors.text, margin: '0 0 4px', fontSize: '19px', fontWeight: '600' }}>Hospital Finder</h2>
            <p style={{ color: theme.colors.textSecondary, fontSize: '13px', margin: 0 }}>Find hospitals across Pakistan</p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Total Hospitals', value: hospitals.length },
              { label: 'Government', value: hospitals.filter(h => h.type === 'Government').length },
              { label: 'Private', value: hospitals.filter(h => h.type === 'Private').length },
              { label: 'Cities', value: cities.length - 1 },
            ].map((stat, i) => (
              <div key={i} style={{ backgroundColor: 'white', borderRadius: theme.borderRadius, padding: '16px', border: `1px solid ${theme.colors.border}`, textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: theme.colors.primaryDark }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search & Filter */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search hospital or specialty..."
              value={search}
              onChange={e => setSearch(e.target.value.replace(/[<>{}]/g, ''))}
              maxLength={50}
              style={{ padding: '9px 14px', border: `1px solid ${theme.colors.primaryBorder}`, borderRadius: '8px', fontSize: '13px', outline: 'none', flex: 1, backgroundColor: 'white', fontFamily: theme.font, color: theme.colors.text }}
            />
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              style={{ padding: '9px 14px', border: `1px solid ${theme.colors.primaryBorder}`, borderRadius: '8px', fontSize: '13px', outline: 'none', backgroundColor: 'white', fontFamily: theme.font, cursor: 'pointer', color: theme.colors.text }}
            >
              <option value="All">All Types</option>
              <option value="Government">Government</option>
              <option value="Private">Private</option>
              <option value="Military">Military</option>
            </select>
          </div>

          {/* City filter */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
            {cities.map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                style={{
                  padding: '5px 12px', borderRadius: '20px', border: 'none',
                  fontSize: '12px', fontWeight: '500', cursor: 'pointer', fontFamily: theme.font,
                  backgroundColor: selectedCity === city ? theme.colors.primary : 'white',
                  color: selectedCity === city ? 'white' : theme.colors.textSecondary,
                  outline: selectedCity === city ? 'none' : `1px solid ${theme.colors.border}`,
                }}
              >
                {city}
              </button>
            ))}
          </div>

          <p style={{ fontSize: '13px', color: theme.colors.textSecondary, marginBottom: '14px' }}>
            Showing <strong>{filtered.length}</strong> hospitals{selectedCity !== 'All' && <> in <strong>{selectedCity}</strong></>}
          </p>

          {/* Map + List */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '16px', height: '580px' }}>
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: `1px solid ${theme.colors.border}` }}>
              <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }} key={selectedCity}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                {filtered.map(h => (
                  <Marker key={h.id} position={[h.lat, h.lng]} eventHandlers={{ click: () => setSelectedHospital(h) }}>
                    <Popup>
                      <div style={{ minWidth: '160px', fontFamily: theme.font }}>
                        <strong style={{ fontSize: '13px', color: theme.colors.text }}>{h.name}</strong><br />
                        <span style={{ fontSize: '12px', color: theme.colors.textSecondary }}>{h.type} · {h.beds} Beds</span><br />
                        <span style={{ fontSize: '12px', color: theme.colors.text }}>{h.address}</span><br />
                        <span style={{ fontSize: '12px', color: theme.colors.primary, fontWeight: '500' }}>{h.phone}</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map(h => (
                <div
                  key={h.id}
                  onClick={() => setSelectedHospital(h)}
                  style={{
                    backgroundColor: 'white', borderRadius: theme.borderRadius, padding: '14px',
                    border: `1px solid ${selectedHospital?.id === h.id ? theme.colors.primary : theme.colors.border}`,
                    cursor: 'pointer', boxShadow: selectedHospital?.id === h.id ? `0 0 0 2px ${theme.colors.primaryLight}` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: theme.colors.text, lineHeight: '1.3', flex: 1, marginRight: '8px' }}>{h.name}</span>
                    <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 7px', borderRadius: '12px', whiteSpace: 'nowrap', backgroundColor: typeColor[h.type]?.bg, color: typeColor[h.type]?.color }}>
                      {h.type}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: theme.colors.textSecondary }}>{h.city}</span>
                    <span style={{ color: theme.colors.border }}>·</span>
                    <span style={{ fontSize: '12px', color: theme.colors.textSecondary }}>{h.beds} Beds</span>
                    {h.emergency && <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: '600', backgroundColor: '#fef2f2', padding: '1px 6px', borderRadius: '4px' }}>Emergency</span>}
                  </div>

                  <p style={{ fontSize: '12px', color: theme.colors.textSecondary, margin: '0 0 2px' }}>{h.address}</p>
                  <p style={{ fontSize: '12px', color: theme.colors.primary, fontWeight: '500', margin: '0 0 8px' }}>{h.phone}</p>

                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {h.specialties.slice(0, 3).map((s, i) => (
                      <span key={i} style={{ backgroundColor: theme.colors.primaryLight, color: theme.colors.primaryDark, padding: '2px 7px', borderRadius: '6px', fontSize: '11px', fontWeight: '500' }}>{s}</span>
                    ))}
                    {h.specialties.length > 3 && <span style={{ backgroundColor: '#f3f4f6', color: theme.colors.textSecondary, padding: '2px 7px', borderRadius: '6px', fontSize: '11px' }}>+{h.specialties.length - 3}</span>}
                  </div>

                  <a
                    href={`https://www.google.com/maps?q=${h.lat},${h.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'block', textAlign: 'center', backgroundColor: theme.colors.primaryLight, color: theme.colors.primaryDark, border: `1px solid ${theme.colors.primaryBorder}`, padding: '6px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', textDecoration: 'none' }}
                    onClick={e => e.stopPropagation()}
                  >
                    Get Directions
                  </a>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HospitalPage;
