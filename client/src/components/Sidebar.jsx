import React, { useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({
  isOpen,
  onClose,
  unreadCount = 0,
  pendingRequestsCount = 0,
  onOpenNotifications,
  onOpenPreferences,
  isCollapsed = false,
  onToggleCollapse,
  sidebarWidth = 250,
  onWidthChange,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const resizerRef = useRef(null);

  const handleLogout = async () => {
    if (onClose) onClose();
    await logout();
    navigate('/');
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  // Draggable Resizer Handler
  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(74, Math.min(420, startWidth + deltaX));
      if (onWidthChange) {
        onWidthChange(newWidth);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };

    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      <aside
        className={`app-sidebar ${isOpen ? 'drawer-open' : ''} ${isCollapsed ? 'sidebar-collapsed' : ''}`}
        style={{
          width: isCollapsed ? '74px' : `${sidebarWidth}px`,
        }}
      >
        {/* Draggable Resizer Handle on border (Chhota-Bada drag control) */}
        {!isCollapsed && (
          <div
            className="sidebar-resizer"
            onMouseDown={handleMouseDown}
            title="Drag to resize sidebar (chhota / bada)"
          />
        )}

        {/* Top Header: Brand Logo & Compress Toggle Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 14, marginBottom: 12, borderBottom: '2px solid var(--black)', width: '100%' }}>
          <Link to="/" className="sidebar-brand" onClick={handleNavClick} title="Edu Exchange">
            <div className="brand-badge">&lt;/&gt;</div>
            {!isCollapsed && <span className="brand-title">EDU EXCHANGE</span>}
          </Link>

          {/* Compress / Expand Button */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="square-btn"
            style={{ width: 28, height: 28, fontSize: '0.85rem', padding: 0 }}
            title={isCollapsed ? "Expand sidebar (Bada karein)" : "Compress sidebar (Chhota karein)"}
            aria-label="Toggle sidebar collapse"
          >
            {isCollapsed ? '⇥' : '⇤'}
          </button>
        </div>

        {/* Quick Size Pills: S, M, L (Only when expanded) */}
        {!isCollapsed && (
          <div
            className="sidebar-size-pills"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
              padding: '4px 8px',
              background: 'rgba(255, 255, 255, 0.65)',
              border: '1.5px solid var(--black)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700 }}>
              Width:
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                type="button"
                onClick={() => onWidthChange && onWidthChange(190)}
                className="badge-neo badge-neo-white"
                style={{ cursor: 'pointer', padding: '1px 6px', fontSize: '0.68rem', background: sidebarWidth < 220 ? 'var(--black)' : 'var(--white)', color: sidebarWidth < 220 ? 'var(--white)' : 'var(--black)' }}
                title="Small sidebar"
              >
                S
              </button>
              <button
                type="button"
                onClick={() => onWidthChange && onWidthChange(250)}
                className="badge-neo badge-neo-white"
                style={{ cursor: 'pointer', padding: '1px 6px', fontSize: '0.68rem', background: sidebarWidth >= 220 && sidebarWidth <= 280 ? 'var(--black)' : 'var(--white)', color: sidebarWidth >= 220 && sidebarWidth <= 280 ? 'var(--white)' : 'var(--black)' }}
                title="Medium/Standard sidebar"
              >
                M
              </button>
              <button
                type="button"
                onClick={() => onWidthChange && onWidthChange(330)}
                className="badge-neo badge-neo-white"
                style={{ cursor: 'pointer', padding: '1px 6px', fontSize: '0.68rem', background: sidebarWidth > 280 ? 'var(--black)' : 'var(--white)', color: sidebarWidth > 280 ? 'var(--white)' : 'var(--black)' }}
                title="Large sidebar"
              >
                L
              </button>
            </div>
          </div>
        )}

        {/* Middle Navigation Menu - Scrollable if screen height is small */}
        <div className="sidebar-nav-container">
          <nav>
            <ul className="sidebar-menu">
              <li>
                <NavLink
                  to={isAuthenticated ? '/dashboard' : '/'}
                  end={!isAuthenticated}
                  className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={handleNavClick}
                  title="Home"
                >
                  <span className="sidebar-icon">🏠</span>
                  {!isCollapsed && <span>Home</span>}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/skills"
                  className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={handleNavClick}
                  title="Explore Skills"
                >
                  <span className="sidebar-icon">⚡</span>
                  {!isCollapsed && <span>Explore Skills</span>}
                </NavLink>
              </li>

              {isAuthenticated ? (
                <>
                  <li>
                    <NavLink
                      to="/profile"
                      className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                      onClick={handleNavClick}
                      title="My Profile"
                    >
                      <span className="sidebar-icon">👤</span>
                      {!isCollapsed && <span>My Profile</span>}
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/requests"
                      className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                      onClick={handleNavClick}
                      title="Requests"
                    >
                      <span className="sidebar-icon">🤝</span>
                      {!isCollapsed && <span>Requests</span>}
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
                      title="Projects"
                    >
                      <span className="sidebar-icon">📁</span>
                      {!isCollapsed && <span>Projects</span>}
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
                      title="Notifications"
                    >
                      <span className="sidebar-icon">🔔</span>
                      {!isCollapsed && <span>Notifications</span>}
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
                      title="Projects"
                    >
                      <span className="sidebar-icon">📁</span>
                      {!isCollapsed && <span>Projects</span>}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/login"
                      className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                      onClick={handleNavClick}
                      title="Log In"
                    >
                      <span className="sidebar-icon">🔑</span>
                      {!isCollapsed && <span>Log In</span>}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/signup"
                      className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                      onClick={handleNavClick}
                      title="Sign Up"
                    >
                      <span className="sidebar-icon">🎓</span>
                      {!isCollapsed && <span>Sign Up</span>}
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>

        {/* Sidebar Footer (Preferences, Logout) - LOCKED AT THE BOTTOM CONSTANTLY */}
        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-item"
            style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}
            onClick={() => {
              handleNavClick();
              if (onOpenPreferences) onOpenPreferences();
            }}
            title="Platform Preferences"
          >
            <span className="sidebar-icon">⚙️</span>
            {!isCollapsed && <span>Preferences</span>}
          </button>

          {isAuthenticated ? (
            <button
              type="button"
              className="sidebar-item"
              style={{ width: '100%', textAlign: 'left', cursor: 'pointer', color: 'var(--black)' }}
              onClick={handleLogout}
              title="Log out"
            >
              <span className="sidebar-icon">🚪</span>
              {!isCollapsed && <span>Log out</span>}
            </button>
          ) : (
            <Link
              to="/login"
              className="sidebar-item"
              onClick={handleNavClick}
              title="Student Portal"
            >
              <span className="sidebar-icon">🚪</span>
              {!isCollapsed && <span>Student Portal</span>}
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
