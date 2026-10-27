// Generate initials from user name (e.g., "Alex Rivera" -> "AR")
const getInitials = (name) => {
  if (!name) return 'FL';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Return a nice pastel/vibrant gradient or hex based on user name string
const getAvatarGradient = (name = 'User') => {
  const gradients = [
    'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', // Indigo to Purple
    'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', // Blue to Cyan
    'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', // Pink to Rose
    'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)', // Emerald to Teal
    'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', // Amber to Red
    'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', // Violet to Pink
    'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)', // Sky to Indigo
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

module.exports = { getInitials, getAvatarGradient };
