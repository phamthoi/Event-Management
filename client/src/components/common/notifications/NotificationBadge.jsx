import React, { useState, useEffect } from 'react';
import { notificationService } from '../../../services/common/notification/notificationService.js';
import { useTheme } from '../../../contexts/ThemeContext.jsx';

const NotificationBadge = ({ className = "" }) => {
  const { isDarkMode } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.unreadCount);
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Refresh unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Expose refresh function globally for other components to use
  useEffect(() => {
    window.refreshNotificationBadge = fetchUnreadCount;
    
    return () => {
      delete window.refreshNotificationBadge;
    };
  }, []);

  if (unreadCount === 0) {
    return null;
  }

  return (
    <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full ${className}`}>
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  );
};

export default NotificationBadge;