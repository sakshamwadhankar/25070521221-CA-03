import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';
import { requestService } from '../services/requestService';
import Avatar from './Avatar';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Fetch notifications & pending requests when logged in
  const fetchAlerts = async () => {
    if (!isAuthenticated) return;
    try {
      const [notifData, reqData] = await Promise.all([
        notificationService.getNotifications(),
        requestService.getReceivedRequests(),
      ]);

      if (notifData?.notifications) {
        setNotifications(notifData.notifications);
        setUnreadCount(notifData.unreadCount || 0);
      }

      if (reqData?.requests) {
        const pending = reqData.requests.filter((r) => r.status === 'pending');
        setPendingRequestsCount(pending.length);
      }
    } catch (err) {
      // ignore silent fetch failure
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000); // 15s poll
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.isRead) {
        await notificationService.markAsRead(notif._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      setNotifDropdownOpen(false);

      if (notif.type === 'project-join') {
        navigate('/projects');
      } else {
        navigate('/requests');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-badge">&lt;/&gt;</div>
          <span>EDU EXCHANGE</span>
        </Link>

        {/* Navigation Links */}
        <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/skills"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Explore Skills
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Projects
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink
                to="/requests"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Requests
                {pendingRequestsCount > 0 && (
                  <span
                    style={{
                      marginLeft: 6,
                      background: 'var(--primary)',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '999px',
                    }}
                  >
                    {pendingRequestsCount}
                  </span>
                )}
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </NavLink>
            </>
          )}
        </nav>

        {/* Action Buttons & Profile */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              {/* Notifications Bell */}
              <div className="notification-menu-wrapper" ref={notifRef}>
                <button
                  className="icon-btn"
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  aria-label="Notifications"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
                </button>

                {notifDropdownOpen && (
                  <div className="notification-dropdown">
                    <div className="notification-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Notifications</span>
                        {unreadCount > 0 && (
                          <span className="badge badge-primary">{unreadCount} new</span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="notification-list">
                      {notifications.length === 0 ? (
                        <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
                            onClick={() => handleNotificationClick(notif)}
                          >
                            <span className="notification-item-title">{notif.title}</span>
                            <span className="notification-item-msg">{notif.message}</span>
                            <span className="notification-item-time">
                              {new Date(notif.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div style={{ position: 'relative' }} ref={userRef}>
                <button
                  className="user-menu-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <Avatar name={user?.name} size="sm" />
                  <span className="user-menu-name">{user?.name?.split(' ')[0] || 'Account'}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '48px',
                      right: 0,
                      width: '210px',
                      background: '#ffffff',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-xl)',
                      padding: '8px',
                      zIndex: 1050,
                      animation: 'dropIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', marginBottom: 4 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{user?.name}</p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      className="nav-link"
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <span>👤</span> My Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="nav-link"
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <span>📊</span> Dashboard
                    </Link>
                    <Link
                      to="/requests"
                      className="nav-link"
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <span>🤝</span> Exchange Requests
                    </Link>

                    <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 4, paddingTop: 4 }}>
                      <button
                        onClick={handleLogout}
                        className="nav-link"
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '8px 12px',
                          color: 'var(--danger)',
                        }}
                      >
                        <span>🚪</span> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-toggle icon-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
