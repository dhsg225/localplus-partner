import { supabase } from './supabase'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Booking, BookingNotification } from '../types'

// [2024-12-19 10:30] - Notification service for booking status changes and preferences management

// Cached service role client
let serviceRoleClient: SupabaseClient | null = null;

// Service role client for dev bypass (bypasses RLS)
const getServiceRoleClient = () => {
  if (typeof window === 'undefined') return null; // Server-side, use regular client

  const devUserRaw = localStorage.getItem('partner_dev_user');
  if (!devUserRaw) return null; // Not in dev bypass mode

  if (serviceRoleClient) {
    return serviceRoleClient;
  }

  // Use service role key for dev bypass to bypass RLS
  // Create with a unique key to avoid conflicts
  serviceRoleClient = createClient(
    'https://joknprahhqdhvdhzmuwl.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTY1MjcxMCwiZXhwIjoyMDY1MjI4NzEwfQ.8Esm5KMfVJAQxHoKrEV9exsMASEFTnHfKOdqSt5cDFk',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    }
  );
  return serviceRoleClient;
};

export interface NotificationPreferences {
  id: string
  business_id: string
  email_enabled: boolean
  sms_enabled: boolean
  email_templates: {
    confirmation: string
    reminder: string
    cancellation: string
    no_show: string
  }
  sms_templates: {
    confirmation: string
    reminder: string
    cancellation: string
    no_show: string
  }
  reminder_hours_before: number
  auto_send_confirmations: boolean
  auto_send_reminders: boolean
  created_at: string
  updated_at: string
}

export interface NotificationTemplate {
  type: 'confirmation' | 'reminder' | 'cancellation' | 'no_show'
  subject?: string
  message: string
  variables: string[]
}

const DEFAULT_EMAIL_TEMPLATES = {
  confirmation: 'Your booking at {{restaurant_name}} has been confirmed for {{date}} at {{time}} for {{party_size}} people. Confirmation code: {{confirmation_code}}',
  reminder: 'Reminder: Your booking at {{restaurant_name}} is tomorrow at {{time}} for {{party_size}} people. Confirmation code: {{confirmation_code}}',
  cancellation: 'Your booking at {{restaurant_name}} for {{date}} at {{time}} has been cancelled. {{cancellation_reason}}',
  no_show: 'Your booking at {{restaurant_name}} for {{date}} at {{time}} has been marked as no-show.'
}

const DEFAULT_SMS_TEMPLATES = {
  confirmation: 'Booking confirmed at {{restaurant_name}} for {{date}} at {{time}}. Code: {{confirmation_code}}',
  reminder: 'Reminder: Booking tomorrow at {{time}} at {{restaurant_name}}. Code: {{confirmation_code}}',
  cancellation: 'Booking cancelled at {{restaurant_name}} for {{date}} at {{time}}.',
  no_show: 'Booking marked as no-show at {{restaurant_name}} for {{date}} at {{time}}.'
}

