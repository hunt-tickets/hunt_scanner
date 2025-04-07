// src/components/SuccessCircle.tsx
import React from 'react';

interface SuccessCircleProps {
  ticketType?: string;
}

const SuccessCircle: React.FC<SuccessCircleProps> = ({ ticketType = 'General' }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative w-48 h-48 flex items-center justify-center mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-green-500 shadow-[0_0_15px_rgba(0,255,0,0.7)]"></div>
      </div>
      <h2 className="text-xl font-bold mb-2">Entrada Válida</h2>
      <p className="text-[#D9D9D9]">{ticketType}</p>
    </div>
  );
};

export default SuccessCircle;