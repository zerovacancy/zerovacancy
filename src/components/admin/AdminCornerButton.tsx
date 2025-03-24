import React from 'react';
import { Link } from 'react-router-dom';

export const AdminCornerButton = () => {
  return (
    <Link
      to="/hidden-admin-login"
      className="fixed top-0 right-0 z-[9999]"
      style={{
        width: '20px',
        height: '20px',
        background: 'transparent',
        color: 'transparent',
        border: 'none',
        padding: 0,
        margin: 0,
        cursor: 'default',
        pointerEvents: 'auto',
        opacity: 0
      }}
      aria-label="Admin login"
    />
  );
};

export default AdminCornerButton;