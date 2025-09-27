import { supabase } from './supabase'
import type { Restaurant } from '../types'

export const restaurantService = {
  // Get all restaurants (for partner dashboard)
  async getRestaurants(): Promise<Restaurant[]> {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('partnership_status', 'active')
      .order('name')

    if (error) {
      console.error('Error fetching restaurants:', error)
      throw error
    }

    return data || []
  },

  // Get all restaurants by location
  async getRestaurantsByLocation(location: string): Promise<Restaurant[]> {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .ilike('address', `%${location}%`)
      .eq('partnership_status', 'active')
      .order('name')

    if (error) {
      console.error('Error fetching restaurants by location:', error)
      throw error
    }

    return data || []
  },

  // Get single restaurant by ID
  async getRestaurantById(id: string): Promise<Restaurant | null> {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching restaurant:', error)
      throw error
    }

    return data
  },

  // Create new restaurant
  async createRestaurant(restaurant: Omit<Restaurant, 'id' | 'created_at' | 'updated_at'>): Promise<Restaurant> {
    const { data, error } = await supabase
      .from('businesses')
      .insert([restaurant])
      .select()
      .single()

    if (error) {
      console.error('Error creating restaurant:', error)
      throw error
    }

    return data
  },

  // Update restaurant details (for partner app)
  async updateRestaurant(id: string, updates: Partial<Restaurant>): Promise<Restaurant> {
    const { data, error } = await supabase
      .from('businesses')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating restaurant:', error)
      throw error
    }

    return data
  },

  // Get restaurants by partner/owner
  async getRestaurantsByOwner(userId: string): Promise<Restaurant[]> {
    const { data, error } = await supabase
      .from('partners')
      .select(`
        business_id,
        businesses (*)
      `)
      .eq('user_id', userId)
      .eq('is_active', true)

    if (error) {
      console.error('Error fetching partner restaurants:', error)
      throw error
    }

    return data?.map((item: any) => item.businesses).filter(Boolean) || []
  },

  // Get restaurants by cuisine type
  async getRestaurantsByCuisine(cuisines: string[]): Promise<Restaurant[]> {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('partnership_status', 'active')
      .order('name')

    if (error) {
      console.error('Error fetching restaurants by cuisine:', error)
      throw error
    }

    // Filter by cuisine in JavaScript since we don't have a cuisine column yet
    return data?.filter(restaurant => 
      cuisines.some(cuisine => 
        restaurant.description?.toLowerCase().includes(cuisine.toLowerCase()) ||
        restaurant.name.toLowerCase().includes(cuisine.toLowerCase())
      )
    ) || []
  }
} 