import { supabase } from './supabase';
import { CoreOrganization, MiceVenue, MiceVenueSpace } from '../app/mice/types/mice';

export const miceService = {
  // --- Organization Management ---
  async getMyOrganization(): Promise<CoreOrganization | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // 1. Try to get org from metadata
    let orgId = user.app_metadata?.org_id;
    
    // 2. Fallback: Search for any organization linked to this user in the 'partners' table
    if (!orgId) {
      const { data: partner } = await supabase
        .from('partners')
        .select('business_id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .limit(1)
        .single();
      
      if (partner) {
        orgId = partner.business_id;
      }
    }

    if (!orgId) return null;

    const { data, error } = await supabase
      .from('core_organizations')
      .select('*')
      .eq('id', orgId)
      .single();

    if (error) return null;
    return data;
  },

  // Temporary Dev Fix: Auto-link current user to a default org
  async createDefaultOrganization(): Promise<CoreOrganization> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Create unique name
    const orgName = `Dev Org - ${user.email?.split('@')[0]}`;
    
    // 1. Create Business
    const { data: org, error: orgError } = await supabase
      .from('core_organizations')
      .insert({
        name: orgName,
        industry: 'MICE',
        legacy_id: 'AUTO_INIT'
      })
      .select()
      .single();
    
    if (orgError) throw orgError;

    // 2. Link User in Partners table
    const { error: partnerError } = await supabase
      .from('partners')
      .insert({
        user_id: user.id,
        business_id: org.id,
        role: 'owner',
        is_active: true
      });

    if (partnerError) throw partnerError;

    return org;
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
