import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { skillService } from '../services/skillService';
import { requestService } from '../services/requestService';
import SkillCard from '../components/SkillCard';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const CATEGORIES = [
  'All',
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

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

const ExploreSkills = () => {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSkills, setTotalSkills] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');

  // Modals
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState(null);

  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // Skill Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Programming',
    level: 'Intermediate',
    description: '',
    wantedSkill: '',
    availability: 'Flexible / Weekends',
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch Skills
  const fetchSkills = async (targetPage = 1, append = false) => {
    try {
      setLoading(true);
      const params = {
        page: targetPage,
        limit: 9,
        category: category !== 'All' ? category : undefined,
        level: level !== 'All' ? level : undefined,
        search: search.trim() || undefined,
      };

      const res = await skillService.getSkills(params);
      if (res?.skills) {
        if (append) {
          setSkills((prev) => [...prev, ...res.skills]);
        } else {
          setSkills(res.skills);
        }
        setTotalSkills(res.total || 0);
        setTotalPages(res.totalPages || 1);
        setPage(targetPage);
      }
    } catch (err) {
      toast.error('Failed to load skills from database');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills(1, false);
  }, [category, level]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSkills(1, false);
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      fetchSkills(page + 1, true);
    }
  };

  // Open Create Skill Modal
  const handleOpenCreateModal = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in or create an account to list a skill');
      return;
    }
    setIsEditing(false);
    setEditingSkillId(null);
    setFormData({
      name: '',
      category: 'Programming',
      level: 'Intermediate',
      description: '',
      wantedSkill: '',
      availability: 'Flexible / Weekends',
    });
    setSkillModalOpen(true);
  };

  // Open Edit Skill Modal
  const handleOpenEditModal = (skill) => {
    setIsEditing(true);
    setEditingSkillId(skill._id);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      description: skill.description,
      wantedSkill: skill.wantedSkill,
      availability: skill.availability || 'Flexible / Weekends',
    });
    setSkillModalOpen(true);
  };

  // Submit Skill (Create or Edit)
  const handleSubmitSkill = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim() || !formData.wantedSkill.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      if (isEditing) {
        await skillService.updateSkill(editingSkillId, formData);
        toast.success('Skill updated successfully!');
      } else {
        await skillService.createSkill(formData);
        toast.success('Skill listed successfully!');
      }
      setSkillModalOpen(false);
      fetchSkills(1, false);
    } catch (err) {
      toast.error(err.message || 'Error saving skill');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Skill
  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm('Are you sure you want to delete this skill listing?')) {
      return;
    }

    try {
      await skillService.deleteSkill(skillId);
      toast.success('Skill removed');
      fetchSkills(1, false);
    } catch (err) {
      toast.error(err.message || 'Failed to delete skill');
    }
  };

  // Request Exchange Flow
  const handleOpenExchange = (skill) => {
    if (!isAuthenticated) {
      toast.info('Please log in first to send an exchange request');
      return;
    }
    setSelectedSkill(skill);
    setRequestMessage(
      `Hi ${skill.offeredBy?.name}! I would love to learn "${skill.name}" from you in exchange for skills from my profile.`
    );
    setExchangeModalOpen(true);
  };

  const handleSendExchange = async (e) => {
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

      toast.success('Skill exchange request sent successfully!');
      setExchangeModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to send exchange request');
    } finally {
      setSubmittingRequest(false);
    }
  };

  return (
    <div className="page-container">
      <div className="container">
        {/* Page Title & Add Skill Button */}
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
            <h1 className="section-title">Explore Student Skills</h1>
            <p className="section-subtitle">
              Browse {totalSkills} skills offered by students ready to trade knowledge
            </p>
          </div>

          <button onClick={handleOpenCreateModal} className="btn btn-primary">
            ➕ Add a Skill to Teach
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div
          className="card"
          style={{
            padding: '20px 24px',
            marginBottom: 32,
            background: '#ffffff',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}
          >
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by skill name, description, or keyword..."
                className="form-input"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    fetchSkills(1, false);
                  }}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-light)',
                  }}
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
                  style={{
                    cursor: 'pointer',
                    padding: '6px 12px',
                    fontSize: '0.82rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginRight: 10 }}>
              Skill Level:
            </span>
            {LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`badge ${level === lvl ? 'badge-purple' : 'badge-gray'}`}
                style={{
                  cursor: 'pointer',
                  padding: '4px 10px',
                  fontSize: '0.78rem',
                }}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        {loading && skills.length === 0 ? (
          <Loader text="Retrieving skills from MongoDB..." />
        ) : skills.length === 0 ? (
          <EmptyState
            icon="💡"
            title="No skills found matching your filters"
            description="Try choosing another category, resetting search terms, or be the first to offer a skill in this area!"
            actionText="Clear Filters"
            onAction={() => {
              setSearch('');
              setCategory('All');
              setLevel('All');
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-3">
              {skills.map((skill) => (
                <SkillCard
                  key={skill._id}
                  skill={skill}
                  onRequest={handleOpenExchange}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteSkill}
                />
              ))}
            </div>

            {/* Load More Button */}
            {page < totalPages && (
              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <button
                  onClick={handleLoadMore}
                  className="btn btn-secondary btn-lg"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : `Load More Skills (${skills.length} of ${totalSkills})`}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal: Add or Edit Skill */}
      <Modal
        isOpen={skillModalOpen}
        onClose={() => setSkillModalOpen(false)}
        title={isEditing ? 'Edit Skill Listing' : 'List a New Skill to Teach'}
      >
        <form onSubmit={handleSubmitSkill}>
          <div className="form-group">
            <label className="form-label">Skill Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Modern React & Hooks"
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
              <label className="form-label">Proficiency Level *</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
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
              value={formData.wantedSkill}
              onChange={(e) => setFormData({ ...formData, wantedSkill: e.target.value })}
              placeholder="e.g. Figma UI/UX, Python data science, French conversation..."
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Skill Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide details about what topics you can cover, your background, and hands-on projects you've built..."
              className="form-textarea"
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Availability / Preferred Hours</label>
            <input
              type="text"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              placeholder="e.g. Tuesdays 6-8 PM, Saturday mornings"
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <button
              type="button"
              onClick={() => setSkillModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'List Skill'}
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
              <label className="form-label">Personal Message *</label>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                className="form-textarea"
                rows="4"
                placeholder="Introduce yourself, mention what you can offer in return, and suggest a meeting time..."
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

export default ExploreSkills;
