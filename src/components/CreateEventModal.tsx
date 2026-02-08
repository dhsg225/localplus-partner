// [2025-12-01] - Modal for creating new events
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import MediaPicker from './MediaPicker';
import CreateLocationModal from './CreateLocationModal';
import CustomFormBuilder from './CustomFormBuilder';

interface CreateEventModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: any; // [2025-12-07] - Optional initial data for duplicating events
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  visible,
  onClose,
  onSuccess,
  initialData
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subtitle: '',
    status: 'draft',
    event_type: 'general',
    location: '',
    venue_area: '',
    start_time: '',
    end_time: '',
    hero_image_url: '',
    // [2026-01-21] - Modular feature system
    enabled_features: {
      rsvp: false,
      ticketing: false
    },
    rsvp_config: {
      max_capacity: '' as number | '',
      rsvp_deadline: '',
      requires_confirmation: true,
      allow_guest_plus_one: false,
      custom_fields: [] as any[]
    },
    ticketing_config: {
      price_per_ticket: '' as number | '',
      currency: 'THB',
      payment_methods: ['bank_transfer'] as string[],
      ticket_types: [] as any[],
      sales_start: '',
      sales_end: ''
    }
  });
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showCreateLocationModal, setShowCreateLocationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // [2025-12-01] - Organizer state
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [selectedOrganizerId, setSelectedOrganizerId] = useState<string>('');
  const [showCreateOrganizer, setShowCreateOrganizer] = useState(false);
  const [newOrganizer, setNewOrganizer] = useState({
    name: '',
    description: '',
    contact: '',
    address: '',
    image_url: '',
    website_url: ''
  });
  const [loadingOrganizers, setLoadingOrganizers] = useState(false);

  // [2025-01-XX] - Autocomplete state for Category, Location, Organizer, Calendar
  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [calendars, setCalendars] = useState<any[]>([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [calendarSearch, setCalendarSearch] = useState('');
  const [organizerSearch, setOrganizerSearch] = useState('');
  const [selectedCalendarSlug, setSelectedCalendarSlug] = useState<string>('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);
  const [showOrganizerDropdown, setShowOrganizerDropdown] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [loadingCalendars, setLoadingCalendars] = useState(false);

  // [2025-12-05] - Recurrence state
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceData, setRecurrenceData] = useState({
    frequency: 'weekly',
    interval: 1,
    byweekday: [] as number[],
    bymonthday: null as number | null,
    bysetpos: null as number | null,
    endCondition: 'never' as 'never' | 'until' | 'count',
    until: '',
    count: null as number | null,
    exceptions: [] as string[],
    additional_dates: [] as string[]
  });

  // [2025-12-01] - Load organizers when modal opens
  // [2025-01-XX] - Also load categories, locations, and calendars
  useEffect(() => {
    if (visible) {
      loadOrganizers();
      loadCategories();
      loadLocations();
      loadCalendars();
    }
  }, [visible]);

  // [2025-01-XX] - Load categories from API
  const loadCategories = async (search?: string) => {
    setLoadingCategories(true);
    try {
      const response = await apiService.getCategories(search);
      const data = Array.isArray(response.data) ? response.data : [];
      setCategories(data);
    } catch (err) {
      console.error('[CreateEventModal] Error loading categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  // [2025-01-XX] - Load locations from API
  const loadLocations = async (search?: string) => {
    setLoadingLocations(true);
    try {
      const response = await apiService.getLocations(search);
      const data = Array.isArray(response.data) ? response.data : [];
      setLocations(data);
    } catch (err) {
      console.error('[CreateEventModal] Error loading locations:', err);
    } finally {
      setLoadingLocations(false);
    }
  };

  // [2025-01-23] - Load calendars from API
  const loadCalendars = async (search?: string) => {
    setLoadingCalendars(true);
    try {
      const response = await apiService.getCalendars(search);
      const data = Array.isArray(response.data) ? response.data : [];
      setCalendars(data);
    } catch (err) {
      console.error('[CreateEventModal] Error loading calendars:', err);
    } finally {
      setLoadingCalendars(false);
    }
  };

  // [2025-12-01] - Load organizers from API
  // [2025-01-XX] - Added search parameter for autocomplete
  const loadOrganizers = async (search?: string) => {
    setLoadingOrganizers(true);
    try {
      const response = await apiService.getOrganizers(search);
      const data = Array.isArray(response.data) ? response.data : response?.data?.data || [];
      setOrganizers(data);
    } catch (err) {
      console.error('[CreateEventModal] Error loading organizers:', err);
      // Don't show error - organizers are optional
    } finally {
      setLoadingOrganizers(false);
    }
  };

  // [2025-01-XX] - Debounced search handlers for autocomplete
  useEffect(() => {
    const timer = setTimeout(() => {
      if (categorySearch.trim()) {
        loadCategories(categorySearch);
      } else {
        loadCategories();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [categorySearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (locationSearch.trim()) {
        loadLocations(locationSearch);
      } else {
        loadLocations();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [locationSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (organizerSearch.trim()) {
        loadOrganizers(organizerSearch);
      } else {
        loadOrganizers();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [organizerSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (calendarSearch.trim()) {
        loadCalendars(calendarSearch);
      } else {
        loadCalendars();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [calendarSearch]);

  // [2025-12-01] - Set default times (now + 1 hour, now + 3 hours)
  // [2025-12-07] - Also handle initialData for duplicating events
  useEffect(() => {
    if (visible) {
      if (initialData) {
        // [2025-12-07] - Pre-fill form with event data for duplication
        const formatDateTimeLocal = (dateString: string) => {
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        };

        // [2025-01-XX] - Keep category IDs as-is (multi-select component handles display)
        let eventType = initialData.event_type || 'general';

        // Parse enabled features from initialData
        const enabledFeatures = initialData.enabled_features || {};
        const rsvpConfig = initialData.rsvp_config || {};
        const ticketingConfig = initialData.ticketing_config || {};

        setFormData({
          title: `${initialData.title} (Copy)`,
          description: initialData.description || '',
          subtitle: initialData.subtitle || '',
          status: 'draft',
          event_type: eventType,
          location: initialData.location || '',
          venue_area: initialData.venue_area || '',
          start_time: initialData.start_time ? formatDateTimeLocal(initialData.start_time) : '',
          end_time: initialData.end_time ? formatDateTimeLocal(initialData.end_time) : '',
          hero_image_url: initialData.hero_image_url || '',
          enabled_features: {
            rsvp: enabledFeatures.rsvp || false,
            ticketing: enabledFeatures.ticketing || false
          },
          rsvp_config: {
            max_capacity: rsvpConfig.max_capacity || '',
            rsvp_deadline: rsvpConfig.rsvp_deadline ? formatDateTimeLocal(rsvpConfig.rsvp_deadline) : '',
            requires_confirmation: rsvpConfig.requires_confirmation !== false,
            allow_guest_plus_one: rsvpConfig.allow_guest_plus_one || false,
            custom_fields: rsvpConfig.custom_fields || []
          },
          ticketing_config: {
            price_per_ticket: ticketingConfig.price_per_ticket || '',
            currency: ticketingConfig.currency || 'THB',
            payment_methods: ticketingConfig.payment_methods || ['bank_transfer'],
            ticket_types: ticketingConfig.ticket_types || [],
            sales_start: ticketingConfig.sales_start ? formatDateTimeLocal(ticketingConfig.sales_start) : '',
            sales_end: ticketingConfig.sales_end ? formatDateTimeLocal(ticketingConfig.sales_end) : ''
          }
        });

        // Set organizer if present
        if (initialData.organizer_id) {
          setSelectedOrganizerId(initialData.organizer_id);
          // If we have organizers loaded, set the search text to the name
          const org = organizers.find(o => o.id === initialData.organizer_id);
          if (org) {
            setOrganizerSearch(org.name);
          }
        } else if (initialData.metadata?.eventon_organizer_id) {
          // Fallback for legacy data
          setOrganizerSearch(`Legacy ID: ${initialData.metadata.eventon_organizer_id}`);
        }

        // Handle recurrence data if present
        if (initialData.recurrence_rules) {
          setIsRecurring(true);
          const rule = initialData.recurrence_rules;
          setRecurrenceData({
            frequency: rule.frequency || 'weekly',
            interval: rule.interval || 1,
            byweekday: rule.byweekday || [],
            bymonthday: rule.bymonthday || null,
            bysetpos: rule.bysetpos || null,
            endCondition: rule.until ? 'until' : rule.count ? 'count' : 'never',
            until: rule.until || '',
            count: rule.count || null,
            exceptions: rule.exceptions || [],
            additional_dates: rule.additional_dates || []
          });
        } else {
          setIsRecurring(false);
          setRecurrenceData({
            frequency: 'weekly',
            interval: 1,
            byweekday: [],
            bymonthday: null,
            bysetpos: null,
            endCondition: 'never',
            until: '',
            count: null,
            exceptions: [],
            additional_dates: []
          });
        }
      } else {
        // Default behavior: set times to now + 1 hour, now + 3 hours
        const now = new Date();
        const start = new Date(now.getTime() + 60 * 60 * 1000); // +1 hour
        const end = new Date(now.getTime() + 3 * 60 * 60 * 1000); // +3 hours

        const formatDateTimeLocal = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        };

        setFormData(prev => ({
          ...prev,
          start_time: formatDateTimeLocal(start),
          end_time: formatDateTimeLocal(end)
        }));
      }
    }
  }, [visible, initialData, organizers]);

  // [2025-01-XX] - Update organizer search when organizers are loaded
  useEffect(() => {
    if (visible && initialData?.organizer_id && organizers.length > 0) {
      const org = organizers.find(o => o.id === initialData.organizer_id);
      if (org && !organizerSearch) {
        setOrganizerSearch(org.name);
      }
    }
  }, [organizers, visible, initialData]);

  // [2025-12-01] - Handle create new organizer
  const handleCreateOrganizer = async () => {
    if (!newOrganizer.name.trim()) {
      setError('Organizer name is required');
      return;
    }

    try {
      const response = await apiService.createOrganizer(newOrganizer);
      const createdOrganizer = response.data?.data || response.data;

      // Add to organizers list and select it
      setOrganizers(prev => [...prev, createdOrganizer]);
      setSelectedOrganizerId(createdOrganizer.id);
      setShowCreateOrganizer(false);

      // Reset new organizer form
      setNewOrganizer({
        name: '',
        description: '',
        contact: '',
        address: '',
        image_url: '',
        website_url: ''
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to create organizer');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Convert datetime-local to ISO string
      const startTime = new Date(formData.start_time).toISOString();
      const endTime = new Date(formData.end_time).toISOString();

      if (endTime <= startTime) {
        setError('End time must be after start time');
        setLoading(false);
        return;
      }

      const eventData: any = {
        title: formData.title,
        description: formData.description || null,
        subtitle: formData.subtitle || null,
        status: formData.status,
        event_type: formData.event_type,
        location: formData.location || null,
        venue_area: formData.venue_area || null,
        start_time: startTime,
        end_time: endTime,
        timezone_id: 'Asia/Bangkok',
        // [2025-01-23] - Include calendar (inspired by EventON's calendar system)
        calendar_slug: selectedCalendarSlug || calendarSearch || null,
        // [2025-01-XX] - Include organizer
        organizer_id: selectedOrganizerId || null,
        hero_image_url: formData.hero_image_url || null,
        // [2026-01-21] - Modular Feature System
        enabled_features: formData.enabled_features,
        rsvp_config: formData.enabled_features.rsvp ? {
          max_capacity: formData.rsvp_config.max_capacity ? parseInt(String(formData.rsvp_config.max_capacity)) : null,
          rsvp_deadline: formData.rsvp_config.rsvp_deadline ? new Date(formData.rsvp_config.rsvp_deadline).toISOString() : null,
          requires_confirmation: formData.rsvp_config.requires_confirmation,
          allow_guest_plus_one: formData.rsvp_config.allow_guest_plus_one,
          custom_fields: formData.rsvp_config.custom_fields
        } : {},
        ticketing_config: formData.enabled_features.ticketing ? {
          price_per_ticket: formData.ticketing_config.price_per_ticket ? parseFloat(String(formData.ticketing_config.price_per_ticket)) : null,
          currency: formData.ticketing_config.currency,
          payment_methods: formData.ticketing_config.payment_methods,
          ticket_types: formData.ticketing_config.ticket_types,
          sales_start: formData.ticketing_config.sales_start ? new Date(formData.ticketing_config.sales_start).toISOString() : null,
          sales_end: formData.ticketing_config.sales_end ? new Date(formData.ticketing_config.sales_end).toISOString() : null
        } : {}
      };

      // [2025-12-05] - Add recurrence_rules if event is recurring
      if (isRecurring) {
        const rule: any = {
          frequency: recurrenceData.frequency,
          interval: recurrenceData.interval || 1,
          timezone: 'Asia/Bangkok'
        };

        // Add frequency-specific fields
        if (recurrenceData.frequency === 'weekly' && recurrenceData.byweekday.length > 0) {
          rule.byweekday = recurrenceData.byweekday;
        } else if (recurrenceData.frequency === 'monthly') {
          if (recurrenceData.bymonthday) {
            rule.bymonthday = recurrenceData.bymonthday;
          } else if (recurrenceData.bysetpos && recurrenceData.byweekday.length > 0) {
            rule.bysetpos = recurrenceData.bysetpos;
            rule.byweekday = recurrenceData.byweekday;
          }
        }

        // Add end conditions
        if (recurrenceData.endCondition === 'until' && recurrenceData.until) {
          rule.until = new Date(recurrenceData.until).toISOString();
        } else if (recurrenceData.endCondition === 'count' && recurrenceData.count) {
          rule.count = recurrenceData.count;
        }

        // Add exceptions and additional dates
        if (recurrenceData.exceptions.length > 0) {
          rule.exceptions = recurrenceData.exceptions;
        }
        if (recurrenceData.additional_dates.length > 0) {
          rule.additional_dates = recurrenceData.additional_dates;
        }

        eventData.recurrence_rules = rule;
      }

      await apiService.createEvent(eventData);

      // Reset form
      setFormData({
        title: '',
        description: '',
        subtitle: '',
        status: 'draft',
        event_type: 'general',
        location: '',
        venue_area: '',
        start_time: '',
        end_time: '',
        hero_image_url: '',
        enabled_features: {
          rsvp: false,
          ticketing: false
        },
        rsvp_config: {
          max_capacity: '' as number | '',
          rsvp_deadline: '',
          requires_confirmation: true,
          allow_guest_plus_one: false,
          custom_fields: [] as any[]
        },
        ticketing_config: {
          price_per_ticket: '' as number | '',
          currency: 'THB',
          payment_methods: ['bank_transfer'] as string[],
          ticket_types: [] as any[],
          sales_start: '',
          sales_end: ''
        }
      });

      // [2025-12-05] - Reset recurrence
      setIsRecurring(false);
      setRecurrenceData({
        frequency: 'weekly',
        interval: 1,
        byweekday: [],
        bymonthday: null,
        bysetpos: null,
        endCondition: 'never',
        until: '',
        count: null,
        exceptions: [],
        additional_dates: []
      });

      // [2025-12-07] - Reset organizer selection
      setSelectedOrganizerId('');
      // [2025-01-XX] - Reset autocomplete search states
      setCategorySearch('');
      setLocationSearch('');
      setOrganizerSearch('');
      setCalendarSearch('');
      setSelectedCalendarSlug('');
      setShowCategoryDropdown(false);
      setShowLocationDropdown(false);
      setShowOrganizerDropdown(false);
      setShowCalendarDropdown(false);

      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('[CreateEventModal] Error creating event:', err);
      setError(err?.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // [2025-12-07] - Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      // Reset form when modal is closed
      setFormData({
        title: '',
        description: '',
        subtitle: '',
        status: 'draft',
        event_type: 'general',
        location: '',
        venue_area: '',
        start_time: '',
        end_time: '',
        hero_image_url: '',
        enabled_features: {
          rsvp: false,
          ticketing: false
        },
        rsvp_config: {
          max_capacity: '' as number | '',
          rsvp_deadline: '',
          requires_confirmation: true,
          allow_guest_plus_one: false,
          custom_fields: [] as any[]
        },
        ticketing_config: {
          price_per_ticket: '' as number | '',
          currency: 'THB',
          payment_methods: ['bank_transfer'] as string[],
          ticket_types: [] as any[],
          sales_start: '',
          sales_end: ''
        }
      });
      setIsRecurring(false);
      setRecurrenceData({
        frequency: 'weekly',
        interval: 1,
        byweekday: [],
        bymonthday: null,
        bysetpos: null,
        endCondition: 'never',
        until: '',
        count: null,
        exceptions: [],
        additional_dates: []
      });
      setSelectedOrganizerId('');
      // [2025-01-XX] - Reset autocomplete search states
      setCategorySearch('');
      setLocationSearch('');
      setOrganizerSearch('');
      setShowCategoryDropdown(false);
      setShowLocationDropdown(false);
      setShowOrganizerDropdown(false);
      setError(null);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {initialData ? 'Duplicate Event' : 'Create New Event'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white px-6 py-4 pb-32 max-h-[70vh] overflow-y-auto">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Event title"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional subtitle"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Event description"
                  />
                </div>

                {/* Hero Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hero Image
                  </label>
                  <div className="flex items-start gap-4">
                    {formData.hero_image_url ? (
                      <div className="relative w-40 h-24 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                        <img
                          src={`${formData.hero_image_url}?width=400`}
                          alt="Hero preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, hero_image_url: '' })}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-sm"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowMediaPicker(true)}
                        className="w-40 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-xs text-gray-500 font-medium">Add Photo</span>
                      </button>
                    )}
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.hero_image_url}
                        onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-2"
                        placeholder="Image URL or use picker"
                      />
                      <button
                        type="button"
                        onClick={() => setShowMediaPicker(true)}
                        className="text-sm text-blue-600 font-medium hover:text-blue-700"
                      >
                        Open Media Manager
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                {/* Event Type - Multi-select Autocomplete */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categories
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 bg-white min-h-[42px] flex flex-wrap gap-2 items-center">
                    {/* Selected Chips */}
                    {(() => {
                      // Parse current event_type string into array of IDs
                      const currentIds = formData.event_type
                        ? String(formData.event_type).split(',').map(s => s.trim()).filter(Boolean)
                        : [];

                      return currentIds.map(id => {
                        const cat = categories.find(c => String(c.term_id) === id);
                        const label = cat ? cat.name : id;
                        return (
                          <div key={id} className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            <span>{label}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newIds = currentIds.filter(cid => cid !== id);
                                setFormData({ ...formData, event_type: newIds.join(', ') });
                              }}
                              className="w-4 h-4 flex items-center justify-center hover:bg-blue-200 rounded-full text-blue-600"
                            >
                              ×
                            </button>
                          </div>
                        );
                      });
                    })()}

                    {/* Search Input */}
                    <input
                      type="text"
                      value={categorySearch}
                      onChange={(e) => {
                        setCategorySearch(e.target.value);
                        setShowCategoryDropdown(true);
                      }}
                      onFocus={() => setShowCategoryDropdown(true)}
                      onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 200)}
                      className="flex-1 min-w-[100px] outline-none text-sm"
                      placeholder={formData.event_type ? "" : "Search categories..."}
                    />
                  </div>

                  {showCategoryDropdown && categories.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {categories
                        .filter(cat => {
                          const currentIds = formData.event_type
                            ? String(formData.event_type).split(',').map(s => s.trim()).filter(Boolean)
                            : [];
                          // Exclude already selected
                          if (currentIds.includes(String(cat.term_id))) return false;
                          // Filter by search
                          if (!categorySearch) return true;
                          return cat.name.toLowerCase().includes(categorySearch.toLowerCase());
                        })
                        .map((cat) => (
                          <button
                            key={cat.term_id}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              // Append new ID to comma-separated list
                              const currentIds = formData.event_type
                                ? String(formData.event_type).split(',').map(s => s.trim()).filter(Boolean)
                                : [];
                              const newIds = [...currentIds, String(cat.term_id)];
                              setFormData({ ...formData, event_type: newIds.join(', ') });
                              setCategorySearch(''); // Clear search after selection
                              // Keep dropdown open for multiple selections
                              // setShowCategoryDropdown(false); 
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm"
                          >
                            {cat.name}
                          </button>
                        ))}
                    </div>
                  )}
                  {loadingCategories && (
                    <p className="mt-1 text-xs text-gray-500">Loading categories...</p>
                  )}
                </div>

                {/* Calendar - Autocomplete */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calendar
                  </label>
                  <input
                    type="text"
                    value={calendarSearch || (selectedCalendarSlug ? calendars.find(c => c.slug === selectedCalendarSlug)?.name || '' : '')}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCalendarSearch(value);
                      setShowCalendarDropdown(true);
                      // Clear selection if user is typing
                      if (value !== calendars.find(c => c.slug === selectedCalendarSlug)?.name) {
                        setSelectedCalendarSlug('');
                      }
                    }}
                    onFocus={() => {
                      setShowCalendarDropdown(true);
                      if (calendars.length === 0) {
                        loadCalendars();
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowCalendarDropdown(false), 200)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type to search calendars..."
                    disabled={loadingCalendars}
                  />
                  {showCalendarDropdown && calendars.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {calendars.map((cal) => (
                        <button
                          key={cal.slug}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setSelectedCalendarSlug(cal.slug);
                            setCalendarSearch(cal.name);
                            setShowCalendarDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm"
                        >
                          <div className="font-medium">{cal.name}</div>
                          {cal.description && (
                            <div className="text-xs text-gray-500">{cal.description}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  {loadingCalendars && (
                    <p className="mt-1 text-xs text-gray-500">Loading calendars...</p>
                  )}
                </div>

                {/* [2026-01-21] - Modular Feature System */}
                <div className="border-t border-gray-100 pt-6 mt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">📋 Event Features</h4>
                  <p className="text-xs text-gray-500 mb-4">Enable additional features for your event</p>

                  {/* RSVP Feature Toggle */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <input
                        id="enable_rsvp"
                        type="checkbox"
                        checked={formData.enabled_features.rsvp}
                        onChange={(e) => setFormData({
                          ...formData,
                          enabled_features: { ...formData.enabled_features, rsvp: e.target.checked }
                        })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="enable_rsvp" className="flex-1 text-sm font-medium text-gray-900 cursor-pointer">
                        Enable RSVP & Attendance Tracking
                      </label>
                    </div>

                    {/* RSVP Settings Panel (Collapsible) */}
                    {formData.enabled_features.rsvp && (
                      <div className="mt-3 ml-7 p-4 bg-blue-50 rounded-lg border border-blue-100 animate-in fade-in slide-in-from-top-2 duration-200">
                        <h5 className="text-sm font-semibold text-gray-900 mb-3">RSVP Settings</h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Max Capacity */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Max Capacity
                            </label>
                            <input
                              type="number"
                              value={formData.rsvp_config.max_capacity}
                              onChange={(e) => setFormData({
                                ...formData,
                                rsvp_config: { ...formData.rsvp_config, max_capacity: e.target.value ? parseInt(e.target.value) : '' }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              placeholder="e.g. 20"
                            />
                          </div>

                          {/* RSVP Deadline */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              RSVP Deadline
                            </label>
                            <input
                              type="datetime-local"
                              value={formData.rsvp_config.rsvp_deadline}
                              onChange={(e) => setFormData({
                                ...formData,
                                rsvp_config: { ...formData.rsvp_config, rsvp_deadline: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                        </div>

                        <div className="mt-3 space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.rsvp_config.requires_confirmation}
                              onChange={(e) => setFormData({
                                ...formData,
                                rsvp_config: { ...formData.rsvp_config, requires_confirmation: e.target.checked }
                              })}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Require host confirmation</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.rsvp_config.allow_guest_plus_one}
                              onChange={(e) => setFormData({
                                ...formData,
                                rsvp_config: { ...formData.rsvp_config, allow_guest_plus_one: e.target.checked }
                              })}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Allow +1 guests</span>
                          </label>
                        </div>

                        {/* [2026-01-21] - Custom Form Builder */}
                        <CustomFormBuilder
                          fields={formData.rsvp_config.custom_fields}
                          onChange={(fields) => setFormData({
                            ...formData,
                            rsvp_config: { ...formData.rsvp_config, custom_fields: fields }
                          })}
                        />
                      </div>
                    )}
                  </div>

                  {/* Ticketing Feature Toggle */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <input
                        id="enable_ticketing"
                        type="checkbox"
                        checked={formData.enabled_features.ticketing}
                        onChange={(e) => setFormData({
                          ...formData,
                          enabled_features: { ...formData.enabled_features, ticketing: e.target.checked }
                        })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="enable_ticketing" className="flex-1 text-sm font-medium text-gray-900 cursor-pointer">
                        Enable Ticket Sales
                      </label>
                    </div>

                    {/* Ticketing Settings Panel (Collapsible) */}
                    {formData.enabled_features.ticketing && (
                      <div className="mt-3 ml-7 p-4 bg-green-50 rounded-lg border border-green-100 animate-in fade-in slide-in-from-top-2 duration-200">
                        <h5 className="text-sm font-semibold text-gray-900 mb-3">🎫 Ticketing Settings</h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Price per Ticket */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Price per Ticket
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-2 text-gray-500 text-sm">฿</span>
                              <input
                                type="number"
                                value={formData.ticketing_config.price_per_ticket}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  ticketing_config: { ...formData.ticketing_config, price_per_ticket: e.target.value ? parseFloat(e.target.value) : '' }
                                })}
                                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="0.00"
                              />
                            </div>
                          </div>

                          {/* Currency */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Currency
                            </label>
                            <select
                              value={formData.ticketing_config.currency}
                              onChange={(e) => setFormData({
                                ...formData,
                                ticketing_config: { ...formData.ticketing_config, currency: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                              <option value="THB">THB (฿)</option>
                              <option value="USD">USD ($)</option>
                              <option value="EUR">EUR (€)</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Payment Methods
                          </label>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.ticketing_config.payment_methods.includes('bank_transfer')}
                                onChange={(e) => {
                                  const methods = e.target.checked
                                    ? [...formData.ticketing_config.payment_methods, 'bank_transfer']
                                    : formData.ticketing_config.payment_methods.filter(m => m !== 'bank_transfer');
                                  setFormData({
                                    ...formData,
                                    ticketing_config: { ...formData.ticketing_config, payment_methods: methods }
                                  });
                                }}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">Bank Transfer</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.ticketing_config.payment_methods.includes('promptpay')}
                                onChange={(e) => {
                                  const methods = e.target.checked
                                    ? [...formData.ticketing_config.payment_methods, 'promptpay']
                                    : formData.ticketing_config.payment_methods.filter(m => m !== 'promptpay');
                                  setFormData({
                                    ...formData,
                                    ticketing_config: { ...formData.ticketing_config, payment_methods: methods }
                                  });
                                }}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">PromptPay</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-not-allowed opacity-50">
                              <input
                                type="checkbox"
                                disabled
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">Credit Card (Coming Soon)</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Future Features (Disabled) */}
                  <div className="opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <input
                        type="checkbox"
                        disabled
                        className="w-4 h-4 text-gray-400 border-gray-300 rounded"
                      />
                      <label className="flex-1 text-sm font-medium text-gray-500">
                        Enable Waitlist (Coming Soon)
                      </label>
                    </div>
                  </div>
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Location - Autocomplete */}
                {/* Location - Autocomplete */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={locationSearch || formData.location}
                        onChange={(e) => {
                          const value = e.target.value;
                          setLocationSearch(value);
                          setFormData({ ...formData, location: value });
                          setShowLocationDropdown(true);
                        }}
                        onFocus={() => {
                          setShowLocationDropdown(true);
                          if (locations.length === 0) {
                            loadLocations();
                          }
                        }}
                        onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type to search locations..."
                      />
                      {showLocationDropdown && locations.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                          {locations.map((loc) => (
                            <button
                              key={loc.id}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setFormData({ ...formData, location: loc.name });
                                setLocationSearch(loc.name);
                                setShowLocationDropdown(false);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm"
                            >
                              <div className="font-medium">{loc.name}</div>
                              {loc.address && (
                                <div className="text-xs text-gray-500">{loc.address}</div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                      {loadingLocations && (
                        <p className="mt-1 text-xs text-gray-500">Loading locations...</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCreateLocationModal(true)}
                      className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-transparent rounded-md hover:bg-blue-100 whitespace-nowrap"
                      title="Create new location"
                    >
                      + New
                    </button>
                  </div>
                </div>

                {/* Venue Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue Area
                  </label>
                  <input
                    type="text"
                    value={formData.venue_area}
                    onChange={(e) => setFormData({ ...formData, venue_area: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Area or district"
                  />
                </div>

                {/* Recurrence Section */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="isRecurring"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isRecurring" className="ml-2 block text-sm font-medium text-gray-700">
                      This event repeats
                    </label>
                  </div>

                  {isRecurring && (
                    <div className="space-y-4 bg-gray-50 p-4 rounded-md">
                      {/* Step 1: Frequency */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Repeat
                        </label>
                        <select
                          value={recurrenceData.frequency}
                          onChange={(e) => setRecurrenceData({ ...recurrenceData, frequency: e.target.value as any, byweekday: [], bymonthday: null, bysetpos: null })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>

                      {/* Step 2: Interval */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Every
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={recurrenceData.interval}
                            onChange={(e) => setRecurrenceData({ ...recurrenceData, interval: parseInt(e.target.value) || 1 })}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-600">
                            {recurrenceData.frequency === 'daily' && 'day(s)'}
                            {recurrenceData.frequency === 'weekly' && 'week(s)'}
                            {recurrenceData.frequency === 'monthly' && 'month(s)'}
                            {recurrenceData.frequency === 'yearly' && 'year(s)'}
                          </span>
                        </div>
                      </div>

                      {/* Step 3: Rule Details */}
                      {recurrenceData.frequency === 'weekly' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Repeat on
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { value: 0, label: 'Sun' },
                              { value: 1, label: 'Mon' },
                              { value: 2, label: 'Tue' },
                              { value: 3, label: 'Wed' },
                              { value: 4, label: 'Thu' },
                              { value: 5, label: 'Fri' },
                              { value: 6, label: 'Sat' }
                            ].map((day) => (
                              <button
                                key={day.value}
                                type="button"
                                onClick={() => {
                                  const newWeekdays = recurrenceData.byweekday.includes(day.value)
                                    ? recurrenceData.byweekday.filter(d => d !== day.value)
                                    : [...recurrenceData.byweekday, day.value];
                                  setRecurrenceData({ ...recurrenceData, byweekday: newWeekdays });
                                }}
                                className={`px-3 py-1 text-sm rounded-md border ${recurrenceData.byweekday.includes(day.value)
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                  }`}
                              >
                                {day.label}
                              </button>
                            ))}
                          </div>
                          {recurrenceData.byweekday.length === 0 && (
                            <p className="mt-1 text-xs text-red-500">Please select at least one day</p>
                          )}
                        </div>
                      )}

                      {recurrenceData.frequency === 'monthly' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Monthly Rule
                          </label>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="monthly-day"
                                name="monthly-rule"
                                checked={recurrenceData.bymonthday !== null}
                                onChange={() => setRecurrenceData({ ...recurrenceData, bymonthday: 1, bysetpos: null, byweekday: [] })}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                              />
                              <label htmlFor="monthly-day" className="ml-2 text-sm text-gray-700">
                                On day{' '}
                                <input
                                  type="number"
                                  min="1"
                                  max="31"
                                  value={recurrenceData.bymonthday || ''}
                                  onChange={(e) => setRecurrenceData({ ...recurrenceData, bymonthday: parseInt(e.target.value) || null, bysetpos: null, byweekday: [] })}
                                  className="w-16 px-2 py-1 ml-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  disabled={recurrenceData.bymonthday === null}
                                />
                              </label>
                            </div>
                            <div>
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id="monthly-weekday"
                                  name="monthly-rule"
                                  checked={recurrenceData.bysetpos !== null}
                                  onChange={() => setRecurrenceData({ ...recurrenceData, bysetpos: 1, bymonthday: null, byweekday: [1] })}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="monthly-weekday" className="ml-2 text-sm text-gray-700">
                                  On the
                                </label>
                              </div>
                              <div className="ml-6 mt-2 space-y-2">
                                <select
                                  value={recurrenceData.bysetpos || 1}
                                  onChange={(e) => setRecurrenceData({ ...recurrenceData, bysetpos: parseInt(e.target.value) })}
                                  disabled={recurrenceData.bysetpos === null}
                                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="1">First</option>
                                  <option value="2">Second</option>
                                  <option value="3">Third</option>
                                  <option value="4">Fourth</option>
                                  <option value="-1">Last</option>
                                </select>
                                <select
                                  value={recurrenceData.byweekday[0] || 1}
                                  onChange={(e) => setRecurrenceData({ ...recurrenceData, byweekday: [parseInt(e.target.value)] })}
                                  disabled={recurrenceData.bysetpos === null}
                                  className="ml-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="0">Sunday</option>
                                  <option value="1">Monday</option>
                                  <option value="2">Tuesday</option>
                                  <option value="3">Wednesday</option>
                                  <option value="4">Thursday</option>
                                  <option value="5">Friday</option>
                                  <option value="6">Saturday</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 4: End Conditions */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ends
                        </label>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="end-never"
                              name="end-condition"
                              checked={recurrenceData.endCondition === 'never'}
                              onChange={() => setRecurrenceData({ ...recurrenceData, endCondition: 'never', until: '', count: null })}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="end-never" className="ml-2 text-sm text-gray-700">
                              Never
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="end-until"
                              name="end-condition"
                              checked={recurrenceData.endCondition === 'until'}
                              onChange={() => setRecurrenceData({ ...recurrenceData, endCondition: 'until', count: null })}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="end-until" className="ml-2 text-sm text-gray-700">
                              On{' '}
                              <input
                                type="date"
                                value={recurrenceData.until}
                                onChange={(e) => setRecurrenceData({ ...recurrenceData, until: e.target.value })}
                                disabled={recurrenceData.endCondition !== 'until'}
                                className="ml-2 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                              />
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="end-count"
                              name="end-condition"
                              checked={recurrenceData.endCondition === 'count'}
                              onChange={() => setRecurrenceData({ ...recurrenceData, endCondition: 'count', until: '' })}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="end-count" className="ml-2 text-sm text-gray-700">
                              After{' '}
                              <input
                                type="number"
                                min="1"
                                value={recurrenceData.count || ''}
                                onChange={(e) => setRecurrenceData({ ...recurrenceData, count: parseInt(e.target.value) || null })}
                                disabled={recurrenceData.endCondition !== 'count'}
                                className="ml-2 w-20 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                              />{' '}
                              occurrence(s)
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Step 5: Exceptions & Additional Dates */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Exclude Dates
                          </label>
                          <input
                            type="date"
                            onChange={(e) => {
                              if (e.target.value) {
                                const newExceptions = [...recurrenceData.exceptions, e.target.value];
                                setRecurrenceData({ ...recurrenceData, exceptions: newExceptions });
                                e.target.value = '';
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {recurrenceData.exceptions.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {recurrenceData.exceptions.map((date, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm bg-white px-2 py-1 rounded border">
                                  <span>{date}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newExceptions = recurrenceData.exceptions.filter((_, i) => i !== idx);
                                      setRecurrenceData({ ...recurrenceData, exceptions: newExceptions });
                                    }}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Add Extra Dates
                          </label>
                          <input
                            type="date"
                            onChange={(e) => {
                              if (e.target.value) {
                                const newDates = [...recurrenceData.additional_dates, e.target.value];
                                setRecurrenceData({ ...recurrenceData, additional_dates: newDates });
                                e.target.value = '';
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {recurrenceData.additional_dates.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {recurrenceData.additional_dates.map((date, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm bg-white px-2 py-1 rounded border">
                                  <span>{date}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newDates = recurrenceData.additional_dates.filter((_, i) => i !== idx);
                                      setRecurrenceData({ ...recurrenceData, additional_dates: newDates });
                                    }}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Organizer Section */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Organizer
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateOrganizer(!showCreateOrganizer);
                        if (showCreateOrganizer) {
                          setSelectedOrganizerId('');
                        }
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {showCreateOrganizer ? 'Cancel' : '+ Create New'}
                    </button>
                  </div>

                  {!showCreateOrganizer ? (
                    <div className="relative">
                      <input
                        type="text"
                        value={organizerSearch || (selectedOrganizerId ? organizers.find(o => o.id === selectedOrganizerId)?.name || '' : '')}
                        onChange={(e) => {
                          const value = e.target.value;
                          setOrganizerSearch(value);
                          setShowOrganizerDropdown(true);
                          // Clear selection if user is typing
                          if (value !== organizers.find(o => o.id === selectedOrganizerId)?.name) {
                            setSelectedOrganizerId('');
                          }
                        }}
                        onFocus={() => setShowOrganizerDropdown(true)}
                        onBlur={() => setTimeout(() => setShowOrganizerDropdown(false), 200)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type to search organizers..."
                        disabled={loadingOrganizers}
                      />
                      {showOrganizerDropdown && organizers.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                          {organizers.map((org) => (
                            <button
                              key={org.id}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setSelectedOrganizerId(org.id);
                                setOrganizerSearch(org.name);
                                setShowOrganizerDropdown(false);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm"
                            >
                              <div className="font-medium">{org.name}</div>
                              {org.description && (
                                <div className="text-xs text-gray-500">{org.description}</div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                      {loadingOrganizers && (
                        <p className="mt-1 text-xs text-gray-500">Loading organizers...</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3 bg-gray-50 p-4 rounded-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Organizer Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={newOrganizer.name}
                          onChange={(e) => setNewOrganizer({ ...newOrganizer, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Organizer name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={newOrganizer.description}
                          onChange={(e) => setNewOrganizer({ ...newOrganizer, description: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Organizer description"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contact
                        </label>
                        <input
                          type="text"
                          value={newOrganizer.contact}
                          onChange={(e) => setNewOrganizer({ ...newOrganizer, contact: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Phone, email, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          value={newOrganizer.address}
                          onChange={(e) => setNewOrganizer({ ...newOrganizer, address: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Organizer address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={newOrganizer.image_url}
                          onChange={(e) => setNewOrganizer({ ...newOrganizer, image_url: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Website URL
                        </label>
                        <input
                          type="url"
                          value={newOrganizer.website_url}
                          onChange={(e) => setNewOrganizer({ ...newOrganizer, website_url: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://..."
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleCreateOrganizer}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Create Organizer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <MediaPicker
        visible={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={(url) => setFormData({ ...formData, hero_image_url: url })}
        title="Select Event Hero Image"
      />

      <CreateLocationModal
        visible={showCreateLocationModal}
        onClose={() => setShowCreateLocationModal(false)}
        onSuccess={(locationData) => {
          loadLocations();
          setFormData({ ...formData, location: locationData.name });
          setLocationSearch(locationData.name);
          setShowCreateLocationModal(false);
        }}
      />
    </div>
  );
};

export default CreateEventModal;

