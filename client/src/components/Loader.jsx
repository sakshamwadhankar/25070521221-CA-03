import React from 'react';

const Loader = ({ text = 'Loading platform data...', fullScreen = false }) => {
  const content = (
    <div className="loader-container">
      <div className="spinner"></div>
      {text && <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', fontWeight: 500 }}>{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
