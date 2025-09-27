import React from 'react';
// Removed shared component import - using native HTML elements

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
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'structure', label: 'Structure', icon: '🏗️' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                LocalPlus Partner
              </h1>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    currentPage === item.id
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {showAdminLink && (
              <a
                href="https://admin-3c726yywc-shannons-projects-3f909922.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Admin Panel
              </a>
            )}
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                {user?.user_metadata?.full_name || user?.email}
              </span>
              <button
                onClick={onLogout}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
