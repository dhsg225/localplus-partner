// [2024-09-26] - Updated to use API endpoints instead of direct Supabase
// [2025-11-26] - Restored direct Supabase query for getBookings (original working implementation)
import { supabase } from './supabase';
import { apiService } from './apiService';

export interface Booking {
  id: string;
  business_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  booking_time: string;
  party_size: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'seated' | 'completed' | 'no-show';
  confirmation_code?: string;
  cancellation_reason?: string;
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export const bookingService = {
  async getBookings(businessId: string, status?: Booking['status']): Promise<Booking[]> {
    // [2025-11-26] - Restored original working implementation from shared/services/bookingService.ts.bak
    let query = supabase
      .from('bookings')
      .select('*')
      .eq('business_id', businessId)
      .order('booking_date', { ascending: true })
      .order('booking_time', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    console.log('[DEBUG] getBookings businessId:', businessId, 'status:', status, 'data:', data?.length || 0, 'error:', error);
    
    if (error) throw error;
    return (data || []) as Booking[];
  },

  async confirmBooking(bookingId: string, businessId: string): Promise<Booking> {
    try {
      const response = await apiService.confirmBooking(bookingId, businessId);
      return response.data;
    } catch (error) {
      console.error('Error confirming booking:', error);
      throw error;
    }
  },

  async seatBooking(bookingId: string, businessId: string): Promise<Booking> {
    try {
      const response = await apiService.seatBooking(bookingId);
      return response.data;
    } catch (error) {
      console.error('Error seating booking:', error);
      throw error;
    }
  },

  async completeBooking(bookingId: string, businessId: string): Promise<Booking> {
    try {
      const response = await apiService.completeBooking(bookingId);
      return response.data;
    } catch (error) {
      console.error('Error completing booking:', error);
      throw error;
    }
  },

  async cancelBooking(bookingId: string, businessId: string, reason: string = 'Customer requested'): Promise<Booking> {
    try {
      const response = await apiService.cancelBooking(bookingId, reason);
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  },

  async markNoShow(bookingId: string, businessId: string): Promise<Booking> {
    try {
      const response = await apiService.markNoShow(bookingId);
      return response.data;
    } catch (error) {
      console.error('Error marking no-show:', error);
      throw error;
    }
  },

  async getPartnerRestaurants(): Promise<any[]> {
    try {
      // Get current user from Supabase auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Authentication required. Please log in to access partner restaurants.');
      }

      // Get restaurants this user has partner access to
      const { data, error } = await supabase
        .from('businesses')
        .select(`*, partners!inner(id, role, permissions, is_active)`)
        .eq('partners.user_id', user.id)
        .eq('partners.is_active', true);

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('No restaurants found for this partner account. Please contact support.');
      }
      return data;
    } catch (error) {
      console.error('Error fetching partner restaurants:', error);
      throw error;
    }
  }
}