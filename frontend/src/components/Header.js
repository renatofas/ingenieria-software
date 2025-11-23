// src/components/Header.js
import React from 'react';

function Header({ user, onOpenLogin, onLogout, currentView, onNavigate }) {
  return (
    <header className="app-header">
      {/* Logo y título a la izquierda */}
      <div className="header-left">
        <h1 style={{ fontSize: '1.5em', margin: 0 }}>Estudio Mañón 4ever</h1>
        <p style={{ fontSize: '0.85em', color: '#666', margin: '0.25rem 0 0 0' }}>
          Sistema de Centralización Académica UAI
        </p>
      </div>

      {/* Navegación en el centro */}
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
        <button
          className={currentView === 'mallas' ? 'nav-button active' : 'nav-button'}
          onClick={() => onNavigate('mallas')}
        >
          🗺️ Mallas
        </button>
      </nav>

      {/* Login/Usuario a la derecha */}
      <div className="header-right">
        {user ? (
          <div className="user-menu">
            <div className="user-info">
              <span className="user-icon">👤</span>
              <div className="user-details">
                <span className="user-email">{user.email}</span>
                <span className="user-role">Estudiante</span>
              </div>
            </div>
            <button onClick={onLogout} className="logout-button-small">
              Salir
            </button>
          </div>
        ) : (
          <button onClick={onOpenLogin} className="login-button-header">
            🔐 Iniciar Sesión
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;