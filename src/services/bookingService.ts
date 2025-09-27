// [2024-09-26] - Updated to use API endpoints instead of direct Supabase
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
    try {
      console.log('[DEBUG] getBookings businessId:', businessId, 'status:', status);
      
      const response = await apiService.getBookings(businessId, status);
      console.log('[DEBUG] getBookings data:', response.data);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
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
      // Mock partner restaurants
      console.log('[MOCK] Fetching partner restaurants');
      return [{ id: '550e8400-e29b-41d4-a716-446655440000', name: 'Shannon\'s Coastal Kitchen' }];
    } catch (error) {
      console.error('Error fetching partner restaurants:', error);
      throw error;
    }
  }
}