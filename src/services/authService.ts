// [2024-09-26] - Auth service for Partner app - replaces shared authService
// [2025-11-26] - Reverted: Use API service (shared monorepo architecture)
import { apiService } from './apiService';
import { supabase } from './supabase';

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
      // [2025-11-30] - API returns { success: true, data: { user, session } }
      const response = await apiService.login(email, password);

      // Handle API Gateway response format: { success: true, data: { user, session } }
      const userData = response.data?.user || response.user;
      const sessionData = response.data?.session || response.session;

      if (!userData || !sessionData) {
        throw new Error('Invalid response format from login API');
      }

      // Store token in localStorage
      if (sessionData.access_token) {
        localStorage.setItem('auth_token', sessionData.access_token);
        // [2025-11-30] - Also store refresh token for automatic refresh
        if (sessionData.refresh_token) {
          localStorage.setItem('auth_refresh_token', sessionData.refresh_token);
        }

        // [2025-11-30] - Set Supabase session so RLS policies work
        // The API returns the full session object from Supabase
        // This is CRITICAL for auth.uid() to work in RLS policies
        try {
          const sessionResult = await supabase.auth.setSession({
            access_token: sessionData.access_token,
            refresh_token: sessionData.refresh_token || sessionData.access_token
          });

          if (sessionResult.error) {
            console.error('[AUTH] Error setting Supabase session:', sessionResult.error);
          } else if (sessionResult.data?.session) {
            console.log('[AUTH] ✅ Supabase session set successfully');
            // Verify auth.uid() is working
            const { data: { user: verifyUser } } = await supabase.auth.getUser();
            console.log('[AUTH] Verified auth.uid():', verifyUser?.id || 'NULL');
          } else {
            console.warn('[AUTH] ⚠️ Supabase session set but no session data returned');
          }
        } catch (err) {
          console.error('[AUTH] Error setting Supabase session:', err);
        }
      }

      return {
        user: userData,
        session: sessionData
      };
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

      // [2025-11-30] - Try to refresh token if expired
      try {
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        if (!existingSession || !existingSession.access_token) {
          // Try to refresh using stored token
          const refreshToken = localStorage.getItem('auth_refresh_token');
          if (refreshToken) {
            const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession({
              refresh_token: refreshToken
            });
            if (refreshedSession && !refreshError) {
              localStorage.setItem('auth_token', refreshedSession.access_token);
              if (refreshedSession.refresh_token) {
                localStorage.setItem('auth_refresh_token', refreshedSession.refresh_token);
              }
              console.log('[AUTH] Token refreshed successfully');
            }
          }
        }
      } catch (refreshErr) {
        console.warn('[AUTH] Token refresh failed, will try API call:', refreshErr);
      }

      const response = await apiService.getCurrentUser();

      // Ensure Supabase session is set for RLS policies
      if (response.user) {
        try {
          const currentToken = localStorage.getItem('auth_token');
          if (currentToken) {
            const sessionResult = await supabase.auth.setSession({
              access_token: currentToken,
              refresh_token: localStorage.getItem('auth_refresh_token') || currentToken
            });

            if (sessionResult.error) {
              console.error('[AUTH] Error setting Supabase session:', sessionResult.error);
              if (sessionResult.error.message.includes('Refresh token is not valid') ||
                sessionResult.error.message.includes('Invalid Refresh Token')) {
                console.warn('[AUTH] Invalid refresh token detected. Clearing session.');
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_refresh_token');
                return null;
              }
            } else {
              console.log('[AUTH] Supabase session restored:', sessionResult.data?.session ? 'success' : 'failed');
            }
          }
        } catch (err) {
          console.error('[AUTH] Error restoring Supabase session:', err);
        }
      }

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
  },

  // [2025-12-05] - User registration with business type
  async signUp(
    email: string,
    password: string,
    businessType: string,
    businessName: string
  ): Promise<{ user: User; session: any }> {
    try {
      const response = await apiService.register(email, password, businessType, businessName);

      // Handle API response format
      const userData = response.data?.user || response.user;
      const sessionData = response.data?.session || response.session;

      if (!userData || !sessionData) {
        throw new Error('Invalid response format from registration API');
      }

      // Store token in localStorage
      if (sessionData.access_token) {
        localStorage.setItem('auth_token', sessionData.access_token);
        if (sessionData.refresh_token) {
          localStorage.setItem('auth_refresh_token', sessionData.refresh_token);
        }

        // Set Supabase session so RLS policies work
        try {
          const sessionResult = await supabase.auth.setSession({
            access_token: sessionData.access_token,
            refresh_token: sessionData.refresh_token || sessionData.access_token
          });

          if (sessionResult.error) {
            console.error('[AUTH] Error setting Supabase session:', sessionResult.error);
          } else if (sessionResult.data?.session) {
            console.log('[AUTH] ✅ Supabase session set successfully after registration');
          }
        } catch (err) {
          console.error('[AUTH] Error setting Supabase session:', err);
        }
      }

      return {
        user: userData,
        session: sessionData
      };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }
};
