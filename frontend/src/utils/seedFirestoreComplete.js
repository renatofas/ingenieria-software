// src/utils/seedFirestoreComplete.js
import { db } from '../services/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

// ========================================
// REQUISITOS DE PASO A 5º AÑO
// ========================================
const requisitos = [
  { 
    idRequisito: 1, 
    titulo: "Créditos Académicos Totales", 
    descripcion: "Completar un total de 240 créditos UAI para poder avanzar a quinto año. Estos créditos incluyen cursos obligatorios, electivos y de formación general.", 
    tipo: "CREDITOS_ACADEMICOS", 
    esObligatorio: true,
    documentos: [
      { nombre: "Reglamento Académico UAI", url: "https://www.uai.cl/reglamento-academico" }
    ]
  },
  { 
    idRequisito: 2, 
    titulo: "Curso Específico: Ética", 
    descripcion: "Aprobar el curso ECF-101 Ética con nota mínima 4.0. Este curso es requisito obligatorio para todas las ingenierías civiles.", 
    tipo: "CURSO_ESPECIFICO", 
    esObligatorio: true,
    documentos: [
      { nombre: "Programa del Curso", url: "https://www.uai.cl/cursos/ecf-101" }
    ]
  },
  { 
    idRequisito: 3, 
    titulo: "Actividad Extracurricular", 
    descripcion: "Completar al menos 1 actividad extracurricular validada por la universidad. Puede ser deportiva, cultural o de voluntariado.", 
    tipo: "ACTIVIDAD_EXTRACURRICULAR", 
    esObligatorio: false,
    documentos: [
      { nombre: "Listado de Actividades", url: "https://www.uai.cl/vida-estudiantil" }
    ]
  },
  { 
    idRequisito: 4, 
    titulo: "Requisito Administrativo: Biblioteca", 
    descripcion: "No tener deudas pendientes con la biblioteca UAI. Verificar devolución de todos los libros y materiales prestados.", 
    tipo: "REQUISITO_ADMINISTRATIVO", 
    esObligatorio: true,
    documentos: []
  },
  { 
    idRequisito: 5, 
    titulo: "Inscripción Trabajo de Titulación", 
    descripcion: "Inscribir propuesta de trabajo de titulación ante la coordinación de carrera antes del inicio del quinto año.", 
    tipo: "TRABAJO_TITULACION", 
    esObligatorio: true,
    documentos: [
      { nombre: "Formulario de Inscripción", url: "https://www.uai.cl/titulacion" }
    ]
  },
  {
    idRequisito: 6,
    titulo: "Plan de Quinto Año 2024",
    descripcion: "Completar 60 créditos distribuidos en 1800 horas académicas. Incluye cursos obligatorios, optativos profesionales y trabajo de titulación.",
    tipo: "CREDITOS_ACADEMICOS",
    esObligatorio: true,
    documentos: [
      { nombre: "Malla Curricular 2024", url: "https://www.uai.cl/malla-2024" }
    ]
  }
];

