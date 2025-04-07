export const API_URL = "https://jtfcfsnksywotlbsddqb.functions.supabase.co/scan_qr_codes";

export const ERROR_CODES = {
  INVALID_METHOD: 1001,
  INVALID_PAYLOAD: 1002,
  INVALID_QR_DATA: 1003,
  INVALID_FORMAT: 1004,
  INVALID_TOKEN: 1005,
  QR_NOT_FOUND: 2001,
  QR_ALREADY_USED: 2002,
  QR_EXPIRED: 2003,
  TICKET_STATUS_ERROR: 2004,
  SERVER_ERROR: 3001,
  DATABASE_ERROR: 3002,
  SIGNATURE_INVALID: 4001,
  UNAUTHORIZED: 4002
};