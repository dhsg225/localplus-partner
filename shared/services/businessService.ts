// [2024-12-19] - Business service for signup and partner operations
import { supabase } from './supabase'; // Use the central Supabase client

// [2024-12-19] - Vercel API routes URL (production-ready)
// [2025-11-29] - Updated to use clean branded API URL via Cloudflare Worker
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.localplus.city' // Clean branded URL via Cloudflare Worker → API Gateway
  : 'http://localhost:9004'; // Local API server port (per PORT_ALLOCATION_STANDARD.md)

export interface Business {
  id: string;
  name: string;
  partnership_status: 'pending' | 'active' | 'suspended';
  category?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export const businessService = {
  // Get businesses for signup (uses Vercel API routes)
  async getBusinessesForSignup(): Promise<Business[]> {
    return []; // Temporarily disabled
    /*
    try {
      console.log('🔒 Fetching businesses via Vercel API routes...');
      
      // [2024-12-19] - Use Vercel serverless API functions
      const response = await fetch(`${API_BASE_URL}/api/businesses`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const { businesses } = await response.json();
      
      console.log(`✅ Successfully fetched ${businesses?.length || 0} businesses via Vercel API`);
      return businesses || [];
    } catch (err) {
      console.error('❌ Error fetching businesses via Vercel API:', err);
      return [];
    }
    */
  },

  // Get businesses for authenticated users (uses regular client)
  async getBusinessesForUser(): Promise<Business[]> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('id, name, partnership_status')
        .order('name');
      
      if (error) {
        console.error('❌ Error fetching businesses for user:', error);
        return [];
      }
      
      return data || [];
    } catch (err) {
      console.error('❌ Unexpected error fetching user businesses:', err);
      return [];
    }
  },

  // Get active businesses only
  async getActiveBusinesses(): Promise<Business[]> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('id, name, partnership_status')
        .eq('partnership_status', 'active')
        .order('name');
      
      if (error) {
        console.error('❌ Error fetching active businesses:', error);
        return [];
      }
      
      return data || [];
    } catch (err) {
      console.error('❌ Unexpected error fetching active businesses:', err);
      return [];
    }
  },

  // Link user to business (uses Vercel API routes)
  async linkUserToBusiness(userId: string, businessId: string, role: string = 'owner'): Promise<boolean> {
    try {
      // [2024-12-19] - Use Vercel serverless API functions
      const response = await fetch(`${API_BASE_URL}/api/link-user-business`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          businessId,
          role
        })
      });
      
      if (!response.ok) {
        throw new Error(`Link request failed: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ User linked to business successfully via Vercel API');
        return true;
      } else {
        console.error('❌ Failed to link user to business:', result.error);
        return false;
      }
    } catch (err) {
      console.error('❌ Unexpected error linking user to business:', err);
      return false;
    }
  }
}; 