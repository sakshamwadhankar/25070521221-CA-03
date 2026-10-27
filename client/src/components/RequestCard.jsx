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

  const isSkillExchange = request.requestType === 'skill-exchange';

  return (
    <div className="card-neo card-neo-white" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header: Request Type & Status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '2px solid var(--black)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="badge-neo badge-neo-yellow">
            {isSkillExchange ? '🤝 Skill Exchange' : '🚀 Project Join'}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-light)' }}>
            {new Date(request.createdAt).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        <span className={`badge-neo ${request.status === 'accepted' ? 'badge-neo-mint' : request.status === 'completed' ? 'badge-neo-yellow' : request.status === 'pending' ? 'badge-neo-peach' : 'badge-neo-white'}`}>
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
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-light)', display: 'block' }}>From</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', fontWeight: 700, color: 'var(--black)' }}>
              {request.sender?.name} {isSender ? '(You)' : ''}
            </span>
          </div>
        </Link>

        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--black)', fontWeight: 700, fontSize: '1.2rem' }}>➔</span>

        {/* Receiver */}
        <Link
          to={`/profile/${request.receiver?._id || ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Avatar name={request.receiver?.name} size="sm" />
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-light)', display: 'block' }}>To</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', fontWeight: 700, color: 'var(--black)' }}>
              {request.receiver?.name} {isReceiver ? '(You)' : ''}
            </span>
          </div>
        </Link>
      </div>

      {/* Exchange Details */}
      {isSkillExchange ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, background: 'var(--cream)', padding: '10px 14px', border: 'var(--border-black)', borderRadius: 'var(--radius-sm)' }}>
          <div>
            <span className="form-label-neo" style={{ fontSize: '0.68rem', display: 'block' }}>Offered Skill</span>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', fontWeight: 700, color: 'var(--black)', marginTop: 2 }}>
              💡 {request.offeredSkill || 'Exchange offer'}
            </p>
          </div>
          <div>
            <span className="form-label-neo" style={{ fontSize: '0.68rem', display: 'block' }}>Wanted Skill</span>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', fontWeight: 700, color: 'var(--black)', marginTop: 2 }}>
              🎯 {request.wantedSkill || 'Skill desired'}
            </p>
          </div>
        </div>
      ) : (
        <div style={{ background: 'var(--cream)', padding: '10px 14px', border: 'var(--border-black)', borderRadius: 'var(--radius-sm)' }}>
          <span className="form-label-neo" style={{ fontSize: '0.68rem', display: 'block' }}>Target Project</span>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', fontWeight: 700, color: 'var(--black)', marginTop: 2 }}>
            📁 {request.project?.title || 'Project Application'}
          </p>
        </div>
      )}

      {/* Message Note */}
      {request.message && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-muted)', background: 'var(--white)', padding: '8px 12px', border: '1.5px solid var(--black)', borderRadius: 'var(--radius-sm)' }}>
          "{request.message}"
        </p>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, paddingTop: 10, borderTop: '2px solid var(--black)', flexWrap: 'wrap' }}>
        {/* Receiver actions when Pending */}
        {isReceiver && request.status === 'pending' && (
          <>
            <button onClick={() => onAccept && onAccept(request._id)} className="btn btn-primary btn-sm">
              ✓ Accept
            </button>
            <button onClick={() => onReject && onReject(request._id)} className="btn btn-danger btn-sm">
              ✕ Decline
            </button>
          </>
        )}

        {/* Sender actions when Pending */}
        {isSender && request.status === 'pending' && (
          <button onClick={() => onCancel && onCancel(request._id)} className="btn btn-secondary btn-sm">
            Cancel Request
          </button>
        )}

        {/* Both when Accepted: Can mark Completed */}
        {request.status === 'accepted' && (
          <button onClick={() => onComplete && onComplete(request._id)} className="btn btn-warning btn-sm">
            ⭐ Mark Completed
          </button>
        )}

        {/* Remove history */}
        {(request.status === 'rejected' || request.status === 'cancelled' || request.status === 'completed') && (
          <button onClick={() => onDelete && onDelete(request._id)} className="btn btn-secondary btn-sm" title="Remove record">
            🗑️ Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
