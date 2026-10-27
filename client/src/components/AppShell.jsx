import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';
import { requestService } from '../services/requestService';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import NotificationsModal from './NotificationsModal';
import PreferencesModal from './PreferencesModal';

const AppShell = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [prefModalOpen, setPrefModalOpen] = useState(false);

  // Sidebar Compress / Expand & Resizing State (Saved in localStorage)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('edu_sidebar_collapsed') === 'true';
  });

  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('edu_sidebar_width');
    return saved ? parseInt(saved, 10) : 250;
  });

  // Remove Laptop Frame Mode (Full screen edge-to-edge)
  const [isFullScreen, setIsFullScreen] = useState(() => {
    return localStorage.getItem('edu_fullscreen_mode') === 'true';
  });

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('edu_sidebar_collapsed', String(next));
      return next;
    });
  };

  const handleWidthChange = (newWidth) => {
    setSidebarWidth(newWidth);
    if (isCollapsed && newWidth > 120) {
      setIsCollapsed(false);
      localStorage.setItem('edu_sidebar_collapsed', 'false');
    }
    localStorage.setItem('edu_sidebar_width', String(newWidth));
  };

  const handleToggleFullScreen = () => {
    setIsFullScreen((prev) => {
      const next = !prev;
      localStorage.setItem('edu_fullscreen_mode', String(next));
      return next;
    });
  };

  // Poll alerts every 15s if logged in
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
      // silent fetch catch
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

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
      setNotifModalOpen(false);

      if (notif.type === 'project-join') {
        navigate('/projects');
      } else {
        navigate('/requests');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`app-viewport ${isFullScreen ? 'full-screen-mode' : ''}`}>
      <div className="app-frame">
        {/* Mint Green Sidebar - FIXED, STEADY, COMPRESSIBLE */}
        <Sidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          unreadCount={unreadCount}
          pendingRequestsCount={pendingRequestsCount}
          onOpenNotifications={() => setNotifModalOpen(true)}
          onOpenPreferences={() => setPrefModalOpen(true)}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          sidebarWidth={sidebarWidth}
          onWidthChange={handleWidthChange}
        />

        {/* Cream Main Area - ONLY THIS SECTION SCROLLS */}
        <div className="app-main">
          <Topbar
            unreadCount={unreadCount}
            onOpenNotifications={() => setNotifModalOpen(true)}
            onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
            isCollapsed={isCollapsed}
            onToggleCollapse={handleToggleCollapse}
            isFullScreen={isFullScreen}
            onToggleFullScreen={handleToggleFullScreen}
          />

          <main className="app-content-body">
            {children}
          </main>
        </div>
      </div>

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={notifModalOpen}
        onClose={() => setNotifModalOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAllRead={handleMarkAllRead}
        onNotificationClick={handleNotificationClick}
      />

      {/* Preferences Modal */}
      <PreferencesModal
        isOpen={prefModalOpen}
        onClose={() => setPrefModalOpen(false)}
      />
    </div>
  );
};

export default AppShell;
