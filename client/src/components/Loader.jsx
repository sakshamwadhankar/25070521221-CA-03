import React from 'react';

const Loader = ({ text = 'Loading platform data...', fullScreen = false }) => {
  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '40px 20px' }}>
      <div className="spinner"></div>
      {text && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'var(--black)', fontWeight: 700 }}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        style={{
          minHeight: '60vh',
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
