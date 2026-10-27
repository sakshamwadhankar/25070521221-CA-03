import React from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({
  isOpen,
  onClose,
  unreadCount = 0,
  pendingRequestsCount = 0,
  onOpenNotifications,
  onOpenPreferences,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    if (onClose) onClose();
    await logout();
    navigate('/');
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      <aside className={`app-sidebar ${isOpen ? 'drawer-open' : ''}`}>
        <div>
          {/* Brand Logo - inspired by </> JEDI */}
          <Link to="/" className="sidebar-brand" onClick={handleNavClick}>
            <div className="brand-badge">&lt;/&gt;</div>
            <span className="brand-title">EDU EXCHANGE</span>
          </Link>

          {/* Navigation Menu */}
          <nav>
            <ul className="sidebar-menu">
              <li>
                <NavLink
                  to={isAuthenticated ? '/dashboard' : '/'}
                  end={!isAuthenticated}
                  className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  <span className="sidebar-icon">🏠</span>
                  <span>Home</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/skills"
                  className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  <span className="sidebar-icon">⚡</span>
                  <span>Explore Skills</span>
                </NavLink>
              </li>

              {isAuthenticated ? (
                <>
                  <li>
                    <NavLink
                      to="/profile"
                      className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                      onClick={handleNavClick}
                    >
                      <span className="sidebar-icon">👤</span>
                      <span>My Profile</span>
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/requests"
                      className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                      onClick={handleNavClick}
                    >
                      <span className="sidebar-icon">🤝</span>
                      <span>Requests</span>
                      {pendingRequestsCount > 0 && (
                        <span className="sidebar-badge">{pendingRequestsCount}</span>
                      )}
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/projects"
                      className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                      onClick={handleNavClick}
                    >
                      <span className="sidebar-icon">📁</span>
                      <span>Projects</span>
                    </NavLink>
                  </li>

                  <li>
                    <button
                      type="button"
                      className="sidebar-item"
                      style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}
                      onClick={() => {
                        handleNavClick();
                        if (onOpenNotifications) onOpenNotifications();
                      }}
                    >
                      <span className="sidebar-icon">🔔</span>
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <span className="sidebar-badge" style={{ background: 'var(--soft-pink)' }}>
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink
                      to="/projects"
                      className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                      onClick={handleNavClick}
                    >
                      <span className="sidebar-icon">📁</span>
                      <span>Projects</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/login"
                      className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                      onClick={handleNavClick}
                    >
                      <span className="sidebar-icon">🔑</span>
                      <span>Log In</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/signup"
                      className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                      onClick={handleNavClick}
                    >
                      <span className="sidebar-icon">🎓</span>
                      <span>Sign Up</span>
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>

        {/* Sidebar Footer (Preferences, Logout) */}
        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-item"
            style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}
            onClick={() => {
              handleNavClick();
              if (onOpenPreferences) onOpenPreferences();
            }}
          >
            <span className="sidebar-icon">⚙️</span>
            <span>Preferences</span>
          </button>

          {isAuthenticated ? (
            <button
              type="button"
              className="sidebar-item"
              style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}
              onClick={handleLogout}
            >
              <span className="sidebar-icon">🚪</span>
              <span>Log out</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="sidebar-item"
              onClick={handleNavClick}
            >
              <span className="sidebar-icon">🚪</span>
              <span>Student Portal</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
