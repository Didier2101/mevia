/**
 * api_config.js — Configuración de la API del Backend (Directa)
 */

const API_BASE_URL = "http://192.168.2.9:3000/api";

async function apiFetch(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`[API Request] ${options.method || 'GET'} -> ${url}`);

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error(`[API Error] ${endpoint}:`, data);
            throw new Error(data.error || 'Error en la petición');
        }
        
        console.log(`[API Response] ${endpoint}:`, data);
        return data;
    } catch (error) {
        console.error(`[API Fetch Exception] ${endpoint}:`, error);
        throw error;
    }
}
