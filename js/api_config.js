/**
 * api_config.js — Configuración de la API del Backend (Directa)
 */

const API_BASE_URL = "http://192.168.2.9:3000/api";

let __apiOnline = true;

function _updateBackendOnlineStatus(isOnline, mensaje) {
  if (__apiOnline === isOnline) return;
  __apiOnline = isOnline;

  if (
    typeof window !== "undefined" &&
    typeof window.setBackendConnectionStatus === "function"
  ) {
    window.setBackendConnectionStatus(isOnline, mensaje);
  }
}

async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos de timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);
    const data = await response.json();

    if (!response.ok) {
      _updateBackendOnlineStatus(false, `HTTP ${response.status}`);
      throw new Error(data.error || "Error en la petición");
    }

    _updateBackendOnlineStatus(true);
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      error.message = "Tiempo de espera agotado (Timeout)";
    }
    _updateBackendOnlineStatus(false, error.message);
    throw error;
  }
}
