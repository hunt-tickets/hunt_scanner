// src/utils/errors.ts
import { ERROR_CODES } from './constants';

export function getErrorMessage(errorCode: number): string {
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