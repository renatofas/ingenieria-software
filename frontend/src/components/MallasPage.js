// src/components/MallasPage.js
import React, { useState } from 'react';

const BASE_URL = 'https://www.uai.cl/admision/carreras';

const CARRERAS = [
  {
    nombre: 'Doble Título Arquitectura + Ingeniería Civil Industrial',
    slug: 'doble-titulo-arquitectura-ingenieria'
  },
  {
    nombre: 'Psicología',
    slug: 'psicologia'
  },
  {
    nombre: 'Comunicación Estratégica - Periodismo (Doble Título)',
    slug: 'comunicacion-estrategica-periodismo-doble-titulo'
  },
  {
    nombre: 'Derecho',
    slug: 'derecho'
  },
  {
    nombre: 'Doble Grado Derecho + Ingeniería Comercial',
    slug: 'doble-grado-derecho-ingenieria-comercial'
  },
  {
    nombre: 'Doble Título Ingeniería Comercial + Sociología',
    slug: 'doble-titulo-ingenieria-comercial-sociologia'
  },
  {
    nombre: 'Ingeniería Comercial',
    slug: 'ingenieria-comercial'
  },
  {
    nombre: 'Bachillerato de Ingeniería Comercial',
    slug: 'bachillerato-ingenieria-comercial'
  },
  {
    nombre: 'International Management',
    slug: 'international-management'
  },
  {
    nombre: 'Ingeniería en Negocios y Tecnología',
    slug: 'ingenieria-negocios-tecnologia'
  },
  {
    nombre: 'Ingeniería en Diseño',
    slug: 'ingenieria-diseno'
  },
  {
    nombre: 'Ingeniería en Computer Science',
    slug: 'ingenieria-computer-science'
  },
  {
    nombre: 'Ingeniería Civil Industrial',
    slug: 'ingenieria-civil-industrial'
  },
  {
    nombre: 'Ingeniería Civil Informática',
    slug: 'ingenieria-civil-informatica'
  },
  {
    nombre: 'Ingeniería Civil en Bioingeniería',
    slug: 'ingenieria-civil-bioingenieria'
  },
  {
    nombre: 'Ingeniería Civil en Obras Civiles',
    slug: 'ingenieria-civil-obras-civiles'
  },
  {
    nombre: 'Ingeniería Civil en Energía',
    slug: 'ingenieria-civil-energia'
  },
  {
    nombre: 'Ingeniería Civil Mecánica',
    slug: 'ingenieria-civil-mecanica'
  },
  {
    nombre: 'Ingeniería Civil en Minería',
    slug: 'ingenieria-civil-mineria'
  },
  {
    nombre: 'Bachillerato de Ingeniería Civil',
    slug: 'bachillerato-ingenieria-civil'
  },
  {
    nombre: 'Ingeniería Civil (Plan común)',
    slug: 'ingenieria-civil-plan-comun'
  },
  {
    nombre: 'Ingeniería Aeroespacial',
    slug: 'ingenieria-aeroespacial'
  }
];


export default function MallasPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCarreras = CARRERAS.filter(carrera => {
    const searchLower = searchTerm.toLowerCase();
    return carrera.nombre.toLowerCase().includes(searchLower);
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="minors-page">
      {/* HEADER IGUAL QUE MINORS */}
      <div className="page-header">
        <h2><i className="bi bi-journal-text"></i> Mallas de Carreras UAI</h2>
        <p className="page-subtitle">
          Explora las mallas oficiales de todas las carreras disponibles en la UAI.
        </p>
      </div>

      {/* BUSCADOR IGUAL QUE MINORS */}
      <div className="search-container">
        <div className="search-box">
          <span className="search-icon"><i className="bi bi-search"></i></span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar carrera por nombre…"
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

      {/* TEXTO DE RESULTADOS IGUAL QUE MINORS */}
      {searchTerm && (
        <p className="search-results-info">
          {filteredCarreras.length === 0 
            ? <><i className="bi bi-x-circle"></i> No se encontraron carreras con "{searchTerm}"</>
            : <><i className="bi bi-bar-chart-fill"></i> Mostrando {filteredCarreras.length} de {CARRERAS.length} carreras</>
          }
        </p>
      )}

      {!searchTerm && (
        <p style={{fontSize: '0.9em', color: 'white', marginBottom: '1.5rem'}}>
          <i className="bi bi-bar-chart-fill"></i> Mostrando {CARRERAS.length} carreras (fuente: sitio oficial UAI)
        </p>
      )}

      {/* GRID IGUAL QUE MINORS */}
      <div className="minors-grid">
        {filteredCarreras.length === 0 ? (
          <div className="no-results">
            <p><i className="bi bi-search"></i> No se encontraron carreras que coincidan con tu búsqueda.</p>
            <button onClick={clearSearch} className="clear-filter-button">
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          filteredCarreras.map(carrera => (
            <div
              key={carrera.slug}
              className="minor-card"
              onClick={() => window.open(`${BASE_URL}/${carrera.slug}`, '_blank')}
            >
              <div className="minor-card-header">
                <h3>{carrera.nombre}</h3>
                <span className="minor-badge">Malla</span>
              </div>

              <p className="minor-facultad">
                <i className="bi bi-building"></i> Carrera UAI
              </p>

              <p className="minor-description">
                Revisa la malla oficial de <strong>{carrera.nombre}</strong> en el portal de Admisión UAI.
              </p>

              <div className="minor-footer">
                <span className="minor-cursos">
                  <i className="bi bi-globe"></i> Sitio oficial UAI
                </span>
                <span className="minor-link">
                  Ver malla <i className="bi bi-arrow-right"></i>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}