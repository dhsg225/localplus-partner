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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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
      <nav className="bg-white shadow-sm border-b border-gray-200 w-full">
        <div className="w-full px-4 lg:px-6">
          <div className="flex justify-between h-16 items-center">
            <div className="flex flex-col items-start">
              <h1 className="text-xl font-bold text-gray-900">LocalPlus Partner</h1>
              <span className="text-[10px] text-gray-400 font-normal leading-none mt-0.5">
                v0.2.22
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
    <nav className="bg-white shadow-sm border-b border-gray-200 relative w-full z-50">
      <div className="w-full px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Left Side: Logo + Desktop Menu */}
          <div className="flex items-center min-w-0 flex-1">
            {/* Logo */}
            <div className="flex-shrink-0 flex flex-col items-start mr-8">
              <h1 className="text-lg font-bold text-gray-900 whitespace-nowrap">
                LocalPlus
              </h1>
              <span className="text-[10px] text-gray-400 font-normal leading-none mt-0.5">
                v0.2.22
              </span>
            </div>

            {/* Desktop Menu - Items follow logo (visible >= 2XL) */}
            <div className="hidden 2xl:flex items-center gap-2 min-w-0 overflow-hidden">
              {navItems
                .filter(item => !['venues', 'categories', 'taxonomy', 'settings'].includes(item.key))
                .map((item) => {
                  const routeKey = item.route?.replace(/^\//, '') || item.key;
                  const isActive = currentPage === routeKey || currentPage === item.key;
                  const isEvents = item.key === 'events';

                  if (isEvents) {
                    return (
                      <div key={item.id} className="relative flex-shrink-0">
                        <button
                          onClick={() => setShowEventsDropdown(!showEventsDropdown)}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 border-b-2 text-sm font-medium whitespace-nowrap ${isActive || ['venues', 'categories', 'taxonomy', 'locations'].includes(currentPage)
                            ? 'border-blue-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            }`}
                        >
                          <span className="mr-1.5">{item.icon}</span>
                          {item.label}
                          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {showEventsDropdown && (
                          <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg z-[60] border border-gray-200">
                            <div className="py-1">
                              {['events', 'venues', 'categories', 'locations'].map(sub => (
                                <button
                                  key={sub}
                                  onClick={() => {
                                    onPageChange(sub === 'events' ? routeKey : sub);
                                    setShowEventsDropdown(false);
                                  }}
                                  className={`w-full text-left px-4 py-2 text-sm flex items-center hover:bg-gray-100 ${currentPage === sub ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                                >
                                  <span className="mr-2">{sub === 'events' ? item.icon : sub === 'categories' ? '🏷️' : '📍'}</span>
                                  {sub.charAt(0).toUpperCase() + sub.slice(1)}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => onPageChange(routeKey)}
                      className={`flex-shrink-0 inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium whitespace-nowrap ${isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                    >
                      <span className="mr-1.5">{item.icon}</span>
                      {item.label}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Right Side: Primary Controls */}
          <div className="flex items-center flex-shrink-0 space-x-4">
            {/* Desktop Controls (visible >= 2XL) */}
            <div className="hidden 2xl:flex items-center space-x-3">
              {activeType && (
                <div className="flex items-center text-xs border-r border-gray-200 pr-3">
                  <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 border border-blue-200">
                    <span className="text-blue-700">{activeType.icon}</span>
                    <span className="text-xs font-medium text-blue-900">{activeType.name}</span>
                    <button
                      onClick={() => setShowTypeSelector(!showTypeSelector)}
                      className="ml-1 flex items-center justify-center w-6 h-6 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                    {showTypeSelector && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-md shadow-lg z-[60] border border-gray-200">
                        <div className="py-1">
                          <button onClick={() => handleTypeOverride(null)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Default</button>
                          {availableTypes.map(bt => (
                            <button key={bt.id} onClick={() => handleTypeOverride(bt.key)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">{bt.icon} {bt.name}</button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {showAdminLink && (
                <a
                  href="https://admin-3c726yywc-shannons-projects-3f909922.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 border border-transparent hover:border-gray-200 rounded-md transition-all"
                >
                  Admin Panel
                </a>
              )}
            </div>

            {/* Profile Dropdown (visible for all) */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white border-2 border-white shadow-sm hover:bg-indigo-700 transition-colors"
                title={user?.email}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-xl z-[60] border border-gray-200 py-2">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900">{user?.user_metadata?.full_name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button onClick={() => { onPageChange('settings'); setShowProfileDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                      <span>⚙️</span> Settings
                    </button>
                    {/* User Management inside profile if screen is small */}
                    <button onClick={() => { onPageChange('admin'); setShowProfileDropdown(false); }} className="2xl:hidden w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                      <span>👥</span> Users
                    </button>
                    <button onClick={() => { setShowProfileDropdown(false); onLogout(); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Toggle Button (visible < 2XL) */}
            <div className="2xl:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {showMobileMenu ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {showMobileMenu && (
        <div className="2xl:hidden bg-white border-t border-gray-200 shadow-lg absolute top-full left-0 w-full z-50 overflow-y-auto max-h-[calc(100vh-64px)]">
          <div className="pt-2 pb-3 space-y-1">
            {navItems
              .filter(item => !['venues', 'categories', 'taxonomy', 'settings'].includes(item.key))
              .map((item) => {
                const routeKey = item.route?.replace(/^\//, '') || item.key;
                const isActive = currentPage === routeKey || currentPage === item.key;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onPageChange(routeKey); setShowMobileMenu(false); }}
                    className={`w-full flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}
                  >
                    <span className="mr-3 text-xl">{item.icon}</span>
                    {item.label}
                  </button>
                );
              })}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 bg-gray-50 px-4 space-y-2">
            <button onClick={() => { onPageChange('settings'); setShowMobileMenu(false); }} className="block w-full text-left text-base font-medium text-gray-500 hover:text-gray-800">Settings</button>
            <button onClick={() => { onPageChange('admin'); setShowMobileMenu(false); }} className="block w-full text-left text-base font-medium text-gray-500 hover:text-gray-800">👥 Users</button>
            <button onClick={() => { setShowMobileMenu(false); onLogout(); }} className="block w-full text-left text-base font-medium text-red-600 hover:text-red-800">Sign Out</button>
          </div>
        </div>
      )}

      {/* Outside click listener */}
      {(showTypeSelector || showProfileDropdown || showEventsDropdown || showMobileMenu) && (
        <div className="fixed inset-0 z-40" onClick={() => { setShowTypeSelector(false); setShowProfileDropdown(false); setShowEventsDropdown(false); setShowMobileMenu(false); }} />
      )}
    </nav>
  );
};

export default Navigation;
