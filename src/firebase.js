import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Datele tale de configurare pentru MesoHelp
const firebaseConfig = {
    apiKey: "AIzaSyBMZNeAmWpaM3savE3Zm8aJ4VZckPT3JPg",
    authDomain: "mesohelp.firebaseapp.com",
    projectId: "mesohelp",
    storageBucket: "mesohelp.firebasestorage.app",
    messagingSenderId: "947152253127",
    appId: "1:947152253127:web:a72d2f0d8cef8df7690ee2"
};

// 1. Inițializăm aplicația principală
const app = initializeApp(firebaseConfig);

// 2. Activați serviciile de care avem nevoie
const db = getFirestore(app);
const auth = getAuth(app);

// 3. Exportăm totul pentru a putea fi folosit de AppContext.jsx și alte componente
export { app, db, auth };