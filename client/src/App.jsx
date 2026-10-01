import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ResultPage from './pages/ResultPage';

import HomePage from './pages/HomePage';
import CheckResultPage from './pages/CheckResultPage';
import PastResultsPage from './pages/PastResultsPage';
import NotFoundPage from './pages/NotFoundPage';

import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import CreateDrawPage from './pages/admin/CreateDrawPage';
import ManageDrawsPage from './pages/admin/ManageDrawsPage';
import SetWinnersPage from './pages/admin/SetWinnersPage';
import ManageImagesPage from './pages/admin/ManageImagesPage';
import ManageBuyersPage from './pages/admin/ManageBuyersPage';

import './assets/styles/global.css';

// Public layout (Kerala mobile style)
const PublicLayout = ({ children }) => (
  <div className="app-container">
    <Navbar />
    {children}
    <Footer />
  </div>
);

const Shell = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    // Admin pages render their own full-width layout
    return (
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/admin/create-draw" element={<ProtectedRoute><CreateDrawPage /></ProtectedRoute>} />
        <Route path="/admin/manage-draws" element={<ProtectedRoute><ManageDrawsPage /></ProtectedRoute>} />
        <Route path="/admin/set-winners/:drawId" element={<ProtectedRoute><SetWinnersPage /></ProtectedRoute>} />
        <Route path="/admin/manage-images" element={<ProtectedRoute><ManageImagesPage /></ProtectedRoute>} />
        <Route path="/admin/manage-buyers" element={<ProtectedRoute><ManageBuyersPage /></ProtectedRoute>} />
        <Route
  path="/admin/set-winners"
  element={
    <ProtectedRoute>
      <SetWinnersPage />
    </ProtectedRoute>
  }
/>
      </Routes>
    );
  }

  return (
    <PublicLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/check" element={<CheckResultPage />} />
        <Route path="/past-results" element={<PastResultsPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </PublicLayout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Shell />
      </Router>
    </AuthProvider>
  );
}

export default App;