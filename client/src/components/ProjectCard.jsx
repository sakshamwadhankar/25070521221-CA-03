import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import { useAuth } from '../context/AuthContext';

const ProjectCard = ({ project, onViewDetails, onJoin, onEdit, onDelete }) => {
  const { user } = useAuth();

  const isOwner = user && project.owner?._id === user._id;
  const isMember = user && project.members?.some((m) => (m._id || m) === user._id);
  const isFull = (project.members?.length || 0) >= (project.maxMembers || 4);

  // Status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return 'badge-success';
      case 'In Progress':
        return 'badge-warning';
      case 'Completed':
        return 'badge-secondary';
      default:
        return 'badge-gray';
    }
  };

  return (
    <div className="card card-hover project-card">
      <div style={{ flex: 1 }}>
        {/* Category & Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span className="badge badge-purple">{project.category}</span>
          <span className={`badge ${getStatusBadge(project.status)}`}>
            ● {project.status}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            marginBottom: 8,
            color: 'var(--text-main)',
            cursor: 'pointer',
          }}
          onClick={() => onViewDetails && onViewDetails(project)}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: 14 }}>
          {project.description?.length > 130
            ? `${project.description.substring(0, 130)}...`
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
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {project.owner?.name || 'Project Lead'}
            </span>
          </Link>

          {project.deadline && (
            <span style={{ fontSize: '0.76rem', color: 'var(--text-light)', fontWeight: 500 }}>
              📅 {new Date(project.deadline).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Team Members Stack */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
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
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: 8 }}>
              {project.members?.length || 1} / {project.maxMembers || 4} Members
            </span>
          </div>

          {isOwner && (
            <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
              Project Owner
            </span>
          )}
        </div>
      </div>

      {/* Card Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        <button
          onClick={() => onViewDetails && onViewDetails(project)}
          className="btn btn-secondary btn-sm"
        >
          View Details
        </button>

        {isOwner ? (
          <div style={{ display: 'flex', gap: 6 }}>
            {onEdit && (
              <button
                onClick={() => onEdit(project)}
                className="btn btn-secondary btn-sm"
                title="Edit Project"
              >
                ✏️ Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(project._id)}
                className="btn btn-secondary btn-sm"
                style={{ color: 'var(--danger)' }}
                title="Delete Project"
              >
                🗑️
              </button>
            )}
          </div>
        ) : isMember ? (
          <span className="badge badge-success" style={{ padding: '6px 12px' }}>
            ✓ Joined Team
          </span>
        ) : isFull ? (
          <span className="badge badge-gray" style={{ padding: '6px 12px' }}>
            Team Full
          </span>
        ) : (
          <button
            onClick={() => onJoin && onJoin(project)}
            className="btn btn-primary btn-sm"
          >
            🚀 Request to Join
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
