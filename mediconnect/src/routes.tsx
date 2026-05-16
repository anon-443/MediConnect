import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import DiseasesPage from './pages/DiseasesPage';
import DiseaseDetailPage from './pages/DiseaseDetailPage';
import HospitalPage from './pages/HospitalPage';
import DoctorsPage from './pages/DoctorsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import Unauthorized from './pages/Unauthorized';

import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* PROTECTED ROUTES */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/diseases" element={<ProtectedRoute><DiseasesPage /></ProtectedRoute>} />
      <Route path="/diseases/:id" element={<ProtectedRoute><DiseaseDetailPage /></ProtectedRoute>} />
      <Route path="/hospitals" element={<ProtectedRoute><HospitalPage /></ProtectedRoute>} />
      <Route path="/doctors" element={<ProtectedRoute><DoctorsPage /></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
      <Route path="/chat/:id" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};

export default AppRoutes;