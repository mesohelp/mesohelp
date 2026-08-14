import { createContext, useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

export const AppContext = createContext();

const getCachedInstructions = () => {
  try {
    const cached = localStorage.getItem('meso_instructions');
    return cached ? JSON.parse(cached) : [];
  } catch (error) {
    return [];
  }
};

export const AppProvider = ({ children }) => {
  const [instructions, setInstructions] = useState(getCachedInstructions);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(() => getCachedInstructions().length === 0);
  const [authLoading, setAuthLoading] = useState(true);

  // Authentication Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Instructions from Firestore
  useEffect(() => {
    const fetchInstructions = async () => {
      if (getCachedInstructions().length === 0) {
        setLoading(true);
      }
      try {
        const querySnapshot = await getDocs(collection(db, 'instructions'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sort by createdAt descending to match previous behavior
        data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setInstructions(data);
        localStorage.setItem('meso_instructions', JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching instructions: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructions();
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login failed: ", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed: ", error);
      throw error;
    }
  };

  const addInstruction = async (inst) => {
    try {
      const newInst = { ...inst, createdAt: Date.now() };
      const docRef = await addDoc(collection(db, 'instructions'), newInst);
      setInstructions(prev => [{ ...newInst, id: docRef.id }, ...prev]);
    } catch (error) {
      console.error("Error adding instruction: ", error);
      throw error;
    }
  };
  
  const updateInstruction = async (id, updated) => {
    try {
      const docRef = doc(db, 'instructions', id);
      await updateDoc(docRef, updated);
      setInstructions(prev => prev.map(i => i.id === id ? { ...i, ...updated } : i));
    } catch (error) {
      console.error("Error updating instruction: ", error);
      throw error;
    }
  };
  
  const deleteInstruction = async (id) => {
    try {
      const docRef = doc(db, 'instructions', id);
      await deleteDoc(docRef);
      setInstructions(prev => prev.filter(i => i.id !== id));
    } catch (error) {
      console.error("Error deleting instruction: ", error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{
      instructions, setInstructions, addInstruction, updateInstruction, deleteInstruction,
      isAdmin, setIsAdmin, searchQuery, setSearchQuery, login, logout, loading, authLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};
