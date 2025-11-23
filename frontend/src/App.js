// src/App.js
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardPage from './components/DashboardPage';
import RequirementDetail from './components/RequirementDetail';
import MinorsPage from './components/MinorsPage';
import MinorDetail from './components/MinorDetail';
import LoginModal from './components/LoginModal';
import AdminSetup from './components/AdminSetup';
import { isAuthenticated, logout, login, getCurrentUser } from './utils/auth';
import { onAuthChange } from './services/firebase';
import { db } from './services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import MallasPage from './components/MallasPage';

function App() {
  // Estados de autenticación
  const [user, setUser] = useState(getCurrentUser());
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Estados de navegación
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedReqId, setSelectedReqId] = useState(null);
  const [selectedMinorId, setSelectedMinorId] = useState(null);
  
  // Estados de setup
  const [needsSetup, setNeedsSetup] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);

  // Listener de Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        login(firebaseUser);
        setUser(getCurrentUser());
      } else {
        logout();
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Verificar si Firestore necesita setup
  useEffect(() => {
    checkFirestoreSetup();
  }, []);

  const checkFirestoreSetup = async () => {
    try {
      setCheckingSetup(true);
      
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

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setUser(getCurrentUser());
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const handleOpenLogin = () => {
    setShowLoginModal(true);
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

  // Si está verificando setup
  if (checkingSetup) {
    return (
      <div className="app-container">
        <Header 
          user={user}
          onOpenLogin={handleOpenLogin}
          onLogout={handleLogout}
          currentView={currentView}
          onNavigate={setCurrentView}
        />
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
        <Header 
          user={user}
          onOpenLogin={handleOpenLogin}
          onLogout={handleLogout}
          currentView={currentView}
          onNavigate={setCurrentView}
        />
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

    // 👉 NUEVO CASO MALLAS
    case 'mallas':
      return <MallasPage />;
    
    default:
      return <DashboardPage onSelectRequirement={handleSelectReq} />;
  }
};

  return (
    <div className="app-container">
      <Header 
        user={user}
        onOpenLogin={handleOpenLogin}
        onLogout={handleLogout}
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'dashboard') {
            handleBackToDashboard();
          } else if (view === 'minors') {
            handleGoToMinors();
          } else if (view === 'mallas') {
            // 👉 limpiamos selecciones y vamos a Mallas
            setSelectedReqId(null);
            setSelectedMinorId(null);
            setCurrentView('mallas');
          } else {
            setCurrentView(view);
          }
        }}
      />
      <main>
        {renderView()}
      </main>

      {/* Modal de Login/Registro */}
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;