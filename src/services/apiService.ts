import { API_URL, ERROR_CODES } from '../utils/constants';
import { obtenerTokenEstacion } from '../utils/helpers';
import { getErrorMessage } from '../utils/errors';

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