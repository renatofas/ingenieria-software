// src/components/AdminSetup.js
import React, { useState } from 'react';
import { seedFirestoreComplete } from '../utils/seedFirestoreComplete';

function AdminSetup({ onComplete }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const handleSeed = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    setStats(null);

    try {
      const result = await seedFirestoreComplete();
      setStats(result.stats);
      setMessage('✅ Base de datos poblada exitosamente! Recargando...');
      
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (err) {
      setError(`❌ Error: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '700px',
      margin: '3rem auto',
      padding: '2rem',
      background: '#f8f9fa',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h2>🔧 Configuración Inicial</h2>
      <p>Parece que tu base de datos Firestore está vacía.</p>
      <p>Click en el botón para poblarla con los datos oficiales de la UAI:</p>
      
      <button 
        onClick={handleSeed} 
        disabled={loading}
        style={{
          marginTop: '1.5rem',
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '⏳ Poblando base de datos...' : '🌱 Poblar Firestore con Datos Reales'}
      </button>

      {stats && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#d4edda',
          borderRadius: '4px',
          textAlign: 'left'
        }}>
          <p style={{margin: '0.5rem 0', fontWeight: 'bold'}}>
            📊 Datos poblados:
          </p>
          <ul style={{margin: '0.5rem 0', paddingLeft: '2rem'}}>
            <li>✅ {stats.requisitos} Requisitos de 5º año</li>
            <li>✅ {stats.minors} Minors FIC</li>
            <li>✅ {stats.menciones} Menciones disponibles</li>
          </ul>
        </div>
      )}

      {message && (
        <p style={{color: '#28a745', marginTop: '1rem', fontWeight: 'bold'}}>
          {message}
        </p>
      )}

      {error && (
        <p style={{color: '#dc3545', marginTop: '1rem'}}>
          {error}
        </p>
      )}

      <div style={{marginTop: '2rem', fontSize: '0.9em', color: '#666'}}>
        <p><strong>¿Qué hace esto?</strong></p>
        <p>Crea en Firestore:</p>
        <ul style={{textAlign: 'left', display: 'inline-block'}}>
          <li>📋 6 Requisitos de paso a 5º año</li>
          <li>🎓 7 Minors oficiales FIC (con cursos reales)</li>
          <li>🏆 3 Menciones de Ingeniería Civil</li>
        </ul>
        <p style={{marginTop: '1rem', fontStyle: 'italic'}}>
          Todos los datos son oficiales de la UAI 2024
        </p>
      </div>
    </div>
  );
}

export default AdminSetup;