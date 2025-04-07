import { Routes, Route, useNavigate } from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import ScanPage from './pages/ScanPage';
import ResultPage from './pages/ResultPage';
import { useState, useEffect } from 'react';
import { ApiResponse } from './services/apiService';

function App() {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState<ApiResponse | null>(null);
  
  // Verifica si el dispositivo tiene una cámara
  const [hasCameraSupport, setHasCameraSupport] = useState<boolean>(true);
  
  useEffect(() => {
    // Verificar soporte de cámara
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          // Liberar la cámara inmediatamente después de verificar
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
          setHasCameraSupport(true);
        })
        .catch(error => {
          console.error("Error accediendo a la cámara:", error);
          setHasCameraSupport(false);
        });
    } else {
      setHasCameraSupport(false);
    }
  }, []);
  
  const handleScanComplete = (result: ApiResponse) => {
    setScanResult(result);
    navigate('/result');
  };
  
  const handleScanAgain = () => {
    navigate('/scan');
  };
  
  const handleStartScan = () => {
    navigate('/scan');
  };
  
  // Mostrar mensaje de error si no hay soporte de cámara
  if (hasCameraSupport === false) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-md mx-auto text-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 text-red-500 mx-auto mb-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-2xl font-bold mb-4">Cámara no disponible</h1>
          <p className="mb-6">
            No se pudo acceder a la cámara de tu dispositivo. 
            Por favor, verifica que tu dispositivo tenga cámara y hayas concedido los permisos necesarios.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-white text-black font-medium py-3 px-6 rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Routes>
        <Route path="/" element={<IndexPage onStartScan={handleStartScan} />} />
        <Route path="/scan" element={<ScanPage onScanComplete={handleScanComplete} />} />
        <Route path="/result" element={<ResultPage result={scanResult} onScanAgain={handleScanAgain} />} />
      </Routes>
    </div>
  );
}

export default App;