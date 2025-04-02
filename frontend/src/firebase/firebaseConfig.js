import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDb1Kl3Iux8SDum_wGBTcPH6KvZ7EgGuZg",
  authDomain: "text-editor-309f0.firebaseapp.com",
  projectId: "text-editor-309f0",
  storageBucket: "text-editor-309f0.firebasestorage.app",
  messagingSenderId: "555548618024",
  appId: "1:555548618024:web:2932c1092a14cc1efa341d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set authentication persistence to session-only (resets on refresh)
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Firebase Auth set to session-only");
  })
  .catch((error) => {
    console.error("Failed to set Firebase persistence:", error);
  });

export { auth };