// ========================================
// MINORS DISPONIBLES (DATOS REALES UAI)
// ========================================
const minors = [
  {
    idMinor: 1,
    nombre: "Minor en Minería",
    facultad: "Facultad de Ingeniería y Ciencias",
    descripcion: "Programa que entrega conocimientos fundamentales sobre la industria minera, desde exploración hasta gestión económica.",
    coordinador: "Coordinación FIC",
    contacto: "fic@uai.cl",
    requisitos: "4 de los siguientes cursos",
    cursos: [
      { codigo: "MIN210", nombre: "Introducción a la Minería" },
      { codigo: "MIN431", nombre: "Evaluación de Yacimientos" },
      { codigo: "MIN240", nombre: "Geología" },
      { codigo: "MIN442", nombre: "Mecánica de Rocas" },
      { codigo: "MIN451", nombre: "Metalurgia Extractiva" },
      { codigo: "MIN432", nombre: "Economía y Gestión Minera" }
    ]
  },
  {
    idMinor: 2,
    nombre: "Minor en Obras Civiles",
    facultad: "Facultad de Ingeniería y Ciencias",
    descripcion: "Formación en análisis, diseño y construcción de obras civiles e infraestructura.",
    coordinador: "Coordinación FIC",
    contacto: "fic@uai.cl",
    requisitos: "4 de los siguientes cursos",
    cursos: [
      { codigo: "OCIV351", nombre: "Materiales de Ingeniería Civil" },
      { codigo: "ING329", nombre: "Geotecnia" },
      { codigo: "OCIV312", nombre: "Resistencia de Materiales" },
      { codigo: "OCIV331", nombre: "Análisis Estructural" },
      { codigo: "OCIV310", nombre: "Estática Aplicada" },
      { codigo: "IND438", nombre: "Ingeniería de Transporte y Vial" }
    ]
  },
  {
    idMinor: 3,
    nombre: "Minor en Mecánica",
    facultad: "Facultad de Ingeniería y Ciencias",
    descripcion: "Especialización en diseño mecánico, manufactura y análisis de sistemas dinámicos.",
    coordinador: "Coordinación FIC",
    contacto: "fic@uai.cl",
    requisitos: "4 de los siguientes cursos",
    cursos: [
      { codigo: "FIS300", nombre: "Dinámica y Vibraciones" },
      { codigo: "MEC300", nombre: "Diseño Mecánico Computacional" },
      { codigo: "MEC400", nombre: "Diseño de Máquinas" },
      { codigo: "MEC420", nombre: "Proceso de Manufactura" },
      { codigo: "MEC401", nombre: "Metalurgia Física" },
      { codigo: "MEC301", nombre: "Métodos Numéricos" }
    ]
  },
  {
    idMinor: 4,
    nombre: "Minor en Matemáticas",
    facultad: "Facultad de Ingeniería y Ciencias",
    descripcion: "Profundización en modelamiento matemático y métodos computacionales.",
    coordinador: "Coordinación FIC",
    contacto: "fic@uai.cl",
    requisitos: "4 de los siguientes cursos",
    cursos: [
      { codigo: "IGE426", nombre: "Simulación" },
      { codigo: "MAT301", nombre: "Ecuaciones Diferenciales Parciales" },
      { codigo: "MAT302", nombre: "Análisis Complejo" },
      { codigo: "MAT401", nombre: "Optimización" }
    ]
  },
  {
    idMinor: 5,
    nombre: "Minor en Diseño",
    facultad: "Facultad de Artes Liberales y Diseño",
    descripcion: "Integración de competencias de diseño, fabricación digital y pensamiento visual.",
    coordinador: "Coordinación Diseño",
    contacto: "diseno@uai.cl",
    requisitos: "4 de los siguientes cursos",
    cursos: [
      { codigo: "DIS122", nombre: "Modelación 2, 3D y Gráfica" },
      { codigo: "DIS123", nombre: "Programación para Diseño" },
      { codigo: "DIS223", nombre: "Representación Visual I" },
      { codigo: "DIS224", nombre: "Representación Visual II" },
      { codigo: "DIS405", nombre: "Introducción a la Fabricación" },
      { codigo: "DIS125", nombre: "Tendencias Contemporáneas del Diseño" },
      { codigo: "DIS126", nombre: "Teoría y Tendencias en Diseño" }
    ]
  },
  {
    idMinor: 6,
    nombre: "Minor en Gerencia TI",
    facultad: "Facultad de Ingeniería y Ciencias",
    descripcion: "Formación en gestión de proyectos tecnológicos, arquitectura de sistemas y seguridad informática.",
    coordinador: "Coordinación FIC",
    contacto: "fic@uai.cl",
    requisitos: "4 de los siguientes cursos",
    cursos: [
      { codigo: "TICS200", nombre: "Lenguajes y Paradigmas de Programación" },
      { codigo: "TICS331", nombre: "Ingeniería de Software" },
      { codigo: "TICS320", nombre: "Bases de Datos" },
      { codigo: "TICS313", nombre: "Redes de Computadores" },
      { codigo: "TICS317", nombre: "Arquitectura de Sistemas" },
      { codigo: "TICS400", nombre: "Arquitectura Cloud" },
      { codigo: "TICS413", nombre: "Seguridad en TI" }
    ]
  },
  {
    idMinor: 7,
    nombre: "Minor en Ciencia de Datos",
    facultad: "Facultad de Ingeniería y Ciencias",
    descripcion: "Especialización en análisis de datos, machine learning y visualización de información.",
    coordinador: "Coordinación FIC",
    contacto: "fic@uai.cl",
    requisitos: "4 de los siguientes cursos",
    cursos: [
      { codigo: "TICS411", nombre: "Minería de Datos" },
      { codigo: "TICS815", nombre: "Inteligencia Artificial" },
      { codigo: "ING812", nombre: "Aproximación a la Política Pública desde los Datos" },
      { codigo: "MDS103", nombre: "Visualización de Datos y Storytelling" },
      { codigo: "TICS860", nombre: "Modelos Lineales Aplicados en R" },
      { codigo: "TICS320", nombre: "Bases de Datos" }
    ]
  }
];

