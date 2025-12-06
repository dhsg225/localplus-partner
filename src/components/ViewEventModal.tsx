// [2025-11-30] - Single event view modal (EventOn-style)
import React from 'react';

interface EventRecord {
  id: string;
  title: string;
  description?: string;
  subtitle?: string;
  status: string;
  start_time: string;
  end_time: string;
  event_type: string;
  business_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  location?: string;
  venue_area?: string;
  hero_image_url?: string;
  theme_color_hex?: string;
  venue_map_url?: string;
  learn_more_url?: string;
  venue_latitude?: number;
  venue_longitude?: number;
  metadata?: {
    eventon_organizer_id?: string;
    organizer_name?: string;
    organizer_description?: string;
    organizer_contact?: string;
    organizer_address?: string;
    organizer_image?: string;
    [key: string]: any;
  };
}

interface ViewEventModalProps {
  visible: boolean;
  event: EventRecord | null;
  onClose: () => void;
  onEdit?: () => void;
}

const ViewEventModal: React.FC<ViewEventModalProps> = ({
  visible,
  event,
  onClose,
  onEdit
}) => {
  if (!visible || !event) return null;

  // Format date and time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString(undefined, { month: 'short' }).toUpperCase(),
      full: date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const startDate = formatDate(event.start_time);
  const endDate = formatDate(event.end_time);
  const isSameDay = startDate.day === endDate.day && startDate.month === endDate.month;

  // Get category color
  const getCategoryColor = (eventType: string) => {
    switch (eventType?.toLowerCase()) {
      case 'music': return '#3b82f6'; // blue
      case 'food': return '#ec4899'; // pink
      case 'art': return '#8b5cf6'; // purple
      case 'wellness': return '#10b981'; // green
      case 'sports': return '#f97316'; // orange
      default: return event.theme_color_hex || '#6366f1'; // indigo
    }
  };

  const categoryColor = getCategoryColor(event.event_type);

  // [2025-11-30] - Get placeholder image URL based on event category
  const getPlaceholderImage = (eventType: string) => {
    const category = eventType?.toLowerCase() || 'general';
    const placeholders: Record<string, string> = {
      music: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
      food: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
      art: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop',
      wellness: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=400&fit=crop',
      sports: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
      festival: 'https://images.unsplash.com/photo-1478147427282-58a87ed120e8?w=800&h=400&fit=crop',
      general: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop'
    };
    return placeholders[category] || placeholders.general;
  };

  const displayImageUrl = event.hero_image_url || getPlaceholderImage(event.event_type);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header with Hero Image */}
          <div className="relative">
            <div className="relative h-64 overflow-hidden">
              <img
                src={displayImageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to gradient if image fails to load
                  const img = e.currentTarget;
                  const parent = img.parentElement;
                  if (parent) {
                    img.style.display = 'none';
                    const gradientDiv = document.createElement('div');
                    gradientDiv.className = 'absolute inset-0';
                    gradientDiv.style.background = `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%)`;
                    
                    // Add decorative pattern
                    const patternSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    patternSvg.setAttribute('class', 'absolute inset-0 opacity-10');
                    patternSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
                    pattern.setAttribute('id', `grid-${event.id}`);
                    pattern.setAttribute('width', '40');
                    pattern.setAttribute('height', '40');
                    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
                    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path.setAttribute('d', 'M 40 0 L 0 0 0 40');
                    path.setAttribute('fill', 'none');
                    path.setAttribute('stroke', 'white');
                    path.setAttribute('stroke-width', '1');
                    pattern.appendChild(path);
                    defs.appendChild(pattern);
                    patternSvg.appendChild(defs);
                    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    rect.setAttribute('width', '100%');
                    rect.setAttribute('height', '100%');
                    rect.setAttribute('fill', `url(#grid-${event.id})`);
                    patternSvg.appendChild(rect);
                    gradientDiv.appendChild(patternSvg);
                    
                    // Add icon overlay
                    const iconDiv = document.createElement('div');
                    iconDiv.className = 'absolute inset-0 flex items-center justify-center opacity-20';
                    iconDiv.innerHTML = `
                      <svg class="w-32 h-32 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    `;
                    gradientDiv.appendChild(iconDiv);
                    parent.appendChild(gradientDiv);
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white bg-black/30 hover:bg-black/50 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Event Card/Pill Overlay */}
            <div className="absolute bottom-4 left-4 flex items-center gap-4">
              <div
                className="bg-white rounded-lg p-4 shadow-lg flex items-center gap-3"
                style={{ minWidth: '200px' }}
              >
                <img
                  src={displayImageUrl}
                  alt={event.title}
                  className="w-16 h-16 rounded-lg object-cover"
                  onError={(e) => {
                    // Replace with colored placeholder
                    const img = e.currentTarget;
                    const placeholder = document.createElement('div');
                    placeholder.className = 'w-16 h-16 rounded-lg flex items-center justify-center';
                    placeholder.style.backgroundColor = categoryColor;
                    placeholder.innerHTML = `
                      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    `;
                    img.replaceWith(placeholder);
                  }}
                />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{startDate.day}</div>
                  <div className="text-xs font-medium text-gray-600">{startDate.month}</div>
                </div>
              </div>
              {event.status === 'published' && (
                <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                  FEATURED
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white">
            {/* Title and Tagline Section */}
            <div className="px-6 pt-6 pb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
              {event.subtitle && (
                <p className="text-lg text-gray-600 italic mb-4">{event.subtitle}</p>
              )}
              {event.description && (
                <p className="text-base text-gray-700 leading-relaxed mb-4">
                  {event.description}
                </p>
              )}
            </div>

            {/* Event Details Cards */}
            <div className="px-6 pb-6 space-y-4">
              {/* Time Card */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Time</h3>
                    <p className="text-sm text-gray-700">
                      {startDate.full} {startDate.time}
                      {!isSameDay && (
                        <> to {endDate.full} {endDate.time}</>
                      )}
                      {isSameDay && startDate.time !== endDate.time && (
                        <> - {endDate.time}</>
                      )}
                    </p>
                    {event.timezone_id && (
                      <p className="text-xs text-gray-500 mt-1">({event.timezone_id})</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Card */}
              {(event.location || event.venue_area) && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                      {event.venue_area && (
                        <p className="text-sm font-medium text-gray-900">{event.venue_area}</p>
                      )}
                      {event.location && (
                        <p className="text-sm text-gray-700">{event.location}</p>
                      )}
                      {(event.venue_map_url || (event.venue_latitude && event.venue_longitude)) && (
                        <div className="mt-2">
                          {event.venue_map_url ? (
                            <a
                              href={event.venue_map_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 inline-block"
                            >
                              View on Map →
                            </a>
                          ) : (
                            <a
                              href={`https://www.google.com/maps?q=${event.venue_latitude},${event.venue_longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 inline-block"
                            >
                              View on Google Maps →
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Map Section */}
              {(event.venue_latitude && event.venue_longitude) && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Map</h3>
                  <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
                    {/* Google Maps embed - using static map as fallback, or link to Google Maps */}
                    <a
                      href={`https://www.google.com/maps?q=${event.venue_latitude},${event.venue_longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full relative group"
                    >
                      {/* Static map image as preview */}
                      <img
                        src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+${categoryColor.replace('#', '')}(${event.venue_longitude},${event.venue_latitude})/${event.venue_longitude},${event.venue_latitude},15,0/600x300@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`}
                        alt="Event location map"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to OpenStreetMap static image
                          e.currentTarget.src = `https://www.openstreetmap.org/export/embed.html?bbox=${event.venue_longitude - 0.01},${event.venue_latitude - 0.01},${event.venue_longitude + 0.01},${event.venue_latitude + 0.01}&layer=mapnik&marker=${event.venue_latitude},${event.venue_longitude}`;
                        }}
                      />
                      {/* Overlay with "Click to view on map" */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="bg-white/90 px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to view on Google Maps →
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              )}

              {/* Organizer Card */}
              {event.metadata && (
                <>
                  {(event.metadata.organizer_name || event.metadata.eventon_organizer_id) && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">Organizer</h3>
                          {event.metadata.organizer_image && (
                            <div className="mb-3">
                              <img
                                src={event.metadata.organizer_image}
                                alt={event.metadata.organizer_name || 'Organizer'}
                                className="w-20 h-20 rounded-lg object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          {event.metadata.organizer_name && (
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {event.metadata.organizer_name}
                            </p>
                          )}
                          {event.metadata.organizer_description && (
                            <p className="text-sm text-gray-700 mb-2">
                              {event.metadata.organizer_description}
                            </p>
                          )}
                          {event.metadata.organizer_contact && (
                            <p className="text-xs text-gray-600 mb-1">
                              Contact: {event.metadata.organizer_contact}
                            </p>
                          )}
                          {event.metadata.organizer_address && (
                            <p className="text-xs text-gray-600">
                              {event.metadata.organizer_address}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Event Details Card */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Event Details</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Category:</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {event.event_type || 'General'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'published' ? 'bg-green-100 text-green-800' :
                          event.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                          event.status === 'scraped_draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                      {event.learn_more_url && (
                        <div>
                          <a
                            href={event.learn_more_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Learn More →
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Edit Event
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEventModal;

