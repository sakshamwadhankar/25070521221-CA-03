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

  // Fetch Skills from real MongoDB API
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
      toast.info('Please sign in to list a skill on Edu Exchange');
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
        toast.success('Skill listed on Edu Exchange!');
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
      `Hi ${skill.offeredBy?.name}! I would love to learn "${skill.name}" from you on Edu Exchange in trade for my skills.`
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: 6 }}>Explore Student Skills</h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Browse {totalSkills} skills offered by students ready to trade knowledge peer-to-peer.
          </p>
        </div>

        <button onClick={handleOpenCreateModal} className="btn btn-primary">
          ➕ Offer a Skill
        </button>
      </div>

      {/* Large Search Bar & Filters Card */}
      <div
        className="card-neo card-neo-yellow"
        style={{ padding: '22px' }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search by skill name, topic, or keyword (e.g. React, Figma, Python)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input-neo"
              style={{ background: 'var(--white)' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }}>
            Search 🔍
          </button>
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                fetchSkills(1, false);
              }}
              className="btn btn-secondary btn-sm"
            >
              Clear
            </button>
          )}
        </form>

        {/* Category Pills */}
        <div style={{ marginBottom: 14 }}>
          <span className="form-label-neo" style={{ fontSize: '0.74rem', display: 'block', marginBottom: 8 }}>
            Filter by Category:
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

        {/* Level Pills */}
        <div>
          <span className="form-label-neo" style={{ fontSize: '0.74rem', display: 'block', marginBottom: 8 }}>
            Proficiency Level:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {LEVELS.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevel(lvl)}
                className={`tab-neo-btn ${level === lvl ? 'active' : ''}`}
                style={{ fontSize: '0.78rem', padding: '5px 12px' }}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      {loading && skills.length === 0 ? (
        <Loader text="Loading marketplace skills from database..." />
      ) : skills.length === 0 ? (
        <EmptyState
          icon="⚡"
          title="No skills found"
          description="No students have listed skills matching this search or filter. Try a broader search or list the first one!"
          actionText="+ Offer This Skill"
          onAction={handleOpenCreateModal}
        />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
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
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <button
                onClick={handleLoadMore}
                className="btn btn-secondary btn-lg"
                disabled={loading}
              >
                {loading ? 'Loading...' : `Load More Skills (${skills.length} of ${totalSkills}) ➔`}
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal 1: Create or Edit Skill */}
      <Modal
        isOpen={skillModalOpen}
        onClose={() => setSkillModalOpen(false)}
        title={isEditing ? 'Edit Skill Listing' : 'List a Skill on Edu Exchange'}
        maxWidth="540px"
        footer={
          <>
            <button
              type="button"
              onClick={() => setSkillModalOpen(false)}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmitSkill}
              className="btn btn-primary btn-sm"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : isEditing ? 'Update Skill' : 'Publish Skill'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmitSkill}>
          <div className="form-group-neo">
            <label className="form-label-neo">Skill Name *</label>
            <input
              type="text"
              placeholder="e.g. React.js, UI/UX in Figma, Python Data Analysis"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              <label className="form-label-neo">Proficiency Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
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
            <label className="form-label-neo">What You Can Teach (Description) *</label>
            <textarea
              placeholder="Explain what topics or projects you can help a student with..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input-neo"
              rows="3"
              required
            />
          </div>

          <div className="form-group-neo">
            <label className="form-label-neo">Skill Desired in Exchange *</label>
            <input
              type="text"
              placeholder="e.g. Graphic Design, Docker, Conversational Japanese"
              value={formData.wantedSkill}
              onChange={(e) => setFormData({ ...formData, wantedSkill: e.target.value })}
              className="form-input-neo"
              required
            />
          </div>

          <div className="form-group-neo">
            <label className="form-label-neo">Availability / Schedule</label>
            <input
              type="text"
              placeholder="e.g. Weekends, Tuesday evenings, Flexible"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="form-input-neo"
            />
          </div>
        </form>
      </Modal>

      {/* Modal 2: Send Exchange Request */}
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
          <div style={{ background: 'var(--cream)', border: 'var(--border-black)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: 14 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem' }}>
              Offering to: <strong>{selectedSkill?.offeredBy?.name}</strong> ({selectedSkill?.offeredBy?.department})
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Skill you want: <strong>{selectedSkill?.name}</strong>
            </p>
          </div>

          <div className="form-group-neo">
            <label className="form-label-neo">Message to Student</label>
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

export default ExploreSkills;
