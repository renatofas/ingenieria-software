// src/App.js
import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import DashboardPage from './components/DashboardPage';
import RequirementDetail from './components/RequirementDetail';
import { isAuthenticated, logout } from './utils/auth';

// (Opcional: puedes importar CSS de App aquí)
// import './App.css';

function App() {
  // 1. Estado de autenticación
  const [auth, setAuth] = useState(isAuthenticated());

  // 2. Estado de "navegación"
  const [currentViewId, setCurrentViewId] = useState(null);

  // --- Funciones de manejo de estado ---
  const handleLogin = () => {
    setAuth(true);
    setCurrentViewId(null);
  };

  const handleLogout = () => {
    logout();
    setAuth(false);
    setCurrentViewId(null);
  };

  const handleSelectReq = (id) => {
    setCurrentViewId(id);
  };

  const handleBackToDashboard = () => {
    setCurrentViewId(null);
  };

  // --- Renderizado condicional ---

  // Si no está autenticado, mostrar solo LoginPage
  if (!auth) {
    return <LoginPage onLoginSuccess={handleLogin} />;
  }

  // Si está autenticado, mostrar Header + contenido
  return (
    <div className="app-container">
      <Header onLogout={handleLogout} />
      <main>
        {currentViewId === null ? (
          // Mostrar Dashboard (HU-02)
          <DashboardPage onSelectRequirement={handleSelectReq} />
        ) : (
          // Mostrar Detalle (HU-05)
          <RequirementDetail
            requirementId={currentViewId}
            onBack={handleBackToDashboard}
          />
        )}
      </main>
    </div>
  );
}

export default App;