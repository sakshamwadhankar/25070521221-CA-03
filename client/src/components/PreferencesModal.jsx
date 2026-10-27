import React, { useState } from 'react';
import Modal from './Modal';
import { useToast } from '../context/ToastContext';

const PreferencesModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [editorFont, setEditorFont] = useState('Space Mono');
  const [compactMode, setCompactMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSave = () => {
    toast.success('Preferences saved successfully!');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Platform Preferences"
      maxWidth="500px"
      footer={
        <>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary btn-sm">
            Save Preferences
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="form-group-neo">
          <label className="form-label-neo">Editorial Font Family</label>
          <select
            className="form-input-neo"
            value={editorFont}
            onChange={(e) => setEditorFont(e.target.value)}
          >
            <option value="Space Mono">Space Mono (Typewriter Serif)</option>
            <option value="DM Mono">DM Mono (Clean Monospace)</option>
            <option value="IBM Plex Mono">IBM Plex Mono</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--white)', border: 'var(--border-black)', borderRadius: 'var(--radius-sm)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.88rem' }}>Dense Dashboard Grid</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Display more skill cards per row</div>
          </div>
          <input
            type="checkbox"
            checked={compactMode}
            onChange={(e) => setCompactMode(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: 'var(--black)' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--white)', border: 'var(--border-black)', borderRadius: 'var(--radius-sm)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.88rem' }}>Sound Notifications</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Play subtle chime when receiving exchange requests</div>
          </div>
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: 'var(--black)' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--white)', border: 'var(--border-black)', borderRadius: 'var(--radius-sm)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.88rem' }}>Campus Activity Digest</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Receive email when new projects in your tech stack are posted</div>
          </div>
          <input
            type="checkbox"
            checked={emailAlerts}
            onChange={(e) => setEmailAlerts(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: 'var(--black)' }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default PreferencesModal;
