import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Settings } from 'lucide-react';
import './Header.css';

const Header = ({ title, subtitle }) => {
  return (
    <motion.header 
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-content">
        <div className="header-title-section">
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>

        <div className="header-actions">
          <button className="header-action-btn">
            <Search size={20} />
          </button>
          <button className="header-action-btn">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>
          <button className="header-action-btn">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;