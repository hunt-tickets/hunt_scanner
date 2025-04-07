// src/utils/helpers.ts
export function obtenerTokenEstacion(): string | null {
    return new URLSearchParams(window.location.search).get('token');
  }