// backend/server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001; // El backend correrá en el puerto 3001

// --- Middlewares ---
app.use(cors()); // Permite peticiones desde otros dominios (tu frontend)
app.use(express.json()); // Permite al servidor entender JSON

// --- Base de Datos Simulada (Datos del Sprint 1) ---
const mockRequirements = [
  { idRequisito: 1, titulo: "Créditos Académicos Totales", descripcion: "Completar un total de 240 créditos UAI.", tipo: "CREDITOS_ACADEMICOS", esObligatorio: true },
  { idRequisito: 2, titulo: "Curso Específico: Ética", descripcion: "Aprobar el curso ECF-101.", tipo: "CURSO_ESPECIFICO", esObligatorio: true },
  { idRequisito: 3, titulo: "Actividad Extracurricular", descripcion: "Completar 1 actividad.", tipo: "ACTIVIDAD_EXTRACURRICULAR", esObligatorio: false },
  { idRequisito: 4, titulo: "Requisito Administrativo: Biblioteca", descripcion: "Sin deudas.", tipo: "REQUISITO_ADMINISTRATIVO", esObligatorio: true },
  { idRequisito: 5, titulo: "Inscripción Trabajo de Titulación", descripcion: "Inscribir propuesta.", tipo: "TRABAJO_TITULACION", esObligatorio: true }
];

// --- Definición de Endpoints (basado en el informe) ---

// Endpoint: POST /api/auth/login 
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Criterios de HU-01 [cite: 107]
  if (email && email.endsWith('@alumnos.uai.cl') && password && password.length >= 8) {
    res.json({
      token: 'real-jwt-token-from-backend-123',
      user: { nombre: 'Estudiante', apellido: 'UAI', email: email }
    });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas. Use un email @alumnos.uai.cl y contraseña de 8+ caracteres.' });
  }
});

// Endpoint: POST /api/auth/logout 
app.post('/api/auth/logout', (req, res) => {
  // En un backend real, aquí invalidarías el token
  res.json({ message: 'Sesión cerrada exitosamente' });
});

// Endpoint: GET /api/requisitos 
app.get('/api/requisitos', (req, res) => {
  res.json(mockRequirements);
});

// Endpoint: GET /api/requisitos/:id 
app.get('/api/requisitos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const reqEncontrado = mockRequirements.find(r => r.idRequisito === id);

  if (reqEncontrado) {
    res.json(reqEncontrado);
  } else {
    res.status(404).json({ message: 'Requisito no encontrado' });
  }
});

// --- Iniciar Servidor ---
app.listen(PORT, () => {
  console.log(`Backend "Estudio Mañón 4ever" corriendo en http://localhost:${PORT}`);
});