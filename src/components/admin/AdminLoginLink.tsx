import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminLoginLink() {
  return (
    <Link 
      to="/hidden-admin-login" 
      className="fixed top-0 right-0 z-[1000] p-2 text-transparent hover:text-transparent focus:text-transparent"
      style={{ 
        width: '30px', 
        height: '30px', 
        background: 'transparent', 
        border: 'none' 
      }}
      aria-label="Admin Login"
    />
  );
}