// src/pages/ResultPage.tsx
import React from 'react';
import Button from '../components/Button';
import SuccessCircle from '../components/SuccessCircle';
import ErrorCircle from '../components/ErrorCircle';
import { ApiResponse } from '../services/apiService';
import { getErrorMessage } from '../utils/errors';

interface ResultPageProps {
  result: ApiResponse | null;
  onScanAgain: () => void;
}

const ResultPage: React.FC<ResultPageProps> = ({ result, onScanAgain }) => {
  if (!result) {
    // Redirect if no result
    onScanAgain();
    return null;
  }
  
  const isSuccess = result.status === 'success';
  const ticketType = result.data?.type || 'General';
  const errorMessage = result.friendly || (result.code ? getErrorMessage(result.code) : "Error desconocido");
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="flex-1 flex flex-col items-center justify-center">
        {isSuccess ? (
          <SuccessCircle ticketType={ticketType} />
        ) : (
          <ErrorCircle message={errorMessage} />
        )}
        
        {result.code && !isSuccess && (
          <p className="text-xs text-gray-500 mt-2">Código: {result.code}</p>
        )}
      </div>
      
      <div className="w-full mt-8">
        <Button 
          onClick={onScanAgain}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-black">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M7 7h.01M17 7h.01M7 17h.01M12 7v5m0 0h5" />
            </svg>
          }
        >
          Escanear de nuevo
        </Button>
      </div>
    </div>
  );
};

export default ResultPage;