import React from 'react';

export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white/80 backdrop-blur-2xl rounded-2xl shadow-glass border border-white/80 hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
