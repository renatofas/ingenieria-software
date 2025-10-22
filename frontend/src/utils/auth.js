// src/utils/auth.js
const TOKEN_KEY = 'authToken';

// Guarda el token en localStorage
export function login(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

// Remueve el token al cerrar sesión
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

// Verifica si el usuario está autenticado
export function isAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY);
}