// src/components/LoginPage.js
import React, { useState } from 'react';
import { firebaseLogin } from '../services/firebase';
import { login } from '../utils/auth';

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    // Validación del dominio UAI
    if (!email.endsWith('@alumnos.uai.cl')) {
      setError('Debes usar un email institucional @alumnos.uai.cl');
      setLoading(false);
      return;
    }

    // Validación de contraseña
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setLoading(false);
      return;
    }

    try {
      // 🔥 Login con Firebase
      const userCredential = await firebaseLogin(email, password);
      const user = userCredential.user;

      // Guardar usuario en localStorage
      login(user);

      // Notificar éxito
      onLoginSuccess();
    } catch (err) {
      console.error('Error en login:', err);
      
      // Mensajes de error personalizados
      let errorMessage = 'Error al iniciar sesión';
      
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este email. ¿Necesitas registrarte?';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
          break;
        default:
          errorMessage = err.message;
      }
      
      setError(errorMessage);
      setLoading(false);
    }
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
      
      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
          📧 Usa tu email @alumnos.uai.cl<br />
          🔒 Contraseña mínima: 8 caracteres
        </p>
      </div>
    </div>
  );
}

export default LoginPage;