// [2024-12-19 22:15] - Unified Authentication Service for all LocalPlus apps
import { supabase } from './supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Unified User Types
export type UserRole = 'consumer' | 'partner' | 'admin' | 'super_admin';

export interface BaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  roles: UserRole[];
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  loginProvider: 'email' | 'google' | 'facebook' | 'line';
}

export interface ConsumerProfile {
  preferences: {
    language: string;
    currency: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      deals: boolean;
      events: boolean;
      reminders: boolean;
    };
    dietary: {
      vegetarian: boolean;
      vegan: boolean;
      halal: boolean;
      glutenFree: boolean;
      allergies: string[];
    };
    cuisinePreferences: string[];
    priceRange: { min: number; max: number };
    favoriteDistricts: string[];
  };
  location?: {
    city: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
}

export interface PartnerProfile {
  businessIds: string[];
  permissions: string[];
  role: 'owner' | 'manager' | 'staff';
}

export interface AdminProfile {
  permissions: string[];
  department?: string;
}

export interface UnifiedUser extends BaseUser {
  consumerProfile?: ConsumerProfile;
  partnerProfile?: PartnerProfile;
  adminProfile?: AdminProfile;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  businessId?: string; // For partner registration
}

export interface AuthResponse {
  user: UnifiedUser;
  token: string;
  expiresIn: number;
}

class UnifiedAuthService {
  private tokenKey = 'localplus_auth_token';
  private userKey = 'localplus_user';

