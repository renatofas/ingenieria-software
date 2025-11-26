// src/components/MinorDetail.js
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

function MinorDetail({ minorId, onBack }) {
  const [minor, setMinor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMinor = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'minors', String(minorId));
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setMinor({
            id: docSnap.id,
            idMinor: parseInt(docSnap.id),
            ...docSnap.data()
          });
          setError(null);
        } else {
          setError('Minor no encontrado');
        }
      } catch (err) {
        console.error('Error al cargar minor:', err);
        setError('No se pudo cargar el minor.');
      } finally {
        setLoading(false);
      }
    };

    loadMinor();
  }, [minorId]);

  if (loading) {
    return (
      <div className="detail-view">
        <button onClick={onBack} className="back-button">
          <i className="bi bi-arrow-left"></i> Volver a minors
        </button>
        <div className="loading-container">
          <p><i className="bi bi-arrow-repeat"></i> Cargando minor desde Firestore...</p>
        </div>
      </div>
    );
  }

  if (error || !minor) {
    return (
      <div className="detail-view">
        <button onClick={onBack} className="back-button">
          <i className="bi bi-arrow-left"></i> Volver a minors
        </button>
        <div className="error-container">
          <p className="error-message">
            <i className="bi bi-x-circle"></i> {error || 'Error: Minor no encontrado.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-view minor-detail">
      {/* Botón de volver */}
      <button onClick={onBack} className="back-button">
        <i className="bi bi-arrow-left"></i> Volver a minors
      </button>

      {/* Header */}
      <div className="detail-header">
        <div>
          <h2>{minor.nombre}</h2>
          <p className="minor-facultad-large">
            <i className="bi bi-building"></i> {minor.facultad}
          </p>
        </div>
        <span className="tipo-badge" style={{ backgroundColor: '#6f42c1' }}>
          Minor
        </span>
      </div>

      {/* Descripción */}
      <div className="detail-section">
        <h3><i className="bi bi-clipboard-check"></i> Descripción del Programa</h3>
        <p className="descripcion-text">{minor.descripcion}</p>
      </div>

      {/* Requisitos */}
      <div className="detail-section">
        <h3><i className="bi bi-pencil-square"></i> Requisitos para Obtener el Minor</h3>
        <div className="requisitos-box">
          <p><strong>{minor.requisitos}</strong></p>
          <p style={{fontSize: '0.9em', color: '#666', marginTop: '0.5rem'}}>
            Debes completar los cursos según los requisitos específicos del programa
          </p>
        </div>
      </div>

      {/* Lista de cursos */}
      <div className="detail-section">
        <h3><i className="bi bi-book"></i> Cursos del Minor ({minor.cursos.length})</h3>
        <div className="cursos-grid">
          {minor.cursos.map((curso, index) => (
            <div key={index} className="curso-card">
              <div className="curso-codigo">{curso.codigo}</div>
              <div className="curso-nombre">{curso.nombre}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Información de contacto */}
      <div className="detail-section info-adicional">
        <h3><i className="bi bi-chat-dots"></i> ¿Tienes dudas sobre este Minor?</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Coordinador:</span>
            <span className="info-value">{minor.coordinador}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Contacto:</span>
            <span className="info-value">{minor.contacto}</span>
          </div>
        </div>
        <div className="contacto-buttons">
          <button 
            className="contacto-button"
            onClick={() => window.open(`mailto:${minor.contacto}`, '_blank')}
          >
            <i className="bi bi-envelope"></i> Enviar Email
          </button>
          <button 
            className="contacto-button"
            onClick={() => window.open('https://alumnosfic.uai.cl/', '_blank')}
          >
            <i className="bi bi-globe"></i> Sitio Web FIC
          </button>
        </div>
      </div>

      {/* Información adicional */}
      <div className="detail-section" style={{background: '#fff3cd', borderLeft: '4px solid #ffc107'}}>
        <h3><i className="bi bi-lightbulb"></i> Información Importante</h3>
        <ul style={{margin: 0, paddingLeft: '1.5rem'}}>
          <li>Los minors complementan tu formación profesional</li>
          <li>Puedes cursar el minor desde 3º año</li>
          <li>El minor aparece en tu certificado de título</li>
          <li>Consulta con tu coordinador de carrera sobre compatibilidad con tu malla</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="detail-footer">
        <p>
          <i className="bi bi-fire"></i> Información cargada desde Firestore | 
          Minor #{minor.idMinor} | 
          Última actualización: {new Date().toLocaleDateString('es-CL')}
        </p>
      </div>
    </div>
  );
}

export default MinorDetail;