// ========================================
// MENCIONES DISPONIBLES
// ========================================
const menciones = [
  {
    idMencion: 1,
    nombre: "Ingeniería Civil Industrial",
    descripcion: "Mención enfocada en optimización de procesos, gestión de operaciones y toma de decisiones estratégicas.",
    requisitos: "Completar plan de estudios específico de la mención",
    proceso: "Solicitud en 4º año, proceso de selección en agosto",
    fechasImportantes: [
      { evento: "Postulación", fecha: "Agosto 2024" },
      { evento: "Resultados", fecha: "Septiembre 2024" },
      { evento: "Inicio cursos mención", fecha: "Marzo 2025" }
    ],
    coordinador: "Coordinación Ingeniería Industrial",
    contacto: "industrial@uai.cl"
  },
  {
    idMencion: 2,
    nombre: "Ingeniería Civil Informática",
    descripcion: "Especialización en desarrollo de software, arquitectura de sistemas y gestión de proyectos tecnológicos.",
    requisitos: "Completar plan de estudios específico de la mención",
    proceso: "Solicitud en 4º año, proceso de selección en agosto",
    fechasImportantes: [
      { evento: "Postulación", fecha: "Agosto 2024" },
      { evento: "Resultados", fecha: "Septiembre 2024" },
      { evento: "Inicio cursos mención", fecha: "Marzo 2025" }
    ],
    coordinador: "Coordinación Ingeniería Informática",
    contacto: "informatica@uai.cl"
  },
  {
    idMencion: 3,
    nombre: "Ingeniería Civil Eléctrica",
    descripcion: "Formación en sistemas de potencia, electrónica y telecomunicaciones.",
    requisitos: "Completar plan de estudios específico de la mención",
    proceso: "Solicitud en 4º año, proceso de selección en agosto",
    fechasImportantes: [
      { evento: "Postulación", fecha: "Agosto 2024" },
      { evento: "Resultados", fecha: "Septiembre 2024" },
      { evento: "Inicio cursos mención", fecha: "Marzo 2025" }
    ],
    coordinador: "Coordinación Ingeniería Eléctrica",
    contacto: "electrica@uai.cl"
  }
];

// ========================================
// FUNCIÓN PRINCIPAL DE SEED
// ========================================
export async function seedFirestoreComplete() {
  try {
    console.log('🌱 Iniciando población COMPLETA de Firestore con datos reales UAI...');
    
    // 1. POBLAR REQUISITOS
    console.log('\n📋 Poblando requisitos...');
    const requisitosCol = collection(db, 'requisitos');
    for (const req of requisitos) {
      const { idRequisito, ...data } = req;
      const docRef = doc(requisitosCol, String(idRequisito));
      await setDoc(docRef, data);
      console.log(`✅ Requisito ${idRequisito}: ${data.titulo}`);
    }
    
    // 2. POBLAR MINORS
    console.log('\n🎓 Poblando minors...');
    const minorsCol = collection(db, 'minors');
    for (const minor of minors) {
      const { idMinor, ...data } = minor;
      const docRef = doc(minorsCol, String(idMinor));
      await setDoc(docRef, data);
      console.log(`✅ Minor ${idMinor}: ${data.nombre}`);
    }
    
    // 3. POBLAR MENCIONES
    console.log('\n🏆 Poblando menciones...');
    const mencionesCol = collection(db, 'menciones');
    for (const mencion of menciones) {
      const { idMencion, ...data } = mencion;
      const docRef = doc(mencionesCol, String(idMencion));
      await setDoc(docRef, data);
      console.log(`✅ Mención ${idMencion}: ${data.nombre}`);
    }
    
    console.log('\n🎉 ¡Firestore poblado exitosamente con TODOS los datos reales!');
    console.log(`\n📊 Resumen:`);
    console.log(`   - ${requisitos.length} requisitos`);
    console.log(`   - ${minors.length} minors`);
    console.log(`   - ${menciones.length} menciones`);
    
    return {
      success: true,
      stats: {
        requisitos: requisitos.length,
        minors: minors.length,
        menciones: menciones.length
      }
    };
  } catch (error) {
    console.error('❌ Error al poblar Firestore:', error);
    throw error;
  }
}

// Exportar también los datos por si se necesitan en otro lugar
export { requisitos, minors, menciones };