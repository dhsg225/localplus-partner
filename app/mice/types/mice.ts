export type MiceVenueType = 'hotel_ballroom' | 'conference_center' | 'beach_venue' | 'restaurant' | 'other';

export interface CoreOrganization {
  id: string;
  name: string;
  contact_email?: string;
  phone?: string;
  description?: string;
  legacy_id?: string;
  created_at?: string;
}

export interface MiceVenue {
  id: string;
  organization_id: string;
  name: string;
  venue_type: MiceVenueType;
  description?: string;
  max_capacity?: number;
  total_area_sqm?: number;
  created_at?: string;
}

export interface MiceVenueSpace {
  id: string;
  venue_id: string;
  name: string;
  area_sqm?: number;
  natural_light?: boolean;
  min_capacity?: number;
  max_capacity?: number;
  minimum_spend?: number;
  created_at?: string;
}
