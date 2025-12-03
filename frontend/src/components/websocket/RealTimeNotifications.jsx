import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp, Flame, X, Zap } from 'lucide-react';
import { useWebSocket } from '../../contexts/WebSocketContexts';
import './RealtimeNotifications.css';

const RealtimeNotifications = () => {
  const { notifications, removeNotification } = useWebSocket();

  const getIcon = (type) => {
    switch (type) {
      case 'achievement':
        return <Trophy size={24} />;
      case 'level_up':
        return <TrendingUp size={24} />;
      case 'streak':
        return <Flame size={24} />;
      case 'ranking':
        return <Zap size={24} />;
      default:
        return <Zap size={24} />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'achievement':
        return '#8b5cf6';
      case 'level_up':
        return '#10b981';
      case 'streak':
        return '#ef4444';
      case 'ranking':
        return '#6366f1';
      default:
        return '#6366f1';
    }
  };

  return (
    <div className="realtime-notifications">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            className="notification-item"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{ borderLeftColor: getColor(notification.type) }}
          >
            <div 
              className="notification-icon"
              style={{ background: `${getColor(notification.type)}20`, color: getColor(notification.type) }}
            >
              {getIcon(notification.type)}
            </div>
            <div className="notification-content">
              <p className="notification-message">{notification.message}</p>
            </div>
            <button
              className="notification-close"
              onClick={() => removeNotification(notification.id)}
            >
              <X size={18} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default RealtimeNotifications;