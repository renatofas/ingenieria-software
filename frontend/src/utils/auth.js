// src/utils/auth.js
const USER_KEY = 'firebaseUser';

// Guarda el usuario de Firebase en localStorage
export function login(user) {
  const userData = {
    uid: user.uid,
    email: user.email,
    accessToken: user.accessToken
  };
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
}

// Remueve el usuario al cerrar sesión
export function logout() {
  localStorage.removeItem(USER_KEY);
}

// Verifica si el usuario está autenticado
export function isAuthenticated() {
  return !!localStorage.getItem(USER_KEY);
}

// Obtiene el usuario actual
export function getCurrentUser() {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
}

// Obtiene el token de Firebase
export function getFirebaseToken() {
  const user = getCurrentUser();
  return user?.accessToken || null;
}