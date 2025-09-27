// Restaurant Types
export interface Restaurant {
  id: string
  google_place_id?: string
  name: string
  category_id: string
  address: string
  latitude: number
  longitude: number
  phone?: string
  email?: string
  website_url?: string
  description?: string
  business_hours?: Record<string, any>
  partnership_status: 'pending' | 'active' | 'suspended'
  verified_at?: string
  created_at: string
  updated_at: string
}

// Booking Types
export interface Booking {
  id: string
  business_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  party_size: number
  booking_date: string
  booking_time: string
  special_requests?: string
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show'
  confirmation_code?: string
  cancellation_reason?: string
  cancelled_at?: string
  cancelled_by?: 'customer' | 'restaurant' | 'system'
  seated_at?: string
  completed_at?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface BookingAvailability {
  restaurant_id: string
  date: string
  time_slots: {
    time: string
    available: boolean
    capacity: number
    booked: number
  }[]
}

// User Types
export interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  date_of_birth?: string
  subscription_tier: 'free' | 'premium'
  subscription_expires_at?: string
  total_savings: number
  redemption_count: number
  created_at: string
  updated_at: string
}

// Partner/Business Owner Types
export interface Partner {
  id: string
  user_id: string
  business_id: string
  role: 'owner' | 'manager' | 'staff'
  permissions: string[]
  is_active: boolean
  invited_by?: string
  invited_at: string
  accepted_at?: string
  created_at: string
  updated_at: string
}

// Menu Types (for future use)
export interface MenuItem {
  id: string
  business_id: string
  category_id?: string
  name: string
  description?: string
  price: number
  image_url?: string
  dietary_flags: string[]
  spice_level?: number
  is_available: boolean
  is_featured: boolean
  preparation_time_minutes: number
  sort_order: number
  created_at: string
  updated_at: string
}

export interface MenuCategory {
  id: string
  business_id: string
  name: string
  description?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Booking System Types
export type BookingStatus = 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show'

export interface CreateBookingData {
  business_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  party_size: number
  booking_date: string
  booking_time: string
  special_requests?: string
}

export interface UpdateBookingData {
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  party_size?: number
  booking_date?: string
  booking_time?: string
  special_requests?: string
  status?: BookingStatus
  notes?: string
}

export interface RestaurantSettings {
  id: string
  business_id: string
  booking_enabled: boolean
  advance_booking_days: number
  max_party_size: number
  min_party_size: number
  booking_buffer_minutes: number
  cancellation_policy: string
  special_instructions?: string
  auto_confirm: boolean
  require_phone: boolean
  require_email: boolean
  created_at: string
  updated_at: string
}

export interface OperatingHours {
  id: string
  business_id: string
  day_of_week: number // 0 = Sunday, 6 = Saturday
  is_open: boolean
  open_time: string
  close_time: string
  break_start_time?: string
  break_end_time?: string
  created_at: string
}

export interface TimeSlot {
  id: string
  business_id: string
  slot_time: string
  capacity: number
  duration_minutes: number
  is_active: boolean
  created_at: string
}

export interface BlockedDate {
  id: string
  business_id: string
  blocked_date: string
  reason: string
  is_recurring: boolean
  recurring_type?: 'weekly' | 'monthly' | 'yearly'
  created_by?: string
  created_at: string
}

export interface BookingNotification {
  id: string
  booking_id: string
  notification_type: string
  recipient_email?: string
  recipient_phone?: string
  subject?: string
  message?: string
  channel: 'email' | 'sms' | 'whatsapp' | 'in_app'
  status: 'pending' | 'sent' | 'delivered' | 'failed'
  sent_at?: string
  delivered_at?: string
  error_message?: string
  created_at: string
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  total_pages: number
} 