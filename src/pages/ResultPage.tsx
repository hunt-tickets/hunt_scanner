import React, { useEffect } from 'react';
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
  useEffect(() => {
    // Intentar reproducir feedback de audio según el resultado
    try {
      const audioFile = result?.status === 'success' 
        ? '/success-sound.mp3' 
        : '/error-sound.mp3';
      
      const audio = new Audio(audioFile);
      audio.play().catch(() => console.log('Audio feedback no disponible'));
    } catch (e) {
      // Ignorar errores de audio
    }
    
    // Vibración como feedback táctil si está soportado
    if (navigator.vibrate) {
      if (result?.status === 'success') {
        navigator.vibrate(200); // Una vibración corta para éxito
      } else {
        navigator.vibrate([100, 100, 100]); // Patrón de vibración para error
      }
    }
  }, [result]);
  
  if (!result) {
    // Redireccionar si no hay resultado
    onScanAgain();
    return null;
  }
  
  const isSuccess = result.status === 'success';
  const ticketType = result.data?.type || 'General';
  const errorMessage = result.friendly || (result.code ? getErrorMessage(result.code) : "Error desconocido");
  
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-between p-6">
      <div className="w-full flex-1 flex flex-col items-center justify-center">
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
          fullWidth={false}
          className="bg-white hover:bg-gray-100 text-black py-3 font-medium"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black">
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