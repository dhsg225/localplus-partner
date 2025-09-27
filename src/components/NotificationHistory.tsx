import React from 'react';

interface NotificationHistoryProps {
  // Add props as needed
}

const NotificationHistory: React.FC<NotificationHistoryProps> = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Notification History</h2>
      <p className="text-gray-600">Notification history will be displayed here.</p>
    </div>
  );
};

export default NotificationHistory;
