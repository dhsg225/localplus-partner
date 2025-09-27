import type { User as SupabaseUser } from '@supabase/supabase-js';
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
        priceRange: {
            min: number;
            max: number;
        };
        favoriteDistricts: string[];
    };
    location?: {
        city: string;
        country: string;
        coordinates: {
            lat: number;
            lng: number;
        };
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
    businessId?: string;
}
export interface AuthResponse {
    user: UnifiedUser;
    token: string;
    expiresIn: number;
}
declare class UnifiedAuthService {
    private tokenKey;
    private userKey;
    signIn(credentials: LoginCredentials): Promise<UnifiedUser>;
    signUp(credentials: RegisterCredentials): Promise<UnifiedUser>;
    signOut(): Promise<void>;
    getCurrentUser(): Promise<UnifiedUser | null>;
    getUserById(userId: string): Promise<{
        id: any;
        email: any;
        firstName: any;
        lastName: any;
    }>;
    hasRole(user: UnifiedUser, role: UserRole): boolean;
    hasPermission(user: UnifiedUser, permission: string): boolean;
    canAccessApp(user: UnifiedUser, app: 'consumer' | 'partner' | 'admin'): boolean;
    getUserProfile(supabaseUser: SupabaseUser): Promise<UnifiedUser>;
    private createUserProfile;
    private getConsumerProfile;
    private getPartnerProfile;
    private getAdminProfile;
    private createPartnerProfile;
    private createConsumerProfile;
    private createAdminProfile;
}
export declare const authService: UnifiedAuthService;
export {};
