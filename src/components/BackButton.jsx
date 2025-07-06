import React from 'react';

const BackButton = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`back-button ${className}`}
    >
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span>Back</span>
    </button>
  );
};

export default BackButton; 