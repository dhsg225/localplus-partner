// [2024-09-26] - Structure documentation and management page
import React, { useState } from 'react';

const Structure: React.FC = () => {
  const [activeTab, setActiveTab] = useState('api');

  const tabs = [
    { id: 'api', label: 'API Documentation', icon: '🔌' },
    { id: 'database', label: 'Database Schema', icon: '🗄️' },
    { id: 'apps', label: 'App Structure', icon: '📱' },
    { id: 'business', label: 'Business Logic', icon: '⚙️' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">System Structure</h1>
        <div className="text-sm text-gray-500">
          Comprehensive documentation and management tools
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'api' && <ApiDocumentation />}
        {activeTab === 'database' && <DatabaseSchema />}
        {activeTab === 'apps' && <AppStructure />}
        {activeTab === 'business' && <BusinessLogic />}
      </div>
    </div>
  );
};

// API Documentation Component
const ApiDocumentation: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('auth');

  const endpoints = {
    auth: {
      title: 'Authentication API',
      baseUrl: 'https://api.localplus.city/api/auth',
      methods: [
        {
          method: 'POST',
          path: '/api/auth',
          description: 'User login',
          request: {
            body: {
              email: 'string',
              password: 'string'
            }
          },
          response: {
            success: {
              user: 'User object',
              session: 'Session object'
            },
            error: {
              error: 'Error message'
            }
          },
          example: {
            request: `curl -X POST https://api.localplus.city/api/auth \\
  -H "Content-Type: application/json" \\
  -d '{"email":"partner@restaurant.com","password":"password123"}'`,
            response: `{
  "success": true,
  "user": {
    "id": "user-123",
    "email": "partner@restaurant.com",
    "roles": ["partner"]
  },
  "session": {
    "access_token": "jwt-token-here"
  }
}`
          }
        },
        {
          method: 'GET',
          path: '/api/auth/me',
          description: 'Get current user',
          headers: {
            Authorization: 'Bearer jwt-token'
          },
          response: {
            success: {
              user: 'User object'
            }
          },
          example: {
            request: `curl -H "Authorization: Bearer jwt-token" \\
  https://api.localplus.city/api/auth/me`,
            response: `{
  "success": true,
  "user": {
    "id": "user-123",
    "email": "partner@restaurant.com"
  }
}`
          }
        },
        {
          method: 'DELETE',
          path: '/api/auth',
          description: 'User logout',
          headers: {
            Authorization: 'Bearer jwt-token'
          },
          response: {
            success: {
              message: 'Logged out successfully'
            }
          }
        }
      ]
    },
    bookings: {
      title: 'Bookings API',
      baseUrl: 'https://api.localplus.city/api/bookings',
      methods: [
        {
          method: 'GET',
          path: '/api/bookings',
          description: 'Get bookings for a business',
          query: {
            businessId: 'string (required)',
            status: 'string (optional)',
            limit: 'number (default: 50)',
            offset: 'number (default: 0)'
          },
          response: {
            success: {
              data: 'Array of booking objects',
              pagination: 'Pagination info'
            }
          },
          example: {
            request: `curl "https://api.localplus.city/api/bookings?businessId=550e8400-e29b-41d4-a716-446655440000&status=confirmed"`,
            response: `{
  "success": true,
  "data": [
    {
      "id": "booking-123",
      "customer_name": "John Doe",
      "customer_email": "john@example.com",
      "party_size": 4,
      "booking_date": "2024-09-27",
      "booking_time": "19:00",
      "status": "confirmed"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 1
  }
}`
          }
        },
        {
          method: 'POST',
          path: '/api/bookings',
          description: 'Create new booking',
          request: {
            body: {
              business_id: 'string',
              customer_name: 'string',
              customer_email: 'string',
              party_size: 'number',
              booking_date: 'string',
              booking_time: 'string'
            }
          },
          response: {
            success: {
              data: 'Booking object'
            }
          }
        },
        {
          method: 'PUT',
          path: '/api/bookings/[id]/confirm',
          description: 'Confirm booking',
          request: {
            body: {
              restaurantId: 'string'
            }
          },
          response: {
            success: {
              data: 'Updated booking object'
            }
          }
        }
      ]
    },
    restaurants: {
      title: 'Restaurants API',
      baseUrl: 'https://api.localplus.city/api/restaurants',
      methods: [
        {
          method: 'GET',
          path: '/api/restaurants',
          description: 'Get restaurants with filters',
          query: {
            location: 'string (optional)',
            cuisine: 'string (optional)',
            priceRange: 'string (optional)',
            rating: 'string (optional)',
            limit: 'number (default: 20)',
            offset: 'number (default: 0)'
          },
          response: {
            success: {
              data: 'Array of restaurant objects',
              pagination: 'Pagination info'
            }
          }
        },
        {
          method: 'GET',
          path: '/api/restaurants/search',
          description: 'Search restaurants',
          query: {
            query: 'string (required)',
            location: 'string (optional)',
            radius: 'number (default: 5000)',
            limit: 'number (default: 20)'
          },
          response: {
            success: {
              data: 'Array of restaurant objects',
              search: 'Search parameters'
            }
          }
        }
      ]
    },
    businesses: {
      title: 'Businesses API',
      baseUrl: 'https://api.localplus.city/api/businesses',
      methods: [
        {
          method: 'GET',
          path: '/api/businesses',
          description: 'Get businesses for admin',
          query: {
            status: 'string (optional)',
            limit: 'number (default: 50)',
            offset: 'number (default: 0)'
          },
          response: {
            success: {
              data: 'Array of business objects',
              pagination: 'Pagination info'
            }
          }
        }
      ]
    },
    notifications: {
      title: 'Notifications API',
      baseUrl: 'https://api.localplus.city/api/notifications',
      methods: [
        {
          method: 'GET',
          path: '/api/notifications',
          description: 'Get notification preferences',
          query: {
            businessId: 'string (required)'
          },
          response: {
            success: {
              data: 'Notification preferences object'
            }
          }
        },
        {
          method: 'POST',
          path: '/api/notifications',
          description: 'Update notification preferences',
          request: {
            body: {
              business_id: 'string',
              email_enabled: 'boolean',
              sms_enabled: 'boolean',
              confirmation_template: 'string',
              cancellation_template: 'string'
            }
          },
          response: {
            success: {
              data: 'Updated preferences object'
            }
          }
        }
      ]
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Endpoint List */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">API Endpoints</h3>
          <div className="space-y-2">
            {Object.entries(endpoints).map(([key, endpoint]) => (
              <button
                key={key}
                onClick={() => setSelectedEndpoint(key)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                  selectedEndpoint === key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {endpoint.title}
              </button>
            ))}
          </div>
        </div>

        {/* Endpoint Details */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {endpoints[selectedEndpoint as keyof typeof endpoints].title}
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Base URL: <code className="bg-gray-100 px-2 py-1 rounded">{endpoints[selectedEndpoint as keyof typeof endpoints].baseUrl}</code>
            </p>

            <div className="space-y-6">
              {endpoints[selectedEndpoint as keyof typeof endpoints].methods.map((method, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      method.method === 'GET' ? 'bg-green-100 text-green-800' :
                      method.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                      method.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {method.method}
                    </span>
                    <code className="text-sm font-mono">{method.path}</code>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{method.description}</p>

                  {/* Request Details */}
                  {method.query && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Query Parameters:</h4>
                      <div className="bg-gray-50 p-3 rounded">
                        <pre className="text-xs">{JSON.stringify(method.query, null, 2)}</pre>
                      </div>
                    </div>
                  )}

                  {method.request && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Request Body:</h4>
                      <div className="bg-gray-50 p-3 rounded">
                        <pre className="text-xs">{JSON.stringify(method.request, null, 2)}</pre>
                      </div>
                    </div>
                  )}

                  {method.headers && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Headers:</h4>
                      <div className="bg-gray-50 p-3 rounded">
                        <pre className="text-xs">{JSON.stringify(method.headers, null, 2)}</pre>
                      </div>
                    </div>
                  )}

                  {/* Response */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Response:</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <pre className="text-xs">{JSON.stringify(method.response, null, 2)}</pre>
                    </div>
                  </div>

                  {/* Example */}
                  {method.example && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Example:</h4>
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-xs font-semibold text-gray-700 mb-1">Request:</h5>
                          <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto">
                            <pre>{method.example.request}</pre>
                          </div>
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-gray-700 mb-1">Response:</h5>
                          <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto">
                            <pre>{method.example.response}</pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Database Schema Component
const DatabaseSchema: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState('businesses');

  const tables = {
    businesses: {
      name: 'businesses',
      description: 'Core business/restaurant information',
      fields: [
        { name: 'id', type: 'uuid', description: 'Primary key', example: '550e8400-e29b-41d4-a716-446655440000' },
        { name: 'name', type: 'text', description: 'Business name', example: 'Shannon\'s Coastal Kitchen' },
        { name: 'address', type: 'text', description: 'Full address', example: '123 Beach Road, Pattaya' },
        { name: 'latitude', type: 'float', description: 'GPS latitude', example: '12.9234' },
        { name: 'longitude', type: 'float', description: 'GPS longitude', example: '100.7654' },
        { name: 'phone', type: 'text', description: 'Contact phone', example: '+66-38-123-456' },
        { name: 'email', type: 'text', description: 'Contact email', example: 'info@shannons.com' },
        { name: 'category', type: 'text', description: 'Business category', example: 'restaurant' },
        { name: 'partnership_status', type: 'text', description: 'Partnership status', example: 'active' },
        { name: 'created_at', type: 'timestamp', description: 'Creation date', example: '2024-01-15T10:30:00Z' },
        { name: 'updated_at', type: 'timestamp', description: 'Last update', example: '2024-09-26T14:20:00Z' }
      ],
      relationships: [
        { table: 'bookings', type: 'one-to-many', description: 'A business can have many bookings' },
        { table: 'partners', type: 'one-to-many', description: 'A business can have many partners' },
        { table: 'notification_preferences', type: 'one-to-one', description: 'Each business has notification settings' }
      ]
    },
    bookings: {
      name: 'bookings',
      description: 'Customer booking records',
      fields: [
        { name: 'id', type: 'uuid', description: 'Primary key', example: 'booking-123-456' },
        { name: 'business_id', type: 'uuid', description: 'Foreign key to businesses', example: '550e8400-e29b-41d4-a716-446655440000' },
        { name: 'customer_name', type: 'text', description: 'Customer full name', example: 'John Doe' },
        { name: 'customer_email', type: 'text', description: 'Customer email', example: 'john@example.com' },
        { name: 'customer_phone', type: 'text', description: 'Customer phone', example: '+66-81-234-5678' },
        { name: 'party_size', type: 'integer', description: 'Number of people', example: '4' },
        { name: 'booking_date', type: 'date', description: 'Booking date', example: '2024-09-27' },
        { name: 'booking_time', type: 'time', description: 'Booking time', example: '19:00' },
        { name: 'status', type: 'text', description: 'Booking status', example: 'confirmed' },
        { name: 'confirmation_code', type: 'text', description: 'Unique confirmation code', example: 'BK-2024-0927-001' },
        { name: 'special_requests', type: 'text', description: 'Customer special requests', example: 'Birthday celebration' },
        { name: 'created_at', type: 'timestamp', description: 'Booking creation', example: '2024-09-26T10:30:00Z' }
      ],
      relationships: [
        { table: 'businesses', type: 'many-to-one', description: 'Each booking belongs to one business' }
      ]
    },
    partners: {
      name: 'partners',
      description: 'User-business partnerships',
      fields: [
        { name: 'id', type: 'uuid', description: 'Primary key', example: 'partner-123-456' },
        { name: 'user_id', type: 'uuid', description: 'User ID from auth', example: 'user-123-456' },
        { name: 'business_id', type: 'uuid', description: 'Business ID', example: '550e8400-e29b-41d4-a716-446655440000' },
        { name: 'role', type: 'text', description: 'Partner role', example: 'owner' },
        { name: 'is_active', type: 'boolean', description: 'Partnership active', example: 'true' },
        { name: 'accepted_at', type: 'timestamp', description: 'Partnership accepted date', example: '2024-01-15T10:30:00Z' }
      ],
      relationships: [
        { table: 'businesses', type: 'many-to-one', description: 'Each partnership belongs to one business' }
      ]
    },
    notification_preferences: {
      name: 'notification_preferences',
      description: 'Business notification settings',
      fields: [
        { name: 'id', type: 'uuid', description: 'Primary key', example: 'notif-123-456' },
        { name: 'business_id', type: 'uuid', description: 'Business ID', example: '550e8400-e29b-41d4-a716-446655440000' },
        { name: 'email_enabled', type: 'boolean', description: 'Email notifications enabled', example: 'true' },
        { name: 'sms_enabled', type: 'boolean', description: 'SMS notifications enabled', example: 'false' },
        { name: 'confirmation_template', type: 'text', description: 'Email confirmation template', example: 'Your booking at {{restaurant_name}} is confirmed for {{date}} at {{time}}.' },
        { name: 'cancellation_template', type: 'text', description: 'Email cancellation template', example: 'Your booking at {{restaurant_name}} has been cancelled.' },
        { name: 'created_at', type: 'timestamp', description: 'Settings creation', example: '2024-01-15T10:30:00Z' }
      ],
      relationships: [
        { table: 'businesses', type: 'one-to-one', description: 'Each business has one notification preference' }
      ]
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Table List */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Tables</h3>
          <div className="space-y-2">
            {Object.entries(tables).map(([key, table]) => (
              <button
                key={key}
                onClick={() => setSelectedTable(key)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                  selectedTable === key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {table.name}
              </button>
            ))}
          </div>
        </div>

        {/* Table Details */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {tables[selectedTable as keyof typeof tables].name}
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              {tables[selectedTable as keyof typeof tables].description}
            </p>

            {/* Fields */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fields</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Example</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tables[selectedTable as keyof typeof tables].fields.map((field, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{field.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{field.type}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{field.description}</td>
                        <td className="px-6 py-4 text-sm font-mono text-gray-900">{field.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Relationships */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Relationships</h3>
              <div className="space-y-2">
                {tables[selectedTable as keyof typeof tables].relationships.map((rel, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{rel.table}</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{rel.type}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{rel.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// App Structure Component
const AppStructure: React.FC = () => {
  const apps = [
    {
      name: 'Partner App',
      url: 'https://partners.localplus.city',
      description: 'Restaurant partner management dashboard',
      structure: {
        'src/': 'Source code',
        'src/pages/': 'Main application pages',
        'src/components/': 'Reusable UI components',
        'src/services/': 'API service layer',
        'public/': 'Static assets'
      },
      keyFeatures: [
        'Booking Management',
        'Restaurant Settings',
        'Notification Templates',
        'Analytics Dashboard'
      ],
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite']
    },
    {
      name: 'Admin App',
      url: 'https://admin.localplus.city',
      description: 'Business discovery and management system',
      structure: {
        'src/': 'Source code',
        'src/components/': 'Admin components',
        'src/lib/': 'Utility libraries',
        'src/pages/': 'Admin pages'
      },
      keyFeatures: [
        'Business Discovery',
        'Analytics & Reporting',
        'User Management',
        'System Configuration'
      ],
      techStack: ['React', 'TypeScript', 'Azure Maps', 'Vite']
    },
    {
      name: 'Consumer App',
      url: 'https://superapp.localplus.city',
      description: 'Customer-facing restaurant discovery',
      structure: {
        'src/': 'Source code',
        'src/modules/': 'Feature modules',
        'src/components/': 'UI components',
        'src/services/': 'API services'
      },
      keyFeatures: [
        'Restaurant Discovery',
        'Booking System',
        'User Authentication',
        'Mobile-First Design'
      ],
      techStack: ['React', 'TypeScript', 'Google Maps', 'PWA']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {apps.map((app, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
              <a 
                href={app.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View App →
              </a>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{app.description}</p>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Features:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {app.keyFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Tech Stack:</h4>
              <div className="flex flex-wrap gap-1">
                {app.techStack.map((tech, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Directory Structure:</h4>
              <div className="text-xs font-mono text-gray-600 space-y-1">
                {Object.entries(app.structure).map(([path, description]) => (
                  <div key={path} className="flex justify-between">
                    <span className="text-blue-600">{path}</span>
                    <span className="text-gray-500">{description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Architecture Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Shared API</h4>
            <p className="text-sm text-blue-700">
              All apps communicate with a single API server at <code>api.localplus.city</code> 
              providing unified business logic and data access.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Independent Deployment</h4>
            <p className="text-sm text-blue-700">
              Each app can be deployed independently to Vercel with its own domain 
              and configuration while sharing the same backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Business Logic Component
const BusinessLogic: React.FC = () => {
  const [selectedLogic, setSelectedLogic] = useState('booking');

  const businessRules = {
    booking: {
      title: 'Booking Management',
      description: 'Rules and logic for handling customer bookings',
      rules: [
        {
          name: 'Booking Confirmation',
          description: 'Automatic confirmation for bookings within business hours',
          logic: 'If booking_time is between opening_hours and booking is made > 2 hours in advance, auto-confirm',
          code: `if (bookingTime >= openingHours && hoursUntilBooking > 2) {
  booking.status = 'confirmed';
  sendConfirmationEmail(booking);
}`
        },
        {
          name: 'Party Size Limits',
          description: 'Enforce minimum and maximum party sizes',
          logic: 'Party size must be between 1 and restaurant max_capacity',
          code: `if (partySize < 1 || partySize > restaurant.maxCapacity) {
  throw new Error('Invalid party size');
}`
        },
        {
          name: 'Cancellation Policy',
          description: 'Handle booking cancellations based on timing',
          logic: 'Free cancellation if > 24 hours, 50% charge if < 24 hours, no refund if < 2 hours',
          code: `if (hoursUntilBooking > 24) {
  // Free cancellation
} else if (hoursUntilBooking > 2) {
  // 50% charge
} else {
  // No refund
}`
        }
      ]
    },
    notification: {
      title: 'Notification System',
      description: 'Email and SMS notification logic',
      rules: [
        {
          name: 'Email Templates',
          description: 'Dynamic email template rendering',
          logic: 'Replace template variables with actual booking data',
          code: `const template = "Your booking at {{restaurant_name}} is confirmed for {{date}} at {{time}}.";
const rendered = template
  .replace('{{restaurant_name}}', booking.restaurant.name)
  .replace('{{date}}', booking.date)
  .replace('{{time}}', booking.time);`
        },
        {
          name: 'Notification Timing',
          description: 'When to send different types of notifications',
          logic: 'Confirmation: immediately, Reminder: 24 hours before, Follow-up: 2 hours after',
          code: `// Confirmation: send immediately
sendNotification('confirmation', booking);

// Reminder: schedule for 24 hours before
scheduleNotification('reminder', booking, booking.date - 24h);

// Follow-up: schedule for 2 hours after
scheduleNotification('followup', booking, booking.date + 2h);`
        }
      ]
    },
    pricing: {
      title: 'Pricing Logic',
      description: 'Dynamic pricing and discount calculations',
      rules: [
        {
          name: 'Peak Hour Pricing',
          description: 'Apply premium pricing during peak hours',
          logic: 'Weekend evenings and holidays have 20% premium',
          code: `if (isWeekend(booking.date) && isEvening(booking.time)) {
  basePrice *= 1.2; // 20% premium
}`
        },
        {
          name: 'Loyalty Discounts',
          description: 'Apply discounts based on customer loyalty',
          logic: 'Returning customers get 10% discount, VIP customers get 15%',
          code: `if (customer.loyaltyTier === 'VIP') {
  discount = 0.15;
} else if (customer.visitCount > 5) {
  discount = 0.10;
}`
        }
      ]
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Logic Categories */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Logic</h3>
          <div className="space-y-2">
            {Object.entries(businessRules).map(([key, logic]) => (
              <button
                key={key}
                onClick={() => setSelectedLogic(key)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                  selectedLogic === key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {logic.title}
              </button>
            ))}
          </div>
        </div>

        {/* Logic Details */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {businessRules[selectedLogic as keyof typeof businessRules].title}
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              {businessRules[selectedLogic as keyof typeof businessRules].description}
            </p>

            <div className="space-y-6">
              {businessRules[selectedLogic as keyof typeof businessRules].rules.map((rule, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{rule.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
                  
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Logic:</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{rule.logic}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Code Example:</h4>
                    <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto">
                      <pre>{rule.code}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Business Logic Editor */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4">Business Logic Editor</h3>
        <p className="text-sm text-yellow-800 mb-4">
          Modify business rules and logic here. Changes will be applied to the API server.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Rule to Modify:</label>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option>Booking Confirmation Logic</option>
              <option>Party Size Validation</option>
              <option>Cancellation Policy</option>
              <option>Email Template Variables</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Edit Logic:</label>
            <textarea 
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={6}
              placeholder="Enter your business logic code here..."
            ></textarea>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Save Changes
            </button>
            <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
              Test Logic
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Structure;
