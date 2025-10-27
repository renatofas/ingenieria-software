// src/components/Header.js
import React from 'react';
import { firebaseLogout } from '../services/firebase';
import { getCurrentUser } from '../utils/auth';

function Header({ onLogout }) {
  const user = getCurrentUser();

  const handleLogout = async () => {
    try {
      await firebaseLogout();
      onLogout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <header className="app-header">
      <div>
        <h1 style={{ fontSize: '1.5em', margin: 0 }}>Estudio Mañón 4ever</h1>
        {user && (
          <p style={{ fontSize: '0.9em', color: '#666', margin: '0.25rem 0 0 0' }}>
            👤 {user.email}
          </p>
        )}
      </div>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </header>
  );
}

export default Header;