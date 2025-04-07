import React from 'react';
import Button from '../components/Button';

interface IndexPageProps {
  onStartScan: () => void;
}

const IndexPage: React.FC<IndexPageProps> = ({ onStartScan }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black">
      <div className="max-w-md w-full mx-auto mb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-center text-white">Escáner de QR</h1>
          <p className="text-center text-gray-300 text-lg">
            Escanea códigos QR de entradas para verificar su validez
          </p>
        </div>
        
        {/* Ilustración de escaneo */}
        <div className="flex justify-center mb-10">
          <div className="relative w-48 h-48 bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="absolute w-32 h-32 border-2 border-white/40 rounded-lg"></div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="90" 
              height="90" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1" 
              className="text-white/70"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M7 7h.01M17 7h.01M7 17h.01M12 7v5m0 0h5" />
            </svg>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={onStartScan}
        fullWidth={false}
        className="bg-white hover:bg-gray-100 text-black py-4 font-medium text-lg"
        icon={
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="text-black"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        }
      >
        Comenzar a escanear
      </Button>
    </div>
  );
};

export default IndexPage;