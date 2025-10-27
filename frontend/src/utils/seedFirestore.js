// src/utils/seedFirestore.js
import { db } from '../services/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

const mockRequirements = [
  { 
    idRequisito: 1, 
    titulo: "Créditos Académicos Totales", 
    descripcion: "Completar un total de 240 créditos UAI.", 
    tipo: "CREDITOS_ACADEMICOS", 
    esObligatorio: true 
  },
  { 
    idRequisito: 2, 
    titulo: "Curso Específico: Ética", 
    descripcion: "Aprobar el curso ECF-101.", 
    tipo: "CURSO_ESPECIFICO", 
    esObligatorio: true 
  },
  { 
    idRequisito: 3, 
    titulo: "Actividad Extracurricular", 
    descripcion: "Completar 1 actividad.", 
    tipo: "ACTIVIDAD_EXTRACURRICULAR", 
    esObligatorio: false 
  },
  { 
    idRequisito: 4, 
    titulo: "Requisito Administrativo: Biblioteca", 
    descripcion: "Sin deudas.", 
    tipo: "REQUISITO_ADMINISTRATIVO", 
    esObligatorio: true 
  },
  { 
    idRequisito: 5, 
    titulo: "Inscripción Trabajo de Titulación", 
    descripcion: "Inscribir propuesta.", 
    tipo: "TRABAJO_TITULACION", 
    esObligatorio: true 
  }
];

export async function seedFirestore() {
  try {
    console.log('🌱 Iniciando población de Firestore...');
    
    const requisitosCol = collection(db, 'requisitos');
    
    for (const req of mockRequirements) {
      const { idRequisito, ...data } = req;
      const docRef = doc(requisitosCol, String(idRequisito));
      
      await setDoc(docRef, data);
      console.log(`✅ Requisito ${idRequisito} creado:`, data.titulo);
    }
    
    console.log('🎉 Firestore poblado exitosamente!');
    return true;
  } catch (error) {
    console.error('❌ Error al poblar Firestore:', error);
    throw error;
  }
}