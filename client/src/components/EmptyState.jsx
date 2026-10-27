import React from 'react';

const EmptyState = ({
  icon = '🔍',
  title = 'No items found',
  description = 'There are no items matching your criteria. Try adjusting your search or filters.',
  actionText,
  onAction,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
