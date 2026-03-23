import React, { useState } from 'react';
// Removed shared component import - using native HTML elements

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  });

  const handleSave = () => {
    console.log('Saving notification settings:', settings);
    // This will be implemented when we have the notification service
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
        <button 
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Settings
        </button>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Notification Preferences
        </h2>
                
                <div className="space-y-4">
          <div className="flex items-center justify-between">
                      <div>
              <h3 className="text-sm font-medium text-gray-900">
                Email Notifications
              </h3>
              <p className="text-sm text-gray-500">
                Receive booking confirmations and updates via email
              </p>
                      </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                emailNotifications: e.target.checked
              }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
              </div>

          <div className="flex items-center justify-between">
                    <div>
              <h3 className="text-sm font-medium text-gray-900">
                SMS Notifications
              </h3>
              <p className="text-sm text-gray-500">
                Receive urgent updates via text message
              </p>
                </div>
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                smsNotifications: e.target.checked
              }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
              </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Push Notifications
              </h3>
              <p className="text-sm text-gray-500">
                Receive real-time notifications in your browser
              </p>
                </div>
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                pushNotifications: e.target.checked
              }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
