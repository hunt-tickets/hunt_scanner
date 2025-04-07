import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { verifyQRCode, ApiResponse } from '../services/apiService';
import { obtenerTokenEstacion } from '../utils/helpers';

interface ScanPageProps {
  onScanComplete: (result: ApiResponse) => void;
}

const ScanPage: React.FC<ScanPageProps> = ({ onScanComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scannerId = obtenerTokenEstacion();

  useEffect(() => {
    let scanner: Html5Qrcode;
    
    const initializeScanner = async () => {
      try {
        if (!containerRef.current) return;
        
        // Get available cameras
        const devices = await Html5Qrcode.getCameras();
        
        // Find rear camera
        let cameraId = null;
        
        // First try to find a camera with "back" or "rear" or "trasera" in its label
        const rearCamera = devices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('trasera')
        );
        
        if (rearCamera) {
          cameraId = rearCamera.id;
        } else if (devices.length > 0) {
          // If no rear camera was identified, use the first one
          cameraId = devices[0].id;
        }
        
        if (!cameraId) {
          setError("No se pudo acceder a la cámara. Por favor, permite el acceso a la cámara e intenta nuevamente.");
          return;
        }
        
        scanner = new Html5Qrcode("scanner");
        scannerRef.current = scanner;
        
        // Configure scanning options
        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          aspectRatio: window.innerWidth / window.innerHeight,
          showTorchButtonIfSupported: true,
          rememberLastUsedCamera: true,
        };
        
        // Try environment camera first
        try {
          await scanner.start(
            { facingMode: { exact: "environment" } },
            config,
            handleScanSuccess,
            undefined
          );
        } catch (error) {
          // Fallback to specific camera ID
          try {
            await scanner.start(
              cameraId,
              config,
              handleScanSuccess,
              undefined
            );
          } catch (innerError) {
            // Final fallback to any available camera
            try {
              await scanner.start(
                { facingMode: "environment" },
                config,
                handleScanSuccess,
                undefined
              );
            } catch (finalError) {
              setError("No se pudo iniciar el escáner. Verifica los permisos de la cámara e intenta nuevamente.");
            }
          }
        }
      } catch (error) {
        setError("Ocurrió un error al inicializar la cámara. Por favor, intenta nuevamente.");
      }
    };
    
    initializeScanner();
    
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop()
          .catch(error => console.error("Error stopping scanner:", error));
      }
    };
  }, []);
  
  const handleScanSuccess = async (decodedText: string) => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.pause();
      }
      
      const result = await verifyQRCode(decodedText);
      onScanComplete(result);
    } catch (error) {
      setError("Error al procesar el código QR. Intenta nuevamente.");
      
      if (scannerRef.current && scannerRef.current.getState() === Html5QrcodeScannerState.PAUSED) {
        await scannerRef.current.resume();
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col relative">
      {error ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 bg-[#0A0A0A]">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="py-2 px-4 bg-white text-black rounded-md"
          >
            Intentar nuevamente
          </button>
        </div>
      ) : (
        <>
          <div 
            ref={containerRef}
            id="scanner" 
            className="w-full flex-1 relative overflow-hidden"
          >
            {/* Scanner will be mounted here */}
          </div>
          
          <div className="absolute inset-0 pointer-events-none">
            <div className="flex flex-col h-full justify-center items-center">
              <div className="w-64 h-64 border-2 border-white/30 rounded-lg"></div>
              <p className="mt-4 text-white/70">Escaneando</p>
            </div>
          </div>
          
          {scannerId && (
            <div className="absolute bottom-4 left-0 right-0 text-center text-white/50 text-sm">
              Estación: {scannerId}
            </div>
          )}
          
          {loading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <p className="text-white">Verificando código...</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ScanPage;