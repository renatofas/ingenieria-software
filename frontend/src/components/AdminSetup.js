// src/components/AdminSetup.js
import React, { useState } from 'react';
import { seedFirestore } from '../utils/seedFirestore';

function AdminSetup({ onComplete }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSeed = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await seedFirestore();
      setMessage('✅ Base de datos poblada exitosamente! Recargando...');
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(`❌ Error: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '3rem auto',
      padding: '2rem',
      background: '#f8f9fa',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h2>🔧 Configuración Inicial</h2>
      <p>Parece que tu base de datos Firestore está vacía.</p>
      <p>Click en el botón para poblarla con los datos iniciales:</p>
      
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
        {loading ? '⏳ Poblando base de datos...' : '🌱 Poblar Firestore'}
      </button>

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
        <p>Crea 5 requisitos en tu base de datos Firestore:</p>
        <ul style={{textAlign: 'left', display: 'inline-block'}}>
          <li>Créditos Académicos Totales</li>
          <li>Curso Específico: Ética</li>
          <li>Actividad Extracurricular</li>
          <li>Requisito Administrativo: Biblioteca</li>
          <li>Inscripción Trabajo de Titulación</li>
        </ul>
      </div>
    </div>
  );
}

export default AdminSetup;