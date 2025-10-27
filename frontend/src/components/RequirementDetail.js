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

  if (loading) {
    return (
      <div className="detail-view">
        <button onClick={onBack}>← Volver a la lista</button>
        <p>Cargando detalle desde Firestore... 🔥</p>
      </div>
    );
  }

  if (error || !req) {
    return (
      <div className="detail-view">
        <button onClick={onBack}>← Volver a la lista</button>
        <p className="error-message">
          {error || 'Error: Requisito no encontrado.'}
        </p>
      </div>
    );
  }

  return (
    <div className="detail-view">
      <button onClick={onBack}>← Volver a la lista</button>
      <h2>{req.titulo}</h2>
      <p>{req.descripcion}</p>
      <ul>
        <li><strong>Tipo:</strong> {req.tipo}</li>
        <li><strong>Obligatorio:</strong> {req.esObligatorio ? 'Sí' : 'No'}</li>
        <li style={{fontSize: '0.8em', color: '#666', marginTop: '0.5rem'}}>
          🔥 Cargado desde Firestore
        </li>
      </ul>
    </div>
  );
}

export default RequirementDetail;