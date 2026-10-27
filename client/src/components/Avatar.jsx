import React from 'react';

const PASTELS = [
  '#FFD447', // Warm Yellow
  '#F4B6E6', // Soft Pink
  '#B7DDBD', // Mint Green
  '#FFA983', // Peach
  '#5EC0F0', // Sky Blue
  '#FFF6E4', // Cream
  '#E8E5DD', // Light Gray
];

export const getAvatarColor = (name = 'User') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PASTELS.length;
  return PASTELS[index];
};

export const getInitials = (name = 'Student') => {
  if (!name) return 'EE';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const Avatar = ({ name = 'Student', size = 'md', className = '' }) => {
  const initials = getInitials(name);
  const background = getAvatarColor(name);

  return (
    <div
      className={`avatar avatar-${size} ${className}`}
      style={{
        backgroundColor: background,
        border: '2px solid #111111',
        color: '#111111',
        fontWeight: 700,
        boxShadow: '2px 2px 0px #111111',
        borderRadius: '4px',
      }}
      title={name}
      aria-label={name}
    >
      {initials}
    </div>
  );
};

export default Avatar;
