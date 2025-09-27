import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { authService } from './services/authService';
// Removed shared component import - using native HTML elements
import LoginForm from './components/LoginForm';
import Dashboard from './pages/Dashboard';
import BookingDashboard from './pages/BookingDashboard';
import NotificationSettings from './pages/NotificationSettings';
import Structure from './pages/Structure';
import Navigation from './components/Navigation';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { user } = await authService.getSession();
        if (user) {
          setUser(user);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handlePageChange = (page: string) => {
    navigate(`/${page}`);
  };

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/') return 'dashboard';
    if (path === '/bookings') return 'bookings';
    if (path === '/notifications') return 'notifications';
    if (path === '/structure') return 'structure';
    return 'dashboard';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={(user) => setUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentPage={getCurrentPage()}
        onPageChange={handlePageChange}
        user={user}
        onLogout={handleLogout}
        showAdminLink={true}
      />
      
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookings" element={<BookingDashboard />} />
          <Route path="/notifications" element={<NotificationSettings />} />
          <Route path="/structure" element={<Structure />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
