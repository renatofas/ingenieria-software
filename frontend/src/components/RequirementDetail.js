// src/components/RequirementDetail.js
import React, { useState, useEffect } from 'react';
import { getRequirementById } from '../services/firebase';

function RequirementDetail({ requirementId, onBack }) {
  const [req, setReq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRequirement = async () => {
      try {
        setLoading(true);
        const data = await getRequirementById(requirementId);
        setReq(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar requisito:', err);
        setError('No se pudo cargar el requisito.');
      } finally {
        setLoading(false);
      }
    };

    loadRequirement();
  }, [requirementId]);

  // Función para formatear el tipo de requisito
  const formatTipo = (tipo) => {
    const tipos = {
      'CREDITOS_ACADEMICOS': 'Créditos Académicos',
      'CURSO_ESPECIFICO': 'Curso Específico',
      'ACTIVIDAD_EXTRACURRICULAR': 'Actividad Extracurricular',
      'REQUISITO_ADMINISTRATIVO': 'Requisito Administrativo',
      'TRABAJO_TITULACION': 'Trabajo de Titulación'
    };
    return tipos[tipo] || tipo;
  };

  // Función para obtener el color según el tipo
  const getTipoColor = (tipo) => {
    const colores = {
      'CREDITOS_ACADEMICOS': '#007bff',
      'CURSO_ESPECIFICO': '#28a745',
      'ACTIVIDAD_EXTRACURRICULAR': '#ffc107',
      'REQUISITO_ADMINISTRATIVO': '#dc3545',
      'TRABAJO_TITULACION': '#6f42c1'
    };
    return colores[tipo] || '#6c757d';
  };

  if (loading) {
    return (
      <div className="detail-view">
        <button onClick={onBack} className="back-button">← Volver a la lista</button>
        <div className="loading-container">
          <p>🔄 Cargando detalle desde Firestore...</p>
        </div>
      </div>
    );
  }

  if (error || !req) {
    return (
      <div className="detail-view">
        <button onClick={onBack} className="back-button">← Volver a la lista</button>
        <div className="error-container">
          <p className="error-message">
            ❌ {error || 'Error: Requisito no encontrado.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-view">
      {/* Botón de volver */}
      <button onClick={onBack} className="back-button">
        ← Volver a la lista
      </button>

      {/* Header con título y badge */}
      <div className="detail-header">
        <h2>{req.titulo}</h2>
        <span 
          className="tipo-badge" 
          style={{ backgroundColor: getTipoColor(req.tipo) }}
        >
          {formatTipo(req.tipo)}
        </span>
      </div>

      {/* Descripción principal */}
      <div className="detail-section">
        <h3>📋 Descripción</h3>
        <p className="descripcion-text">{req.descripcion}</p>
      </div>

      {/* Información importante */}
      <div className="detail-section">
        <h3>ℹ️ Información Importante</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Obligatorio:</span>
            <span className={`info-value ${req.esObligatorio ? 'obligatorio-si' : 'obligatorio-no'}`}>
              {req.esObligatorio ? '✅ Sí' : '⚠️ No'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Categoría:</span>
            <span className="info-value">{formatTipo(req.tipo)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">ID Requisito:</span>
            <span className="info-value">#{req.idRequisito}</span>
          </div>
        </div>
      </div>

      {/* Sección de documentos */}
      <div className="detail-section">
        <h3>📄 Documentos Relacionados</h3>
        <div className="documentos-container">
          {/* Reglamento Oficial PDF */}
          <button 
            className="documento-button"
            onClick={() => window.open('https://alumno.uai.cl/assets/uploads/2024/04/reglamentos-uai-2024.pdf', '_blank')}
          >
            📥 Descargar Reglamento Oficial (PDF)
          </button>
          
          {/* Nota sobre formulario en Intranet */}
          <div style={{
            padding: '1rem',
            background: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '6px',
            marginTop: '0.5rem'
          }}>
            <p style={{
              margin: 0,
              fontSize: '0.9rem',
              color: '#856404'
            }}>
              📋 <strong>Formulario de Solicitud:</strong> El formulario de solicitud se realiza directamente dentro de la Intranet UAI.
            </p>
          </div>
          
          <p className="documento-nota">
            💡 Los documentos se abrirán en una nueva pestaña
          </p>
        </div>
      </div>

      {/* Información adicional */}
      <div className="detail-section info-adicional">
        <h3>💬 ¿Necesitas más información?</h3>
        <p>Contacta a tu coordinador académico o visita el portal de autoservicio UAI.</p>
        <div className="contacto-buttons">
          {/* Botón Contactar Coordinación - Abre cliente de email */}
          <button 
            className="contacto-button"
            onClick={() => {
              const email = 'secretariadepregrado@uai.cl';
              const subject = `Consulta sobre Requisito: ${req.titulo}`;
              const body = `Hola,%0D%0A%0D%0AMe gustaría obtener más información sobre el requisito "${req.titulo}".%0D%0A%0D%0AGracias.`;
              window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${body}`;
            }}
          >
            📧 Contactar Coordinación
          </button>
          
          {/* Botón Portal UAI - Abre sitio web */}
          <button 
            className="contacto-button"
            onClick={() => window.open('https://www.uai.cl/', '_blank')}
          >
            🌐 Portal UAI
          </button>
        </div>
      </div>

      {/* Footer con metadata */}
      <div className="detail-footer">
        <p>
          🔥 Información cargada desde Firestore | 
          Última actualización: {new Date().toLocaleDateString('es-CL')}
        </p>
      </div>
    </div>
  );
}

export default RequirementDetail;