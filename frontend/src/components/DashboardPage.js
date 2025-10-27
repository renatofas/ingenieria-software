// src/components/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { getRequirements } from '../services/firebase';

function DashboardPage({ onSelectRequirement }) {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRequirements = async () => {
      try {
        setLoading(true);
        const data = await getRequirements();
        
        // Ordenar por idRequisito
        const sorted = data.sort((a, b) => a.idRequisito - b.idRequisito);
        
        setRequirements(sorted);
        setError(null);
      } catch (err) {
        console.error('Error al cargar requisitos:', err);
        setError('Error al cargar los requisitos. Intenta recargar la página.');
      } finally {
        setLoading(false);
      }
    };

    loadRequirements();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <p>Cargando requisitos desde Firestore... 🔥</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()}>
          Recargar página
        </button>
      </div>
    );
  }

  if (requirements.length === 0) {
    return (
      <div className="dashboard">
        <h2>Requisitos de Paso a 5º Año</h2>
        <p>No hay requisitos disponibles.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>Requisitos de Paso a 5º Año</h2>
      <p style={{fontSize: '0.9em', color: '#666', marginBottom: '1rem'}}>
        📊 Mostrando {requirements.length} requisitos desde Firebase Firestore
      </p>
      <ul className="requirement-list">
        {requirements.map(req => (
          <li
            key={req.id}
            className="requirement-item"
            onClick={() => onSelectRequirement(req.idRequisito)}
          >
            <strong>{req.titulo}</strong>
            <span className="req-type">{req.tipo}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DashboardPage;