// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

// 🔒 Configuración de Firebase - REEMPLAZA CON TUS CREDENCIALES
const firebaseConfig = {
  apiKey: "AIzaSyAWRt_4PslF4cadnxIJDUTGz7BFaw3oQGY",
  authDomain: "ing-software-9f047.firebaseapp.com",
  projectId: "ing-software-9f047",
  storageBucket: "ing-software-9f047.firebasestorage.app",
  messagingSenderId: "504603544813",
  appId: "1:504603544813:web:f753ca35d3e48bd10c50e4",
  measurementId: "G-Z4ERYD77C8"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================
// FUNCIONES DE AUTENTICACIÓN
// ==========================================

export const firebaseLogin = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const firebaseSignup = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const firebaseLogout = () => {
  return signOut(auth);
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// ==========================================
// FUNCIONES DE FIRESTORE (BASE DE DATOS)
// ==========================================

/**
 * Obtener todos los requisitos
 */
export const getRequirements = async () => {
  try {
    const requisitosCol = collection(db, 'requisitos');
    const snapshot = await getDocs(requisitosCol);
    
    const requisitos = snapshot.docs.map(doc => ({
      id: doc.id,
      idRequisito: parseInt(doc.id),
      ...doc.data()
    }));
    
    return requisitos;
  } catch (error) {
    console.error('Error al obtener requisitos:', error);
    throw error;
  }
};

/**
 * Obtener un requisito por ID
 */
export const getRequirementById = async (id) => {
  try {
    const docRef = doc(db, 'requisitos', String(id));
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        idRequisito: parseInt(docSnap.id),
        ...docSnap.data()
      };
    } else {
      throw new Error('Requisito no encontrado');
    }
  } catch (error) {
    console.error('Error al obtener requisito:', error);
    throw error;
  }
};

// ==========================================
// EXPORTAR TAMBIÉN FIRESTORE HELPERS
// ==========================================
export { auth, db, collection, getDocs, doc, getDoc, setDoc };