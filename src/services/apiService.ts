// [2024-09-26] - API service for Partner app - replaces shared dependencies
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://api.localplus.city';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('auth_token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser() {
    return this.request('/api/auth/me');
  }

  async logout() {
    return this.request('/api/auth', {
      method: 'DELETE',
    });
  }

  // Booking endpoints
  async getBookings(businessId: string, status?: string, limit = 50, offset = 0) {
    const params = new URLSearchParams({
      businessId,
      limit: limit.toString(),
      offset: offset.toString(),
    });
    
    if (status) {
      params.append('status', status);
    }

    return this.request(`/api/bookings?${params}`);
  }

  async getBookingById(id: string) {
    return this.request(`/api/bookings/${id}`);
  }

  async createBooking(bookingData: any) {
    return this.request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async confirmBooking(id: string, restaurantId: string) {
    return this.request(`/api/bookings/${id}/confirm`, {
      method: 'PUT',
      body: JSON.stringify({ restaurantId }),
    });
  }

  async cancelBooking(id: string, reason?: string) {
    return this.request(`/api/bookings/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  async seatBooking(id: string) {
    return this.request(`/api/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'seated' }),
    });
  }

  async completeBooking(id: string) {
    return this.request(`/api/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'completed' }),
    });
  }

  async markNoShow(id: string) {
    return this.request(`/api/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'no_show' }),
    });
  }

  // Notification endpoints
  async getNotificationPreferences(businessId: string) {
    return this.request(`/api/notifications?businessId=${businessId}`);
  }

  async updateNotificationPreferences(preferences: any) {
    return this.request('/api/notifications', {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
  }
}

export const apiService = new ApiService();
