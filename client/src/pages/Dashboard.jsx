import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userService } from '../services/userService';
import { skillService } from '../services/skillService';
import { projectService } from '../services/projectService';
import { requestService } from '../services/requestService';
import Avatar from '../components/Avatar';
import SkillCard from '../components/SkillCard';
import ProjectCard from '../components/ProjectCard';
import RequestCard from '../components/RequestCard';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const CATEGORIES = [
  'Programming',
  'Design',
  'Business',
  'Communication',
  'Languages',
  'Music',
  'Sports',
  'Academics',
  'Other',
];

const Dashboard = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {
      totalSkillsOffered: 0,
      totalSkillsWanted: 0,
      pendingReceivedRequests: 0,
      pendingSentRequests: 0,
      activeProjects: 0,
      completedExchanges: 0,
    },
    recommendedSkills: [],
    recentRequests: [],
    activeProjects: [],
  });

  // Modal states
  const [addSkillModalOpen, setAddSkillModalOpen] = useState(false);
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Add Skill Form State
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'Programming',
    level: 'Intermediate',
    description: '',
    wantedSkill: '',
    availability: 'Flexible / Weekends',
  });
  const [submittingSkill, setSubmittingSkill] = useState(false);

  // Create Project Form State
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    category: 'Technical',
    requiredSkills: '',
    maxMembers: 4,
    deadline: '',
  });
  const [submittingProject, setSubmittingProject] = useState(false);

  // Request Form State
  const [requestMessage, setRequestMessage] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await userService.getDashboardStats();
      if (res?.stats) {
        setData(res);
      }
    } catch (err) {
      toast.error('Could not load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle Add Skill Submit
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!skillForm.name.trim() || !skillForm.description.trim() || !skillForm.wantedSkill.trim()) {
      toast.error('Please fill in skill name, description, and wanted skill');
      return;
    }

    try {
      setSubmittingSkill(true);
      await skillService.createSkill(skillForm);
      toast.success('Skill added to your profile!');
      setAddSkillModalOpen(false);
      setSkillForm({
        name: '',
        category: 'Programming',
        level: 'Intermediate',
        description: '',
        wantedSkill: '',
        availability: 'Flexible / Weekends',
      });
      fetchDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to add skill');
    } finally {
      setSubmittingSkill(false);
    }
  };

  // Handle Create Project Submit
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title.trim() || !projectForm.description.trim()) {
      toast.error('Please enter project title and description');
      return;
    }

    try {
      setSubmittingProject(true);
      await projectService.createProject(projectForm);
      toast.success('Project created successfully!');
      setCreateProjectModalOpen(false);
      setProjectForm({
        title: '',
        description: '',
        category: 'Technical',
        requiredSkills: '',
        maxMembers: 4,
        deadline: '',
      });
      fetchDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to create project');
    } finally {
      setSubmittingProject(false);
    }
  };

  // Handle Send Exchange Request
  const handleOpenExchange = (skill) => {
    setSelectedSkill(skill);
    setRequestMessage(`Hi ${skill.offeredBy?.name}! I saw your "${skill.name}" skill on Edu Exchange and would love to trade skills.`);
    setExchangeModalOpen(true);
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!selectedSkill) return;

    try {
      setSubmittingRequest(true);
      await requestService.createRequest({
        receiverId: selectedSkill.offeredBy._id,
        skillId: selectedSkill._id,
        offeredSkill: 'Open to discuss based on profile',
        wantedSkill: selectedSkill.name,
        message: requestMessage,
      });

      toast.success('Exchange request sent!');
      setExchangeModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to send request');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleAcceptRequest = async (reqId) => {
    try {
      await requestService.acceptRequest(reqId);
      toast.success('Request accepted!');
      fetchDashboardData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRejectRequest = async (reqId) => {
    try {
      await requestService.rejectRequest(reqId);
      toast.info('Request declined');
      fetchDashboardData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return <Loader text="Loading your student dashboard from database..." fullScreen />;
  }

  const { stats, recommendedSkills, recentRequests, activeProjects } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      {/* Top Editorial Grid: Yellow Student Info (Trainer Info) on Left, Project Experience on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, alignItems: 'start' }}>
        
        {/* Left Column: Yellow Student Info Panel directly mirroring reference */}
        <div>
          <h2 style={{ fontSize: '1.85rem', marginBottom: 14 }}>Student info</h2>
          <div
            className="card-neo card-neo-yellow"
            style={{
              padding: '26px',
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            {/* Top row: Avatar + Name + Social Pills */}
            <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: 90,
                  height: 90,
                  border: 'var(--border-black-thick)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.2rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  boxShadow: 'var(--shadow-black-sm)',
                  flexShrink: 0,
                }}
              >
                {user?.name?.substring(0, 2).toUpperCase() || 'ST'}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{user?.name}</h3>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className="badge-neo badge-neo-white" title="Department">{user?.department?.split(' ')[0]}</span>
                    <span className="badge-neo badge-neo-white" title="Year">{user?.year?.split(' ')[0]}</span>
                  </div>
                </div>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {user?.email}
                </div>

                {/* Metric Sub-blocks (Exact layout from reference: 10+ experience, #1 on platform...) */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 8,
                    marginTop: 14,
                  }}
                >
                  <div className="stat-subblock" style={{ padding: '8px 4px' }}>
                    <div className="stat-subblock-num" style={{ fontSize: '1.15rem' }}>{stats.totalSkillsOffered}</div>
                    <div className="stat-subblock-label" style={{ fontSize: '0.64rem' }}>Skills I Teach</div>
                  </div>
                  <div className="stat-subblock" style={{ padding: '8px 4px' }}>
                    <div className="stat-subblock-num" style={{ fontSize: '1.15rem' }}>{stats.totalSkillsWanted || 2}</div>
                    <div className="stat-subblock-label" style={{ fontSize: '0.64rem' }}>I Want To Learn</div>
                  </div>
                  <div className="stat-subblock" style={{ padding: '8px 4px' }}>
                    <div className="stat-subblock-num" style={{ fontSize: '1.15rem' }}>{stats.completedExchanges}</div>
                    <div className="stat-subblock-label" style={{ fontSize: '0.64rem' }}>Exchanges Done</div>
                  </div>
                  <div className="stat-subblock" style={{ padding: '8px 4px' }}>
                    <div className="stat-subblock-num" style={{ fontSize: '1.15rem' }}>{stats.activeProjects}</div>
                    <div className="stat-subblock-label" style={{ fontSize: '0.64rem' }}>Projects Active</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio / statement */}
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {user?.bio || 'College student trading peer skills, mastering new frameworks, and collaborating on student project teams.'}
            </p>

            {/* Action buttons (Black CTA + White CTA like in reference image) */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 6 }}>
              <button
                onClick={() => setAddSkillModalOpen(true)}
                className="btn btn-primary"
                style={{ flex: 1, minWidth: '150px' }}
              >
                ➕ Offer Skill
              </button>
              <button
                onClick={() => setCreateProjectModalOpen(true)}
                className="btn btn-secondary"
                style={{ flex: 1, minWidth: '150px' }}
              >
                🚀 New Project
              </button>
              <Link
                to="/profile"
                className="btn btn-warning"
                style={{ flexShrink: 0 }}
              >
                👤 Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Work experience / Active Projects (Stack of white cards like reference) */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ fontSize: '1.85rem', margin: 0 }}>Active projects</h2>
            <Link to="/projects" className="btn btn-secondary btn-sm">
              View all
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeProjects && activeProjects.length > 0 ? (
              activeProjects.slice(0, 3).map((project) => (
                <div
                  key={project._id}
                  className="card-neo card-neo-white"
                  style={{
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate('/projects')}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      border: 'var(--border-black)',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--cream)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      flexShrink: 0,
                    }}
                  >
                    📁
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {project.title}
                      </strong>
                      <span className="badge-neo badge-neo-mint" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                        {project.status || 'Active'}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      {project.category} • Team of {project.members?.length || 1}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="card-neo card-neo-white"
                style={{ textAlign: 'center', padding: '28px 16px' }}
              >
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  No active projects right now.
                </p>
                <button
                  onClick={() => setCreateProjectModalOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: 10 }}
                >
                  + Create Your First Project
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Reviews & Exchange Activity (Pink Card + White Cards like reference bottom row) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: '1.85rem', margin: 0 }}>Exchange requests & activity</h2>
          <Link to="/requests" className="btn btn-secondary btn-sm">
            Manage requests
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {/* Pink Card with Rating & Wave Chart */}
          <div
            className="card-neo card-neo-pink"
            style={{
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.35rem', fontWeight: 700 }}>
                  ★ 4.9 / 5.0
                </span>
                <span className="badge-neo badge-neo-white">Rating</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700 }}>
                {stats.pendingReceivedRequests + stats.pendingSentRequests} Active Requests
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 2 }}>
                {stats.pendingReceivedRequests} Pending to respond • {stats.pendingSentRequests} Sent out
              </div>
            </div>

            {/* Retro wave chart line from reference */}
            <div style={{ marginTop: 18, paddingTop: 12, borderTop: '2px solid var(--black)' }}>
              <svg className="wave-chart-line" viewBox="0 0 200 40">
                <path d="M 5 25 Q 35 5, 70 22 T 130 12 T 175 25 T 195 8" />
              </svg>
            </div>
          </div>

          {/* Recent Received Requests */}
          <div className="card-neo card-neo-white" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: 12 }}>Pending Exchange Requests</h3>
            {recentRequests && recentRequests.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recentRequests.slice(0, 2).map((req) => (
                  <div
                    key={req._id}
                    style={{
                      padding: '10px 12px',
                      background: 'var(--cream)',
                      border: 'var(--border-black)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem' }}>
                        {req.sender?.name}
                      </strong>
                      <span className="badge-neo badge-neo-yellow" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                        {req.status}
                      </span>
                    </div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Wanted: <strong>{req.wantedSkill}</strong> | Offers: {req.offeredSkill}
                    </p>
                    {req.status === 'pending' && req.receiver?._id === user?._id && (
                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        <button
                          onClick={() => handleAcceptRequest(req._id)}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '3px 8px' }}
                        >
                          ✓ Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(req._id)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '3px 8px' }}
                        >
                          ✕ Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                No pending requests. Explore skills to send a trade request!
              </p>
            )}
          </div>

          {/* Recommended Peer Skills */}
          <div className="card-neo card-neo-mint" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: 12 }}>Recommended For You</h3>
            {recommendedSkills && recommendedSkills.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recommendedSkills.slice(0, 2).map((skill) => (
                  <div
                    key={skill._id}
                    style={{
                      padding: '10px 12px',
                      background: 'var(--white)',
                      border: 'var(--border-black)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}>
                        {skill.name}
                      </strong>
                      <span className="badge-neo badge-neo-yellow" style={{ fontSize: '0.68rem' }}>
                        {skill.level}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                      Offered by {skill.offeredBy?.name} ({skill.offeredBy?.department})
                    </div>
                    <button
                      onClick={() => handleOpenExchange(skill)}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                    >
                      🤝 Request Trade
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Discover new skills in the marketplace.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal 1: Add Skill */}
      <Modal
        isOpen={addSkillModalOpen}
        onClose={() => setAddSkillModalOpen(false)}
        title="Offer a New Skill"
        maxWidth="540px"
        footer={
          <>
            <button
              type="button"
              onClick={() => setAddSkillModalOpen(false)}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddSkill}
              className="btn btn-primary btn-sm"
              disabled={submittingSkill}
            >
              {submittingSkill ? 'Adding...' : 'Post Skill to Edu Exchange'}
            </button>
          </>
        }
      >
        <form onSubmit={handleAddSkill}>
          <div className="form-group-neo">
            <label className="form-label-neo">Skill Name *</label>
            <input
              type="text"
              placeholder="e.g. Next.js, Figma Design Systems, Linear Algebra"
              value={skillForm.name}
              onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
              className="form-input-neo"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group-neo">
              <label className="form-label-neo">Category</label>
              <select
                value={skillForm.category}
                onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                className="form-input-neo"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group-neo">
              <label className="form-label-neo">Proficiency</label>
              <select
                value={skillForm.level}
                onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
                className="form-input-neo"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div className="form-group-neo">
            <label className="form-label-neo">What You Can Teach / Description *</label>
            <textarea
              placeholder="Detail what concepts or practical knowledge you can share with a classmate..."
              value={skillForm.description}
              onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
              className="form-input-neo"
              rows="3"
              required
            />
          </div>

          <div className="form-group-neo">
            <label className="form-label-neo">Wanted in Exchange *</label>
            <input
              type="text"
              placeholder="e.g. Docker, Public Speaking, Spanish conversation"
              value={skillForm.wantedSkill}
              onChange={(e) => setSkillForm({ ...skillForm, wantedSkill: e.target.value })}
              className="form-input-neo"
              required
            />
          </div>
        </form>
      </Modal>

      {/* Modal 2: Create Project */}
      <Modal
        isOpen={createProjectModalOpen}
        onClose={() => setCreateProjectModalOpen(false)}
        title="Create Student Project"
        maxWidth="540px"
        footer={
          <>
            <button
              type="button"
              onClick={() => setCreateProjectModalOpen(false)}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateProject}
              className="btn btn-primary btn-sm"
              disabled={submittingProject}
            >
              {submittingProject ? 'Creating...' : 'Launch Project'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateProject}>
          <div className="form-group-neo">
            <label className="form-label-neo">Project Title *</label>
            <input
              type="text"
              placeholder="e.g. AI-Powered Study Assistant, Eco Campus App"
              value={projectForm.title}
              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
              className="form-input-neo"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group-neo">
              <label className="form-label-neo">Category</label>
              <select
                value={projectForm.category}
                onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                className="form-input-neo"
              >
                <option value="Technical">Technical / Coding</option>
                <option value="Design">Design & Creative</option>
                <option value="Research">Academic Research</option>
                <option value="Entrepreneurship">Startup / Pitch</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group-neo">
              <label className="form-label-neo">Max Team Size</label>
              <input
                type="number"
                min="2"
                max="10"
                value={projectForm.maxMembers}
                onChange={(e) => setProjectForm({ ...projectForm, maxMembers: parseInt(e.target.value) || 4 })}
                className="form-input-neo"
              />
            </div>
          </div>

          <div className="form-group-neo">
            <label className="form-label-neo">Project Description *</label>
            <textarea
              placeholder="Outline the project goals, target hackathon, and collaboration structure..."
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              className="form-input-neo"
              rows="3"
              required
            />
          </div>

          <div className="form-group-neo">
            <label className="form-label-neo">Required Skills (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, UI Design, PyTorch"
              value={projectForm.requiredSkills}
              onChange={(e) => setProjectForm({ ...projectForm, requiredSkills: e.target.value })}
              className="form-input-neo"
            />
          </div>
        </form>
      </Modal>

      {/* Modal 3: Request Trade */}
      <Modal
        isOpen={exchangeModalOpen}
        onClose={() => setExchangeModalOpen(false)}
        title={`Request Exchange: ${selectedSkill?.name || 'Skill'}`}
        maxWidth="500px"
        footer={
          <>
            <button
              type="button"
              onClick={() => setExchangeModalOpen(false)}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSendRequest}
              className="btn btn-primary btn-sm"
              disabled={submittingRequest}
            >
              {submittingRequest ? 'Sending...' : 'Send Trade Offer'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSendRequest}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', marginBottom: 14 }}>
            Recipient: <strong>{selectedSkill?.offeredBy?.name}</strong> ({selectedSkill?.offeredBy?.department})
          </p>
          <div className="form-group-neo">
            <label className="form-label-neo">Message</label>
            <textarea
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              className="form-input-neo"
              rows="3"
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
