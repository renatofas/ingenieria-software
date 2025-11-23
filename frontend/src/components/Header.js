// src/components/Header.js
import React from 'react';
import { firebaseLogout } from '../services/firebase';
import { getCurrentUser } from '../utils/auth';

function Header({ onLogout, currentView, onNavigate }) {
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

      {/* Menú de navegación */}
      <nav className="header-nav">
        <button 
          className={`nav-button ${currentView === 'dashboard' || currentView === 'requirement-detail' ? 'active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          📋 Requisitos
        </button>
        <button 
          className={`nav-button ${currentView === 'minors' || currentView === 'minor-detail' ? 'active' : ''}`}
          onClick={() => onNavigate('minors')}
        >
          🎓 Minors
        </button>
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </nav>
    </header>
  );
}

export default Header;