import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import { useAuth } from '../context/AuthContext';

const RequestCard = ({
  request,
  onAccept,
  onReject,
  onCancel,
  onComplete,
  onDelete,
}) => {
  const { user } = useAuth();

  const isSender = user && request.sender?._id === user._id;
  const isReceiver = user && request.receiver?._id === user._id;

  // Status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'accepted':
        return 'badge-success';
      case 'rejected':
        return 'badge-danger';
      case 'cancelled':
        return 'badge-gray';
      case 'completed':
        return 'badge-primary';
      default:
        return 'badge-gray';
    }
  };

  const isSkillExchange = request.requestType === 'skill-exchange';

  return (
    <div className="card request-card">
      {/* Header: Request Type & Status */}
      <div className="request-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="badge badge-purple">
            {isSkillExchange ? '🤝 Skill Exchange' : '🚀 Project Join'}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
            {new Date(request.createdAt).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        <span className={`badge ${getStatusBadge(request.status)}`}>
          ● {request.status.toUpperCase()}
        </span>
      </div>

      {/* Participants: Sender & Receiver */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        {/* Sender */}
        <Link
          to={`/profile/${request.sender?._id || ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Avatar name={request.sender?.name} size="sm" />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>From</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {request.sender?.name} {isSender ? '(You)' : ''}
            </span>
          </div>
        </Link>

        <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem' }}>➔</span>

        {/* Receiver */}
        <Link
          to={`/profile/${request.receiver?._id || ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Avatar name={request.receiver?.name} size="sm" />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>To</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {request.receiver?.name} {isReceiver ? '(You)' : ''}
            </span>
          </div>
        </Link>
      </div>

      {/* Exchange Details */}
      {isSkillExchange ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, background: 'var(--bg-main)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Offered Skill</span>
            <p style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)', marginTop: 2 }}>
              💡 {request.offeredSkill || 'Exchange offer'}
            </p>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Wanted Skill</span>
            <p style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)', marginTop: 2 }}>
              🎯 {request.wantedSkill || 'Requested skill'}
            </p>
          </div>
        </div>
      ) : (
        <div style={{ background: 'var(--bg-main)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Project Applied For</span>
          <p style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--primary)', marginTop: 2 }}>
            📂 {request.projectId?.title || 'Student Project'}
          </p>
        </div>
      )}

      {/* Message */}
      <div className="request-message-box">
        <p style={{ fontSize: '0.86rem', fontStyle: 'italic' }}>
          "{request.message}"
        </p>
      </div>

      {/* Actions based on role and request status */}
      <div className="request-actions">
        {/* If Receiver & Pending: Accept or Reject */}
        {isReceiver && request.status === 'pending' && (
          <>
            <button
              onClick={() => onReject && onReject(request._id)}
              className="btn btn-secondary btn-sm"
              style={{ color: 'var(--danger)' }}
            >
              ✕ Decline
            </button>
            <button
              onClick={() => onAccept && onAccept(request._id)}
              className="btn btn-primary btn-sm"
            >
              ✓ Accept Request
            </button>
          </>
        )}

        {/* If Sender & Pending: Cancel */}
        {isSender && request.status === 'pending' && (
          <button
            onClick={() => onCancel && onCancel(request._id)}
            className="btn btn-secondary btn-sm"
          >
            Cancel Request
          </button>
        )}

        {/* If Accepted: Mark as Completed */}
        {request.status === 'accepted' && (
          <button
            onClick={() => onComplete && onComplete(request._id)}
            className="btn btn-primary btn-sm"
            style={{ background: 'var(--success)' }}
          >
            ⭐ Mark Exchange Completed
          </button>
        )}

        {/* If Rejected, Cancelled, or Completed: Can remove */}
        {['rejected', 'cancelled', 'completed'].includes(request.status) && onDelete && (
          <button
            onClick={() => onDelete(request._id)}
            className="btn btn-secondary btn-sm"
            style={{ color: 'var(--text-muted)' }}
            title="Delete this record"
          >
            🗑️ Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
