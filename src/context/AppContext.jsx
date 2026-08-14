import { createContext, useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [instructions, setInstructions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Authentication Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Initial fetch from public date.json
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`https://support.mesopotamia.ro/date.json?t=${Date.now()}`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setInstructions(data);
          }
        }
      } catch (error) {
        console.error("Error fetching initial date.json: ", error);
      }
    };
    fetchInitialData();
  }, []);

  const syncToServer = async (allInstructions) => {
    try {
      await fetch('https://support.mesopotamia.ro/sync.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: "meso-admin-secret-2026",
          instructions: allInstructions
        }),
      });
    } catch (error) {
      console.error("Error syncing to server: ", error);
    }
  };

  // Auto-healing: If admin is logged in, ensure date.json exists on server, otherwise generate from Firestore
  useEffect(() => {
    if (!isAdmin) return;

    const checkAndSync = async () => {
      try {
        const res = await fetch(`https://support.mesopotamia.ro/date.json?t=${Date.now()}`);
        if (!res.ok) {
          console.log("date.json lipsește. Se generează automat din Firestore...");
          const snapshot = await getDocs(collection(db, 'instructions'));
          const dateMapate = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          dateMapate.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setInstructions(dateMapate);
          await syncToServer(dateMapate);
          console.log("date.json a fost sincronizat cu succes pe server.");
        }
      } catch (error) {
        console.error("Auto-sync error: ", error);
      }
    };

    checkAndSync();
  }, [isAdmin]);

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
      const newInstructionWithId = { ...newInst, id: docRef.id };
      const updatedList = [newInstructionWithId, ...instructions];
      setInstructions(updatedList);
      await syncToServer(updatedList);
    } catch (error) {
      console.error("Error adding instruction: ", error);
      throw error;
    }
  };
  
  const updateInstruction = async (id, updated) => {
    try {
      const docRef = doc(db, 'instructions', id);
      await updateDoc(docRef, updated);
      const updatedList = instructions.map(i => i.id === id ? { ...i, ...updated } : i);
      setInstructions(updatedList);
      await syncToServer(updatedList);
    } catch (error) {
      console.error("Error updating instruction: ", error);
      throw error;
    }
  };
  
  const deleteInstruction = async (id) => {
    try {
      const docRef = doc(db, 'instructions', id);
      await deleteDoc(docRef);
      const updatedList = instructions.filter(i => i.id !== id);
      setInstructions(updatedList);
      await syncToServer(updatedList);
    } catch (error) {
      console.error("Error deleting instruction: ", error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{
      instructions, setInstructions, addInstruction, updateInstruction, deleteInstruction, syncToServer,
      isAdmin, setIsAdmin, searchQuery, setSearchQuery, login, logout, loading, authLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};
