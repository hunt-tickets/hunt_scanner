import React from 'react';

interface SuccessCircleProps {
  ticketType?: string;
}

const SuccessCircle: React.FC<SuccessCircleProps> = ({ ticketType = 'General' }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative w-60 h-60 flex items-center justify-center mb-6">
        {/* Círculo exterior con glow effect */}
        <div className="absolute inset-0 rounded-full border-4 border-green-500 shadow-[0_0_25px_rgba(0,255,0,0.5)] animate-pulse"></div>
        
        {/* Círculo interior */}
        <div className="absolute inset-8 rounded-full bg-green-500/10 flex items-center justify-center">
          {/* Checkmark icon */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-20 w-20 text-green-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-3 text-green-400">Entrada Válida</h2>
      <div className="bg-green-900/30 px-6 py-3 rounded-lg">
        <p className="text-xl text-white font-medium">{ticketType}</p>
      </div>
    </div>
  );
};

export default SuccessCircle;