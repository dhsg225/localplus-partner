import { supabase } from './supabase';
import { CoreOrganization, MiceVenue, MiceVenueSpace } from '../app/mice/types/mice';

export const miceService = {
  // --- Organization Management ---
  async getMyOrganization(): Promise<CoreOrganization | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('core_organizations')
      .select('*')
      .eq('id', user.app_metadata?.org_id) // Assuming org_id is in user metadata
      .single();

    if (error) return null;
    return data;
  },

  async updateOrganization(id: string, updates: Partial<CoreOrganization>) {
    const { data, error } = await supabase
      .from('core_organizations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // --- Venue Management ---
  async getVenues(orgId: string): Promise<MiceVenue[]> {
    const { data, error } = await supabase
      .from('mice_venues')
      .select('*')
      .eq('organization_id', orgId);
    
    if (error) throw error;
    return data || [];
  },

  async addVenue(venue: Omit<MiceVenue, 'id' | 'created_at'>): Promise<MiceVenue> {
    const { data, error } = await supabase
      .from('mice_venues')
      .insert(venue)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // --- Space Management ---
  async getSpaces(venueId: string): Promise<MiceVenueSpace[]> {
    const { data, error } = await supabase
      .from('mice_venue_spaces')
      .select('*')
      .eq('venue_id', venueId);
    
    if (error) throw error;
    return data || [];
  },

  async addSpace(space: Omit<MiceVenueSpace, 'id' | 'created_at'>): Promise<MiceVenueSpace> {
    const { data, error } = await supabase
      .from('mice_venue_spaces')
      .insert(space)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
