import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import { useAuth } from '../context/AuthContext';

const ProjectCard = ({ project, onViewDetails, onJoin, onEdit, onDelete }) => {
  const { user } = useAuth();

  const isOwner = user && project.owner?._id === user._id;
  const isMember = user && project.members?.some((m) => (m._id || m) === user._id);
  const isFull = (project.members?.length || 0) >= (project.maxMembers || 4);

  return (
    <div className="card-neo card-neo-white" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ flex: 1 }}>
        {/* Category & Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="badge-neo badge-neo-yellow">{project.category}</span>
          <span className="badge-neo badge-neo-mint">
            ● {project.status}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.25rem',
            marginBottom: 8,
            color: 'var(--black)',
            cursor: 'pointer',
          }}
          onClick={() => onViewDetails && onViewDetails(project)}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 14 }}>
          {project.description?.length > 120
            ? `${project.description.substring(0, 120)}...`
            : project.description}
        </p>

        {/* Required Skills Tags */}
        {project.requiredSkills && project.requiredSkills.length > 0 && (
          <div className="project-tags">
            {project.requiredSkills.map((sk, idx) => (
              <span key={idx} className="project-tag">
                #{sk}
              </span>
            ))}
          </div>
        )}

        {/* Owner Info & Deadline */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '14px 0 10px' }}>
          <Link
            to={`/profile/${project.owner?._id || ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Avatar name={project.owner?.name} size="sm" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', fontWeight: 700, color: 'var(--black)' }}>
              {project.owner?.name || 'Project Lead'}
            </span>
          </Link>

          {project.deadline && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-light)', fontWeight: 600 }}>
              📅 {new Date(project.deadline).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Team Members Stack */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '2px solid var(--black)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className="avatar-stack">
              {project.members &&
                project.members.slice(0, 4).map((member, idx) => (
                  <Avatar
                    key={idx}
                    name={member?.name || 'Member'}
                    size="sm"
                  />
                ))}
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {project.members?.length || 1}/{project.maxMembers || 4} spots
            </span>
          </div>

          {isMember && !isOwner && (
            <span className="badge-neo badge-neo-mint">Member</span>
          )}
          {isOwner && (
            <span className="badge-neo badge-neo-black">Owner</span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16, paddingTop: 12, borderTop: '2px solid var(--black)' }}>
        <button
          onClick={() => onViewDetails && onViewDetails(project)}
          className="btn btn-secondary btn-sm"
          style={{ flex: 1 }}
        >
          Details
        </button>

        {isOwner ? (
          <>
            {onEdit && (
              <button
                onClick={() => onEdit(project)}
                className="btn btn-warning btn-sm"
              >
                ✏️ Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(project._id)}
                className="btn btn-danger btn-sm"
              >
                🗑️
              </button>
            )}
          </>
        ) : isMember ? (
          <button className="btn btn-secondary btn-sm" disabled>
            ✓ Joined
          </button>
        ) : isFull ? (
          <button className="btn btn-secondary btn-sm" disabled>
            Team Full
          </button>
        ) : (
          <button
            onClick={() => onJoin && onJoin(project)}
            className="btn btn-primary btn-sm"
          >
            🚀 Apply to Join
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
