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
        toast.success('Project created on Edu Exchange!');
      }
      setProjectModalOpen(false);
      fetchProjects();
    } catch (err) {
      toast.error(err.message || 'Failed to save project');
    } finally {
      setSubmittingProject(false);
    }
  };

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

  const handleOpenJoin = (project) => {
    if (!isAuthenticated) {
      toast.info('Please log in first to apply to join a project');
      return;
    }
    setProjectToJoin(project);
    setJoinMessage(`Hi! I saw your "${project.title}" project on Edu Exchange and would love to collaborate.`);
    setJoinModalOpen(true);
  };

  const handleSendJoinRequest = async (e) => {
    e.preventDefault();
    if (!projectToJoin) return;

    try {
      setSubmittingJoin(true);
      await projectService.joinProject(projectToJoin._id, { message: joinMessage });
      toast.success('Join request sent to project lead!');
      setJoinModalOpen(false);
      fetchProjects();
    } catch (err) {
      toast.error(err.message || 'Failed to send join request');
    } finally {
      setSubmittingJoin(false);
    }
  };

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header & Create Project */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: 6 }}>Campus Projects & Collaboration</h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Find hackathon teams, academic capstones, and peer research projects.
          </p>
        </div>

        <button onClick={handleOpenCreateModal} className="btn btn-primary">
          🚀 Create Project
        </button>
      </div>

      {/* Search & Filters Card */}
      <div className="card-neo card-neo-mint" style={{ padding: '22px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search projects by title, tech stack, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input-neo"
              style={{ background: 'var(--white)' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }}>
            Filter 🔍
          </button>
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                fetchProjects();
              }}
              className="btn btn-secondary btn-sm"
            >
              Clear
            </button>
          )}
        </form>

        {/* Category Tabs */}
        <div style={{ marginBottom: 12 }}>
          <span className="form-label-neo" style={{ fontSize: '0.74rem', display: 'block', marginBottom: 8 }}>
            Category:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`tab-neo-btn ${category === cat ? 'active' : ''}`}
                style={{ fontSize: '0.78rem', padding: '5px 12px' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Status Tabs */}
        <div>
          <span className="form-label-neo" style={{ fontSize: '0.74rem', display: 'block', marginBottom: 8 }}>
            Status:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {STATUSES.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatus(st)}
                className={`tab-neo-btn ${status === st ? 'active' : ''}`}
                style={{ fontSize: '0.78rem', padding: '5px 12px' }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Project Cards Grid */}
      {loading ? (
        <Loader text="Loading projects from database..." />
      ) : projects.length === 0 ? (
        <EmptyState
          icon="🚀"
          title="No projects found"
          description="There are no projects matching your filter criteria. Be the first to start a collaboration!"
          actionText="+ Launch a Project"
          onAction={handleOpenCreateModal}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onViewDetails={handleViewDetails}
              onJoin={handleOpenJoin}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}

      {/* Modal 1: Create or Edit Project */}
      <Modal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        title={isEditing ? 'Edit Project' : 'Create Student Project'}
        maxWidth="560px"
        footer={
          <>
            <button
              type="button"
              onClick={() => setProjectModalOpen(false)}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmitProject}
              className="btn btn-primary btn-sm"
              disabled={submittingProject}
            >
              {submittingProject ? 'Saving...' : isEditing ? 'Update Project' : 'Launch Project'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmitProject}>
          <div className="form-group-neo">
            <label className="form-label-neo">Project Title *</label>
            <input
              type="text"
              placeholder="e.g. AI Study Companion, Campus Marketplace"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input-neo"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group-neo">
              <label className="form-label-neo">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-input-neo"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group-neo">
              <label className="form-label-neo">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="form-input-neo"
              >
                <option value="Open">Open (Looking for team)</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group-neo">
              <label className="form-label-neo">Max Team Size</label>
              <input
                type="number"
                min="2"
                max="10"
                value={formData.maxMembers}
                onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) || 4 })}
                className="form-input-neo"
              />
            </div>

            <div className="form-group-neo">
              <label className="form-label-neo">Target Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="form-input-neo"
              />
            </div>
          </div>

          <div className="form-group-neo">
            <label className="form-label-neo">Project Description *</label>
            <textarea
              placeholder="Describe what your project is about and what you want to achieve..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input-neo"
              rows="3"
              required
            />
          </div>

          <div className="form-group-neo">
            <label className="form-label-neo">Required Skills (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, UI/UX, Python"
              value={formData.requiredSkills}
              onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
              className="form-input-neo"
            />
          </div>
        </form>
      </Modal>

      {/* Modal 2: View Project Details & Manage Members */}
      {activeProject && (
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title={activeProject.title}
          maxWidth="640px"
          footer={
            <>
              {isOwnerOfActive ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => {
                      setDetailsModalOpen(false);
                      handleOpenEditModal(activeProject);
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => {
                      setDetailsModalOpen(false);
                      handleDeleteProject(activeProject._id);
                    }}
                    className="btn btn-danger btn-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setDetailsModalOpen(false);
                    handleOpenJoin(activeProject);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  🚀 Apply to Join Team
                </button>
              )}
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span className="badge-neo badge-neo-yellow">{activeProject.category}</span>
              <span className="badge-neo badge-neo-mint">● {activeProject.status}</span>
              {activeProject.deadline && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  📅 Target: {new Date(activeProject.deadline).toLocaleDateString()}
                </span>
              )}
            </div>

            <div>
              <span className="form-label-neo" style={{ fontSize: '0.74rem' }}>Project Lead</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <Avatar name={activeProject.owner?.name} size="sm" />
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.92rem' }}>
                  {activeProject.owner?.name} ({activeProject.owner?.department})
                </span>
              </div>
            </div>

            <div>
              <span className="form-label-neo" style={{ fontSize: '0.74rem' }}>Description</span>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 4 }}>
                {activeProject.description}
              </p>
            </div>

            {/* Required Skills */}
            {activeProject.requiredSkills && activeProject.requiredSkills.length > 0 && (
              <div>
                <span className="form-label-neo" style={{ fontSize: '0.74rem' }}>Tech Stack & Required Skills</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                  {activeProject.requiredSkills.map((sk, idx) => (
                    <span key={idx} className="project-tag">
                      #{sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Team Members List */}
            <div>
              <span className="form-label-neo" style={{ fontSize: '0.74rem' }}>
                Team Members ({activeProject.members?.length || 1} of {activeProject.maxMembers || 4})
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
                {activeProject.members?.map((m) => (
                  <div
                    key={m._id || m}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 12px',
                      background: 'var(--white)',
                      border: 'var(--border-black)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <Avatar name={m.name || 'Member'} size="sm" />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', fontWeight: 600 }}>
                      {m.name || 'Student Member'} {m._id === activeProject.owner?._id ? '(Lead)' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Join Requests for Project Owner */}
            {isOwnerOfActive && joinRequests.length > 0 && (
              <div style={{ borderTop: '2px solid var(--black)', paddingTop: 14 }}>
                <span className="form-label-neo" style={{ fontSize: '0.76rem', color: 'var(--warm-yellow)' }}>
                  Pending Applications ({joinRequests.length})
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                  {joinRequests.map((req) => (
                    <div
                      key={req._id}
                      style={{
                        padding: '10px 14px',
                        background: 'var(--warm-yellow)',
                        border: 'var(--border-black)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                      }}
                    >
                      <div>
                        <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}>
                          {req.sender?.name}
                        </strong>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {req.message}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <button
                          onClick={() => handleAcceptApplicant(req._id)}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '3px 8px' }}
                        >
                          ✓ Accept
                        </button>
                        <button
                          onClick={() => handleRejectApplicant(req._id)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '3px 8px' }}
                        >
                          ✕ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal 3: Apply to Join Project */}
      {projectToJoin && (
        <Modal
          isOpen={joinModalOpen}
          onClose={() => setJoinModalOpen(false)}
          title={`Join: ${projectToJoin.title}`}
          maxWidth="480px"
          footer={
            <>
              <button
                type="button"
                onClick={() => setJoinModalOpen(false)}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendJoinRequest}
                className="btn btn-primary btn-sm"
                disabled={submittingJoin}
              >
                {submittingJoin ? 'Sending...' : 'Send Application'}
              </button>
            </>
          }
        >
          <form onSubmit={handleSendJoinRequest}>
            <div style={{ background: 'var(--white)', border: 'var(--border-black)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: 14 }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem' }}>
                Project Lead: <strong>{projectToJoin.owner?.name}</strong>
              </p>
            </div>
            <div className="form-group-neo">
              <label className="form-label-neo">Why do you want to join? (Introduce your skills)</label>
              <textarea
                value={joinMessage}
                onChange={(e) => setJoinMessage(e.target.value)}
                className="form-input-neo"
                rows="3"
                required
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Projects;
