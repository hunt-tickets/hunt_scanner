import React from 'react';

interface ErrorCircleProps {
  message: string;
  title?: string;
}

const ErrorCircle: React.FC<ErrorCircleProps> = ({ message, title = 'Error' }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative w-60 h-60 flex items-center justify-center mb-6">
        {/* Círculo exterior con glow effect */}
        <div className="absolute inset-0 rounded-full border-4 border-red-500 shadow-[0_0_25px_rgba(255,0,0,0.5)] animate-pulse"></div>
        
        {/* Círculo interior */}
        <div className="absolute inset-8 rounded-full bg-red-500/10 flex items-center justify-center">
          {/* X icon */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-20 w-20 text-red-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-3 text-red-400">{title}</h2>
      <div className="bg-red-900/30 px-6 py-3 rounded-lg max-w-xs">
        <p className="text-white">{message}</p>
      </div>
    </div>
  );
};

export default ErrorCircle;