  // Core Authentication Methods
  async signIn(credentials: LoginCredentials): Promise<UnifiedUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });

    if (error) throw error;
    if (!data.user) throw new Error('Login failed');

    // Get user profile with roles
    const user = await this.getUserProfile(data.user);
    
    // Store session info
    if (credentials.rememberMe) {
      localStorage.setItem(this.tokenKey, data.session?.access_token || '');
      localStorage.setItem(this.userKey, JSON.stringify(user));
    } else {
      sessionStorage.setItem(this.tokenKey, data.session?.access_token || '');
      sessionStorage.setItem(this.userKey, JSON.stringify(user));
    }

    return user;
  }

  async signUp(credentials: RegisterCredentials): Promise<UnifiedUser> {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          phone: credentials.phone,
          role: credentials.role
        }
      }
    });

    if (error) throw error;
    if (!data.user) throw new Error('Registration failed');

    // Create user profile based on role
    await this.createUserProfile(data.user, credentials);

    return await this.getUserProfile(data.user);
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
  }

  async getCurrentUser(): Promise<UnifiedUser | null> {
    // [DEV BYPASS] Check for dev user in localStorage
    const devUserRaw = typeof window !== 'undefined' ? localStorage.getItem('partner_dev_user') : null;
    if (devUserRaw) {
      try {
        const devUser = JSON.parse(devUserRaw);
        // Return a mock UnifiedUser object
        return {
          id: devUser.id,
          email: devUser.email,
          firstName: devUser.firstName,
          lastName: devUser.lastName,
          phone: devUser.phone || '',
          avatar: '',
          roles: ['partner'],
          isEmailVerified: true,
          isActive: true,
          createdAt: new Date(),
          lastLoginAt: new Date(),
          loginProvider: 'email',
          partnerProfile: {
            businessIds: [devUser.businessId],
            permissions: ['all'],
            role: 'owner',
          },
        };
      } catch (e) {
        // Ignore parse errors
      }
    }
    // Normal Supabase user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return await this.getUserProfile(user);
  }

  async getUserById(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name
    };
  }

  // Role-Based Access Control
  hasRole(user: UnifiedUser, role: UserRole): boolean {
    return user.roles.includes(role);
  }

  hasPermission(user: UnifiedUser, permission: string): boolean {
    // Check admin permissions
    if (user.adminProfile?.permissions.includes(permission)) return true;
    
    // Check partner permissions
    if (user.partnerProfile?.permissions.includes(permission)) return true;
    
    // Super admin has all permissions
    if (user.roles.includes('super_admin')) return true;
    
    return false;
  }

  canAccessApp(user: UnifiedUser, app: 'consumer' | 'partner' | 'admin'): boolean {
    switch (app) {
      case 'consumer':
        return this.hasRole(user, 'consumer');
      case 'partner':
        return this.hasRole(user, 'partner');
      case 'admin':
        return this.hasRole(user, 'admin') || this.hasRole(user, 'super_admin');
      default:
        return false;
    }
  }

  // Profile Management
  async getUserProfile(supabaseUser: SupabaseUser): Promise<UnifiedUser> {
    // Get base user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (userError && userError.code !== 'PGRST116') { // Not found is OK for new users
      console.warn('Error fetching user data:', userError);
    }

    // Get role-specific profiles
    const [consumerProfile, partnerProfile, adminProfile] = await Promise.all([
      this.getConsumerProfile(supabaseUser.id),
      this.getPartnerProfile(supabaseUser.id),
      this.getAdminProfile(supabaseUser.id)
    ]);

    // Determine roles based on existing profiles
    const roles: UserRole[] = [];
    if (consumerProfile) roles.push('consumer');
    if (partnerProfile) roles.push('partner');
    if (adminProfile) {
      roles.push(adminProfile.permissions.includes('super_admin') ? 'super_admin' : 'admin');
    }

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      firstName: userData?.first_name || supabaseUser.user_metadata?.firstName || '',
      lastName: userData?.last_name || supabaseUser.user_metadata?.lastName || '',
      phone: userData?.phone || supabaseUser.user_metadata?.phone,
      avatar: userData?.avatar_url,
      roles,
      isEmailVerified: !!supabaseUser.email_confirmed_at,
      isActive: userData?.is_active ?? true,
      createdAt: new Date(supabaseUser.created_at),
      lastLoginAt: new Date(),
      loginProvider: 'email',
      consumerProfile,
      partnerProfile,
      adminProfile
    };
  }

  private async createUserProfile(supabaseUser: SupabaseUser, credentials: RegisterCredentials): Promise<void> {
    // Create base user record
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: supabaseUser.id,
        email: supabaseUser.email,
        first_name: credentials.firstName,
        last_name: credentials.lastName,
        phone: credentials.phone,
        is_active: true
      });

    if (userError) console.warn('Error creating user record:', userError);

    // Create role-specific profile
    switch (credentials.role) {
      case 'partner':
        if (credentials.businessId) {
          await this.createPartnerProfile(supabaseUser.id, credentials.businessId);
        }
        break;
      case 'consumer':
        await this.createConsumerProfile(supabaseUser.id);
        break;
      case 'admin':
        await this.createAdminProfile(supabaseUser.id);
        break;
    }
  }

  private async getConsumerProfile(userId: string): Promise<ConsumerProfile | undefined> {
    const { data, error } = await supabase
      .from('consumer_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) return undefined;
    return data;
  }

  private async getPartnerProfile(userId: string): Promise<PartnerProfile | undefined> {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('user_id', userId);

    if (error || !data?.length) return undefined;

    return {
      businessIds: data.map(p => p.business_id),
      permissions: data[0].permissions || [],
      role: data[0].role || 'staff'
    };
  }

  private async getAdminProfile(userId: string): Promise<AdminProfile | undefined> {
    const { data, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) return undefined;
    return data;
  }

  private async createPartnerProfile(userId: string, businessId: string): Promise<void> {
    const { error } = await supabase
      .from('partners')
      .insert({
        user_id: userId,
        business_id: businessId,
        role: 'owner',
        permissions: ['view_bookings', 'manage_bookings', 'view_analytics', 'manage_settings'],
        is_active: true,
        accepted_at: new Date().toISOString()
      });

    if (error) console.warn('Error creating partner profile:', error);
  }

  private async createConsumerProfile(userId: string): Promise<void> {
    const { error } = await supabase
      .from('consumer_profiles')
      .insert({
        user_id: userId,
        preferences: {
          language: 'en',
          currency: 'THB',
          notifications: {
            email: true,
            push: true,
            sms: false,
            deals: true,
            events: true,
            reminders: true
          },
          dietary: {
            vegetarian: false,
            vegan: false,
            halal: false,
            glutenFree: false,
            allergies: []
          },
          cuisinePreferences: [],
          priceRange: { min: 100, max: 1000 },
          favoriteDistricts: []
        }
      });

    if (error) console.warn('Error creating consumer profile:', error);
  }

  private async createAdminProfile(userId: string): Promise<void> {
    const { error } = await supabase
      .from('admin_profiles')
      .insert({
        user_id: userId,
        permissions: ['view_dashboard', 'manage_businesses'],
        department: 'operations'
      });

    if (error) console.warn('Error creating admin profile:', error);
  }
}

export const authService = new UnifiedAuthService(); 