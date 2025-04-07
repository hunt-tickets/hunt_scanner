import { API_URL, ERROR_CODES } from '../utils/constants';
import { obtenerTokenEstacion } from '../utils/helpers';

export interface ApiResponse {
  status: string;
  message: string;
  ticketInfo?: string;
  friendly?: string;
  code?: number;
  data?: {
    type?: string;
    [key: string]: any;
  };
}

// Incluir la función directamente para evitar referencias circulares
function getErrorMessage(errorCode: number): string {
  switch (errorCode) {
    case ERROR_CODES.QR_ALREADY_USED:
      return "Este ticket ya ha sido utilizado. Cada ticket solo puede usarse una vez.";
    case ERROR_CODES.QR_EXPIRED:
      return "Este ticket ha expirado. Por favor, verifica la fecha y hora válidas en tu ticket.";
    case ERROR_CODES.QR_NOT_FOUND:
      return "Este código QR no está reconocido en nuestro sistema. Asegúrate de escanear un código QR de ticket válido.";
    case ERROR_CODES.INVALID_QR_DATA:
      return "El formato del código QR no es válido. Asegúrate de escanear un código QR oficial de ticket.";
    case ERROR_CODES.INVALID_FORMAT:
      return "El código QR tiene un formato incorrecto. Asegúrate de escanear el código QR proporcionado con tu ticket.";
    case ERROR_CODES.INVALID_TOKEN:
      return "La estación de escaneo no está autorizada. Por favor, contacta al personal del evento.";
    case ERROR_CODES.SERVER_ERROR:
      return "Ocurrió un error en el servidor. Intenta nuevamente o contacta a soporte si el problema persiste.";
    default:
      return "Ocurrió un error al procesar el código QR. Intenta nuevamente o contacta a soporte.";
  }
}

export async function verifyQRCode(scanResult: string): Promise<ApiResponse> {
  const scannerId = obtenerTokenEstacion();
  
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        result: scanResult,
        scannerId: scannerId || null
      })
    });
    
    if (!response.ok) {
      // Handle error response
      const errorText = await response.text();
      let errorData = { 
        status: "error",
        message: `Error HTTP: ${response.status}`,
        code: ERROR_CODES.SERVER_ERROR
      };
      
      try { errorData = JSON.parse(errorText); } 
      catch (e) { /* Parse error */ }
      
      return {
        status: "error",
        message: errorData.message || `Error HTTP: ${response.status}`,
        code: errorData.code || ERROR_CODES.SERVER_ERROR,
        friendly: getErrorMessage(errorData.code || ERROR_CODES.SERVER_ERROR)
      };
    }
    
    const responseData = await response.json();
    return {
      status: responseData.status || "success",
      message: responseData.message || "Ticket validado correctamente",
      ticketInfo: responseData.ticketInfo,
      friendly: responseData.friendly,
      code: responseData.code,
      data: responseData.data || {}
    };
  } catch (error) {
    // Network error handling
    const errorMessage = error instanceof Error 
      ? (error.name === 'TypeError' && error.message.includes('fetch') 
          ? "Error de conexión" : error.message)
      : "Error desconocido";
    
    return {
      status: "error",
      message: errorMessage,
      code: ERROR_CODES.SERVER_ERROR,
      friendly: "Error de conexión. Comprueba tu internet e intenta nuevamente."
    };
  }
}