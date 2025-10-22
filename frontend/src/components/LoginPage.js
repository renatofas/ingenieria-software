// src/components/LoginPage.js
import React, { useState } from 'react';
import { apiLogin } from '../services/api';
import { login } from '../utils/auth';

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    apiLogin(email, password)
      .then(data => {
        login(data.token); // Guarda token en localStorage
        onLoginSuccess();  // Avisa a App.js que el login fue exitoso
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <div className="login-container">
      <h2>Sistema de Centralización</h2>
      <h3>Estudio Mañón 4ever</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Institucional</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nombre.apellido@alumnos.uai.cl"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export default LoginPage;