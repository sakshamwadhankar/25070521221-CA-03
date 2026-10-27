import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

const Topbar = ({
  unreadCount = 0,
  onOpenNotifications,
  onToggleMobileMenu,
  isCollapsed = false,
  onToggleCollapse,
  isFullScreen = false,
  onToggleFullScreen,
}) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/skills?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/skills');
    }
  };

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="square-btn mobile-hamburger"
          onClick={onToggleMobileMenu}
          aria-label="Toggle navigation drawer"
          title="Open menu"
        >
          ☰
        </button>

        {/* Sidebar Compress / Expand Toggle Button */}
        <button
          type="button"
          className="square-btn"
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expand sidebar (Bada karein)" : "Compress sidebar (Chhota karein)"}
          aria-label="Toggle sidebar width"
        >
          {isCollapsed ? '⇥' : '⇤'}
        </button>

        {/* Back Button [←] */}
        <button
          type="button"
          className="topbar-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          title="Go back"
        >
          ←
        </button>

        {/* Search Field [Q Find skills, students, projects...] */}
        <form onSubmit={handleSearchSubmit} style={{ flex: 1 }}>
          <div className="topbar-search-box">
            <span style={{ fontSize: '0.9rem', color: '#555555' }}>🔍</span>
            <input
              type="text"
              className="topbar-search-input"
              placeholder="Find skills, students, projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
      </div>

      <div className="topbar-actions">
        {/* Remove / Toggle Laptop Frame Button */}
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onToggleFullScreen}
          title={isFullScreen ? "Switch back to Laptop Frame look" : "Remove Laptop Frame (Full Screen View)"}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px' }}
        >
          <span>{isFullScreen ? '💻' : '🖥️'}</span>
          <span style={{ display: 'none', md: 'inline' }} className="d-none-sm">
            {isFullScreen ? 'Laptop Frame' : 'Remove Laptop'}
          </span>
        </button>

        {isAuthenticated ? (
          <>
            {/* Notification Bell Icon */}
            <button
              type="button"
              className="square-btn"
              onClick={onOpenNotifications}
              aria-label="View notifications"
              title="Notifications"
            >
              🔔
              {unreadCount > 0 && (
                <span className="square-btn-badge">{unreadCount}</span>
              )}
            </button>

            {/* User Profile Pill */}
            <Link
              to="/profile"
              className="topbar-user-pill"
              title="View your profile"
            >
              <Avatar name={user?.name} size="sm" />
              <span>{user?.name?.split(' ')[0] || 'Student'}</span>
            </Link>
          </>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/login" className="btn btn-secondary btn-sm">
              Log In
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
