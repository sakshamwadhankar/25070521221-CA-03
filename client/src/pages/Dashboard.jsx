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
    setRequestMessage(`Hi ${skill.offeredBy?.name}! I saw your "${skill.name}" skill and would love to exchange skills with you.`);
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

  // Handle Request Actions
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
    return (
      <div className="page-container">
        <div className="container">
          <Loader text="Loading your student dashboard from MongoDB..." fullScreen />
        </div>
      </div>
    );
  }

  const { stats, recommendedSkills, recentRequests, activeProjects } = data;

  return (
    <div className="page-container">
      <div className="container">
        {/* Welcome Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%)',
            border: '1px solid #c7d2fe',
            borderRadius: 'var(--radius-xl)',
            padding: '32px 36px',
            marginBottom: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 24,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Avatar name={user?.name} size="xl" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>
                  Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <span className="badge badge-success">Active Student</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                {user?.department} • {user?.year} • {user?.completedExchanges || 0} completed exchanges
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => setAddSkillModalOpen(true)}
              className="btn btn-primary btn-sm"
            >
              ➕ Add Skill
            </button>
            <button
              onClick={() => navigate('/skills')}
              className="btn btn-secondary btn-sm"
            >
              🔍 Find a Skill
            </button>
            <button
              onClick={() => setCreateProjectModalOpen(true)}
              className="btn btn-secondary btn-sm"
            >
              🚀 Create Project
            </button>
            <button
              onClick={() => navigate('/requests')}
              className="btn btn-secondary btn-sm"
            >
              📬 View Requests
            </button>
          </div>
        </div>

        {/* 6 Metric Statistics Cards */}
        <div className="grid grid-cols-3" style={{ marginBottom: 40, gap: 20 }}>
          {/* Card 1 */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}
            >
              💡
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Skills Offered
              </p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                {stats.totalSkillsOffered}
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 'var(--radius-md)',
                background: 'var(--secondary-light)',
                color: 'var(--secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}
            >
              🎯
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Skills Wanted
              </p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                {stats.totalSkillsWanted || stats.totalSkillsOffered}
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 'var(--radius-md)',
                background: 'var(--warning-bg)',
                color: 'var(--warning)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}
            >
              📥
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Pending Received Requests
              </p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                {stats.pendingReceivedRequests}
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 'var(--radius-md)',
                background: '#fdf4ff',
                color: '#a21caf',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}
            >
              📤
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Pending Sent Requests
              </p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                {stats.pendingSentRequests}
              </p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 'var(--radius-md)',
                background: '#f0fdf4',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}
            >
              🚀
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Active Projects
              </p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                {stats.activeProjects}
              </p>
            </div>
          </div>

          {/* Card 6 */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 'var(--radius-md)',
                background: 'var(--success-bg)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}
            >
              🏆
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Completed Exchanges
              </p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                {stats.completedExchanges}
              </p>
            </div>
          </div>
        </div>

        {/* Section: Recent Exchange Requests */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 className="section-title" style={{ fontSize: '1.45rem' }}>Recent Requests</h2>
              <p className="section-subtitle">Your latest incoming and outgoing skill swap requests</p>
            </div>
            <Link to="/requests" className="btn btn-secondary btn-sm">
              View All Requests ➔
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <EmptyState
              icon="🤝"
              title="No exchange requests yet"
              description="Explore skills listed by other classmates or add your own skills to start receiving requests!"
              actionText="Explore Skills"
              onAction={() => navigate('/skills')}
            />
          ) : (
            <div className="grid grid-cols-2" style={{ gap: 18 }}>
              {recentRequests.map((req) => (
                <RequestCard
                  key={req._id}
                  request={req}
                  onAccept={handleAcceptRequest}
                  onReject={handleRejectRequest}
                />
              ))}
            </div>
          )}
        </div>

        {/* Section: Recommended Skills */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 className="section-title" style={{ fontSize: '1.45rem' }}>Recommended Skills for You</h2>
              <p className="section-subtitle">Skills offered by fellow students ready for peer exchange</p>
            </div>
            <Link to="/skills" className="btn btn-secondary btn-sm">
              Explore All Skills ➔
            </Link>
          </div>

          {recommendedSkills.length === 0 ? (
            <EmptyState
              icon="💡"
              title="No recommendations available"
              description="No other skills found right now. Be the first to add one!"
              actionText="Add a Skill"
              onAction={() => setAddSkillModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-3">
              {recommendedSkills.map((skill) => (
                <SkillCard
                  key={skill._id}
                  skill={skill}
                  onRequest={handleOpenExchange}
                />
              ))}
            </div>
          )}
        </div>

        {/* Section: Active Projects */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 className="section-title" style={{ fontSize: '1.45rem' }}>Your Active Projects</h2>
              <p className="section-subtitle">Collaborative student teams and hackathon squads you belong to</p>
            </div>
            <Link to="/projects" className="btn btn-secondary btn-sm">
              Browse All Projects ➔
            </Link>
          </div>

          {activeProjects.length === 0 ? (
            <EmptyState
              icon="🚀"
              title="You haven't joined any projects yet"
              description="Find an exciting project to collaborate on or create your own project squad!"
              actionText="Create Project"
              onAction={() => setCreateProjectModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-2" style={{ gap: 20 }}>
              {activeProjects.map((proj) => (
                <ProjectCard
                  key={proj._id}
                  project={proj}
                  onViewDetails={() => navigate('/projects')}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Skill */}
      <Modal
        isOpen={addSkillModalOpen}
        onClose={() => setAddSkillModalOpen(false)}
        title="Add a Skill to Teach"
      >
        <form onSubmit={handleAddSkill}>
          <div className="form-group">
            <label className="form-label">Skill Name *</label>
            <input
              type="text"
              value={skillForm.name}
              onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
              placeholder="e.g. React & Component Architecture"
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                value={skillForm.category}
                onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                className="form-select"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Proficiency Level *</label>
              <select
                value={skillForm.level}
                onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
                className="form-select"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">What do you want to learn in exchange? *</label>
            <input
              type="text"
              value={skillForm.wantedSkill}
              onChange={(e) => setSkillForm({ ...skillForm, wantedSkill: e.target.value })}
              placeholder="e.g. Figma UI/UX, Python, Spanish..."
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Skill Description *</label>
            <textarea
              value={skillForm.description}
              onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
              placeholder="Describe what you can help other students learn, your project experience, or teaching style..."
              className="form-textarea"
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Your Availability</label>
            <input
              type="text"
              value={skillForm.availability}
              onChange={(e) => setSkillForm({ ...skillForm, availability: e.target.value })}
              placeholder="e.g. Weekday evenings, Saturdays 2-5 PM"
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <button
              type="button"
              onClick={() => setAddSkillModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submittingSkill}
            >
              {submittingSkill ? 'Saving...' : 'Add Skill'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Create Project */}
      <Modal
        isOpen={createProjectModalOpen}
        onClose={() => setCreateProjectModalOpen(false)}
        title="Create a Student Collaboration Project"
      >
        <form onSubmit={handleCreateProject}>
          <div className="form-group">
            <label className="form-label">Project Title *</label>
            <input
              type="text"
              value={projectForm.title}
              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
              placeholder="e.g. Autonomous TechFest Rover"
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                value={projectForm.category}
                onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                className="form-select"
              >
                {['Technical', 'Academic', 'Hackathon', 'Research', 'Creative', 'Social'].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Max Team Members</label>
              <input
                type="number"
                min="2"
                max="10"
                value={projectForm.maxMembers}
                onChange={(e) => setProjectForm({ ...projectForm, maxMembers: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Required Skills (comma-separated)</label>
            <input
              type="text"
              value={projectForm.requiredSkills}
              onChange={(e) => setProjectForm({ ...projectForm, requiredSkills: e.target.value })}
              placeholder="React, Node.js, Figma, Python"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Project Deadline (Optional)</label>
            <input
              type="date"
              value={projectForm.deadline}
              onChange={(e) => setProjectForm({ ...projectForm, deadline: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Project Description *</label>
            <textarea
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              placeholder="Explain the project goals, tech stack, and what role you're looking for teammates to fill..."
              className="form-textarea"
              rows="3"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <button
              type="button"
              onClick={() => setCreateProjectModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submittingProject}
            >
              {submittingProject ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Send Skill Exchange Request */}
      <Modal
        isOpen={exchangeModalOpen}
        onClose={() => setExchangeModalOpen(false)}
        title={`Request Exchange with ${selectedSkill?.offeredBy?.name || 'Student'}`}
      >
        {selectedSkill && (
          <form onSubmit={handleSendRequest}>
            <div style={{ background: 'var(--bg-main)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>You are requesting to learn:</p>
              <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)' }}>
                {selectedSkill.name}
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: 4 }}>
                Wants in exchange: <strong>{selectedSkill.wantedSkill}</strong>
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Personal Message to {selectedSkill.offeredBy?.name} *</label>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                className="form-textarea"
                rows="4"
                placeholder="Introduce yourself, mention what skill you can offer back, and suggest convenient times..."
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setExchangeModalOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submittingRequest}
              >
                {submittingRequest ? 'Sending...' : 'Send Request 🚀'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
