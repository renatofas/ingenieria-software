// src/components/RequirementDetail.js
import React, { useState, useEffect } from 'react';
import { apiFetchRequirementById } from '../services/api';

function RequirementDetail({ requirementId, onBack }) {
  const [req, setReq] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetchRequirementById(requirementId)
      .then(data => {
        setReq(data);
        setLoading(false);
      });
  }, [requirementId]); // Se ejecuta cada vez que 'requirementId' cambia

  if (loading) {
    return <p>Cargando detalle...</p>;
  }

  if (!req) {
    return <p className="error-message">Error: Requisito no encontrado.</p>;
  }

  return (
    <div className="detail-view">
      <button onClick={onBack}>← Volver a la lista</button>
      <h2>{req.titulo}</h2>
      <p>{req.descripcion}</p>
      <ul>
        <li>Tipo: {req.tipo}</li>
        <li>Obligatorio: {req.esObligatorio ? 'Sí' : 'No'}</li>
      </ul>
    </div>
  );
}

export default RequirementDetail;