import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { authService } from './services/authService';
import { supabase } from './services/supabase';
// Removed shared component import - using native HTML elements
import LoginForm from './components/LoginForm';
import Dashboard from './pages/Dashboard';
import BookingDashboard from './pages/BookingDashboard';
import NotificationSettings from './pages/NotificationSettings';
import Structure from './pages/Structure';
import EventsDashboard from './pages/EventsDashboard'; // [2025-11-28 23:35] - Partner Events dashboard
import AdminUsers from './pages/AdminUsers'; // [2025-11-26] - Admin page for viewing partners/users
import EventTaxonomyManager from './pages/EventTaxonomyManager'; // [2025-11-30] - Event taxonomy/category management
import LocationsDashboard from './pages/LocationsDashboard'; // [2025-12-01] - Locations/venues management
import VenuesDashboard from './pages/VenuesDashboard'; // [2025-12-02] - Venues management
import ActivitiesDashboard from './pages/ActivitiesDashboard'; // [2025-12-02] - Activities management
import AttractionsDashboard from './pages/AttractionsDashboard'; // [2025-12-02] - Attractions management
import DMODashboard from './pages/DMODashboard'; // [2025-12-02] - DMO Dashboard
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
        console.log('🔍 Checking session...');
        const { user } = await authService.getSession();
        console.log('👤 Session result:', user ? 'User found' : 'No user');
        if (user) {
          setUser(user);
          
          // Set Supabase session for RLS policies
          const token = localStorage.getItem('auth_token');
          if (token) {
            await supabase.auth.setSession({
              access_token: token,
              refresh_token: ''
            } as any);
          }
        }
      } catch (error) {
        console.error('❌ Error checking session:', error);
        // Don't block rendering on auth errors
      } finally {
        console.log('✅ Loading complete');
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
    if (path === '/events') return 'events'; // [2025-11-28 23:35] - Highlight Events tab
    if (path === '/admin') return 'admin'; // [2025-11-26] - Highlight Admin tab
    if (path === '/taxonomy') return 'taxonomy'; // [2025-11-30] - Highlight Taxonomy tab
    if (path === '/structure') return 'structure';
    if (path === '/locations') return 'locations'; // [2025-12-01] - Highlight Locations tab
    if (path === '/venues') return 'venues'; // [2025-12-02] - Highlight Venues tab
    if (path === '/activities') return 'activities'; // [2025-12-02] - Highlight Activities tab
    if (path === '/attractions') return 'attractions'; // [2025-12-02] - Highlight Attractions tab
    if (path === '/dmo-dashboard') return 'dmo-dashboard'; // [2025-12-02] - Highlight DMO Dashboard tab
    if (path === '/activity-bookings') return 'activity-bookings';
    if (path === '/activity-packages') return 'activity-packages';
    if (path === '/activity-availability') return 'activity-availability';
    if (path === '/attractions-content') return 'attractions-content';
    if (path === '/attractions-locations') return 'attractions-locations';
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
          <Route path="/events" element={<EventsDashboard />} />
          <Route path="/admin" element={<AdminUsers />} />
          <Route path="/taxonomy" element={<EventTaxonomyManager />} />
          <Route path="/structure" element={<Structure />} />
          <Route path="/locations" element={<LocationsDashboard />} />
          <Route path="/venues" element={<VenuesDashboard />} />
          <Route path="/activities" element={<ActivitiesDashboard />} />
          <Route path="/attractions" element={<AttractionsDashboard />} />
          <Route path="/dmo-dashboard" element={<DMODashboard />} />
          <Route path="/activity-bookings" element={<ActivitiesDashboard />} />
          <Route path="/activity-packages" element={<ActivitiesDashboard />} />
          <Route path="/activity-availability" element={<ActivitiesDashboard />} />
          <Route path="/attractions-content" element={<AttractionsDashboard />} />
          <Route path="/attractions-locations" element={<AttractionsDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
