// src/components/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { apiFetchRequirements } from '../services/api';

function DashboardPage({ onSelectRequirement }) {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Se ejecuta 1 vez al cargar el componente
    apiFetchRequirements()
      .then(data => {
        setRequirements(data);
        setLoading(false);
      });
  }, []); // El array vacío asegura que solo se ejecute al montar

  if (loading) {
    return <p>Cargando requisitos...</p>;
  }

  return (
    <div className="dashboard">
      <h2>Requisitos de Paso a 5º Año</h2>
      <ul className="requirement-list">
        {requirements.map(req => (
          <li
            key={req.idRequisito}
            className="requirement-item"
            onClick={() => onSelectRequirement(req.idRequisito)} // HU-05
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