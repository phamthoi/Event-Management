import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';
import { notificationService } from '../../../services/common/notification/notificationService.js';
import { useTheme } from '../../../contexts/ThemeContext.jsx';
import { useSocket } from '../../../contexts/SocketContext.jsx';

const NotificationDropdown = () => {
  const { isDarkMode } = useTheme();
  const { unreadCount, notificationTrigger } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  
  const fetchRecentNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications(1, 10);
      if (response.success) {
        setNotifications(response.notifications);
      }
    } catch (err) {
      console.error('Error fetching recent notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  
  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      fetchRecentNotifications();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  
  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchRecentNotifications();
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'EVENT':
        return '🎉';
      case 'SYSTEM':
        return '⚙️';
      default:
        return '📢';
    }
  };

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch data when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchRecentNotifications();
    }
  }, [isOpen]);

  
  useEffect(() => {
    if (notificationTrigger > 0 && isOpen) {
      console.log('🔔 NotificationDropdown: Refreshing due to notification trigger');
      fetchRecentNotifications();
    }
  }, [notificationTrigger, isOpen]);

  const role = localStorage.getItem('role');
  const notificationsPath = role === 'admin' ? '/admin/notifications' : '/member/notifications';

  return (
    <div className="relative" ref={dropdownRef}>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-colors ${
          isDarkMode 
            ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <FiBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

     
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-80 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border rounded-lg shadow-lg z-50`}>
          
          <div className={`px-4 py-3 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-100'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

         
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-8 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="text-4xl mb-2">📭</div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  No notifications available
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b last:border-b-0 ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-100'
                  } ${
                    !notification.isRead 
                      ? (isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50') 
                      : ''
                  } hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors cursor-pointer`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 text-lg">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      } line-clamp-2`}>
                        {notification.title}
                      </p>
                      <p className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      } mt-1 line-clamp-2`}>
                        {notification.message.split('\n')[0]}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {formatDate(notification.createdAt)}
                        </span>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          
          {notifications.length > 0 && (
            <div className={`px-4 py-3 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-100'
            }`}>
              <Link
                to={notificationsPath}
                className="block text-center text-sm text-blue-600 hover:text-blue-700"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;