export const notificationService = {
  // Get notification preferences for a business
  async getPreferences(businessId: string): Promise<NotificationPreferences | null> {
    // Use service role client if in dev bypass mode
    const serviceClient = getServiceRoleClient();
    const client = serviceClient || supabase;
    
    if (serviceClient) {
      console.log('🔧 Dev bypass: using service role client for real DB operations');
    }

    try {
      const { data, error } = await client
        .from('notification_preferences')
        .select('*')
        .eq('business_id', businessId)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
      
      if (data) {
        console.log('✅ Found existing notification preferences');
        return data;
      } else {
        console.log('📝 No preferences found, will create defaults when saved');
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching notification preferences:', error);
      return null;
    }
  },

  // Create or update notification preferences
  async savePreferences(preferences: Partial<NotificationPreferences> & { business_id: string }): Promise<NotificationPreferences> {
    // Use service role client if in dev bypass mode
    const serviceClient = getServiceRoleClient();
    const client = serviceClient || supabase;
    
    if (serviceClient) {
      console.log('🔧 Dev bypass: using service role client for real DB operations');
    }

    try {
      const existing = await this.getPreferences(preferences.business_id)
      
      if (existing && existing.id && !existing.id.startsWith('dev-')) {
        // Update existing preferences
        console.log('🔄 Updating existing notification preferences');
        const { data, error } = await client
          .from('notification_preferences')
          .update({
            ...preferences,
            updated_at: new Date().toISOString()
          })
          .eq('business_id', preferences.business_id)
          .select()
          .single()

        if (error) throw error
        console.log('✅ Notification preferences updated successfully');
        return data
      } else {
        // Create new preferences with defaults
        console.log('🆕 Creating new notification preferences');
        const defaultPreferences: NotificationPreferences = {
          id: '', // Let database generate ID
          business_id: preferences.business_id,
          email_enabled: preferences.email_enabled ?? true,
          sms_enabled: preferences.sms_enabled ?? false,
          email_templates: preferences.email_templates ?? DEFAULT_EMAIL_TEMPLATES,
          sms_templates: preferences.sms_templates ?? DEFAULT_SMS_TEMPLATES,
          reminder_hours_before: preferences.reminder_hours_before ?? 24,
          auto_send_confirmations: preferences.auto_send_confirmations ?? true,
          auto_send_reminders: preferences.auto_send_reminders ?? true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { data, error } = await client
          .from('notification_preferences')
          .insert([defaultPreferences])
          .select()
          .single()

        if (error) throw error
        console.log('✅ Notification preferences created successfully');
        return data
      }
    } catch (error) {
      console.error('❌ Error saving notification preferences:', error);
      throw error;
    }
  },

  // Send notification for booking status change
  async sendBookingNotification(
    booking: Booking,
    notificationType: 'confirmation' | 'reminder' | 'cancellation' | 'no_show',
    preferences: NotificationPreferences
  ): Promise<BookingNotification[]> {
    const notifications: BookingNotification[] = []

    // Get restaurant name
    const { data: restaurant } = await supabase
      .from('businesses')
      .select('name')
      .eq('id', booking.business_id)
      .single()

    const restaurantName = restaurant?.name || 'Restaurant'

    // Prepare template variables
    const variables = {
      restaurant_name: restaurantName,
      customer_name: booking.customer_name,
      date: new Date(booking.booking_date).toLocaleDateString(),
      time: booking.booking_time,
      party_size: booking.party_size.toString(),
      confirmation_code: booking.confirmation_code || '',
      cancellation_reason: booking.cancellation_reason || 'No reason provided'
    }

    // Send email notification if enabled
    if (preferences.email_enabled && booking.customer_email) {
      const emailTemplate = preferences.email_templates[notificationType]
      const emailMessage = this.replaceTemplateVariables(emailTemplate, variables)
      
      const emailNotification: Omit<BookingNotification, 'id' | 'created_at'> = {
        booking_id: booking.id,
        notification_type: notificationType,
        recipient_email: booking.customer_email,
        subject: `Booking ${notificationType.charAt(0).toUpperCase() + notificationType.slice(1)} - ${restaurantName}`,
        message: emailMessage,
        channel: 'email',
        status: 'pending'
      }

      const { data: emailNotif, error: emailError } = await supabase
        .from('booking_notifications')
        .insert([emailNotification])
        .select()
        .single()

      if (!emailError) {
        notifications.push(emailNotif)
      }
    }

    // Send SMS notification if enabled
    if (preferences.sms_enabled && booking.customer_phone) {
      const smsTemplate = preferences.sms_templates[notificationType]
      const smsMessage = this.replaceTemplateVariables(smsTemplate, variables)
      
      const smsNotification: Omit<BookingNotification, 'id' | 'created_at'> = {
        booking_id: booking.id,
        notification_type: notificationType,
        recipient_phone: booking.customer_phone,
        message: smsMessage,
        channel: 'sms',
        status: 'pending'
      }

      const { data: smsNotif, error: smsError } = await supabase
        .from('booking_notifications')
        .insert([smsNotification])
        .select()
        .single()

      if (!smsError) {
        notifications.push(smsNotif)
      }
    }

    return notifications
  },

  // Replace template variables in message
  replaceTemplateVariables(template: string, variables: Record<string, string>): string {
    let message = template
    Object.entries(variables).forEach(([key, value]) => {
      message = message.replace(new RegExp(`{{${key}}}`, 'g'), value)
    })
    return message
  },

  // Get notification history for a booking
  async getBookingNotifications(bookingId: string): Promise<BookingNotification[]> {
    const { data, error } = await supabase
      .from('booking_notifications')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get notification history for a business
  async getBusinessNotifications(businessId: string, limit = 50): Promise<BookingNotification[]> {
    const { data, error } = await supabase
      .from('booking_notifications')
      .select(`
        *,
        bookings!inner(business_id)
      `)
      .eq('bookings.business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  },

  // Test notification (for settings page)
  async sendTestNotification(
    businessId: string,
    testEmail: string,
    testPhone: string,
    preferences: NotificationPreferences
  ): Promise<BookingNotification[]> {
    const testBooking: Booking = {
      id: 'test-booking',
      business_id: businessId,
      customer_name: 'Test Customer',
      customer_email: testEmail,
      customer_phone: testPhone,
      party_size: 2,
      booking_date: new Date().toISOString().split('T')[0],
      booking_time: '19:00',
      status: 'confirmed',
      confirmation_code: 'TEST123',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return this.sendBookingNotification(testBooking, 'confirmation', preferences)
  }
} 