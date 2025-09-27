// [2024-09-26] - Auth service for Partner app - replaces shared authService
import { apiService } from './apiService';

export interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
  roles?: string[];
}

export const authService = {
  async signIn(email: string, password: string): Promise<{ user: User; session: any }> {
    try {
      const response = await apiService.login(email, password);
      
      // Store token in localStorage
      if (response.session?.access_token) {
        localStorage.setItem('auth_token', response.session.access_token);
      }
      
      return response;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  async signOut(): Promise<void> {
    try {
      await apiService.logout();
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Sign out error:', error);
      // Still clear local storage even if API call fails
      localStorage.removeItem('auth_token');
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;
      
      const response = await apiService.getCurrentUser();
      return response.user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  async getSession(): Promise<{ user: User | null; session: any | null }> {
    try {
      const user = await this.getCurrentUser();
      const token = localStorage.getItem('auth_token');
      
      return {
        user,
        session: token ? { access_token: token } : null
      };
    } catch (error) {
      console.error('Get session error:', error);
      return { user: null, session: null };
    }
  }
};
