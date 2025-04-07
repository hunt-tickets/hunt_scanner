import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
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
  
  // Mantener un seguimiento de si el escaneo se ha completado para evitar escaneos duplicados
  const scanCompleted = useRef(false);

  useEffect(() => {
    let scanner: Html5Qrcode;
    
    const initializeScanner = async () => {
      try {
        if (!containerRef.current) return;
        
        // Obtener cámaras disponibles
        const devices = await Html5Qrcode.getCameras();
        
        // Encontrar cámara trasera (prioridad)
        let cameraId = null;
        
        // Buscar cámara con "back", "rear" o "trasera" en su etiqueta
        const rearCamera = devices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('trasera')
        );
        
        if (rearCamera) {
          cameraId = rearCamera.id;
        } else if (devices.length > 0) {
          // Si no hay cámara trasera, usar la primera disponible
          cameraId = devices[0].id;
        }
        
        if (!cameraId) {
          setError("No se pudo acceder a la cámara. Por favor, permite el acceso a la cámara e intenta nuevamente.");
          return;
        }
        
        scanner = new Html5Qrcode("scanner");
        scannerRef.current = scanner;
        
        // Calcular el tamaño óptimo del cuadro de escaneo
        // Usar un valor fijo para asegurar un cuadrado perfecto
        const minDimension = Math.min(window.innerWidth, window.innerHeight) * 0.7; // 70% de la dimensión más pequeña
        const qrboxSize = Math.floor(minDimension);
        
        // Configurar opciones de escaneo optimizadas
        const config = {
          fps: 15, // Aumentar FPS para mejor captura
          qrbox: { width: qrboxSize, height: qrboxSize },
          aspectRatio: 1.0, // Forzar aspect ratio 1:1
          formatsToSupport: [0], // 0 es para QR_CODE
          disableFlip: false, // Permitir flip para mejorar el reconocimiento
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true // Usar API de detección de códigos de barras nativa si está disponible
          },
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true
        };
        
        // Estrategia en cascada para iniciar la cámara
        try {
          // Primero intentar con facingMode "environment" (cámara trasera)
          await scanner.start(
            { facingMode: "environment" },
            config,
            handleScanSuccess,
            handleScanError
          );
        } catch (err1) {
          console.log("Error en primer intento de cámara:", err1);
          // Segundo intento con ID específico de cámara
          try {
            await scanner.start(
              cameraId,
              config,
              handleScanSuccess,
              handleScanError
            );
          } catch (err2) {
            console.log("Error en segundo intento de cámara:", err2);
            // Tercer intento con cualquier cámara disponible
            try {
              await scanner.start(
                { facingMode: "environment" }, // Usar cualquier cámara frontal disponible
                config,
                handleScanSuccess,
                handleScanError
              );
            } catch (err3) {
              console.error("Todos los intentos de cámara fallaron:", err3);
              setError("No se pudo iniciar el escáner. Verifica los permisos de la cámara e intenta nuevamente.");
            }
          }
        }
      } catch (error) {
        console.error("Error al inicializar la cámara:", error);
        setError("Ocurrió un error al inicializar la cámara. Por favor, intenta nuevamente.");
      }
    };
    
    initializeScanner();
    
    // Función para reintentar si hay problemas durante el escaneo
    const autoRetryTimer = setInterval(() => {
      if (scannerRef.current && !scannerRef.current.isScanning && !scanCompleted.current) {
        console.log("Reiniciando escáner automáticamente...");
        initializeScanner();
      }
    }, 5000); // Verificar cada 5 segundos
    
    return () => {
      clearInterval(autoRetryTimer);
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop()
          .catch(error => console.error("Error stopping scanner:", error));
      }
    };
  }, []);
  
  const handleScanError = (error: string | Error) => {
    // Solo mostrar errores críticos que impidan el escaneo, ignorar errores transitorios
    console.warn("Error de escaneo (no crítico):", error);
  };
  
  const handleScanSuccess = async (decodedText: string) => {
    if (loading || scanCompleted.current) return;
    
    // Evitar procesamiento duplicado
    scanCompleted.current = true;
    setLoading(true);
    
    // Feedback auditivo opcional
    try {
      const audio = new Audio('/scan-beep.mp3');  // Asegurarse de tener este archivo o eliminar esta parte
      audio.play().catch(() => console.log('Audio feedback no disponible'));
    } catch (e) {
      // Ignorar errores de audio
    }
    
    try {
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.pause();
      }
      
      console.log("QR escaneado:", decodedText);
      const result = await verifyQRCode(decodedText);
      onScanComplete(result);
    } catch (error) {
      console.error("Error procesando QR:", error);
      setError("Error al procesar el código QR. Intenta nuevamente.");
      
      if (scannerRef.current && scannerRef.current.isScanning) {
        scanCompleted.current = false;
        await scannerRef.current.resume();
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 flex flex-col">
      {error ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 bg-black">
          <p className="text-red-500 mb-4 text-center">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="py-3 px-4 bg-white text-black rounded-lg font-medium"
          >
            Intentar nuevamente
          </button>
        </div>
      ) : (
        <>
          <div 
            ref={containerRef}
            id="scanner" 
            className="w-full h-full absolute inset-0 bg-black"
          >
            {/* Scanner will be mounted here */}
          </div>
          
          {/* Overlay para el cuadro de escaneo */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="flex flex-col h-full justify-center items-center">
              {/* Cuadro de escaneo con animación de pulso */}
              <div className="relative">
                <div className="absolute inset-0 rounded-lg border-2 border-white/70 animate-pulse"></div>
                <div className="w-64 h-64 sm:w-72 sm:h-72 border-2 border-white/40 rounded-lg"></div>
                
                {/* Indicadores en las esquinas para guiar al usuario */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-lg"></div>
              </div>
              
              {/* Instrucciones para el usuario */}
              <p className="mt-6 text-white/90 font-medium text-center px-4">
                Centra el código QR en el recuadro
              </p>
            </div>
          </div>
          
          {/* Indicador de estación */}
          {scannerId && (
            <div className="absolute bottom-4 left-0 right-0 text-center text-white/60 text-sm z-10">
              Estación: {scannerId}
            </div>
          )}
          
          {/* Indicador de carga */}
          {loading && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-30">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-t-2 border-white rounded-full animate-spin mb-4"></div>
                <p className="text-white font-medium">Verificando código...</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ScanPage;