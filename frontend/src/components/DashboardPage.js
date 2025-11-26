// src/components/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { getRequirements } from '../services/firebase';

function DashboardPage({ onSelectRequirement }) {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para la búsqueda
  const [searchTerm, setSearchTerm] = useState('');

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

  // Función para filtrar requisitos según búsqueda
  const filteredRequirements = requirements.filter(req => {
    const searchLower = searchTerm.toLowerCase();
    return (
      req.titulo.toLowerCase().includes(searchLower) ||
      req.descripcion.toLowerCase().includes(searchLower) ||
      req.tipo.toLowerCase().includes(searchLower)
    );
  });

  // Manejar cambio en búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="dashboard">
        <p>Cargando requisitos desde Firestore... <i className="bi bi-fire"></i></p>
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
      
      {/* Barra de búsqueda */}
      <div className="search-container">
        <div className="search-box">
          <span className="search-icon"><i className="bi bi-search"></i></span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar requisitos por título, descripción o tipo..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button 
              className="clear-search-button" 
              onClick={clearSearch}
              title="Limpiar búsqueda"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>
      </div>

      {/* Mostrar resultados de búsqueda */}
      {searchTerm && (
        <p className="search-results-info">
          {filteredRequirements.length === 0 
            ? <><i className="bi bi-x-circle"></i> No se encontraron requisitos con "{searchTerm}"</>
            : <><i className="bi bi-bar-chart-fill"></i> Mostrando {filteredRequirements.length} de {requirements.length} requisitos</>
          }
        </p>
      )}

      {/* Lista de requisitos filtrados */}
      <ul className="requirement-list">
        {filteredRequirements.length === 0 ? (
          <li className="no-results">
            <p><i className="bi bi-search"></i> No se encontraron requisitos que coincidan con tu búsqueda.</p>
            <button onClick={clearSearch} className="clear-filter-button">
              Limpiar búsqueda
            </button>
          </li>
        ) : (
          filteredRequirements.map(req => (
            <li
              key={req.id}
              className="requirement-item"
              onClick={() => onSelectRequirement(req.idRequisito)}
            >
              <div className="requirement-content">
                <strong>{req.titulo}</strong>
                {/* Mostrar coincidencia en descripción si aplica */}
                {searchTerm && req.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) && (
                  <p className="requirement-preview">{req.descripcion.substring(0, 80)}...</p>
                )}
              </div>
              <span className="req-type">{req.tipo}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default DashboardPage;