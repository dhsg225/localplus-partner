import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://joknprahhqdhvdhzmuwl.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Debug logging for development
if (import.meta.env.DEV) {
  console.log('🔧 Shared Supabase URL:', supabaseUrl)
  console.log('🔧 Shared Supabase Anon Key:', supabaseAnonKey.substring(0, 20) + '...')
}

// Database Types (migrated from consumer app)
export interface Business {
  id: string;
  google_place_id?: string;
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website_url?: string;
  partnership_status: 'pending' | 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface DiscountOffer {
  id: string;
  business_id: string;
  discount_percentage: number;
  description: string;
  terms_conditions?: string;
  valid_from: string;
  valid_until?: string;
  max_redemptions_per_user: number;
  total_redemption_limit?: number;
  is_active: boolean;
  created_at: string;
}

export interface UserRedemption {
  id: string;
  user_id: string;
  business_id: string;
  discount_offer_id: string;
  redemption_code: string;
  redeemed_at: string;
  amount_saved: number;
  verification_status: 'pending' | 'verified' | 'disputed';
}

// Helper function for distance calculation
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

// Business API Functions (migrated from consumer app)
export const businessAPI = {
  // Get all businesses
  async getAllBusinesses(): Promise<Business[]> {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching all businesses:', error);
      throw error;
    }

    return data || [];
  },

  // Get all businesses within radius
  async getBusinessesNearby(lat: number, lng: number, radiusKm: number) {
    const { data, error } = await supabase
      .from('businesses')
      .select(`
        *,
        discount_offers(*)
      `)
      .eq('partnership_status', 'active');
    
    if (error) {
      console.error('Error fetching businesses:', error);
      return [];
    }

    // Calculate distances and filter
    return data?.filter(business => {
      const distance = calculateDistance(lat, lng, business.latitude, business.longitude);
      return distance <= radiusKm;
    }).map(business => ({
      ...business,
      distance: calculateDistance(lat, lng, business.latitude, business.longitude)
    })).sort((a, b) => a.distance - b.distance) || [];
  },

  // Add new business
  async addBusiness(businessData: Omit<Business, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('businesses')
      .insert([{
        ...businessData,
        partnership_status: 'active'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding business:', error);
      return null;
    }

    return data;
  },

  // Add discount offer
  async addDiscountOffer(offerData: Omit<DiscountOffer, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('discount_offers')
      .insert([offerData])
      .select()
      .single();

    if (error) {
      console.error('Error adding discount offer:', error);
      return null;
    }

    return data;
  },

  // Record redemption
  async recordRedemption(redemptionData: Omit<UserRedemption, 'id'>) {
    const { data, error } = await supabase
      .from('user_redemptions')
      .insert([redemptionData])
      .select()
      .single();

    if (error) {
      console.error('Error recording redemption:', error);
      return null;
    }

    return data;
  },

  // Check if user can redeem
  async canUserRedeem(userId: string, businessId: string, discountOfferId: string) {
    const { data, error } = await supabase
      .from('user_redemptions')
      .select('*')
      .eq('user_id', userId)
      .eq('business_id', businessId)
      .eq('discount_offer_id', discountOfferId);

    if (error) {
      console.error('Error checking redemption eligibility:', error);
      return false;
    }

    // Get the discount offer to check limits
    const { data: offer } = await supabase
      .from('discount_offers')
      .select('max_redemptions_per_user')
      .eq('id', discountOfferId)
      .single();

    const redemptionCount = data?.length || 0;
    const maxRedemptions = offer?.max_redemptions_per_user || 1;

    return redemptionCount < maxRedemptions;
  }
}; 