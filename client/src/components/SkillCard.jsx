import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import { useAuth } from '../context/AuthContext';

const SkillCard = ({ skill, onRequest, onEdit, onDelete }) => {
  const { user } = useAuth();

  const isOwner = user && skill.offeredBy?._id === user._id;

  return (
    <div className="card card-hover skill-card">
      <div>
        {/* Header: Student Info & Badges */}
        <div className="skill-card-header">
          <Link
            to={`/profile/${skill.offeredBy?._id || ''}`}
            className="skill-user-info"
            title="View student profile"
          >
            <Avatar name={skill.offeredBy?.name} size="md" />
            <div>
              <p className="skill-user-name">{skill.offeredBy?.name || 'Anonymous Student'}</p>
              <p className="skill-user-dept">
                {skill.offeredBy?.department || 'Department'} • {skill.offeredBy?.year || 'Student'}
              </p>
            </div>
          </Link>

          <span className={`badge badge-level-${skill.level}`}>
            {skill.level}
          </span>
        </div>

        {/* Category & Title */}
        <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="badge badge-primary">{skill.category}</span>
          {skill.availability && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
              🕒 {skill.availability}
            </span>
          )}
        </div>

        <h3 className="skill-title">{skill.name}</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: 12 }}>
          {skill.description}
        </p>

        {/* Exchange Wanted Box */}
        <div className="skill-exchange-box">
          <span className="skill-exchange-label">Wants in Exchange:</span>
          <span className="skill-exchange-value">
            🎯 {skill.wantedSkill || 'Open to discussion'}
          </span>
        </div>
      </div>

      {/* Card Footer: Action Buttons */}
      <div className="skill-card-footer">
        <Link
          to={`/profile/${skill.offeredBy?._id || ''}`}
          className="btn btn-secondary btn-sm"
        >
          View Profile
        </Link>

        {isOwner ? (
          <div style={{ display: 'flex', gap: 6 }}>
            {onEdit && (
              <button
                onClick={() => onEdit(skill)}
                className="btn btn-secondary btn-sm"
                title="Edit skill"
              >
                ✏️ Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(skill._id)}
                className="btn btn-secondary btn-sm"
                style={{ color: 'var(--danger)' }}
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
            🤝 Request Exchange
          </button>
        )}
      </div>
    </div>
  );
};

export default SkillCard;
