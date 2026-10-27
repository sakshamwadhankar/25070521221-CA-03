import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { projectService } from '../services/projectService';
import ProjectCard from '../components/ProjectCard';
import Avatar from '../components/Avatar';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const CATEGORIES = ['All', 'Technical', 'Academic', 'Hackathon', 'Research', 'Creative', 'Social'];
const STATUSES = ['All', 'Open', 'In Progress', 'Completed'];

const Projects = () => {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');

  // Create & Edit Modal
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    requiredSkills: '',
    maxMembers: 4,
    deadline: '',
    status: 'Open',
  });
  const [submittingProject, setSubmittingProject] = useState(false);

  // Details Modal
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Join Request Modal
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [projectToJoin, setProjectToJoin] = useState(null);
  const [joinMessage, setJoinMessage] = useState('');
  const [submittingJoin, setSubmittingJoin] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {
        category: category !== 'All' ? category : undefined,
        status: status !== 'All' ? status : undefined,
        search: search.trim() || undefined,
      };
      const res = await projectService.getProjects(params);
      if (res?.projects) {
        setProjects(res.projects);
      }
    } catch (err) {
      toast.error('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [category, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  // Open Create Project Modal
  const handleOpenCreateModal = () => {
    if (!isAuthenticated) {
      toast.info('Please log in first to create a student project');
      return;
    }
    setIsEditing(false);
    setEditingProjectId(null);
    setFormData({
      title: '',
      description: '',
      category: 'Technical',
      requiredSkills: '',
      maxMembers: 4,
      deadline: '',
      status: 'Open',
    });
    setProjectModalOpen(true);
  };

  // Open Edit Project Modal
  const handleOpenEditModal = (project) => {
    setIsEditing(true);
    setEditingProjectId(project._id);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      requiredSkills: project.requiredSkills ? project.requiredSkills.join(', ') : '',
      maxMembers: project.maxMembers || 4,
      deadline: project.deadline ? project.deadline.split('T')[0] : '',
      status: project.status || 'Open',
    });
    setProjectModalOpen(true);
  };

  // Submit Project Form
  const handleSubmitProject = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please enter project title and description');
      return;
    }

    try {
      setSubmittingProject(true);
      if (isEditing) {
        await projectService.updateProject(editingProjectId, formData);
        toast.success('Project updated successfully!');
      } else {
        await projectService.createProject(formData);
        toast.success('Project created and listed successfully!');
      }
      setProjectModalOpen(false);
      fetchProjects();
    } catch (err) {
      toast.error(err.message || 'Failed to save project');
    } finally {
      setSubmittingProject(false);
    }
  };

  // Delete Project
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectService.deleteProject(projectId);
      toast.success('Project deleted');
      fetchProjects();
    } catch (err) {
      toast.error(err.message || 'Failed to delete project');
    }
  };

  // View Project Details
  const handleViewDetails = async (project) => {
    setActiveProject(project);
    setDetailsModalOpen(true);
    setLoadingDetails(true);

    try {
      const res = await projectService.getProjectById(project._id);
      if (res?.project) {
        setActiveProject(res.project);
        setJoinRequests(res.joinRequests || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Open Join Request Modal
  const handleOpenJoin = (project) => {
    if (!isAuthenticated) {
      toast.info('Please log in first to apply to join a project');
      return;
    }
    setProjectToJoin(project);
    setJoinMessage(`Hi! I saw your "${project.title}" project and would love to collaborate.`);
    setJoinModalOpen(true);
  };

  const handleSendJoinRequest = async (e) => {
    e.preventDefault();
    if (!projectToJoin) return;

    try {
      setSubmittingJoin(true);
      await projectService.joinProject(projectToJoin._id, { message: joinMessage });
      toast.success('Join request sent to project owner!');
      setJoinModalOpen(false);
      fetchProjects();
    } catch (err) {
      toast.error(err.message || 'Failed to send join request');
    } finally {
      setSubmittingJoin(false);
    }
  };

  // Owner: Accept Applicant
  const handleAcceptApplicant = async (requestId) => {
    try {
      const res = await projectService.acceptJoinRequest(activeProject._id, requestId);
      toast.success('Member accepted to the team!');
      setActiveProject(res.project);
      setJoinRequests((prev) => prev.filter((r) => r._id !== requestId));
      fetchProjects();
    } catch (err) {
      toast.error(err.message || 'Failed to accept applicant');
    }
  };

  // Owner: Reject Applicant
  const handleRejectApplicant = async (requestId) => {
    try {
      await projectService.rejectJoinRequest(activeProject._id, requestId);
      toast.info('Join request rejected');
      setJoinRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      toast.error(err.message || 'Failed to reject applicant');
    }
  };

  const isOwnerOfActive = user && activeProject?.owner?._id === user._id;

  return (
    <div className="page-container">
      <div className="container">
        {/* Header & Create Project */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <h1 className="section-title">Student Projects & Collaboration</h1>
            <p className="section-subtitle">
              Find hackathon teams, academic study groups, and capstone collaborators
            </p>
          </div>

          <button onClick={handleOpenCreateModal} className="btn btn-primary">
            🚀 Create a Project
          </button>
        </div>

        {/* Search & Filters */}
        <div className="card" style={{ padding: '20px 24px', marginBottom: 32 }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects by title, description, or required skill tags..."
                className="form-input"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    fetchProjects();
                  }}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}
                >
                  ✕
                </button>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              🔍 Search
            </button>
          </form>

          {/* Category Filter Pills */}
          <div style={{ marginBottom: 14 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginRight: 10 }}>
              Category:
            </span>
            <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 6 }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`badge ${category === cat ? 'badge-primary' : 'badge-gray'}`}
                  style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '0.82rem' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginRight: 10 }}>
              Status:
            </span>
            {STATUSES.map((st) => (
              <button
                key={st}
                onClick={() => setStatus(st)}
                className={`badge ${status === st ? 'badge-purple' : 'badge-gray'}`}
                style={{ cursor: 'pointer', padding: '4px 10px', fontSize: '0.78rem' }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        {loading ? (
          <Loader text="Loading student projects from MongoDB..." />
        ) : projects.length === 0 ? (
          <EmptyState
            icon="🚀"
            title="No projects found"
            description="No student projects currently match your filter criteria. Be the first to start one!"
            actionText="Start a Project"
            onAction={handleOpenCreateModal}
          />
        ) : (
          <div className="grid grid-cols-2" style={{ gap: 24 }}>
            {projects.map((proj) => (
              <ProjectCard
                key={proj._id}
                project={proj}
                onViewDetails={handleViewDetails}
                onJoin={handleOpenJoin}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal: Create or Edit Project */}
      <Modal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        title={isEditing ? 'Edit Project' : 'Create a Student Collaboration Project'}
      >
        <form onSubmit={handleSubmitProject}>
          <div className="form-group">
            <label className="form-label">Project Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. AI Study Buddy – Smart Lecture Summarizer"
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-select"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="form-select"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Max Team Members</label>
              <input
                type="number"
                min="2"
                max="10"
                value={formData.maxMembers}
                onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Deadline (Optional)</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Required Skills (comma-separated)</label>
            <input
              type="text"
              value={formData.requiredSkills}
              onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
              placeholder="e.g. Python, NLP, React, Figma"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Project Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What are the goals of the project? What technologies are used, and what role are you looking for classmates to fill?"
              className="form-textarea"
              rows="4"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <button
              type="button"
              onClick={() => setProjectModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submittingProject}
            >
              {submittingProject ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Project Details & Team Roster */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={activeProject?.title || 'Project Details'}
        maxWidth="680px"
      >
        {activeProject && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span className="badge badge-purple">{activeProject.category}</span>
              <span className="badge badge-success">● {activeProject.status}</span>
              {activeProject.deadline && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginLeft: 'auto' }}>
                  📅 Deadline: {new Date(activeProject.deadline).toLocaleDateString()}
                </span>
              )}
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: 20 }}>
              {activeProject.description}
            </p>

            {/* Required Skills */}
            {activeProject.requiredSkills && activeProject.requiredSkills.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                  Required Skills:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {activeProject.requiredSkills.map((sk, idx) => (
                    <span key={idx} className="project-tag">
                      #{sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Team Members */}
            <div style={{ marginBottom: 24, padding: '16px', background: 'var(--bg-main)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  Project Team ({activeProject.members?.length || 1} / {activeProject.maxMembers || 4})
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                  Owner: {activeProject.owner?.name}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {activeProject.members &&
                  activeProject.members.map((member) => (
                    <div
                      key={member._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: '#ffffff',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={member.name} size="sm" />
                        <div>
                          <p style={{ fontSize: '0.88rem', fontWeight: 700 }}>{member.name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {member.department} • {member.year}
                          </p>
                        </div>
                      </div>
                      {member._id === activeProject.owner?._id ? (
                        <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                          Owner
                        </span>
                      ) : (
                        <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                          Member
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Owner Section: Review Pending Join Requests */}
            {isOwnerOfActive && (
              <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 12 }}>
                  Pending Join Applications ({joinRequests.length})
                </h4>

                {joinRequests.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    No pending join requests for this project.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {joinRequests.map((req) => (
                      <div
                        key={req._id}
                        style={{
                          padding: '12px',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)',
                          background: '#ffffff',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Avatar name={req.sender?.name} size="sm" />
                            <div>
                              <p style={{ fontSize: '0.86rem', fontWeight: 700 }}>{req.sender?.name}</p>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {req.sender?.department}
                              </p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              onClick={() => handleRejectApplicant(req._id)}
                              className="btn btn-secondary btn-sm"
                              style={{ color: 'var(--danger)' }}
                            >
                              ✕ Decline
                            </button>
                            <button
                              onClick={() => handleAcceptApplicant(req._id)}
                              className="btn btn-primary btn-sm"
                            >
                              ✓ Accept
                            </button>
                          </div>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', background: 'var(--bg-main)', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                          "{req.message}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal: Request to Join */}
      <Modal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        title={`Apply to Join "${projectToJoin?.title}"`}
      >
        {projectToJoin && (
          <form onSubmit={handleSendJoinRequest}>
            <div style={{ background: 'var(--bg-main)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Project Owner:</p>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>
                {projectToJoin.owner?.name} ({projectToJoin.owner?.department})
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Message to Project Lead *</label>
              <textarea
                value={joinMessage}
                onChange={(e) => setJoinMessage(e.target.value)}
                className="form-textarea"
                rows="4"
                placeholder="Mention why you want to join, your relevant skills, and past experience..."
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setJoinModalOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submittingJoin}
              >
                {submittingJoin ? 'Sending...' : 'Send Application 🚀'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Projects;
