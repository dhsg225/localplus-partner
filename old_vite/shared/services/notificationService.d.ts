import type { Booking, BookingNotification } from '../types';
export interface NotificationPreferences {
    id: string;
    business_id: string;
    email_enabled: boolean;
    sms_enabled: boolean;
    email_templates: {
        confirmation: string;
        reminder: string;
        cancellation: string;
        no_show: string;
    };
    sms_templates: {
        confirmation: string;
        reminder: string;
        cancellation: string;
        no_show: string;
    };
    reminder_hours_before: number;
    auto_send_confirmations: boolean;
    auto_send_reminders: boolean;
    created_at: string;
    updated_at: string;
}
export interface NotificationTemplate {
    type: 'confirmation' | 'reminder' | 'cancellation' | 'no_show';
    subject?: string;
    message: string;
    variables: string[];
}
export declare const notificationService: {
    getPreferences(businessId: string): Promise<NotificationPreferences | null>;
    savePreferences(preferences: Partial<NotificationPreferences> & {
        business_id: string;
    }): Promise<NotificationPreferences>;
    sendBookingNotification(booking: Booking, notificationType: "confirmation" | "reminder" | "cancellation" | "no_show", preferences: NotificationPreferences): Promise<BookingNotification[]>;
    replaceTemplateVariables(template: string, variables: Record<string, string>): string;
    getBookingNotifications(bookingId: string): Promise<BookingNotification[]>;
    getBusinessNotifications(businessId: string, limit?: number): Promise<BookingNotification[]>;
    sendTestNotification(businessId: string, testEmail: string, testPhone: string, preferences: NotificationPreferences): Promise<BookingNotification[]>;
};
