import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import { useAuth } from '../context/AuthContext';

const SkillCard = ({ skill, onRequest, onEdit, onDelete }) => {
  const { user } = useAuth();
  const isOwner = user && skill.offeredBy?._id === user._id;

  return (
    <div className="card-neo card-neo-white" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {/* Header: Student Info & Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <Link
            to={`/profile/${skill.offeredBy?._id || ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            title="View student profile"
          >
            <Avatar name={skill.offeredBy?.name} size="sm" />
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', fontWeight: 700, color: 'var(--black)', margin: 0 }}>
                {skill.offeredBy?.name || 'Anonymous Student'}
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>
                {skill.offeredBy?.department || 'Department'} • {skill.offeredBy?.year || 'Student'}
              </p>
            </div>
          </Link>

          <span className="badge-neo badge-neo-mint">
            {skill.level}
          </span>
        </div>

        {/* Category & Availability */}
        <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span className="badge-neo badge-neo-yellow">{skill.category}</span>
          {skill.availability && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-light)' }}>
              🕒 {skill.availability}
            </span>
          )}
        </div>

        <h3 style={{ fontSize: '1.25rem', marginBottom: 8, color: 'var(--black)' }}>
          {skill.name}
        </h3>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 14 }}>
          {skill.description}
        </p>

        {/* Exchange Wanted Box (Cream card) */}
        <div
          style={{
            background: 'var(--cream)',
            border: 'var(--border-black)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            boxShadow: 'var(--shadow-black-sm)',
            marginBottom: 16,
          }}
        >
          <span className="form-label-neo" style={{ fontSize: '0.7rem', display: 'block', marginBottom: 2 }}>
            Wants in Exchange:
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', fontWeight: 700, color: 'var(--black)' }}>
            🎯 {skill.wantedSkill || 'Open to discussion'}
          </span>
        </div>
      </div>

      {/* Card Footer: Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '2px solid var(--black)' }}>
        <Link
          to={`/profile/${skill.offeredBy?._id || ''}`}
          className="btn btn-secondary btn-sm"
        >
          Profile
        </Link>

        {isOwner ? (
          <div style={{ display: 'flex', gap: 6 }}>
            {onEdit && (
              <button
                onClick={() => onEdit(skill)}
                className="btn btn-warning btn-sm"
                title="Edit skill"
              >
                ✏️ Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(skill._id)}
                className="btn btn-danger btn-sm"
                title="Delete skill"
              >
                🗑️
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => onRequest && onRequest(skill)}
            className="btn btn-primary btn-sm"
          >
            🤝 Request Trade
          </button>
        )}
      </div>
    </div>
  );
};

export default SkillCard;
