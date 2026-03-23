// [2025-11-30] - Menu Service for Dynamic Business Type-Based Menus
// Fetches and manages menus based on partner's business type
import { supabase } from './supabase';

export interface MenuItem {
  id: string;
  key: string;
  label: string;
  icon: string;
  route: string;
  description?: string;
  is_required: boolean;
  sort_order: number;
}

export interface BusinessType {
  id: string;
  key: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  menus?: MenuItem[];
}

class MenuService {
  private cachedMenus: Map<string, MenuItem[]> = new Map();
  private cachedBusinessTypes: BusinessType[] | null = null;

  // [2025-11-30] - Get partner's business type
  async getPartnerBusinessType(): Promise<BusinessType | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Get partner record with business and business type
      const { data: partner, error: partnerError } = await supabase
        .from('partners')
        .select(`
          business_id,
          businesses (
            id,
            business_type_id,
            business_types (
              id,
              key,
              name,
              description,
              icon,
              color
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .limit(1)
        .single();

      if (partnerError || !partner) {
        console.warn('[MenuService] No partner or business found:', partnerError?.message);
        return null;
      }

      const business = partner.businesses as any;
      if (!business || !business.business_type_id) {
        console.warn('[MenuService] Business has no type assigned');
        return null;
      }

      const businessType = business.business_types;
      if (!businessType) {
        console.warn('[MenuService] Business type not found');
        return null;
      }

      return {
        id: businessType.id,
        key: businessType.key,
        name: businessType.name,
        description: businessType.description,
        icon: businessType.icon,
        color: businessType.color
      };
    } catch (err: any) {
      console.error('[MenuService] Error getting business type:', err);
      return null;
    }
  }

  // [2025-11-30] - Get menus for a business type
  async getMenusForBusinessType(businessTypeKey: string): Promise<MenuItem[]> {
    // Check cache first
    if (this.cachedMenus.has(businessTypeKey)) {
      return this.cachedMenus.get(businessTypeKey)!;
    }

    try {
      // Use the view to get business type with menus
      // Note: If view doesn't exist yet, fall back to manual query
      const { data, error } = await supabase
        .from('business_types_with_menus')
        .select('*')
        .eq('key', businessTypeKey)
        .maybeSingle();
      
      // Fallback: Manual query if view doesn't exist
      if (error && error.code === 'PGRST116') {
        console.warn('[MenuService] View not found, using manual query');
        return this.getMenusForBusinessTypeManual(businessTypeKey);
      }

      if (error || !data) {
        console.error('[MenuService] Error fetching menus:', error);
        return this.getDefaultMenus();
      }

      // Parse menus from JSON
      const menus: MenuItem[] = (data.menus || []).map((menu: any) => ({
        id: menu.id,
        key: menu.key,
        label: menu.label,
        icon: menu.icon || '📄',
        route: menu.route,
        description: menu.description,
        is_required: menu.is_required || false,
        sort_order: menu.sort_order || 0
      }));

      // Sort by sort_order
      menus.sort((a, b) => a.sort_order - b.sort_order);

      // Cache the result
      this.cachedMenus.set(businessTypeKey, menus);

      return menus;
    } catch (err: any) {
      console.error('[MenuService] Error fetching menus:', err);
      return this.getDefaultMenus();
    }
  }

  // [2025-11-30] - Get all available business types (for override)
  async getAllBusinessTypes(): Promise<BusinessType[]> {
    if (this.cachedBusinessTypes) {
      return this.cachedBusinessTypes;
    }

    try {
      const { data, error } = await supabase
        .from('business_types')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('[MenuService] Error fetching business types:', error);
        return [];
      }

      this.cachedBusinessTypes = (data || []).map(bt => ({
        id: bt.id,
        key: bt.key,
        name: bt.name,
        description: bt.description,
        icon: bt.icon,
        color: bt.color
      }));

      return this.cachedBusinessTypes;
    } catch (err: any) {
      console.error('[MenuService] Error fetching business types:', err);
      return [];
    }
  }

  // [2025-11-30] - Get default menus (fallback)
  private getDefaultMenus(): MenuItem[] {
    return [
      { id: '1', key: 'dashboard', label: 'Dashboard', icon: '📊', route: '/dashboard', is_required: true, sort_order: 1 },
      { id: '2', key: 'bookings', label: 'Bookings', icon: '📅', route: '/bookings', is_required: false, sort_order: 2 },
      { id: '3', key: 'events', label: 'Events', icon: '🎟️', route: '/events', is_required: false, sort_order: 3 },
      { id: '4', key: 'notifications', label: 'Notifications', icon: '🔔', route: '/notifications', is_required: false, sort_order: 4 }
    ];
  }

  // [2025-11-30] - Manual query fallback if view doesn't exist
  private async getMenusForBusinessTypeManual(businessTypeKey: string): Promise<MenuItem[]> {
    try {
      // Get business type
      const { data: businessType, error: typeError } = await supabase
        .from('business_types')
        .select('id')
        .eq('key', businessTypeKey)
        .single();

      if (typeError || !businessType) {
        console.error('[MenuService] Business type not found:', typeError);
        return this.getDefaultMenus();
      }

      // Get menu mappings
      const { data: mappings, error: mappingError } = await supabase
        .from('business_type_menus')
        .select(`
          menu_item_id,
          is_required,
          sort_order,
          menu_items (
            id,
            key,
            label,
            icon,
            route,
            description
          )
        `)
        .eq('business_type_id', businessType.id)
        .order('sort_order', { ascending: true });

      if (mappingError || !mappings) {
        console.error('[MenuService] Error fetching menu mappings:', mappingError);
        return this.getDefaultMenus();
      }

      const menus: MenuItem[] = mappings
        .filter((m: any) => m.menu_items && m.menu_items.is_active !== false)
        .map((m: any) => ({
          id: m.menu_items.id,
          key: m.menu_items.key,
          label: m.menu_items.label,
          icon: m.menu_items.icon || '📄',
          route: m.menu_items.route,
          description: m.menu_items.description,
          is_required: m.is_required || false,
          sort_order: m.sort_order || 0
        }));

      menus.sort((a, b) => a.sort_order - b.sort_order);
      this.cachedMenus.set(businessTypeKey, menus);
      return menus;
    } catch (err: any) {
      console.error('[MenuService] Error in manual query:', err);
      return this.getDefaultMenus();
    }
  }

  // [2025-11-30] - Clear cache (for refresh)
  clearCache() {
    this.cachedMenus.clear();
    this.cachedBusinessTypes = null;
  }
}

export const menuService = new MenuService();

