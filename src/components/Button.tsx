import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  icon, 
  className = '',
  fullWidth = false
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center gap-2 
        ${fullWidth ? 'w-full' : 'max-w-xs mx-auto'} 
        py-4 px-6 
        bg-white text-black font-medium 
        rounded-lg
        transition-colors 
        active:bg-gray-200
        focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;