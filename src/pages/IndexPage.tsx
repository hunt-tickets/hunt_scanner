// src/pages/IndexPage.tsx
import React from 'react';
import Button from '../components/Button';

interface IndexPageProps {
  onStartScan: () => void;
}

const IndexPage: React.FC<IndexPageProps> = ({ onStartScan }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Escáner de QR</h1>
      <p className="mb-8 text-center">
        Escanea un código QR para verificar su validez
      </p>
      <Button 
        onClick={onStartScan} 
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-black">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M7 7h.01M17 7h.01M7 17h.01M12 7v5m0 0h5" />
          </svg>
        }
      >
        Comenzar a escanear
      </Button>
    </div>
  );
};

export default IndexPage;