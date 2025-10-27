// src/App.js
import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import DashboardPage from './components/DashboardPage';
import RequirementDetail from './components/RequirementDetail';
import AdminSetup from './components/AdminSetup';
import { isAuthenticated, logout, login } from './utils/auth';
import { onAuthChange, getRequirements } from './services/firebase';

function App() {
  const [auth, setAuth] = useState(isAuthenticated());
  const [currentViewId, setCurrentViewId] = useState(null);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);

  // Listener de Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        login(user);
        setAuth(true);
      } else {
        logout();
        setAuth(false);
        setCurrentViewId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Verificar si Firestore necesita setup
  useEffect(() => {
    if (auth) {
      checkFirestoreSetup();
    }
  }, [auth]);

  const checkFirestoreSetup = async () => {
    try {
      setCheckingSetup(true);
      const requirements = await getRequirements();
      
      if (requirements.length === 0) {
        setNeedsSetup(true);
      } else {
        setNeedsSetup(false);
      }
    } catch (error) {
      console.error('Error al verificar setup:', error);
      setNeedsSetup(true);
    } finally {
      setCheckingSetup(false);
    }
  };

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

  const handleSetupComplete = () => {
    setNeedsSetup(false);
    window.location.reload();
  };

  if (!auth) {
    return <LoginPage onLoginSuccess={handleLogin} />;
  }

  if (checkingSetup) {
    return (
      <div className="app-container">
        <Header onLogout={handleLogout} />
        <main>
          <p style={{textAlign: 'center', marginTop: '3rem'}}>
            🔍 Verificando configuración de Firestore...
          </p>
        </main>
      </div>
    );
  }

  if (needsSetup) {
    return (
      <div className="app-container">
        <Header onLogout={handleLogout} />
        <main>
          <AdminSetup onComplete={handleSetupComplete} />
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header onLogout={handleLogout} />
      <main>
        {currentViewId === null ? (
          <DashboardPage onSelectRequirement={handleSelectReq} />
        ) : (
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