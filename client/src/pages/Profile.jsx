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
    return <Loader text="Loading student profile from database..." fullScreen />;
  }

  if (!profileUser) {
    return (
      <EmptyState
        icon="👤"
        title="Student Profile Not Found"
        description="The profile you're looking for does not exist or may have been deleted."
        actionText="Browse Students & Skills"
        onAction={() => navigate('/skills')}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      {/* Student Profile Header (Directly matching Yellow Trainer Info panel from reference) */}
      <div>
        <h2 style={{ fontSize: '1.9rem', marginBottom: 14 }}>Student info</h2>
        <div
          className="card-neo card-neo-yellow"
          style={{
            border: 'var(--border-black-thick)',
            boxShadow: 'var(--shadow-black-xl)',
            padding: '32px 28px',
          }}
        >
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Avatar block with thick black border */}
            <div
              style={{
                width: 100,
                height: 100,
                border: 'var(--border-black-thick)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                boxShadow: 'var(--shadow-black-sm)',
                flexShrink: 0,
              }}
            >
              {profileUser.name?.substring(0, 2).toUpperCase() || 'ST'}
            </div>

            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <h1 style={{ fontSize: '1.85rem', margin: 0 }}>{profileUser.name}</h1>
                    {isOwnProfile && <span className="badge-neo badge-neo-black">You</span>}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    {profileUser.email}
                  </div>
                </div>

                {/* Social/Tag pills */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span className="badge-neo badge-neo-white">🎓 {profileUser.department}</span>
                  <span className="badge-neo badge-neo-white">📅 {profileUser.year}</span>
                </div>
              </div>

              {/* 4 Metric Sub-blocks (Exact look as in reference) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                  gap: 10,
                  marginTop: 18,
                  marginBottom: 18,
                }}
              >
                <div className="stat-subblock">
                  <div className="stat-subblock-num">{profileUser.skills?.length || 0}</div>
                  <div className="stat-subblock-label">Skills Taught</div>
                </div>
                <div className="stat-subblock">
                  <div className="stat-subblock-num">{profileUser.wantedSkills?.length || 2}</div>
                  <div className="stat-subblock-label">Wants To Learn</div>
                </div>
                <div className="stat-subblock">
                  <div className="stat-subblock-num">{profileUser.completedExchanges || 0}</div>
                  <div className="stat-subblock-label">Trades Done</div>
                </div>
                <div className="stat-subblock">
                  <div className="stat-subblock-num">{userProjects.length}</div>
                  <div className="stat-subblock-label">Campus Projects</div>
                </div>
              </div>

              {/* Bio */}
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                {profileUser.bio || 'College student trading real skills on Edu Exchange. Interested in hands-on peer collaboration.'}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
                {isOwnProfile ? (
                  <>
                    <button onClick={() => setEditModalOpen(true)} className="btn btn-primary">
                      ✏️ Edit Profile
                    </button>
                    <button onClick={() => setAddSkillModalOpen(true)} className="btn btn-secondary">
                      ➕ Add Skill Listing
                    </button>
                  </>
                ) : (
                  profileUser.skills && profileUser.skills.length > 0 && (
                    <button
                      onClick={() => handleOpenExchange(profileUser.skills[0])}
                      className="btn btn-primary"
                    >
                      🤝 Request Exchange Session
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Offered (I Can Teach) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Skills I can teach</h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Skills offered by {profileUser.name} on the marketplace
            </p>
          </div>
          {isOwnProfile && (
            <button onClick={() => setAddSkillModalOpen(true)} className="btn btn-secondary btn-sm">
              + New Skill
            </button>
          )}
        </div>

        {profileUser.skills && profileUser.skills.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {profileUser.skills.map((skill) => (
              <SkillCard
                key={skill._id}
                skill={{ ...skill, offeredBy: profileUser }}
                onRequest={handleOpenExchange}
                onDelete={isOwnProfile ? handleDeleteSkill : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="card-neo card-neo-white" style={{ textAlign: 'center', padding: '36px 20px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              {isOwnProfile ? 'You haven’t listed any skills yet. Share what you know!' : 'No skills listed yet.'}
            </p>
            {isOwnProfile && (
              <button onClick={() => setAddSkillModalOpen(true)} className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
                + Offer Your First Skill
              </button>
            )}
          </div>
        )}
      </div>

      {/* Skills Desired (I Want to Learn) */}
      <div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: 12 }}>Skills I want to learn</h2>
        <div className="card-neo card-neo-mint" style={{ padding: '22px' }}>
          {profileUser.wantedSkills && profileUser.wantedSkills.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {profileUser.wantedSkills.map((wanted, idx) => (
                <span
                  key={idx}
                  className="badge-neo badge-neo-white"
                  style={{ fontSize: '0.85rem', padding: '6px 14px' }}
                >
                  🎯 {wanted}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              Open to discovering new peer recommendations and tech stacks.
            </p>
          )}
        </div>
      </div>

      {/* Projects Section */}
      <div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: 14 }}>Projects & Collaborations</h2>
        {userProjects && userProjects.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {userProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="card-neo card-neo-white" style={{ textAlign: 'center', padding: '32px 20px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              No campus projects joined yet.
            </p>
            {isOwnProfile && (
              <button onClick={() => navigate('/projects')} className="btn btn-primary btn-sm" style={{ marginTop: 10 }}>
                Explore Student Projects ➔
              </button>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Student Profile"
        maxWidth="520px"
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveProfile}
              className="btn btn-primary btn-sm"
              disabled={savingProfile}
            >
              {savingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveProfile}>
          <div className="form-group-neo">
            <label className="form-label-neo">Full Name</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="form-input-neo"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group-neo">
              <label className="form-label-neo">Department</label>
              <select
                value={editForm.department}
                onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                className="form-input-neo"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="form-group-neo">
              <label className="form-label-neo">Year of Study</label>
              <input
                type="text"
                value={editForm.year}
                onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                placeholder="e.g. 3rd Year (Junior)"
                className="form-input-neo"
              />
            </div>
          </div>

          <div className="form-group-neo">
            <label className="form-label-neo">Student Bio</label>
            <textarea
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              className="form-input-neo"
              rows="3"
            />
          </div>
        </form>
      </Modal>

      {/* Add Skill Modal */}
      <Modal
        isOpen={addSkillModalOpen}
        onClose={() => setAddSkillModalOpen(false)}
        title="Add Skill to Profile"
        maxWidth="520px"
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
              {submittingSkill ? 'Adding...' : 'Add Skill'}
            </button>
          </>
        }
      >
        <form onSubmit={handleAddSkill}>
          <div className="form-group-neo">
            <label className="form-label-neo">Skill Name *</label>
            <input
              type="text"
              placeholder="e.g. Python, Blender 3D, Public Speaking"
              value={newSkillForm.name}
              onChange={(e) => setNewSkillForm({ ...newSkillForm, name: e.target.value })}
              className="form-input-neo"
              required
            />
          </div>

          <div className="form-group-neo">
            <label className="form-label-neo">Description *</label>
            <textarea
              placeholder="What can you teach a classmate?"
              value={newSkillForm.description}
              onChange={(e) => setNewSkillForm({ ...newSkillForm, description: e.target.value })}
              className="form-input-neo"
              rows="3"
              required
            />
          </div>

          <div className="form-group-neo">
            <label className="form-label-neo">Skill Wanted in Exchange *</label>
            <input
              type="text"
              placeholder="e.g. React, UX Design, C++"
              value={newSkillForm.wantedSkill}
              onChange={(e) => setNewSkillForm({ ...newSkillForm, wantedSkill: e.target.value })}
              className="form-input-neo"
              required
            />
          </div>
        </form>
      </Modal>

      {/* Exchange Request Modal */}
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
              onClick={handleSendExchange}
              className="btn btn-primary btn-sm"
              disabled={submittingRequest}
            >
              {submittingRequest ? 'Sending...' : 'Send Trade Offer'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSendExchange}>
          <div className="form-group-neo">
            <label className="form-label-neo">Message to {profileUser.name}</label>
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

export default Profile;
