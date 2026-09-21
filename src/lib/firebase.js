import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCvfTB-QOP_mZopgSUE6ZSidOJaK1TBlcM",
  authDomain: "kamate-671e2.firebaseapp.com",
  projectId: "kamate-671e2",
  storageBucket: "kamate-671e2.firebasestorage.app",
  messagingSenderId: "550672186231",
  appId: "1:550672186231:web:26438980e462183befbf72",
  measurementId: "G-0TMX811SYF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
