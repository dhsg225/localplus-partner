// [2026-02-13] - Restaurant Service for Partner App
import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.localplus.city';

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export interface MenuItem {
  id?: string;
  name: string;
  price: number;
  description: string;
  category?: string;
  image_url?: string;
  sort_order?: number;
  is_available?: boolean;
}

export const restaurantService = {
  // OCR Ingestion
  async ingestMenu(file: File, businessId: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('business_id', businessId);

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || '';

    const response = await fetch(`${API_BASE_URL}/api/restaurants/ingest`, {
      method: 'POST',
      headers: {
        'x-user-token': token,
        'x-supabase-token': token
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to process menu');
    }

    return response.json();
  },

  // Save parsed menu items
  async saveMenuItems(items: MenuItem[], businessId: string) {
    const { data, error } = await supabase
      .from('restaurant_menu_items')
      .insert(items.map(item => ({
        ...item,
        business_id: businessId
      })));

    if (error) throw error;
    return data;
  },

  // Get existing menu items
  async getMenuItems(businessId: string) {
    const { data, error } = await supabase
      .from('restaurant_menu_items')
      .select('*')
      .eq('business_id', businessId)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Update menu item
  async updateMenuItem(id: string, updates: Partial<MenuItem>) {
    const { data, error } = await supabase
      .from('restaurant_menu_items')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    return data;
  },

  // Delete menu item
  async deleteMenuItem(id: string) {
    const { error } = await supabase
      .from('restaurant_menu_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // For signup/lookup
  async getBusinessesForSignup() {
    const { data, error } = await supabase
      .from('businesses')
      .select('id, name')
      .limit(10);
    return data || [];
  }
};
