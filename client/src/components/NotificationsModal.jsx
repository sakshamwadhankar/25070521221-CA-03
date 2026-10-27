import React from 'react';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';

const NotificationsModal = ({
  isOpen,
  onClose,
  notifications = [],
  unreadCount = 0,
  onMarkAllRead,
  onNotificationClick,
}) => {
  const navigate = useNavigate();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="badge badge-neo badge-neo-pink">{unreadCount} unread</span>
          )}
        </div>
      }
      maxWidth="560px"
      footer={
        <>
          {unreadCount > 0 && (
            <button onClick={onMarkAllRead} className="btn btn-secondary btn-sm">
              ✓ Mark All Read
            </button>
          )}
          <button onClick={onClose} className="btn btn-primary btn-sm">
            Close
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: '60vh', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}>🔔</span>
            <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>No notifications yet</p>
            <p style={{ fontSize: '0.84rem' }}>When someone requests a skill or accepts your project invite, it will appear here.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => onNotificationClick(notif)}
              style={{
                padding: '12px 16px',
                background: notif.isRead ? 'var(--white)' : 'var(--warm-yellow)',
                border: 'var(--border-black)',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-black-sm)',
                cursor: 'pointer',
                transition: 'transform 0.1s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translate(-1px, -1px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.92rem', color: 'var(--black)' }}>
                  {notif.title}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-light)' }}>
                  {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {notif.message}
              </p>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};

export default NotificationsModal;
