import React, { useState } from 'react';
// Removed shared component imports - using native HTML elements
import { authService } from '../services/authService';
import RegistrationForm from './RegistrationForm';

interface LoginFormProps {
  onLogin: (user: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // [2025-11-29] - authService.signIn returns { user, session } on success, throws on error
      const result = await authService.signIn(email, password);
      if (result.user) {
        onLogin(result.user);
      } else {
        setError('Login failed - no user returned');
      }
    } catch (err: any) {
      // [2025-11-29] - Show actual error message from API
      const errorMessage = err?.message || 'An unexpected error occurred';
      console.error('[LoginForm] Sign in error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // [2025-12-05] - Show registration form if toggled
  if (showRegistration) {
    return (
      <RegistrationForm
        onRegister={onLogin}
        onSwitchToLogin={() => setShowRegistration(false)}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Partner Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage your business
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowRegistration(true)}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Don't have an account? Create one
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
