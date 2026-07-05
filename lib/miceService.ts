import { apiRequest } from './api';
import { CoreOrganization, MiceVenue, MiceVenueSpace } from '../app/mice/types/mice';

export const miceService = {
  // --- Organization Management ---
  async getMyOrganization(): Promise<CoreOrganization | null> {
    const res = await apiRequest('/api/mice/organization');
    return res.data;
  },

  async createDefaultOrganization(): Promise<CoreOrganization> {
    const res = await apiRequest('/api/mice/organization', {
      method: 'POST'
    });
    return res.data;
  },

  async updateOrganization(id: string, updates: Partial<CoreOrganization>) {
    const res = await apiRequest('/api/mice/organization', {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates })
    });
    return res.data;
  },

  // --- Venue Management ---
  async getVenues(orgId: string): Promise<MiceVenue[]> {
    const res = await apiRequest(`/api/mice/venues?orgId=${orgId}`);
    return res.data || [];
  },

  async addVenue(venue: Omit<MiceVenue, 'id' | 'created_at'>): Promise<MiceVenue> {
    const res = await apiRequest('/api/mice/venues', {
      method: 'POST',
      body: JSON.stringify(venue)
    });
    return res.data;
  },

  // --- Space Management ---
  async getSpaces(venueId: string): Promise<MiceVenueSpace[]> {
    const res = await apiRequest(`/api/mice/spaces?venueId=${venueId}`);
    return res.data || [];
  },

  async addSpace(space: Omit<MiceVenueSpace, 'id' | 'created_at'>): Promise<MiceVenueSpace> {
    const res = await apiRequest('/api/mice/spaces', {
      method: 'POST',
      body: JSON.stringify(space)
    });
    return res.data;
  }
};
