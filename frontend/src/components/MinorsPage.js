// src/components/MinorsPage.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

function MinorsPage({ onSelectMinor }) {
  const [minors, setMinors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadMinors = async () => {
      try {
        setLoading(true);
        const minorsCol = collection(db, 'minors');
        const snapshot = await getDocs(minorsCol);
        
        const minorsData = snapshot.docs.map(doc => ({
          id: doc.id,
          idMinor: parseInt(doc.id),
          ...doc.data()
        }));
        
        // Ordenar por idMinor
        const sorted = minorsData.sort((a, b) => a.idMinor - b.idMinor);
        
        setMinors(sorted);
        setError(null);
      } catch (err) {
        console.error('Error al cargar minors:', err);
        setError('Error al cargar los minors. Intenta recargar la página.');
      } finally {
        setLoading(false);
      }
    };

    loadMinors();
  }, []);

  // Filtrar minors según búsqueda
  const filteredMinors = minors.filter(minor => {
    const searchLower = searchTerm.toLowerCase();
    return (
      minor.nombre.toLowerCase().includes(searchLower) ||
      minor.descripcion.toLowerCase().includes(searchLower) ||
      minor.facultad.toLowerCase().includes(searchLower)
    );
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="minors-page">
        <p>🔥 Cargando minors desde Firestore...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="minors-page">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()}>
          Recargar página
        </button>
      </div>
    );
  }

  if (minors.length === 0) {
    return (
      <div className="minors-page">
        <h2>Minors Disponibles</h2>
        <p>No hay minors disponibles.</p>
      </div>
    );
  }

  return (
    <div className="minors-page">
      <div className="page-header">
        <h2>🎓 Minors Disponibles FIC</h2>
        <p className="page-subtitle">
          Explora los programas de especialización disponibles para estudiantes de Ingeniería Civil
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div className="search-container">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar minors por nombre, descripción o facultad..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button 
              className="clear-search-button" 
              onClick={clearSearch}
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Contador de resultados */}
      {searchTerm && (
        <p className="search-results-info">
          {filteredMinors.length === 0 
            ? `❌ No se encontraron minors con "${searchTerm}"`
            : `📊 Mostrando ${filteredMinors.length} de ${minors.length} minors`
          }
        </p>
      )}



      {/* Grid de minors */}
      <div className="minors-grid">
        {filteredMinors.length === 0 ? (
          <div className="no-results">
            <p>🔍 No se encontraron minors que coincidan con tu búsqueda.</p>
            <button onClick={clearSearch} className="clear-filter-button">
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          filteredMinors.map(minor => (
            <div
              key={minor.id}
              className="minor-card"
              onClick={() => onSelectMinor(minor.idMinor)}
            >
              <div className="minor-card-header">
                <h3>{minor.nombre}</h3>
                <span className="minor-badge">Minor</span>
              </div>
              
              <p className="minor-facultad">
                🏛️ {minor.facultad}
              </p>
              
              <p className="minor-description">
                {minor.descripcion}
              </p>
              
              <div className="minor-footer">
                <span className="minor-cursos">
                  📚 {minor.cursos.length} cursos
                </span>
                <span className="minor-link">
                  Ver detalles →
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MinorsPage;