// src/components/ErrorCircle.tsx
import React from 'react';

interface ErrorCircleProps {
  message: string;
  title?: string;
}

const ErrorCircle: React.FC<ErrorCircleProps> = ({ message, title = 'Error' }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative w-48 h-48 flex items-center justify-center mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.7)]"></div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </div>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-[#D9D9D9]">{message}</p>
    </div>
  );
};

export default ErrorCircle;