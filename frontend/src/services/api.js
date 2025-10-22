// src/services/api.js
const API_BASE_URL = 'http://localhost:3001/api'; // URL de tu backend

// Función para manejar respuestas
async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error en la API');
  }
  return response.json();
}

// Llama a: POST /api/auth/login
export function apiLogin(email, password) {
  return fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  .then(handleResponse);
}

// Llama a: GET /api/requisitos
export function apiFetchRequirements() {
  return fetch(`${API_BASE_URL}/requisitos`)
    .then(handleResponse);
}

// Llama a: GET /api/requisitos/:id
export function apiFetchRequirementById(id) {
  return fetch(`${API_BASE_URL}/requisitos/${id}`)
    .then(handleResponse);
}