// [2025-11-30] - Dynamic Navigation based on Business Type
import React, { useState, useEffect } from 'react';
import { menuService, MenuItem, BusinessType } from '../services/menuService';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  user: any;
  onLogout: () => void;
  showAdminLink?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
  currentPage, 
  onPageChange, 
  user, 
  onLogout,
  showAdminLink = false 
}) => {
  const [navItems, setNavItems] = useState<MenuItem[]>([]);
  const [businessType, setBusinessType] = useState<BusinessType | null>(null);
  const [availableTypes, setAvailableTypes] = useState<BusinessType[]>([]);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showEventsDropdown, setShowEventsDropdown] = useState(false);
  const [overrideType, setOverrideType] = useState<string | null>(
    localStorage.getItem('menu_override_type')
  );
  const [loading, setLoading] = useState(true);

  // [2025-11-30] - Load menus based on business type
  useEffect(() => {
    const loadMenus = async () => {
      setLoading(true);
      try {
        // Get partner's business type
        const partnerType = await menuService.getPartnerBusinessType();
        setBusinessType(partnerType);

        // Get all available types for override
        const allTypes = await menuService.getAllBusinessTypes();
        setAvailableTypes(allTypes);

        // Determine which type to use (override or partner's type)
        const typeToUse = overrideType || partnerType?.key || 'restaurant';
        
        // Load menus for the selected type
        const menus = await menuService.getMenusForBusinessType(typeToUse);
        setNavItems(menus);
      } catch (error) {
        console.error('[Navigation] Error loading menus:', error);
        // Fallback to default menus
        setNavItems([
          { id: '1', key: 'dashboard', label: 'Dashboard', icon: '📊', route: '/dashboard', is_required: true, sort_order: 1 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadMenus();
  }, [overrideType]);

  // [2025-11-30] - Handle business type override
  const handleTypeOverride = (typeKey: string | null) => {
    if (typeKey) {
      localStorage.setItem('menu_override_type', typeKey);
    } else {
      localStorage.removeItem('menu_override_type');
    }
    setOverrideType(typeKey);
    setShowTypeSelector(false);
    menuService.clearCache(); // Clear cache to force reload
  };

  if (loading) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex flex-col items-start">
              <h1 className="text-xl font-bold text-gray-900">LocalPlus Partner</h1>
            <span className="text-[10px] text-gray-400 font-normal leading-none mt-0.5">
              v0.2.13
            </span>
            </div>
            <div className="text-sm text-gray-500">Loading menus...</div>
          </div>
        </div>
      </nav>
    );
  }

  const activeType = overrideType 
    ? availableTypes.find(t => t.key === overrideType) 
    : businessType;

  // [2025-12-01] - Show all menu items directly (no "More" dropdown needed with more space)

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 relative">
      <div className="w-full">
        <div className="flex justify-between h-16 items-center">
          {/* Logo - far left with minimal padding */}
          <div className="flex-shrink-0 flex flex-col items-start pl-3">
            <h1 className="text-lg font-bold text-gray-900 whitespace-nowrap">
              LocalPlus
            </h1>
            <span className="text-[10px] text-gray-400 font-normal leading-none mt-0.5">
              v0.2.13
            </span>
          </div>
          
          {/* Menu items - center area with more space - show all items */}
          <div className="flex-1 flex justify-center items-center min-w-0 px-4">
            <div className="hidden sm:flex sm:space-x-6 items-center">
              {/* All menu items - Events has dropdown for taxonomies, Settings moved to profile dropdown */}
              {navItems
                .filter(item => item.key !== 'venues' && item.key !== 'categories' && item.key !== 'taxonomy' && item.key !== 'settings')
                .map((item) => {
                const routeKey = item.route?.replace(/^\//, '') || item.key;
                const isActive = currentPage === routeKey || currentPage === item.key;
                const isEvents = item.key === 'events';
                
                if (isEvents) {
                  // Events with dropdown for Venues and Categories
                  return (
                    <div key={item.id} className="relative">
                      <button
                        onClick={() => setShowEventsDropdown(!showEventsDropdown)}
                        className={`inline-flex items-center px-4 pt-1 border-b-2 text-sm font-medium whitespace-nowrap ${
                          isActive || currentPage === 'venues' || currentPage === 'categories' || currentPage === 'taxonomy' || currentPage === 'locations'
                            ? 'border-blue-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                        title={item.description}
                      >
                        <span className="mr-1.5">{item.icon}</span>
                        {item.label}
                        <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {showEventsDropdown && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setShowEventsDropdown(false)}
                          />
                          <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  onPageChange(routeKey);
                                  setShowEventsDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center hover:bg-gray-100 ${
                                  isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                }`}
                              >
                                <span className="mr-2">{item.icon}</span>
                                Events
                              </button>
                              <button
                                onClick={() => {
                                  onPageChange('venues');
                                  setShowEventsDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center hover:bg-gray-100 ${
                                  currentPage === 'venues' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                }`}
                              >
                                <span className="mr-2">📍</span>
                                Venues
                              </button>
                              <button
                                onClick={() => {
                                  onPageChange('categories');
                                  setShowEventsDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center hover:bg-gray-100 ${
                                  currentPage === 'categories' || currentPage === 'taxonomy' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                }`}
                              >
                                <span className="mr-2">🏷️</span>
                                Categories
                              </button>
                              <button
                                onClick={() => {
                                  onPageChange('locations');
                                  setShowEventsDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center hover:bg-gray-100 ${
                                  currentPage === 'locations' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                }`}
                              >
                                <span className="mr-2">📍</span>
                                Locations
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                }
                
                // Regular menu items
                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(routeKey)}
                    className={`inline-flex items-center px-4 pt-1 border-b-2 text-sm font-medium whitespace-nowrap ${
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                    title={item.description}
                  >
                    <span className="mr-1.5">{item.icon}</span>
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right side - user controls - compressed */}
          <div className="flex-shrink-0 flex items-center space-x-2 pr-2">
            {/* Business Type Indicator - mode indicator with colored background */}
            {activeType && (
              <div className="hidden md:flex items-center text-xs border-r border-gray-200 pr-2">
                <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 border border-blue-200">
                  <span className="text-blue-700">{activeType.icon}</span>
                  <span className="text-xs font-medium text-blue-900">{activeType.name}</span>
                  {overrideType && (
                    <span className="ml-1 text-orange-700 bg-orange-100 px-2 py-0.5 rounded text-xs font-medium border border-orange-200">
                      Override
                    </span>
                  )}
                  {/* Switcher button inside the colored container - aligned properly */}
                  <button
                    onClick={() => setShowTypeSelector(!showTypeSelector)}
                    className="ml-1 flex items-center justify-center w-6 h-6 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors self-center"
                    title="Switch Business Type"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  
                  {showTypeSelector && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                  <div className="py-1">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b">
                      View Menus As:
                    </div>
                    <button
                      onClick={() => handleTypeOverride(null)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        !overrideType ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      {businessType ? (
                        <>
                          <span className="mr-2">{businessType.icon}</span>
                          {businessType.name} (Default)
                        </>
                      ) : (
                        'No Type Assigned'
                      )}
                    </button>
                    {availableTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleTypeOverride(type.key)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          overrideType === type.key ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        <span className="mr-2">{type.icon}</span>
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>
                  )}
                </div>
              </div>
            )}

            {/* Admin Users Link */}
            <button
              onClick={() => onPageChange('admin')}
              className={`text-sm whitespace-nowrap px-2 ${
                currentPage === 'admin'
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="View all users and partners"
            >
              👥 Users
            </button>
            
            {showAdminLink && (
              <a
                href="https://admin-3c726yywc-shannons-projects-3f909922.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap px-2"
              >
                Admin Panel
              </a>
            )}
            
            {/* Profile icon with dropdown */}
            <div className="relative border-l border-gray-200 pl-3">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 border-2 border-white shadow-sm hover:bg-purple-700 transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              
              {showProfileDropdown && (
                <>
                  {/* Click outside to close */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowProfileDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                    <div className="py-2">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {user?.user_metadata?.full_name || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user?.email || 'No email'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Settings button */}
                      <button
                        onClick={() => {
                          onPageChange('settings');
                          setShowProfileDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center hover:bg-gray-100 transition-colors ${
                          currentPage === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </button>
                      
                      {/* Logout button */}
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          onLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Close dropdowns on outside click */}
      {(showTypeSelector || showProfileDropdown || showEventsDropdown) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowTypeSelector(false);
            setShowProfileDropdown(false);
            setShowEventsDropdown(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navigation;
