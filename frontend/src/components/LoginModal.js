// src/components/LoginModal.js
import React, { useState } from 'react';
import { firebaseLogin, firebaseSignup } from '../services/firebase';
import { login } from '../utils/auth';

function LoginModal({ onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' o 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [carrera, setCarrera] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Lista de carreras agrupadas
  const carrerasAgrupadas = [
    {
      grupo: "🎓 Ingeniería Civil",
      opciones: [
        { value: "civil_informatica", label: "Ingeniería Civil Informática" },
        { value: "civil_industrial", label: "Ingeniería Civil Industrial" },
        { value: "civil_obras", label: "Ingeniería Civil en Obras Civiles" },
        { value: "civil_energia", label: "Ingeniería Civil en Energía" },
        { value: "civil_mecanica", label: "Ingeniería Civil Mecánica" },
        { value: "civil_mineria", label: "Ingeniería Civil en Minería" },
        { value: "civil_bioingenieria", label: "Ingeniería Civil en Bioingeniería" },
        { value: "bachillerato_civil", label: "Bachillerato de Ingeniería Civil" }
      ]
    },
    {
      grupo: "💼 Otras Ingenierías",
      opciones: [
        { value: "ing_comercial", label: "Ingeniería Comercial" },
        { value: "computer_science", label: "Ingeniería en Computer Science" },
        { value: "negocios_tech", label: "Ingeniería en Negocios y Tecnología" },
        { value: "ing_diseno", label: "Ingeniería en Diseño" },
        { value: "bachillerato_comercial", label: "Bachillerato de Ingeniería Comercial" }
      ]
    },
    {
      grupo: "🌍 Programas Internacionales",
      opciones: [
        { value: "international_mgmt", label: "International Management" }
      ]
    },
    {
      grupo: "📚 Otras Carreras",
      opciones: [
        { value: "psicologia", label: "Psicología" },
        { value: "derecho", label: "Derecho" },
        { value: "comunicacion", label: "Comunicación Estratégica - Periodismo" }
      ]
    },
    {
      grupo: "🎯 Programas Dobles",
      opciones: [
        { value: "doble_arquitectura_civil", label: "Doble Título Arquitectura + Ing. Civil Industrial" },
        { value: "doble_derecho_comercial", label: "Doble Grado Derecho + Ing. Comercial" },
        { value: "doble_comercial_sociologia", label: "Doble Título Ing. Comercial + Sociología" }
      ]
    },
    {
      grupo: "➕ Otros",
      opciones: [
        { value: "otra", label: "Otra carrera" }
      ]
    }
  ];

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
      if (mode === 'register') {
        // REGISTRO
        if (password !== confirmPassword) {
          setError('Las contraseñas no coinciden');
          setLoading(false);
          return;
        }

        if (!nombre.trim()) {
          setError('El nombre es obligatorio');
          setLoading(false);
          return;
        }

        if (!carrera) {
          setError('Debes seleccionar tu carrera');
          setLoading(false);
          return;
        }

        const userCredential = await firebaseSignup(email, password);
        const user = userCredential.user;

        // Guardar usuario con datos adicionales
        const userData = {
          uid: user.uid,
          email: user.email,
          nombre: nombre,
          carrera: carrera,
          accessToken: user.accessToken
        };
        
        login(userData);
        onLoginSuccess();
      } else {
        // LOGIN
        const userCredential = await firebaseLogin(email, password);
        const user = userCredential.user;

        // Guardar usuario
        login(user);
        onLoginSuccess();
      }
    } catch (err) {
      console.error('Error en autenticación:', err);
      
      let errorMessage = 'Error al procesar la solicitud';
      
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este email. ¿Quieres registrarte?';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Ya existe una cuenta con este email';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña es muy débil';
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

  // Obtener el nombre legible de la carrera seleccionada
  const getCarreraLabel = (value) => {
    for (const grupo of carrerasAgrupadas) {
      const opcion = grupo.opciones.find(op => op.value === value);
      if (opcion) return opcion.label;
    }
    return '';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <i className="bi bi-x-lg"></i>
        </button>
        
        <div className="modal-header">
          <h2>
            {mode === 'login' 
              ? <><i className="bi bi-lock"></i> Iniciar Sesión</> 
              : <><i className="bi bi-pencil-square"></i> Crear Cuenta</>
            }
          </h2>
          <p className="modal-subtitle">
            {mode === 'login' 
              ? 'Accede con tu email institucional UAI' 
              : 'Regístrate para personalizar tu experiencia'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label htmlFor="nombre">Nombre Completo</label>
                <input
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Juan Pérez González"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="carrera">Carrera</label>
                <select
                  id="carrera"
                  value={carrera}
                  onChange={(e) => setCarrera(e.target.value)}
                  className="carrera-select"
                  required
                >
                  <option value="">-- Selecciona tu carrera --</option>
                  {carrerasAgrupadas.map((grupo, index) => (
                    <optgroup key={index} label={grupo.grupo}>
                      {grupo.opciones.map((opcion) => (
                        <option key={opcion.value} value={opcion.value}>
                          {opcion.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {carrera && (
                  <p className="carrera-help-text">
                    Has seleccionado: <strong>{getCarreraLabel(carrera)}</strong>
                  </p>
                )}
              </div>
            </>
          )}

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
              placeholder="Mínimo 8 caracteres"
              minLength={8}
              required
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                minLength={8}
                required
              />
            </div>
          )}

          <button type="submit" disabled={loading} className="modal-submit-button">
            {loading 
              ? (mode === 'login' ? 'Ingresando...' : 'Creando cuenta...') 
              : (mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </button>

          {error && <p className="error-message">{error}</p>}
        </form>

        <div className="modal-footer">
          {mode === 'login' ? (
            <p>
              ¿No tienes cuenta?{' '}
              <button 
                className="link-button" 
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
              >
                Regístrate aquí
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta?{' '}
              <button 
                className="link-button" 
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
              >
                Inicia sesión
              </button>
            </p>
          )}
        </div>

        <div className="modal-info">
          <p>
            <strong><i className="bi bi-lightbulb"></i> Nota:</strong> El login es opcional. Puedes navegar libremente sin crear una cuenta.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;