import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userService } from '../services/userService';
import { skillService } from '../services/skillService';
import { requestService } from '../services/requestService';
import Avatar from '../components/Avatar';
import SkillCard from '../components/SkillCard';
import ProjectCard from '../components/ProjectCard';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Data Science & AI',
  'Business Administration',
  'Design & Media',
  'Linguistics & Languages',
  'Bioengineering',
  'Economics & Finance',
  'Other',
];

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, updateUser, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Profile Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    department: '',
    year: '',
    bio: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Add Skill Modal
  const [addSkillModalOpen, setAddSkillModalOpen] = useState(false);
  const [newSkillForm, setNewSkillForm] = useState({
    name: '',
    category: 'Programming',
    level: 'Intermediate',
    description: '',
    wantedSkill: '',
    availability: 'Flexible / Weekends',
  });
  const [submittingSkill, setSubmittingSkill] = useState(false);

  // Exchange Request Modal
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // Determine if viewing own profile
  const isOwnProfile = !id || (currentUser && id === currentUser._id);
  const targetUserId = id || currentUser?._id;

  const fetchProfile = async () => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await userService.getUserById(targetUserId);
      if (res?.user) {
        setProfileUser(res.user);
        setUserProjects(res.projects || []);
        if (isOwnProfile) {
          setEditForm({
            name: res.user.name || '',
            department: res.user.department || '',
            year: res.user.year || '',
            bio: res.user.bio || '',
          });
        }
      }
    } catch (err) {
      toast.error('Could not load student profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id, currentUser?._id]);

  // Handle Edit Profile Submission
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await userService.updateProfile(editForm);
      if (res?.user) {
        setProfileUser(res.user);
        updateUser(res.user);
        toast.success('Profile updated successfully!');
        setEditModalOpen(false);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Add Skill from Profile
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillForm.name.trim() || !newSkillForm.description.trim() || !newSkillForm.wantedSkill.trim()) {
      toast.error('Please complete all required fields');
      return;
    }

    try {
      setSubmittingSkill(true);
      await skillService.createSkill(newSkillForm);
      toast.success('Skill added to your profile!');
      setAddSkillModalOpen(false);
      setNewSkillForm({
        name: '',
        category: 'Programming',
        level: 'Intermediate',
        description: '',
        wantedSkill: '',
        availability: 'Flexible / Weekends',
      });
      fetchProfile();
    } catch (err) {
      toast.error(err.message || 'Failed to add skill');
    } finally {
      setSubmittingSkill(false);
    }
  };

  // Handle Delete Skill
  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm('Are you sure you want to remove this skill?')) return;
    try {
      await skillService.deleteSkill(skillId);
      toast.success('Skill removed');
      fetchProfile();
    } catch (err) {
      toast.error(err.message || 'Failed to delete skill');
    }
  };

  // Handle Exchange Request
  const handleOpenExchange = (skill) => {
    if (!isAuthenticated) {
      toast.info('Please log in first to send a request');
      return;
    }
    setSelectedSkill(skill);
    setRequestMessage(`Hi ${profileUser?.name}! I would love to learn "${skill.name}" from you in exchange for skills on my profile.`);
    setExchangeModalOpen(true);
  };

  const handleSendExchange = async (e) => {
    e.preventDefault();
    if (!selectedSkill) return;

    try {
      setSubmittingRequest(true);
      await requestService.createRequest({
        receiverId: profileUser._id,
        skillId: selectedSkill._id,
        offeredSkill: 'Open to discuss based on profile',
        wantedSkill: selectedSkill.name,
        message: requestMessage,
      });

      toast.success('Exchange request sent!');
      setExchangeModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to send request');
    } finally {
      setSubmittingRequest(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="container">
          <Loader text="Loading student profile from MongoDB..." fullScreen />
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="page-container">
        <div className="container">
          <EmptyState
            icon="👤"
            title="Student Profile Not Found"
            description="The profile you're looking for does not exist or may have been deleted."
            actionText="Browse Students & Skills"
            onAction={() => navigate('/skills')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container" style={{ maxWidth: '1080px' }}>
        {/* Profile Banner Card */}
        <div
          className="card"
          style={{
            padding: '36px',
            marginBottom: 36,
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <Avatar name={profileUser.name} size="xl" />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>{profileUser.name}</h1>
                  {isOwnProfile && <span className="badge badge-primary">You</span>}
                  <span className="badge badge-success">
                    ⭐ {profileUser.completedExchanges || 0} Exchanges Completed
                  </span>
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  🏫 {profileUser.department} • 🎓 {profileUser.year}
                </p>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-light)', marginTop: 4 }}>
                  ✉️ {profileUser.email}
                </p>
              </div>
            </div>

            {/* Edit Profile Button */}
            {isOwnProfile ? (
              <button
                onClick={() => setEditModalOpen(true)}
                className="btn btn-secondary"
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <button
                onClick={() => {
                  if (profileUser.offeredSkills && profileUser.offeredSkills.length > 0) {
                    handleOpenExchange(profileUser.offeredSkills[0]);
                  } else {
                    toast.info(`${profileUser.name} does not have any active skills listed yet.`);
                  }
                }}
                className="btn btn-primary"
              >
                🤝 Request Skill Exchange
              </button>
            )}
          </div>

          {/* Bio */}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: 8 }}>
              About
            </h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
              {profileUser.bio || 'This student hasn’t added a bio yet.'}
            </p>
          </div>
        </div>

        {/* Section: Skills the Student Can Teach */}
        <div style={{ marginBottom: 44 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 className="section-title" style={{ fontSize: '1.45rem' }}>
                Skills {isOwnProfile ? 'You Can Teach' : `${profileUser.name.split(' ')[0]} Can Teach`}
              </h2>
              <p className="section-subtitle">
                {profileUser.offeredSkills?.length || 0} skills listed
              </p>
            </div>

            {isOwnProfile && (
              <button
                onClick={() => setAddSkillModalOpen(true)}
                className="btn btn-primary btn-sm"
              >
                ➕ Add Skill
              </button>
            )}
          </div>

          {!profileUser.offeredSkills || profileUser.offeredSkills.length === 0 ? (
            <EmptyState
              icon="💡"
              title="No skills listed yet"
              description={
                isOwnProfile
                  ? 'Share what you know with fellow students! Add your first skill.'
                  : `${profileUser.name} hasn't listed any skills yet.`
              }
              actionText={isOwnProfile ? 'Add a Skill' : null}
              onAction={isOwnProfile ? () => setAddSkillModalOpen(true) : null}
            />
          ) : (
            <div className="grid grid-cols-3">
              {profileUser.offeredSkills.map((skill) => (
                <SkillCard
                  key={skill._id}
                  skill={{ ...skill, offeredBy: profileUser }}
                  onRequest={!isOwnProfile ? handleOpenExchange : null}
                  onDelete={isOwnProfile ? handleDeleteSkill : null}
                />
              ))}
            </div>
          )}
        </div>

        {/* Section: Projects Joined / Created */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 className="section-title" style={{ fontSize: '1.45rem' }}>
                Projects ({userProjects.length})
              </h2>
              <p className="section-subtitle">
                Student collaboration squads and hackathon teams
              </p>
            </div>
            {isOwnProfile && (
              <button
                onClick={() => navigate('/projects')}
                className="btn btn-secondary btn-sm"
              >
                Browse All Projects ➔
              </button>
            )}
          </div>

          {userProjects.length === 0 ? (
            <EmptyState
              icon="🚀"
              title="No collaborative projects joined"
              description={
                isOwnProfile
                  ? 'You haven’t joined any student projects yet. Find one today!'
                  : `${profileUser.name} hasn't joined any projects yet.`
              }
              actionText={isOwnProfile ? 'Explore Projects' : null}
              onAction={isOwnProfile ? () => navigate('/projects') : null}
            />
          ) : (
            <div className="grid grid-cols-2" style={{ gap: 20 }}>
              {userProjects.map((proj) => (
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

      {/* Modal: Edit Profile */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Your Student Profile"
      >
        <form onSubmit={handleSaveProfile}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select
                value={editForm.department}
                onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                className="form-select"
                required
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Year of Study *</label>
              <select
                value={editForm.year}
                onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                className="form-select"
                required
              >
                {['1st Year (Freshman)', '2nd Year (Sophomore)', '3rd Year (Junior)', '4th Year (Senior)', 'Postgraduate', 'PhD'].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              className="form-textarea"
              rows="4"
              placeholder="Tell others what you are studying, your interests, and what you love building..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={savingProfile}
            >
              {savingProfile ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </Modal>

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
              value={newSkillForm.name}
              onChange={(e) => setNewSkillForm({ ...newSkillForm, name: e.target.value })}
              placeholder="e.g. Graphic Design with Illustrator"
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                value={newSkillForm.category}
                onChange={(e) => setNewSkillForm({ ...newSkillForm, category: e.target.value })}
                className="form-select"
              >
                {['Programming', 'Design', 'Business', 'Communication', 'Languages', 'Music', 'Sports', 'Academics', 'Other'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Proficiency Level *</label>
              <select
                value={newSkillForm.level}
                onChange={(e) => setNewSkillForm({ ...newSkillForm, level: e.target.value })}
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
            <label className="form-label">What do you want in exchange? *</label>
            <input
              type="text"
              value={newSkillForm.wantedSkill}
              onChange={(e) => setNewSkillForm({ ...newSkillForm, wantedSkill: e.target.value })}
              placeholder="e.g. Python for Beginners"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Skill Description *</label>
            <textarea
              value={newSkillForm.description}
              onChange={(e) => setNewSkillForm({ ...newSkillForm, description: e.target.value })}
              className="form-textarea"
              rows="3"
              placeholder="Explain how you teach and what topics you can cover..."
              required
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
              {submittingSkill ? 'Adding...' : 'Add Skill'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Exchange Request */}
      <Modal
        isOpen={exchangeModalOpen}
        onClose={() => setExchangeModalOpen(false)}
        title={`Request Exchange with ${profileUser?.name}`}
      >
        {selectedSkill && (
          <form onSubmit={handleSendExchange}>
            <div style={{ background: 'var(--bg-main)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>You want to learn:</p>
              <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)' }}>
                {selectedSkill.name}
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: 4 }}>
                Wanted in exchange: <strong>{selectedSkill.wantedSkill}</strong>
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                className="form-textarea"
                rows="4"
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

export default Profile;
