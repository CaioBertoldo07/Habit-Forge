import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Target, 
  Trophy, 
  User, 
  Crown,
  LogOut,
  Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: <LayoutDashboard size={22} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Target size={22} />, label: 'Hábitos', path: '/habits' },
    { icon: <Trophy size={22} />, label: 'Conquistas', path: '/achievements' },
    { icon: <Crown size={22} />, label: 'Ranking', path: '/leaderboard' },
    { icon: <User size={22} />, label: 'Perfil', path: '/profile' }
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <motion.aside 
      className="sidebar"
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Logo/Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Target className="logo-icon" size={32} />
          <span className="logo-text">Habit Forge</span>
        </div>
      </div>

      {/* User Info */}
      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            <div className="avatar-placeholder">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="user-level-badge">
            <Zap size={12} />
            {user?.level || 1}
          </div>
        </div>
        <div className="user-info">
          <p className="user-name">{user?.name}</p>
          <div className="user-xp">
            <div className="xp-bar">
              <div 
                className="xp-fill" 
                style={{ width: `${((user?.xp % 100) / 100) * 100}%` }}
              ></div>
            </div>
            <span className="xp-text">{user?.xp || 0} XP</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) => 
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;