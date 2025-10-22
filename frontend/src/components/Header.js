// src/components/Header.js
import React from 'react';

function Header({ onLogout }) {
  return (
    <header className="app-header">
      <h1 style={{ fontSize: '1.5em' }}>Estudio Mañón 4ever</h1>
      <button onClick={onLogout}>Cerrar Sesión</button>
    </header>
  );
}

export default Header;