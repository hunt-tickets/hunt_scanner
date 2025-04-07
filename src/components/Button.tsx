// src/components/Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, icon, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 w-full py-4 px-6 bg-white text-black font-medium rounded-md transition-colors ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;