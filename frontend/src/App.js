// src/App.js
import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import DashboardPage from './components/DashboardPage';
import RequirementDetail from './components/RequirementDetail';
import MinorsPage from './components/MinorsPage';
import MinorDetail from './components/MinorDetail';
import AdminSetup from './components/AdminSetup';
import { isAuthenticated, logout, login } from './utils/auth';
import { onAuthChange, collection, getDocs } from './services/firebase';
import { db } from './services/firebase';

function App() {
  const [auth, setAuth] = useState(isAuthenticated());
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'minors', 'menciones'
  const [selectedReqId, setSelectedReqId] = useState(null);
  const [selectedMinorId, setSelectedMinorId] = useState(null);
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
        setCurrentView('dashboard');
        setSelectedReqId(null);
        setSelectedMinorId(null);
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
      
      // Verificar si hay requisitos
      const requisitosCol = collection(db, 'requisitos');
      const snapshot = await getDocs(requisitosCol);
      
      if (snapshot.empty) {
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
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    logout();
    setAuth(false);
    setCurrentView('dashboard');
    setSelectedReqId(null);
    setSelectedMinorId(null);
  };

  // Navegación de Requisitos
  const handleSelectReq = (id) => {
    setSelectedReqId(id);
    setCurrentView('requirement-detail');
  };

  const handleBackToDashboard = () => {
    setSelectedReqId(null);
    setCurrentView('dashboard');
  };

  // Navegación de Minors
  const handleGoToMinors = () => {
    setCurrentView('minors');
    setSelectedMinorId(null);
  };

  const handleSelectMinor = (id) => {
    setSelectedMinorId(id);
    setCurrentView('minor-detail');
  };

  const handleBackToMinors = () => {
    setSelectedMinorId(null);
    setCurrentView('minors');
  };

  const handleSetupComplete = () => {
    setNeedsSetup(false);
    window.location.reload();
  };

  // Si no está autenticado
  if (!auth) {
    return <LoginPage onLoginSuccess={handleLogin} />;
  }

  // Si está verificando setup
  if (checkingSetup) {
    return (
      <div className="app-container">
        <Header onLogout={handleLogout} currentView={currentView} onNavigate={setCurrentView} />
        <main>
          <p style={{textAlign: 'center', marginTop: '3rem'}}>
            🔍 Verificando configuración de Firestore...
          </p>
        </main>
      </div>
    );
  }

  // Si necesita setup
  if (needsSetup) {
    return (
      <div className="app-container">
        <Header onLogout={handleLogout} currentView={currentView} onNavigate={setCurrentView} />
        <main>
          <AdminSetup onComplete={handleSetupComplete} />
        </main>
      </div>
    );
  }

  // Renderizar vista según estado
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage onSelectRequirement={handleSelectReq} />;
      
      case 'requirement-detail':
        return (
          <RequirementDetail
            requirementId={selectedReqId}
            onBack={handleBackToDashboard}
          />
        );
      
      case 'minors':
        return <MinorsPage onSelectMinor={handleSelectMinor} />;
      
      case 'minor-detail':
        return (
          <MinorDetail
            minorId={selectedMinorId}
            onBack={handleBackToMinors}
          />
        );
      
      default:
        return <DashboardPage onSelectRequirement={handleSelectReq} />;
    }
  };

  return (
    <div className="app-container">
      <Header 
        onLogout={handleLogout} 
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'dashboard') handleBackToDashboard();
          if (view === 'minors') handleGoToMinors();
        }}
      />
      <main>
        {renderView()}
      </main>
    </div>
  );
}

export default App;